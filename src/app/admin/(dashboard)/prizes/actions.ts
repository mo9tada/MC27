"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/dal";
import { prizeSchema } from "@/lib/validation";

export type PrizeFormState =
  | {
      error?: string;
      fieldErrors?: Record<string, string[]>;
      success?: boolean;
    }
  | undefined;

function parsePrize(formData: FormData) {
  return prizeSchema.safeParse({
    label: formData.get("label"),
    weight: formData.get("weight"),
    color: formData.get("color"),
    order: formData.get("order"),
  });
}

function revalidate() {
  revalidatePath("/admin/prizes");
  revalidatePath("/spinwheel");
}

export async function createPrize(_prev: PrizeFormState, formData: FormData): Promise<PrizeFormState> {
  await verifyAdminSession();

  const parsed = parsePrize(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  await prisma.wheelPrize.create({ data: parsed.data });
  revalidate();
  return { success: true };
}

export async function updatePrize(_prev: PrizeFormState, formData: FormData): Promise<PrizeFormState> {
  await verifyAdminSession();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { error: "Missing prize id." };
  }

  const parsed = parsePrize(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  await prisma.wheelPrize.update({ where: { id }, data: parsed.data });
  revalidate();
  return { success: true };
}

export async function deletePrize(formData: FormData) {
  await verifyAdminSession();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return;
  }

  await prisma.wheelPrize.delete({ where: { id } });
  revalidate();
}
