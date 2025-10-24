// Firebase Cloud Messaging Service Worker
// This service worker handles background push notifications

// Import Firebase scripts (compat version for service workers)
importScripts(
  "https://www.gstatic.com/firebasejs/12.4.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.4.0/firebase-messaging-compat.js"
);

// Initialize Firebase in the service worker
// Note: Service workers cannot use ES6 imports or access environment variables
// You must use the compat version and hardcode your Firebase config
firebase.initializeApp({
  apiKey: "AIzaSyAb3nSkBwSYTJuuP9m7b1OoXmeLZcymM2A",
  authDomain: "basma-maintenance.firebaseapp.com",
  projectId: "basma-maintenance",
  storageBucket: "basma-maintenance.firebasestorage.app",
  messagingSenderId: "924795528869",
  appId: "1:924795528869:web:cd99a83c0f99da12564f4c",
});

// Get messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  const notificationTitle =
    payload.notification?.title || payload.data?.title || "إشعار جديد";
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || "",
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    tag: payload.data?.type || "notification",
    data: payload.data || {},
    requireInteraction: false,
    vibrate: [200, 100, 200],
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);
  event.notification.close();

  const notificationData = event.notification.data;

  // Determine the URL to open based on notification type
  let urlToOpen = "/dashboard";

  if (notificationData) {
    const { type, entityId, entityType } = notificationData;

    switch (type) {
      case "request_status_change":
      case "request_assigned":
      case "request_comment":
        urlToOpen = `/dashboard/requests?id=${entityId}`;
        break;
      case "chat_message":
        urlToOpen = `/dashboard/chat?id=${entityId}`;
        break;
      case "announcement":
        urlToOpen = "/dashboard";
        break;
      case "system_update":
        urlToOpen = "/dashboard/settings";
        break;
      default:
        urlToOpen = "/dashboard";
    }
  }

  // Open or focus the client window
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url.includes("/dashboard") && "focus" in client) {
            return client.focus().then(() => {
              // Navigate to the specific URL
              return client.navigate(urlToOpen);
            });
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Handle service worker updates
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(clients.claim());
});

