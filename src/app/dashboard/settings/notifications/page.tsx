"use client";

import {
  Bell,
  Check,
  Copy,
  RefreshCw,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDaysUntilExpiry, getTokenAge } from "@/lib/firebase";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TopicSubscriptions } from "./topic-subscriptions";
import { SendNotificationForm } from "./send-notification-form";
import { toast } from "sonner";
import { useWebPushNotifications } from "@/hooks/useWebPushNotifications";

export default function NotificationSettingsPage() {
  const {
    permission,
    token,
    isSupported,
    isLoading,
    requestPermission,
    getToken,
  } = useWebPushNotifications();

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      toast.success("تم نسخ رمز الإشعارات");
    }
  };

  const handleRefreshToken = async () => {
    const newToken = await getToken();
    if (newToken) {
      toast.success("تم تحديث رمز الإشعارات");
    }
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

          {token && (
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
                value={token}
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
          <CardDescription>تفعيل أو تعطيل الإشعارات</CardDescription>
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
          </div>
        </CardContent>
      </Card>

      {/* Send Notification to Topic */}
      <SendNotificationForm />

      {/* Topic Subscriptions */}
      <TopicSubscriptions token={token} />

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
