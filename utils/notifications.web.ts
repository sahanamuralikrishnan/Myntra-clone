import axios from "axios";
import { API_URL } from "./api";

// Browser version of notifications.ts. Expo picks this file on web.
// Instead of an Expo push token, it returns the browser's push
// subscription as a JSON string, which the backend stores the same way.

// The backend's public key comes as base64 text; the browser wants raw bytes
function base64ToBytes(base64: string): Uint8Array {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const raw = window.atob(padded);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

// Ask for permission and return this browser's push subscription (or null)
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  // 1. Older browsers can't do push
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
    console.log("This browser doesn't support notifications");
    return null;
  }

  // 2. Ask the user ("Allow notifications?")
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.log("Notification permission denied");
    return null;
  }

  // 3. Get the backend's public key
  const { data } = await axios.get(`${API_URL}/push-token/vapid-public-key`);
  if (!data.publicKey) {
    console.log("Backend has no VAPID key, so browser notifications are off");
    return null;
  }

  // 4. Start the background worker (public/sw.js) that shows notifications
  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  // 5. Reuse this browser's subscription, or create one
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64ToBytes(data.publicKey) as BufferSource,
    });
  }
  return JSON.stringify(subscription);
}
