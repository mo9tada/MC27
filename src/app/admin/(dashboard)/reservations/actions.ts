"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/dal";

export async function updateReservationStatus(formData: FormData) {
  await verifyAdminSession();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !status) {
    return;
  }

  await prisma.reservation.update({ where: { id }, data: { status } });
  revalidatePath("/admin/reservations");
}
