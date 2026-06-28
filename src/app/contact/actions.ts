"use server";

import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";

export type ContactState =
  | {
      error?: string;
      fieldErrors?: Record<string, string[]>;
      success?: boolean;
    }
  | undefined;

export async function submitContactMessage(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  try {
    await prisma.contactMessage.create({ data: parsed.data });
  } catch {
    return { error: "Something went wrong sending your message. Please try again." };
  }

  return { success: true };
}
