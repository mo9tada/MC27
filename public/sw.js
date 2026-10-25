// MC27 admin service worker — shows push notifications for new spins and reservations.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  // Always show a notification: iOS revokes push access for pushes that show nothing.
  let data = { title: "MC27 Admin", body: "Nouvelle activité sur le site." };
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { title: "MC27 Admin", body: event.data.text() };
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "MC27 Admin", {
      body: data.body,
      icon: "/admin-icon-192.png",
      badge: "/admin-icon-192.png",
      tag: data.tag,
      renotify: Boolean(data.tag),
      requireInteraction: true, // stays on screen until the admin dismisses it
      silent: false,
      vibrate: [200, 100, 200, 100, 200],
      timestamp: Date.now(),
      data: { url: data.url || "/admin" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || "/admin", self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((windows) => {
      const existing = windows[0];
      if (existing) {
        return existing.focus().then((client) => client.navigate(url));
      }
      return self.clients.openWindow(url);
    })
  );
});
