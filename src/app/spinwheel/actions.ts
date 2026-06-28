"use server";

import { prisma } from "@/lib/prisma";
import { wheelSchema } from "@/lib/validation";
import { pickSegmentIndex, generateVoucherCode } from "@/lib/wheel";
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

  const prizes = await getWheelPrizes();

  if (prizes.length === 0) {
    return { error: "The wheel is not available right now. Please try again later." };
  }

  // One spin per email per calendar day: only look at spins made since midnight today.
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const existing = await prisma.wheelSpin.findFirst({
    where: { email, createdAt: { gte: startOfDay } },
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
      spin = await prisma.wheelSpin.create({ data: { name, email, prize, code } });
      break;
    } catch {
      code = generateVoucherCode();
    }
  }

  if (!spin) {
    return { error: "Something went wrong. Please try again." };
  }

  return { id: spin.id, name: spin.name, prize: spin.prize, code: spin.code, segmentIndex };
}
