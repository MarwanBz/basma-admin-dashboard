"use client";

import { Bell, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { useDevices } from "@/hooks/useNotifications";

export function NotificationStats() {
  const { data, isLoading } = useDevices();

  const devices = data?.data?.devices || [];
  const totalDevices = devices.length;
  const iosDevices = devices.filter((d) => d.platform === "IOS").length;
  const androidDevices = devices.filter((d) => d.platform === "ANDROID").length;
  const webDevices = devices.filter((d) => d.platform === "WEB").length;

  const stats = [
    {
      title: "إجمالي الأجهزة",
      value: totalDevices,
      icon: Smartphone,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "أجهزة iOS",
      value: iosDevices,
      icon: Smartphone,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    {
      title: "أجهزة Android",
      value: androidDevices,
      icon: Smartphone,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "أجهزة الويب",
      value: webDevices,
      icon: Bell,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
