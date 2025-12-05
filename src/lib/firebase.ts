import { getApps, initializeApp } from "firebase/app";

import { getMessaging } from "firebase/messaging";
import { isSupported } from "firebase/messaging";

// Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAb3nSkBwSYTJuuP9m7b1OoXmeLZcymM2A",
//   authDomain: "basma-maintenance.firebaseapp.com",
//   projectId: "basma-maintenance",
//   storageBucket: "basma-maintenance.firebasestorage.app",
//   messagingSenderId: "924795528869",
//   appId: "1:924795528869:web:cd99a83c0f99da12564f4c",
// };

const firebaseConfig = {
  apiKey: "AIzaSyAb3nSkBwSYTJuuP9m7b1OoXmeLZcymM2A",
  authDomain: "basma-maintenance.firebaseapp.com",
  projectId: "basma-maintenance",
  storageBucket: "basma-maintenance.firebasestorage.app",
  messagingSenderId: "924795528869",
  appId: "1:924795528869:web:cd99a83c0f99da12564f4c",
  measurementId: "G-0CM3JPQ87B"
};

// Initialize Firebase
export const app =
  typeof window !== "undefined" && !getApps().length
    ? initializeApp(firebaseConfig)
    : undefined;

// VAPID key for web push notifications
export const VAPID_KEY =
  "BMyZdwi-jCFJods4UAGvelm6XkdzeSEE-iUx1qlD2F2TSS4h7gJt6BBN22vYPA0iHvW3SZb-4tByyURQc15Pm6Q";

// Alias for compatibility with code that uses PUBLIC_VAPID_KEY
export const PUBLIC_VAPID_KEY = VAPID_KEY;

// Token age utilities
const TOKEN_TIMESTAMP_KEY = "fcm_token_timestamp";
const TOKEN_EXPIRY_DAYS = 60; // FCM tokens typically expire after 60 days

export const getTokenAge = (): number | null => {
  if (typeof window === "undefined") return null;
  const timestamp = localStorage.getItem(TOKEN_TIMESTAMP_KEY);
  if (!timestamp) return null;
  const days = Math.floor(
    (Date.now() - parseInt(timestamp)) / (1000 * 60 * 60 * 24)
  );
  return days;
};

export const getDaysUntilExpiry = (): number | null => {
  const age = getTokenAge();
  if (age === null) return null;
  return Math.max(0, TOKEN_EXPIRY_DAYS - age);
};

export const setTokenTimestamp = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_TIMESTAMP_KEY, Date.now().toString());
  }
};

export const isMessagingSupported =
  typeof window !== "undefined" && isSupported();

export const messaging = isMessagingSupported && app ? getMessaging(app) : null;
