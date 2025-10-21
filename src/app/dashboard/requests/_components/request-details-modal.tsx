"use client";

import {
  Calendar,
  Clock,
  Edit,
  MapPin,
  Trash2,
  User,
  UserPlus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPriorityText, priorityColors } from "@/lib/status-utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MaintenanceRequest } from "@/types/request";
import { StatusSelect } from "@/components/ui/status-select";
import { UserRole } from "@/types/user";

interface RequestDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: MaintenanceRequest;
  userRole: UserRole;
  onEdit: () => void;
  onDelete: () => void;
  onAssign: () => void;
  onStatusChange?: (requestId: string, status: string) => void;
}

export function RequestDetailsModal({
  open,
  onOpenChange,
  request,
  userRole,
  onEdit,
  onDelete,
  onAssign,
  onStatusChange,
}: RequestDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {request.title}
            <Badge className={priorityColors[request.priority]}>
              {getPriorityText(request.priority)}
            </Badge>
            <StatusSelect
              currentStatus={request.status}
              requestId={request.id}
              userRole={userRole}
              onStatusChange={onStatusChange}
            />
          </DialogTitle>
          <DialogDescription>رقم الطلب: {request.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">تفاصيل الطلب</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">الموقع</p>
                  <p className="text-sm text-muted-foreground">
                    {request.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">مُعيّن لـ</p>
                  <p className="text-sm text-muted-foreground">
                    {request.assignedTo?.name || "غير مُعيّن"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">التاريخ</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(
                      request.scheduledDate || request.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">الفئة</p>
                  <p className="text-sm text-muted-foreground">
                    {request.category.name}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">الوصف</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {request.description}
            </p>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إغلاق
          </Button>
          {request.status === "SUBMITTED" && (
            <Button onClick={onAssign} className="gap-2">
              <UserPlus className="h-4 w-4" />
              تعيين فني
            </Button>
          )}
          <Button onClick={onEdit} variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            تعديل
          </Button>
          <Button onClick={onDelete} variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" />
            حذف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
