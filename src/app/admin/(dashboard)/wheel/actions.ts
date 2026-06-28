"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/dal";

export async function toggleRedeemed(formData: FormData) {
  await verifyAdminSession();

  const id = String(formData.get("id") ?? "");
  const redeemed = formData.get("redeemed") === "true";

  if (!id) {
    return;
  }

  await prisma.wheelSpin.update({ where: { id }, data: { redeemed: !redeemed } });
  revalidatePath("/admin/wheel");
}
