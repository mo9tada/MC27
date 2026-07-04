"use server";

import { prisma } from "@/lib/prisma";
import { wheelSchema } from "@/lib/validation";
import { pickSegmentIndex, generateVoucherCode, normalizeWheel } from "@/lib/wheel";
import { getWheelPrizes } from "@/lib/wheel-data";

export type SpinState =
  | {
      error?: string;
      fieldErrors?: Record<string, string[]>;
      id?: string;
      name?: string;
      prize?: string;
      code?: string;
      segmentIndex?: number;
      alreadySpun?: boolean;
    }
  | undefined;

export async function spinWheel(_prevState: SpinState, formData: FormData): Promise<SpinState> {
  const parsed = wheelSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { name, email } = parsed.data;
  const wheel = normalizeWheel(formData.get("wheel"));

  const prizes = await getWheelPrizes(wheel);

  if (prizes.length === 0) {
    return { error: "La roue n'est pas disponible pour le moment. Veuillez réessayer plus tard." };
  }

  // One spin per email per calendar day, per wheel: only look at today's spins on this wheel.
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const existing = await prisma.wheelSpin.findFirst({
    where: { wheel, email, createdAt: { gte: startOfDay } },
    orderBy: { createdAt: "desc" },
  });

  if (existing) {
    const segmentIndex = prizes.findIndex((prize) => prize.label === existing.prize);
    return {
      id: existing.id,
      name: existing.name,
      prize: existing.prize,
      code: existing.code,
      segmentIndex: segmentIndex >= 0 ? segmentIndex : 0,
      alreadySpun: true,
    };
  }

  const segmentIndex = pickSegmentIndex(prizes);
  const prize = prizes[segmentIndex].label;

  let code = generateVoucherCode();
  let spin;

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      spin = await prisma.wheelSpin.create({ data: { wheel, name, email, prize, code } });
      break;
    } catch {
      code = generateVoucherCode();
    }
  }

  if (!spin) {
    return { error: "Une erreur est survenue. Veuillez réessayer." };
  }

  return { id: spin.id, name: spin.name, prize: spin.prize, code: spin.code, segmentIndex };
}
