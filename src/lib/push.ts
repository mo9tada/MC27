import "server-only";
import webpush, { WebPushError } from "web-push";
import { prisma } from "@/lib/prisma";
import { sendAdminAlertEmail } from "@/lib/mailer";

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const isConfigured = Boolean(publicKey && privateKey);

if (isConfigured) {
  webpush.setVapidDetails(process.env.VAPID_SUBJECT ?? "mailto:admin@mc27.coffee", publicKey!, privateKey!);
}

// Keep undelivered pushes queued for the maximum the push services allow (28 days),
// so a phone that is off or offline still receives them when it reconnects.
const PUSH_TTL_SECONDS = 60 * 60 * 24 * 28;
const MAX_ATTEMPTS = 3;

export type AdminNotification = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
};

type SendResult = "delivered" | "expired" | "failed";

function isTransient(error: unknown) {
  if (!(error instanceof WebPushError)) return true; // network error, timeout, DNS…
  return error.statusCode === 429 || error.statusCode >= 500;
}

async function sendToSubscription(
  sub: { id: string; endpoint: string; p256dh: string; auth: string },
  payload: string
): Promise<SendResult> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload,
        { TTL: PUSH_TTL_SECONDS, urgency: "high", timeout: 10_000 }
      );
      return "delivered";
    } catch (error) {
      // 404/410: the device unsubscribed or the subscription expired — forget it.
      if (error instanceof WebPushError && (error.statusCode === 404 || error.statusCode === 410)) {
        await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        return "expired";
      }

      if (!isTransient(error) || attempt === MAX_ATTEMPTS) {
        console.error(`Push notification failed (attempt ${attempt}):`, error);
        return "failed";
      }

      await new Promise((resolve) => setTimeout(resolve, 500 * 3 ** (attempt - 1)));
    }
  }

  return "failed";
}

// Pushes a notification to every device the admin enabled, retrying temporary
// failures. If no device accepts it, the alert is emailed to the admin instead, so
// it is never silently lost. Never throws: a failed notification must not break
// the customer action that triggered it.
export async function notifyAdmins(notification: AdminNotification) {
  let delivered = 0;

  try {
    if (isConfigured) {
      const subscriptions = await prisma.pushSubscription.findMany();
      const payload = JSON.stringify(notification);
      const results = await Promise.all(subscriptions.map((sub) => sendToSubscription(sub, payload)));
      delivered = results.filter((result) => result === "delivered").length;
    }
  } catch (error) {
    console.error("Push notification failed:", error);
  }

  if (delivered === 0) {
    try {
      await sendAdminAlertEmail(notification);
    } catch (error) {
      console.error("Admin alert email fallback failed:", error);
    }
  }

  return { delivered };
}
