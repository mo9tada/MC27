import "server-only";
import webpush, { WebPushError } from "web-push";
import { prisma } from "@/lib/prisma";

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const isConfigured = Boolean(publicKey && privateKey);

if (isConfigured) {
  webpush.setVapidDetails(process.env.VAPID_SUBJECT ?? "mailto:admin@mc27.coffee", publicKey!, privateKey!);
}

export type AdminNotification = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
};

// Pushes a notification to every device the admin enabled. Never throws: a failed
// notification must not break the customer action that triggered it.
export async function notifyAdmins(notification: AdminNotification) {
  if (!isConfigured) return;

  try {
    const subscriptions = await prisma.pushSubscription.findMany();
    const payload = JSON.stringify(notification);

    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload,
            { TTL: 60 * 60 * 24, urgency: "high" }
          );
        } catch (error) {
          // 404/410: the device unsubscribed or the subscription expired — forget it.
          if (error instanceof WebPushError && (error.statusCode === 404 || error.statusCode === 410)) {
            await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
          } else {
            console.error("Push notification failed:", error);
          }
        }
      })
    );
  } catch (error) {
    console.error("Push notification failed:", error);
  }
}
