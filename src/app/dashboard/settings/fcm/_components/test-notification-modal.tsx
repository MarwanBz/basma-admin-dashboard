"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSendTestNotification } from "@/hooks/useNotifications";
import { useState } from "react";

interface TestNotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SendMode = "user" | "topic";

export function TestNotificationModal({
  open,
  onOpenChange,
}: TestNotificationModalProps) {
  const [sendMode, setSendMode] = useState<SendMode>("user");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [topic, setTopic] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [customData, setCustomData] = useState("");
  const [result, setResult] = useState<{
    success: boolean;
    messageId?: string;
    successCount: number;
    failureCount: number;
  } | null>(null);

  const sendMutation = useSendTestNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      toast.error("يرجى ملء عنوان ومحتوى الإشعار");
      return;
    }

    if (sendMode === "user" && !userId.trim()) {
      toast.error("يرجى إدخال معرف المستخدم");
      return;
    }

    if (sendMode === "topic" && !topic.trim()) {
      toast.error("يرجى إدخال اسم الموضوع");
      return;
    }

    let parsedData = undefined;
    if (customData.trim()) {
      try {
        parsedData = JSON.parse(customData);
      } catch {
        toast.error("بيانات JSON غير صالحة");
        return;
      }
    }

    try {
      const response = await sendMutation.mutateAsync({
        token: token || undefined,
        userId: sendMode === "user" ? userId : undefined,
        topic: sendMode === "topic" ? topic : undefined,
        title,
        body,
        data: parsedData,
      });
      setResult(response.data);
      toast.success("تم إرسال الإشعار التجريبي بنجاح");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "فشل إرسال الإشعار";
      toast.error(errorMessage);
      setResult(null);
    }
  };

  const handleClose = () => {
    setSendMode("user");
    setUserId("");
    setTopic("");
    setTitle("");
    setBody("");
    setCustomData("");
    setToken("");
    setResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إرسال إشعار تجريبي</DialogTitle>
          <DialogDescription>
            اختبر إرسال الإشعارات لمستخدم محدد أو موضوع معين
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Device Token */}
          <div className="space-y-2">
            <Label htmlFor="token">رمز الجهاز (اختياري)</Label>
            <Input
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="FCM رمز الجهاز"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              إذا أدخلت رمز جهاز، سيتم إرسال الإشعار للجهاز المحدد
            </p>
          </div>

          {/* Send Mode */}
          <div className="space-y-2">
            <Label htmlFor="sendMode">وجهة الإرسال</Label>
            <Select
              value={sendMode}
              onValueChange={(value) => setSendMode(value as SendMode)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">مستخدم محدد</SelectItem>
                <SelectItem value="topic">موضوع محدد</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* User ID or Topic */}
          {sendMode === "user" ? (
            <div className="space-y-2">
              <Label htmlFor="userId">معرف المستخدم *</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="أدخل معرف المستخدم (UUID)"
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="topic">اسم الموضوع *</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="مثال: maintenance-updates"
                required
              />
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">عنوان الإشعار *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان الإشعار التجريبي"
              required
            />
          </div>

          {/* Body */}
          <div className="space-y-2">
            <Label htmlFor="body">محتوى الإشعار *</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="محتوى الإشعار التجريبي"
              rows={3}
              required
            />
          </div>

          {/* Custom Data (JSON) */}
          <div className="space-y-2">
            <Label htmlFor="customData">بيانات إضافية (JSON - اختياري)</Label>
            <Textarea
              id="customData"
              value={customData}
              onChange={(e) => setCustomData(e.target.value)}
              placeholder='{"type": "test", "key": "value"}'
              rows={3}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              أدخل بيانات JSON صالحة لإرسالها مع الإشعار
            </p>
          </div>

          {/* Result Display */}
          {result && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-sm">نتيجة الإرسال</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className="font-semibold">
                      {result.success ? "تم الإرسال بنجاح" : "فشل الإرسال"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">عدد النجاحات</p>
                      <p className="font-semibold">{result.successCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">عدد الإخفاقات</p>
                      <p className="font-semibold">{result.failureCount}</p>
                    </div>
                  </div>
                  {result.messageId && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">
                        معرف الرسالة
                      </p>
                      <p className="font-mono text-xs break-all">
                        {result.messageId}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={sendMutation.isPending}
            >
              إغلاق
            </Button>
            <Button type="submit" disabled={sendMutation.isPending}>
              {sendMutation.isPending ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                "إرسال الإشعار"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
