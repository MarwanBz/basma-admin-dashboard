"use client";

import { Bell, X } from "lucide-react";

import { Button } from "./ui/button";
import { toast } from "sonner";
import { useEffect } from "react";
import useServiceWorker from "@/hooks/useServiceWorker";
import { useWebPushNotifications } from "@/hooks/useWebPushNotifications";

/**
 * NotificationProvider component
 * - Registers service worker
 * - Manages web push notifications
 * - Shows update banner when new version available
 */
export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { updateAvailable, updateServiceWorker } = useServiceWorker();
  const { permission, isSupported } = useWebPushNotifications();

  // Show update banner when new version is available
  useEffect(() => {
    if (updateAvailable) {
      toast.info("يتوفر تحديث جديد للتطبيق", {
        duration: Infinity,
        action: {
          label: "تحديث الآن",
          onClick: () => updateServiceWorker(),
        },
      });
    }
  }, [updateAvailable, updateServiceWorker]);

  return <>{children}</>;
}

/**
 * NotificationPermissionBanner component
 * Shows a banner to request notification permission if not granted
 */
export function NotificationPermissionBanner() {
  const { permission, isSupported, requestPermission, isLoading } =
    useWebPushNotifications();

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
              // Hide banner by setting permission to denied in local state
              toast.info("يمكنك تفعيل الإشعارات لاحقاً من الإعدادات");
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

