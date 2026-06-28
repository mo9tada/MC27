"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { rsvpSchema } from "@/lib/validation";

export type RsvpState =
  | {
      error?: string;
      fieldErrors?: Record<string, string[]>;
      success?: boolean;
    }
  | undefined;

export async function rsvpToEvent(_prev: RsvpState, formData: FormData): Promise<RsvpState> {
  const parsed = rsvpSchema.safeParse({
    eventId: formData.get("eventId"),
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { eventId, name, email } = parsed.data;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { _count: { select: { attendees: true } } },
  });

  if (!event || !event.published) {
    return { error: "This event is no longer available." };
  }

  if (event.capacity !== null && event._count.attendees >= event.capacity) {
    return { error: "Sorry, this event is fully booked." };
  }

  try {
    await prisma.eventAttendee.create({ data: { eventId, name, email } });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002") {
      return { error: "You've already RSVP'd to this event with that email." };
    }
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/events");
  return { success: true };
}
