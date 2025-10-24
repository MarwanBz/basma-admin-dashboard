"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Check, Copy, Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useSubscribeTopic,
  useUnsubscribeTopic,
} from "@/hooks/useNotifications";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NOTIFICATION_TOPIC } from "@/constants/app-constants";
import { getNotificationTopicLabel } from "@/constants/translations";
import { toast } from "sonner";
import { useWebPushNotifications } from "@/hooks/useWebPushNotifications";

export function TopicSubscriptions() {
  const [deviceToken, setDeviceToken] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [subscribedTopics, setSubscribedTopics] = useState<string[]>([]);

  const subscribeMutation = useSubscribeTopic();
  const unsubscribeMutation = useUnsubscribeTopic();
  const { fcmToken } = useWebPushNotifications();

  const defaultTopics = Object.values(NOTIFICATION_TOPIC);

  // Auto-populate device token when FCM token is available
  useEffect(() => {
    if (fcmToken && !deviceToken) {
      setDeviceToken(fcmToken);
    }
  }, [fcmToken, deviceToken]);

  const handleCopyToken = () => {
    if (deviceToken) {
      navigator.clipboard.writeText(deviceToken);
      toast.success("تم نسخ رمز الجهاز");
    }
  };

  const handleSubscribe = async (topic: string) => {
    if (!deviceToken.trim()) {
      toast.error("يرجى إدخال رمز الجهاز أولاً");
      return;
    }

    try {
      await subscribeMutation.mutateAsync({
        token: deviceToken,
        topic,
      });
      setSubscribedTopics([...subscribedTopics, topic]);
      toast.success(`تم الاشتراك في: ${topic}`);
      if (topic === customTopic) {
        setCustomTopic("");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "فشل الاشتراك في الموضوع";
      toast.error(errorMessage);
    }
  };

  const handleUnsubscribe = async (topic: string) => {
    if (!deviceToken.trim()) {
      toast.error("يرجى إدخال رمز الجهاز أولاً");
      return;
    }

    try {
      await unsubscribeMutation.mutateAsync({
        token: deviceToken,
        topic,
      });
      setSubscribedTopics(subscribedTopics.filter((t) => t !== topic));
      toast.success(`تم إلغاء الاشتراك من: ${topic}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "فشل إلغاء الاشتراك من الموضوع";
      toast.error(errorMessage);
    }
  };

  const isSubscribed = (topic: string) => subscribedTopics.includes(topic);

  return (
    <div className="space-y-6">
      {/* Device Token Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="deviceToken">رمز الجهاز (FCM Token)</Label>
          <div className="flex gap-2">
            {fcmToken && deviceToken === fcmToken && (
              <Badge variant="secondary" className="gap-1">
                <Check className="h-3 w-3" />
                تم التعبئة تلقائياً
              </Badge>
            )}
            {deviceToken && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyToken}
                className="h-6 gap-1"
              >
                <Copy className="h-3 w-3" />
                نسخ
              </Button>
            )}
          </div>
        </div>
        <Input
          id="deviceToken"
          value={deviceToken}
          onChange={(e) => setDeviceToken(e.target.value)}
          placeholder="أدخل رمز الجهاز للاشتراك في المواضيع"
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          {fcmToken
            ? "تم تعبئة رمز جهازك الحالي تلقائياً. يمكنك تغييره لاختبار أجهزة أخرى."
            : "يمكنك الحصول على رمز الجهاز من التطبيق المحمول أو من قائمة الأجهزة المسجلة أعلاه"}
        </p>
      </div>

      {/* Default Topics */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">المواضيع الافتراضية</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {defaultTopics.map((topic) => (
            <Card key={topic}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">
                      {getNotificationTopicLabel(topic)}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      {topic}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSubscribed(topic) && (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700"
                      >
                        <Check className="h-3 w-3 ml-1" />
                        مشترك
                      </Badge>
                    )}
                    {isSubscribed(topic) ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUnsubscribe(topic)}
                        disabled={
                          !deviceToken ||
                          subscribeMutation.isPending ||
                          unsubscribeMutation.isPending
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleSubscribe(topic)}
                        disabled={
                          !deviceToken ||
                          subscribeMutation.isPending ||
                          unsubscribeMutation.isPending
                        }
                      >
                        {subscribeMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Topic Subscription */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">الاشتراك في موضوع مخصص</h4>
        <div className="flex gap-2">
          <Input
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="مثال: request-123 أو building-456"
            className="font-mono text-sm"
          />
          <Button
            onClick={() => handleSubscribe(customTopic)}
            disabled={
              !deviceToken ||
              !customTopic.trim() ||
              subscribeMutation.isPending ||
              unsubscribeMutation.isPending
            }
          >
            {subscribeMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Plus className="h-4 w-4 ml-2" />
                اشتراك
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          يمكنك الاشتراك في مواضيع ديناميكية مثل request-*, building-*, أو
          user-*
        </p>
      </div>

      {/* Subscribed Topics List */}
      {subscribedTopics.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">المواضيع المشترك بها حالياً</h4>
          <div className="flex flex-wrap gap-2">
            {subscribedTopics.map((topic) => (
              <Badge
                key={topic}
                variant="secondary"
                className="px-3 py-1 gap-2"
              >
                {topic}
                <button
                  onClick={() => handleUnsubscribe(topic)}
                  className="hover:text-red-600"
                  disabled={
                    subscribeMutation.isPending || unsubscribeMutation.isPending
                  }
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
