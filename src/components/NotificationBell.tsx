"use client";

import { Bell, BellOff, Loader2, Settings, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useMarkNotificationsRead,
  useNotificationHistory,
  NOTIFICATION_QUERY_KEYS,
} from "@/hooks/useNotifications";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import {
  messaging,
  useWebPushNotifications,
} from "@/hooks/useWebPushNotifications";
import { useQueryClient } from "@tanstack/react-query";
import { onMessage } from "firebase/messaging";

/**
 * NotificationBell component
 * Displays notification icon with badge count and dropdown menu
 */
export function NotificationBell() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { permission, isSupported, requestPermission, isLoading } =
    useWebPushNotifications();
  const historyQuery = useNotificationHistory(50);
  const markReadMutation = useMarkNotificationsRead();
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

  const notifications = useMemo(() => {
    const items = historyQuery.data?.data ?? [];
    return items.filter((n) => !hiddenIds.has(n.id));
  }, [historyQuery.data, hiddenIds]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id: string) => {
    try {
      await markReadMutation.mutateAsync([id]);
    } catch {
      // noop - UI will refetch on error
    }
  };

  const markAllAsRead = async () => {
    const ids = notifications.filter((n) => !n.isRead).map((n) => n.id);
    if (!ids.length) return;
    try {
      await markReadMutation.mutateAsync(ids);
    } catch {
      // noop
    }
  };

  const clearNotification = (id: string) => {
    setHiddenIds((prev) => new Set(prev).add(id));
  };

  // Refetch on window focus
  useEffect(() => {
    const handler = () => {
      historyQuery.refetch();
    };
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, [historyQuery]);

  // Invalidate history when a foreground FCM message arrives
  useEffect(() => {
    if (!messaging) return;
    const unsubscribe = onMessage(messaging, () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.history,
      });
    });
    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "الآن";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `منذ ${days} يوم`;
  };

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) {
          historyQuery.refetch();
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>الإشعارات</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-auto p-1 text-xs"
            >
              تعليم الكل كمقروء
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Notification Permission Status */}
        {isSupported && permission !== "granted" && (
          <>
            <div className="p-3 bg-muted/50">
              <div className="flex items-start gap-2">
                <BellOff className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    الإشعارات غير مفعلة
                  </p>
                  <Button
                    size="sm"
                    onClick={requestPermission}
                    disabled={isLoading}
                    className="h-7 text-xs"
                  >
                    {isLoading ? "جاري التفعيل..." : "تفعيل الإشعارات"}
                  </Button>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Notifications List */}
        <ScrollArea className="h-[300px]">
          {historyQuery.isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                جاري تحميل الإشعارات...
              </p>
            </div>
          ) : historyQuery.isError ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-destructive">
              <BellOff className="h-6 w-6 mb-2" />
              <p className="text-sm">تعذر تحميل الإشعارات</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">لا توجد إشعارات</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                    !notification.isRead ? "bg-muted/30" : ""
                  }`}
                  onClick={() => {
                    markAsRead(notification.id);
                    if (notification.type?.includes("request")) {
                      router.push("/dashboard/requests");
                    }
                  }}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-tight">
                          {notification.title}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearNotification(notification.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.body}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {getTimeAgo(new Date(notification.createdAt))}
                        </span>
                        {!notification.isRead && (
                          <Badge
                            variant="default"
                            className="h-4 px-1 text-[10px]"
                          >
                            جديد
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/dashboard/settings/notifications")}
          className="flex-row-reverse justify-between cursor-pointer"
        >
          <span>إعدادات الإشعارات</span>
          <Settings className="h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
