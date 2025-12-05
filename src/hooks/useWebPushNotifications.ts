import { VAPID_KEY, app, setTokenTimestamp } from "@/lib/firebase";
import { getToken as getFCMToken, getMessaging } from "firebase/messaging";
import { useEffect, useState } from "react";

interface UseWebPushNotificationsReturn {
  permission: NotificationPermission;
  isSupported: boolean;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  getToken: () => Promise<string | null>;
  setPermission: (permission: NotificationPermission) => void;
}

export function useWebPushNotifications(): UseWebPushNotificationsReturn {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if notifications are supported
  const isSupported =
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window;

  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, [isSupported]);

  /**
   * Request notification permission from the user
   */
  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      setError("Push notifications are not supported in this browser");
      return false;
    }

    if (permission === "granted") {
      return true;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        // Get token after permission is granted
        const fcmToken = await getToken();
        return !!fcmToken;
      } else {
        setError("Notification permission denied");
        return false;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to request permission";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get FCM token for the device
   */
  const getToken = async (): Promise<string | null> => {
    if (!isSupported || permission !== "granted") {
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Ensure service worker is ready
      const registration = await navigator.serviceWorker.ready;

      // Initialize Firebase Messaging
      if (!app) {
        throw new Error("Firebase app not initialized");
      }

      const messagingInstance = getMessaging(app);

      // Get FCM token
      const fcmToken = await getFCMToken(messagingInstance, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (fcmToken) {
        setToken(fcmToken);
        setTokenTimestamp();
      }

      return fcmToken;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get FCM token";
      setError(errorMessage);
      console.error("Error getting FCM token:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    permission,
    isSupported,
    token,
    isLoading,
    error,
    requestPermission,
    getToken,
    setPermission,
  };
}
