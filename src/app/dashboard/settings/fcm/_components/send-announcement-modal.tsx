"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Loader2 } from "lucide-react";
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
import { NOTIFICATION_TARGET_ROLE } from "@/constants/app-constants";
import { TargetRole } from "@/types/notifications";
import { Textarea } from "@/components/ui/textarea";
import { getNotificationTargetRoleLabel } from "@/constants/translations";
import { toast } from "sonner";
import { useSendAnnouncement } from "@/hooks/useNotifications";
import { useState } from "react";

interface SendAnnouncementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendAnnouncementModal({
  open,
  onOpenChange,
}: SendAnnouncementModalProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetRole, setTargetRole] = useState<TargetRole>("ALL");
  const [announcementId, setAnnouncementId] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const sendMutation = useSendAnnouncement();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      await sendMutation.mutateAsync({
        title,
        body,
        targetRole,
        announcementId: announcementId || undefined,
      });
      toast.success("تم إرسال الإعلان بنجاح");
      handleClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "فشل إرسال الإعلان";
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    setTitle("");
    setBody("");
    setTargetRole("ALL");
    setAnnouncementId("");
    setShowPreview(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>إرسال إعلان جديد</DialogTitle>
          <DialogDescription>
            أرسل إعلاناً لمجموعة محددة من المستخدمين
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">عنوان الإعلان *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: إشعار صيانة مجدولة"
              required
            />
          </div>

          {/* Body */}
          <div className="space-y-2">
            <Label htmlFor="body">محتوى الإعلان *</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="اكتب محتوى الإعلان هنا..."
              rows={4}
              required
            />
          </div>

          {/* Target Role */}
          <div className="space-y-2">
            <Label htmlFor="targetRole">الفئة المستهدفة</Label>
            <Select
              value={targetRole}
              onValueChange={(value) => setTargetRole(value as TargetRole)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(NOTIFICATION_TARGET_ROLE).map((role) => (
                  <SelectItem key={role} value={role}>
                    {getNotificationTargetRoleLabel(role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Announcement ID (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="announcementId">معرف الإعلان (اختياري)</Label>
            <Input
              id="announcementId"
              value={announcementId}
              onChange={(e) => setAnnouncementId(e.target.value)}
              placeholder="معرف فريد للإعلان"
            />
          </div>

          {/* Preview Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="w-full gap-2"
          >
            <Eye className="h-4 w-4" />
            {showPreview ? "إخفاء المعاينة" : "معاينة الإشعار"}
          </Button>

          {/* Preview Card */}
          {showPreview && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-sm">معاينة الإشعار</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-background rounded-lg border">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">
                        {title || "عنوان الإعلان"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {body || "محتوى الإعلان"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        الفئة: {getNotificationTargetRoleLabel(targetRole)}
                      </p>
                    </div>
                  </div>
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
              إلغاء
            </Button>
            <Button type="submit" disabled={sendMutation.isPending}>
              {sendMutation.isPending ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                "إرسال الإعلان"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
