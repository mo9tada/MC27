import "server-only";
import { prisma } from "@/lib/prisma";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getUpcomingEvents() {
  return prisma.event.findMany({
    where: { published: true, date: { gte: startOfToday() } },
    orderBy: { date: "asc" },
    include: { _count: { select: { attendees: true } } },
  });
}

export async function getEventForPublic(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: { _count: { select: { attendees: true } } },
  });

  if (!event || !event.published) {
    return null;
  }

  return event;
}
