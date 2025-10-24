"use client";

import { Bell, BellOff, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Removed unused imports from notifications types
import {
  useSubscribeTopic,
  useUnsubscribeTopic,
} from "@/hooks/useNotifications";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useWebPushNotifications } from "@/hooks/useWebPushNotifications";

interface TopicSubscriptionProps {
  userRole?: string;
  token?: string | null;
}

export function TopicSubscriptions({
  userRole,
  token: tokenProp,
}: TopicSubscriptionProps) {
  const { token: tokenHook, permission } = useWebPushNotifications();
  const subscribeTopicMutation = useSubscribeTopic();
  const unsubscribeTopicMutation = useUnsubscribeTopic();

  // Use prop token if provided, otherwise use hook token
  const token = tokenProp || tokenHook;

  const [subscribedTopics, setSubscribedTopics] = useState<string[]>([
    // Default subscriptions based on role
    ...(userRole ? [`role-${userRole.toLowerCase()}`] : []),
    "all-users",
    "announcements",
  ]);

  const availableTopics = [
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
    if (!token) {
      toast.error("يجب تفعيل الإشعارات أولاً");
      return;
    }

    try {
      await subscribeTopicMutation.mutateAsync({
        token: token || "",
        topic: topic,
      });

      setSubscribedTopics((prev) => [...prev, topic]);
      toast.success(`تم الاشتراك في ${topic}`);
    } catch {
      toast.error("فشل في الاشتراك");
    }
  };

  const handleUnsubscribe = async (topic: string) => {
    if (!token) {
      toast.error("يجب تفعيل الإشعارات أولاً");
      return;
    }

    try {
      await unsubscribeTopicMutation.mutateAsync({
        token: token || "",
        topic: topic,
      });

      setSubscribedTopics((prev) => prev.filter((t) => t !== topic));
      toast.success(`تم إلغاء الاشتراك من ${topic}`);
    } catch {
      toast.error("فشل في إلغاء الاشتراك");
    }
  };

  const isSubscribed = (topic: string) => subscribedTopics.includes(topic);

  if (permission !== "granted") {
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
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BellOff className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>يجب تفعيل الإشعارات أولاً لإدارة الاشتراكات</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                  onClick={() => handleUnsubscribe(topic.key)}
                  disabled={
                    subscribeTopicMutation.isPending ||
                    unsubscribeTopicMutation.isPending
                  }
                  className="gap-2"
                >
                  <BellOff className="h-4 w-4" />
                  إلغاء الاشتراك
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleSubscribe(topic.key)}
                  disabled={
                    subscribeTopicMutation.isPending ||
                    unsubscribeTopicMutation.isPending
                  }
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
