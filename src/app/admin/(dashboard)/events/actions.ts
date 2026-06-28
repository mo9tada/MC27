"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/dal";
import { eventSchema } from "@/lib/validation";
import { uploadEventImage, isStorageConfigured } from "@/lib/storage";

export type EventFormState =
  | {
      error?: string;
      fieldErrors?: Record<string, string[]>;
      success?: boolean;
    }
  | undefined;

function optionalString(value: FormDataEntryValue | null) {
  const s = String(value ?? "").trim();
  return s === "" ? undefined : s;
}

function parseCapacity(value: FormDataEntryValue | null) {
  const s = String(value ?? "").trim();
  if (s === "") return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

function parseEvent(formData: FormData) {
  return eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    date: formData.get("date"),
    location: optionalString(formData.get("location")),
    price: optionalString(formData.get("price")),
    capacity: parseCapacity(formData.get("capacity")),
    published: formData.get("published") === "on",
  });
}

async function resolveImageUrl(formData: FormData): Promise<{ imageUrl?: string; error?: string }> {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return {};
  }
  if (!isStorageConfigured()) {
    return { error: "Image upload isn't set up yet. Save without an image, or add the storage key first." };
  }
  try {
    return { imageUrl: await uploadEventImage(file) };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Image upload failed." };
  }
}

function revalidate(id?: string) {
  revalidatePath("/admin/events");
  revalidatePath("/events");
  if (id) revalidatePath(`/events/${id}`);
}

export async function createEvent(_prev: EventFormState, formData: FormData): Promise<EventFormState> {
  await verifyAdminSession();

  const parsed = parseEvent(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { imageUrl, error } = await resolveImageUrl(formData);
  if (error) return { error };

  const data = parsed.data;
  await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      location: data.location ?? null,
      price: data.price ?? null,
      capacity: data.capacity ?? null,
      published: data.published ?? true,
      imageUrl: imageUrl ?? null,
    },
  });

  revalidate();
  return { success: true };
}

export async function updateEvent(_prev: EventFormState, formData: FormData): Promise<EventFormState> {
  await verifyAdminSession();

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing event id." };

  const parsed = parseEvent(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { imageUrl, error } = await resolveImageUrl(formData);
  if (error) return { error };

  const data = parsed.data;
  await prisma.event.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      location: data.location ?? null,
      price: data.price ?? null,
      capacity: data.capacity ?? null,
      published: data.published ?? false,
      // Only replace the image when a new one was uploaded.
      ...(imageUrl ? { imageUrl } : {}),
    },
  });

  revalidate(id);
  return { success: true };
}

export async function deleteEvent(formData: FormData) {
  await verifyAdminSession();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.event.delete({ where: { id } });
  revalidate(id);
}
