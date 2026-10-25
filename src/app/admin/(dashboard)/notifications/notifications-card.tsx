"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, Loader2, Share } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { sendTestNotification, subscribeAdminDevice, unsubscribeAdminDevice } from "./actions";

type Status = "loading" | "unsupported" | "ios-install" | "denied" | "off" | "on";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function getRegistration() {
  return navigator.serviceWorker.register("/sw.js", { scope: "/admin", updateViaCache: "none" });
}

export default function NotificationsCard() {
  const [status, setStatus] = useState<Status>("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    async function init() {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        // iOS only exposes Web Push once the site is added to the home screen.
        setStatus(isIOS && !isStandalone ? "ios-install" : "unsupported");
        return;
      }

      if (Notification.permission === "denied") {
        setStatus("denied");
        return;
      }

      const registration = await getRegistration();
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Re-sync in case the database row was removed or the keys rotated.
        await subscribeAdminDevice(subscription.toJSON());
        setStatus("on");
      } else {
        setStatus("off");
      }
    }

    init().catch(() => setStatus("unsupported"));
  }, []);

  async function enable() {
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "off");
        return;
      }

      const registration = await getRegistration();
      await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      });

      const result = await subscribeAdminDevice(subscription.toJSON());
      if (result.error) throw new Error(result.error);

      setStatus("on");
      toast.success("Notifications activées sur cet appareil");
    } catch {
      toast.error("Impossible d'activer les notifications.");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    try {
      const registration = await getRegistration();
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await unsubscribeAdminDevice(subscription.endpoint);
        await subscription.unsubscribe();
      }
      setStatus("off");
      toast.success("Notifications désactivées sur cet appareil");
    } catch {
      toast.error("Impossible de désactiver les notifications.");
    } finally {
      setBusy(false);
    }
  }

  async function test() {
    setBusy(true);
    try {
      await sendTestNotification();
      toast.success("Notification de test envoyée");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 border-white/10 bg-[#102c4e]/60 text-white shadow-lg backdrop-blur duration-500 fill-mode-both">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Bell className="size-5 text-[#c58d5a]" />
          Notifications mobiles
        </CardTitle>
        <CardDescription className="text-white/60">
          Recevez une alerte dès qu&apos;un client tourne la roue ou confirme une réservation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {status === "loading" && <Loader2 className="size-5 animate-spin text-white/60" />}

        {status === "ios-install" && (
          <p className="text-sm text-white/80">
            Sur iPhone, ajoutez d&apos;abord cette page à l&apos;écran d&apos;accueil : touchez{" "}
            <Share className="inline size-4 align-text-bottom" /> puis « Sur l&apos;écran d&apos;accueil ». Ouvrez
            ensuite MC27 Admin depuis l&apos;icône et revenez ici pour activer les notifications.
          </p>
        )}

        {status === "unsupported" && (
          <p className="text-sm text-white/80">Ce navigateur ne prend pas en charge les notifications push.</p>
        )}

        {status === "denied" && (
          <p className="text-sm text-white/80">
            Les notifications sont bloquées pour ce site. Autorisez-les dans les réglages du navigateur, puis
            rechargez la page.
          </p>
        )}

        {status === "off" && (
          <Button onClick={enable} disabled={busy}>
            {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Bell className="mr-2 size-4" />}
            Activer sur cet appareil
          </Button>
        )}

        {status === "on" && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-sm text-emerald-300">Activées sur cet appareil</span>
            <Button variant="secondary" onClick={test} disabled={busy}>
              Envoyer un test
            </Button>
            <Button
              variant="ghost"
              onClick={disable}
              disabled={busy}
              className="text-white/70 hover:bg-white/10 hover:text-white"
            >
              <BellOff className="mr-2 size-4" />
              Désactiver
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
