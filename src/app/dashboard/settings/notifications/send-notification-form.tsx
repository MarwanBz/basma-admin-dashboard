"use client";

import { Bell, Send } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { useSendToTopic } from "@/hooks/useNotifications";

const AVAILABLE_TOPICS = [
  { value: "job-hunting", label: "فرص العمل" },
  { value: "all-users", label: "جميع المستخدمين" },
  { value: "maintenance-updates", label: "تحديثات الصيانة" },
  { value: "chat-messages", label: "رسائل المحادثة" },
  { value: "announcements", label: "الإعلانات" },
];

export function SendNotificationForm() {
  const [topic, setTopic] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { mutateAsync: sendNotification, isPending } = useSendToTopic();

  const handleSend = async () => {
    if (!topic || !title || !body) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    try {
      await sendNotification({ topic, title, body });
      toast.success(`تم إرسال الإشعار إلى ${topic}`);
      // Reset form
      setTitle("");
      setBody("");
    } catch (error) {
      toast.error("فشل في إرسال الإشعار");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          إرسال إشعار إلى موضوع
        </CardTitle>
        <CardDescription>
          إرسال إشعار لجميع المشتركين في موضوع معين
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">الموضوع</Label>
          <Select value={topic} onValueChange={setTopic}>
            <SelectTrigger id="topic">
              <SelectValue placeholder="اختر موضوع" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_TOPICS.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">العنوان</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان الإشعار"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body">الرسالة</Label>
          <Textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="نص الإشعار"
            rows={4}
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={isPending || !topic || !title || !body}
          className="w-full gap-2"
        >
          <Send className="h-4 w-4" />
          {isPending ? "جاري الإرسال..." : "إرسال الإشعار"}
        </Button>
      </CardContent>
    </Card>
  );
}
