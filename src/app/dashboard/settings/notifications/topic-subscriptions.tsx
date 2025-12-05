"use client";

import { Bell, BellOff, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSubscribeTopic } from "@/hooks/useNotifications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useWebPushNotifications } from "@/hooks/useWebPushNotifications";

interface TopicSubscriptionProps {
  token?: string | null;
}

export function TopicSubscriptions({
  token: tokenProp,
}: TopicSubscriptionProps) {
  const {
    token: tokenHook,
    permission,
    requestPermission,
    getToken,
    setPermission,
  } = useWebPushNotifications();
  const subscribeTopicMutation = useSubscribeTopic();

  // Use prop token if provided, otherwise use hook token
  let token = tokenProp || tokenHook;

  const [subscribedTopics, setSubscribedTopics] = useState<string[]>([]);

  const availableTopics = [
    {
      key: "job-hunting",
      label: "فرص العمل",
      description: "إشعارات حول فرص العمل الجديدة",
    },
    {
      key: "all-users",
      label: "جميع المستخدمين",
      description: "إشعارات عامة لجميع المستخدمين",
    },
    {
      key: "maintenance-updates",
      label: "تحديثات الصيانة",
      description: "إشعارات حول تحديثات الصيانة",
    },
    {
      key: "chat-messages",
      label: "رسائل المحادثة",
      description: "إشعارات الرسائل الجديدة",
    },
    {
      key: "announcements",
      label: "الإعلانات",
      description: "إشعارات الإعلانات الرسمية",
    },
  ];

  const handleSubscribe = async (topic: string) => {
    if (permission !== "granted") {
      const permissionGranted = await requestPermission();
      if (!permissionGranted) {
        toast.error("يجب السماح بالإشعارات للاشتراك");
        return;
      }
      // re-render the component to remove the disabled state
      setPermission(Notification.permission);
    }

    if (!token) {
      token = await getToken();
      if (!token) {
        toast.error("لم يتم العثور على رمز مميز. حاول تحديث الصفحة.");
        return;
      }
    }

    console.log("Subscribing to topic:", { token, topic });

    try {
      await subscribeTopicMutation.mutateAsync({
        token: token,
        topic: topic,
      });

      setSubscribedTopics((prev) => [...prev, topic]);
      toast.success(`تم الاشتراك في ${topic}`);
    } catch {
      toast.error("فشل في الاشتراك");
    }
  };

  const isSubscribed = (topic: string) => subscribedTopics.includes(topic);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          إدارة الاشتراكات
        </CardTitle>
        <CardDescription>
          إدارة الاشتراكات في أنواع الإشعارات المختلفة
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {availableTopics.map((topic) => (
          <div
            key={topic.key}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">{topic.label}</h4>
                {isSubscribed(topic.key) && (
                  <Badge variant="default" className="gap-1">
                    <Check className="h-3 w-3" />
                    مشترك
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {topic.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isSubscribed(topic.key) ? (
                <Button
                  size="sm"
                  variant="outline"
                  disabled
                  className="gap-2"
                >
                  <Check className="h-4 w-4" />
                  تم الاشتراك
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleSubscribe(topic.key)}
                  disabled={subscribeTopicMutation.isPending}
                  className="gap-2"
                >
                  <Bell className="h-4 w-4" />
                  اشتراك
                </Button>
              )}
            </div>
          </div>
        ))}

        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 يمكنك الاشتراك في أنواع مختلفة من الإشعارات حسب احتياجاتك
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
