"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/dal";
import { sendContactReplyEmail } from "@/lib/mailer";

export type ReplyState = { error?: string; success?: boolean } | undefined;

export async function replyToContactMessage(
  _prevState: ReplyState,
  formData: FormData
): Promise<ReplyState> {
  await verifyAdminSession();

  const id = String(formData.get("id") ?? "");
  const reply = String(formData.get("reply") ?? "").trim();

  if (!id || !reply) {
    return { error: "Please write a reply before sending." };
  }

  const message = await prisma.contactMessage.findUnique({ where: { id } });

  if (!message) {
    return { error: "Message not found." };
  }

  await prisma.contactMessage.update({
    where: { id },
    data: { reply, status: "answered", repliedAt: new Date() },
  });

  try {
    await sendContactReplyEmail(message.email, message.name, message.subject, reply);
  } catch {
    return { error: "Reply saved, but the email failed to send." };
  }

  revalidatePath("/admin/contact");
  return { success: true };
}
