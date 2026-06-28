import "server-only";
import { prisma } from "@/lib/prisma";

export async function getWheelPrizes() {
  return prisma.wheelPrize.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
}
