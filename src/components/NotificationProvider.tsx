"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useWebPushNotifications } from "@/hooks/useWebPushNotifications";
import { useSubscribeTopic } from "@/hooks/useNotifications";
import { onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firebase";
import { Bell, X } from "lucide-react";
import { Button } from "./ui/button";

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { requestPermission, getToken } = useWebPushNotifications();
  const { mutateAsync: subscribe } = useSubscribeTopic();
  const topic = "job-hunting";
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        const granted = await requestPermission();

        if (granted) {
          const token = await getToken();
          if (token) {
            console.log(token);
            try {
              await subscribe({ token, topic });
            } catch (error) {
              // Silent error
            }
          }
        }

        if (messaging) {
          unsubscribeRef.current = onMessage(messaging, (payload) => {
            toast.success(
              (payload.notification?.title || "") + " " + (payload.notification?.body || ""),
              {
                position: "top-center",
                duration: 3000,
              }
            );
          });
        }

        const handleServiceWorkerMessage = (event: MessageEvent) => {
          if (event.data && event.data.type === "NOTIFICATION_CLICKED") {
            // Handle click
          }
        };

        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.addEventListener(
            "message",
            handleServiceWorkerMessage
          );
        }

        return () => {
          if ("serviceWorker" in navigator) {
            navigator.serviceWorker.removeEventListener(
              "message",
              handleServiceWorkerMessage
            );
          }
        };
      } catch (error) {
        // Silent error
      }
    };

    initializeNotifications();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return <>{children}</>;
}

/**
 * NotificationPermissionBanner component
 * Shows a banner to request notification permission if not granted
 */
export function NotificationPermissionBanner() {
  const {
    permission,
    isSupported,
    requestPermission,
    isLoading,
    setPermission,
  } = useWebPushNotifications();

  // Don't show banner if notifications not supported or already granted/denied
  if (!isSupported || permission === "granted" || permission === "denied") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-primary text-primary-foreground rounded-lg shadow-lg p-4 flex items-start gap-3 z-50">
      <Bell className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <h3 className="font-semibold mb-1">تفعيل الإشعارات</h3>
        <p className="text-sm opacity-90 mb-3">
          احصل على إشعارات فورية عند تحديث حالة الطلبات والرسائل الجديدة
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={requestPermission}
            disabled={isLoading}
          >
            {isLoading ? "جاري التفعيل..." : "تفعيل الإشعارات"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              toast.info("يمكنك تفعيل الإشعارات لاحقاً من الإعدادات");
              setPermission("denied");
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
