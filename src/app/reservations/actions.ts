"use server";

import { prisma } from "@/lib/prisma";
import { generateOtp, hashOtp, verifyOtp, OTP_TTL_MINUTES, OTP_MAX_ATTEMPTS } from "@/lib/otp";
import { sendOtpEmail, sendReservationConfirmedEmail } from "@/lib/mailer";
import { reservationSchema, otpSchema } from "@/lib/validation";

export type CreateReservationState =
  | {
      error?: string;
      fieldErrors?: Record<string, string[]>;
      reservationId?: string;
      name?: string;
      email?: string;
    }
  | undefined;

export async function createReservation(
  _prevState: CreateReservationState,
  formData: FormData
): Promise<CreateReservationState> {
  const parsed = reservationSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    partySize: formData.get("partySize"),
    date: formData.get("date"),
    time: formData.get("time"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { name, email, phone, partySize, date, time, notes } = parsed.data;

  const code = generateOtp();
  const otpCodeHash = await hashOtp(code);
  const otpExpiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  const reservation = await prisma.reservation.create({
    data: {
      name,
      email,
      phone,
      partySize,
      date: new Date(date),
      time,
      notes,
      otpCodeHash,
      otpExpiresAt,
    },
  });

  try {
    await sendOtpEmail(email, name, code);
  } catch {
    return { error: "We couldn't send the confirmation email. Please try again." };
  }

  return { reservationId: reservation.id, name, email };
}

export type VerifyOtpState =
  | {
      error?: string;
      success?: boolean;
      reservation?: { date: string; time: string; partySize: number };
    }
  | undefined;

export async function verifyReservationOtp(
  _prevState: VerifyOtpState,
  formData: FormData
): Promise<VerifyOtpState> {
  const parsed = otpSchema.safeParse({
    reservationId: formData.get("reservationId"),
    code: formData.get("code"),
  });

  if (!parsed.success) {
    return { error: "Enter the 6-digit code." };
  }

  const { reservationId, code } = parsed.data;

  const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });

  if (!reservation || !reservation.otpCodeHash || !reservation.otpExpiresAt) {
    return { error: "Reservation not found. Please start again." };
  }

  if (reservation.verified) {
    return { success: true, reservation: formatReservation(reservation) };
  }

  if (reservation.otpAttempts >= OTP_MAX_ATTEMPTS) {
    return { error: "Too many attempts. Please request a new code." };
  }

  if (reservation.otpExpiresAt < new Date()) {
    return { error: "This code has expired. Please request a new one." };
  }

  const isValid = await verifyOtp(code, reservation.otpCodeHash);

  if (!isValid) {
    await prisma.reservation.update({
      where: { id: reservationId },
      data: { otpAttempts: { increment: 1 } },
    });
    return { error: "That code is incorrect. Please try again." };
  }

  const updated = await prisma.reservation.update({
    where: { id: reservationId },
    data: { verified: true, status: "confirmed", otpCodeHash: null, otpExpiresAt: null },
  });

  try {
    await sendReservationConfirmedEmail(updated.email, updated.name, {
      date: updated.date.toLocaleDateString(),
      time: updated.time,
      partySize: updated.partySize,
    });
  } catch {
    // Confirmation email is a courtesy; the reservation is already confirmed.
  }

  return { success: true, reservation: formatReservation(updated) };
}

export type ResendOtpState = { message?: string; error?: string } | undefined;

export async function resendOtp(
  _prevState: ResendOtpState,
  formData: FormData
): Promise<ResendOtpState> {
  const reservationId = String(formData.get("reservationId") ?? "");
  const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });

  if (!reservation) {
    return { error: "Reservation not found. Please start again." };
  }

  if (reservation.verified) {
    return { message: "This reservation is already confirmed." };
  }

  const code = generateOtp();
  const otpCodeHash = await hashOtp(code);
  const otpExpiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await prisma.reservation.update({
    where: { id: reservationId },
    data: { otpCodeHash, otpExpiresAt, otpAttempts: 0 },
  });

  try {
    await sendOtpEmail(reservation.email, reservation.name, code);
  } catch {
    return { error: "We couldn't resend the code. Please try again." };
  }

  return { message: "A new code has been sent to your email." };
}

function formatReservation(reservation: { date: Date; time: string; partySize: number }) {
  return {
    date: reservation.date.toLocaleDateString(),
    time: reservation.time,
    partySize: reservation.partySize,
  };
}
