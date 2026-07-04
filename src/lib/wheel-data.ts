import "server-only";
import { prisma } from "@/lib/prisma";
import { normalizeWheel, type WheelKind } from "@/lib/wheel";

export async function getWheelPrizes(wheel: WheelKind = "store") {
  return prisma.wheelPrize.findMany({
    where: { wheel: normalizeWheel(wheel) },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}
