"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { verifyAdminSession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { notifyAdmins } from "@/lib/push";

const subscriptionSchema = z.object({
  endpoint: z.url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

export async function subscribeAdminDevice(input: unknown) {
  await verifyAdminSession();

  const parsed = subscriptionSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Abonnement invalide." };
  }

  const { endpoint, keys } = parsed.data;
  const userAgent = (await headers()).get("user-agent");

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    create: { endpoint, p256dh: keys.p256dh, auth: keys.auth, userAgent },
    update: { p256dh: keys.p256dh, auth: keys.auth, userAgent },
  });

  return { success: true };
}

export async function unsubscribeAdminDevice(endpoint: string) {
  await verifyAdminSession();
  await prisma.pushSubscription.deleteMany({ where: { endpoint } });
  return { success: true };
}

export async function sendTestNotification() {
  await verifyAdminSession();
  await notifyAdmins({
    title: "MC27 Admin",
    body: "Les notifications fonctionnent sur cet appareil ✅",
    url: "/admin",
    tag: "test",
  });
  return { success: true };
}
