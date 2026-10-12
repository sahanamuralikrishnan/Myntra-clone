// Service worker: runs in the background (even when the Myntra tab is closed)
// and shows the notifications the backend sends.

// A notification arrived from the backend
self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    // not JSON; show a plain notification
  }

  event.waitUntil(
    self.registration.showNotification(payload.title || "Myntra Clone", {
      body: payload.body || "",
      icon: "/favicon.ico",
      data: payload.data || {},
    })
  );
});

// The user clicked the notification: open the screen it is about
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data || {};

  let path = "/";
  if (data.screen === "orders") path = "/orders";
  else if (data.screen === "product" && data.productId) path = "/product/" + data.productId;
  else if (data.screen === "bag") path = "/bag";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((tabs) => {
      // Reuse an open Myntra tab if there is one, otherwise open a new tab
      const tab = tabs[0];
      if (tab) {
        return tab.focus().then(() => tab.navigate(path).catch(() => self.clients.openWindow(path)));
      }
      return self.clients.openWindow(path);
    })
  );
});
