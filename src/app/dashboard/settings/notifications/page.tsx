"use client";

import {
  Bell,
  BellOff,
  Check,
  Copy,
  RefreshCw,
  TestTube,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDaysUntilExpiry, getTokenAge } from "@/lib/fcm-storage";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TopicSubscriptions } from "./topic-subscriptions";
import { toast } from "sonner";
import { useDevices } from "@/hooks/useNotifications";
import { useWebPushNotifications } from "@/hooks/useWebPushNotifications";

export default function NotificationSettingsPage() {
  const {
    permission,
    fcmToken,
    isSupported,
    isLoading,
    requestPermission,
    showTestNotification,
    refreshToken,
  } = useWebPushNotifications();

  const { data: devicesResponse } = useDevices();
  const devices = devicesResponse?.data?.devices || [];
  const webDevices = devices.filter((d) => d.platform === "WEB");

  const handleCopyToken = () => {
    if (fcmToken) {
      navigator.clipboard.writeText(fcmToken);
      toast.success("تم نسخ رمز الإشعارات");
    }
  };

  const handleRefreshToken = async () => {
    await refreshToken();
  };

  const getPermissionBadge = () => {
    switch (permission) {
      case "granted":
        return (
          <Badge variant="default" className="gap-1">
            <Check className="h-3 w-3" />
            ممنوح
          </Badge>
        );
      case "denied":
        return (
          <Badge variant="destructive" className="gap-1">
            <X className="h-3 w-3" />
            مرفوض
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1">
            غير محدد
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">إعدادات الإشعارات</h1>
        <p className="text-muted-foreground mt-2">
          إدارة إعدادات الإشعارات والأجهزة المسجلة
        </p>
      </div>

      {/* Browser Support Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            حالة دعم الإشعارات
          </CardTitle>
          <CardDescription>معلومات حول دعم المتصفح للإشعارات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">دعم المتصفح</span>
            {isSupported ? (
              <Badge variant="default" className="gap-1">
                <Check className="h-3 w-3" />
                مدعوم
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <X className="h-3 w-3" />
                غير مدعوم
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">حالة الإذن</span>
            {getPermissionBadge()}
          </div>

          {fcmToken && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="fcm-token">رمز FCM للجهاز الحالي</Label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyToken}
                    className="gap-2"
                  >
                    <Copy className="h-3 w-3" />
                    نسخ
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRefreshToken}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <RefreshCw
                      className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`}
                    />
                    تحديث
                  </Button>
                </div>
              </div>
              <Input
                id="fcm-token"
                value={fcmToken}
                readOnly
                className="font-mono text-xs"
              />
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {getTokenAge() !== null && (
                  <span>عمر الرمز: {getTokenAge()} يوم</span>
                )}
                {getDaysUntilExpiry() !== null && (
                  <span>ينتهي خلال: {getDaysUntilExpiry()} يوم</span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            إدارة الإشعارات
          </CardTitle>
          <CardDescription>تفعيل أو تعطيل الإشعارات واختبارها</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isSupported && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              <p className="text-sm">
                المتصفح الحالي لا يدعم الإشعارات. يرجى استخدام متصفح حديث مثل
                Chrome أو Firefox أو Edge.
              </p>
            </div>
          )}

          {isSupported && permission === "denied" && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              <p className="text-sm">
                تم رفض إذن الإشعارات. يرجى تفعيل الإشعارات من إعدادات المتصفح.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {permission !== "granted" && isSupported && (
              <Button
                onClick={requestPermission}
                disabled={isLoading || permission === "denied"}
                className="gap-2"
              >
                <Bell className="h-4 w-4" />
                {isLoading ? "جاري التفعيل..." : "تفعيل الإشعارات"}
              </Button>
            )}

            {permission === "granted" && (
              <Button
                onClick={showTestNotification}
                variant="outline"
                className="gap-2"
              >
                <TestTube className="h-4 w-4" />
                إرسال إشعار تجريبي
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Registered Web Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            الأجهزة المسجلة (الويب)
          </CardTitle>
          <CardDescription>
            قائمة بأجهزة الويب المسجلة لاستقبال الإشعارات
          </CardDescription>
        </CardHeader>
        <CardContent>
          {webDevices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BellOff className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>لا توجد أجهزة ويب مسجلة</p>
            </div>
          ) : (
            <div className="space-y-3">
              {webDevices.map((device) => (
                <div
                  key={device.id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">WEB</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(device.createdAt).toLocaleDateString("ar-SA")}
                    </span>
                  </div>
                  {device.deviceId && (
                    <p className="text-sm text-muted-foreground truncate">
                      {device.deviceId}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>آخر استخدام</span>
                    <span>
                      {new Date(device.lastUsedAt).toLocaleDateString("ar-SA")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Topic Subscriptions */}
      <TopicSubscriptions fcmToken={fcmToken} />

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات مهمة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>• الإشعارات تعمل حتى عند إغلاق التطبيق أو تصغير المتصفح</p>
          <p>• يمكنك تعطيل الإشعارات في أي وقت من إعدادات المتصفح</p>
          <p>• الإشعارات تظهر في نظام التشغيل (Windows/Mac/Linux)</p>
          <p>• يمكنك النقر على الإشعار للانتقال مباشرة إلى الصفحة المعنية</p>
        </CardContent>
      </Card>
    </div>
  );
}
