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
    return { error: "Cet événement n'est plus disponible." };
  }

  if (event.capacity !== null && event._count.attendees >= event.capacity) {
    return { error: "Désolé, cet événement est complet." };
  }

  try {
    await prisma.eventAttendee.create({ data: { eventId, name, email } });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002") {
      return { error: "Vous êtes déjà inscrit(e) à cet événement avec cette adresse e-mail." };
    }
    return { error: "Une erreur est survenue. Veuillez réessayer." };
  }

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/events");
  return { success: true };
}
