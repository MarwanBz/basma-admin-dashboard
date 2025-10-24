"use client";

import { Bell, Layers, Send, TestTube } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DevicesTable,
  NotificationStats,
  SendAnnouncementModal,
  TestNotificationModal,
  TopicSubscriptions,
} from "./_components";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function FCMManagementPage() {
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex gap-4">
        <Button
          onClick={() => setAnnouncementModalOpen(true)}
          className="gap-2"
        >
          <Send className="h-4 w-4" />
          إرسال إعلان
        </Button>
        <Button
          onClick={() => setTestModalOpen(true)}
          variant="outline"
          className="gap-2"
        >
          <TestTube className="h-4 w-4" />
          إشعار تجريبي
        </Button>
      </div>

      {/* Notification Statistics */}
      <NotificationStats />

      {/* Devices Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            الأجهزة المسجلة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DevicesTable />
        </CardContent>
      </Card>

      {/* Topic Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            إدارة المواضيع
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TopicSubscriptions />
        </CardContent>
      </Card>

      {/* Modals */}
      <SendAnnouncementModal
        open={announcementModalOpen}
        onOpenChange={setAnnouncementModalOpen}
      />
      <TestNotificationModal
        open={testModalOpen}
        onOpenChange={setTestModalOpen}
      />
    </div>
  );
}
