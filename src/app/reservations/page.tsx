"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { CalendarCheck, Mail, ShieldCheck } from "lucide-react";

import Navbar from "@/components/navbar";
import VideoBackground from "@/components/video-background";
import { FloatPanel } from "@/components/float-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { createReservation, verifyReservationOtp, resendOtp } from "./actions";

export default function ReservationsPage() {
  const [step, setStep] = useState<"form" | "otp" | "done">("form");
  const [reservationId, setReservationId] = useState("");
  const [contact, setContact] = useState({ name: "", email: "" });

  const [createState, createFormAction, isCreating] = useActionState(createReservation, undefined);
  const [verifyState, verifyFormAction, isVerifying] = useActionState(verifyReservationOtp, undefined);
  const [resendState, resendFormAction, isResending] = useActionState(resendOtp, undefined);

  useEffect(() => {
    if (createState?.reservationId) {
      setReservationId(createState.reservationId);
      setContact({ name: createState.name ?? "", email: createState.email ?? "" });
      setStep("otp");
    }
  }, [createState]);

  useEffect(() => {
    if (verifyState?.success) {
      setStep("done");
    }
  }, [verifyState]);

  return (
    <main className="relative min-h-screen overflow-x-hidden text-white">
      <VideoBackground overlayClassName="bg-[linear-gradient(180deg,_rgba(7,21,38,0.88),_rgba(16,44,78,0.9))]" blobs />
      <Navbar />

      <section className="relative z-10 mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur">
            <span className="size-2 rounded-full bg-[#c58d5a]" />
            <span>MC27 Coffee — Reservations</span>
          </div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Reserve a table</h1>
          <p className="mt-3 text-white/70">
            Tell us when you&apos;d like to visit. We&apos;ll email you a code to confirm your spot.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
        {step === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35 }}
          >
          <FloatPanel>
            <p className="text-sm text-[#c58d5a]">Step 1 of 2</p>
            <h2 className="font-heading mt-1 flex items-center gap-2 text-xl text-white">
              <CalendarCheck className="size-5 text-[#c58d5a]" />
              Reservation details
            </h2>

            <form action={createFormAction} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-white/80">Name</Label>
                    <Input id="name" name="name" placeholder="Jane Doe" required />
                    {createState?.fieldErrors?.name && (
                      <p className="text-xs text-red-300">{createState.fieldErrors.name[0]}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-white/80">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="jane@example.com" required />
                    {createState?.fieldErrors?.email && (
                      <p className="text-xs text-red-300">{createState.fieldErrors.email[0]}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-white/80">Phone</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+1 555 123 4567" required />
                    {createState?.fieldErrors?.phone && (
                      <p className="text-xs text-red-300">{createState.fieldErrors.phone[0]}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="partySize" className="text-white/80">Party size</Label>
                    <Input id="partySize" name="partySize" type="number" min={1} max={20} defaultValue={2} required />
                    {createState?.fieldErrors?.partySize && (
                      <p className="text-xs text-red-300">{createState.fieldErrors.partySize[0]}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="date" className="text-white/80">Date</Label>
                    <Input id="date" name="date" type="date" required />
                    {createState?.fieldErrors?.date && (
                      <p className="text-xs text-red-300">{createState.fieldErrors.date[0]}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="time" className="text-white/80">Time</Label>
                    <Input id="time" name="time" type="time" required />
                    {createState?.fieldErrors?.time && (
                      <p className="text-xs text-red-300">{createState.fieldErrors.time[0]}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="notes" className="text-white/80">Notes (optional)</Label>
                  <Textarea id="notes" name="notes" placeholder="Window seat, allergies, celebration..." />
                </div>

                {createState?.error && <p className="text-sm text-red-300">{createState.error}</p>}

                <Button type="submit" disabled={isCreating} className="w-full bg-[#163b66] text-white hover:bg-[#102c4e]">
                  {isCreating ? "Sending code..." : "Request reservation"}
                </Button>
            </form>
          </FloatPanel>
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35 }}
          >
          <FloatPanel>
            <p className="text-sm text-[#c58d5a]">Step 2 of 2</p>
            <h2 className="font-heading mt-1 flex items-center gap-2 text-xl text-white">
              <Mail className="size-5 text-[#c58d5a]" />
              Confirm with your code
            </h2>

            <p className="mt-4 text-sm text-white/70">
              We sent a 6-digit code to <span className="text-white">{contact.email}</span>. Enter it below to
              confirm your table.
            </p>

            <form action={verifyFormAction} className="mt-4 space-y-4">
                <input type="hidden" name="reservationId" value={reservationId} />
                <div className="space-y-1.5">
                  <Label htmlFor="code" className="text-white/80">6-digit code</Label>
                  <Input
                    id="code"
                    name="code"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="123456"
                    className="text-center text-lg tracking-[0.4em]"
                    required
                  />
                </div>

                {verifyState?.error && <p className="text-sm text-red-300">{verifyState.error}</p>}

                <Button type="submit" disabled={isVerifying} className="w-full bg-[#163b66] text-white hover:bg-[#102c4e]">
                  {isVerifying ? "Confirming..." : "Confirm reservation"}
                </Button>
            </form>

            <form action={resendFormAction} className="mt-2 flex flex-col items-center gap-2">
                <input type="hidden" name="reservationId" value={reservationId} />
                <Button type="submit" variant="ghost" disabled={isResending} className="text-white/70 hover:text-white">
                  {isResending ? "Resending..." : "Resend code"}
                </Button>
                {resendState?.message && <p className="text-xs text-emerald-300">{resendState.message}</p>}
                {resendState?.error && <p className="text-xs text-red-300">{resendState.error}</p>}
            </form>
          </FloatPanel>
          </motion.div>
        )}

        {step === "done" && verifyState?.reservation && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.17, 0.67, 0.12, 0.99] as const }}
          >
          <FloatPanel glow="navy">
            <h2 className="font-heading flex items-center gap-2 text-xl text-white">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 15 }}
              >
                <ShieldCheck className="size-5 text-emerald-400" />
              </motion.span>
              Table confirmed!
            </h2>
            <p className="mt-1 text-sm text-white/70">
              A confirmation email is on its way to {contact.email}.
            </p>

            <div className="mt-6 space-y-2 text-sm text-white/80">
              <p><strong className="text-white">Date:</strong> {verifyState.reservation.date}</p>
              <p><strong className="text-white">Time:</strong> {verifyState.reservation.time}</p>
              <p><strong className="text-white">Party size:</strong> {verifyState.reservation.partySize}</p>
              <div className="pt-4">
                <Link href="/spinwheel" className="text-[#c58d5a] underline underline-offset-4">
                  While you&apos;re here, spin the wheel for a discount →
                </Link>
              </div>
            </div>
          </FloatPanel>
          </motion.div>
        )}
        </AnimatePresence>
      </section>
    </main>
  );
}
