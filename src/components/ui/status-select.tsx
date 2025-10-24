"use client";

import { AlertTriangle, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  canUpdateStatus,
  getAvailableStatuses,
  getStatusColor,
  getStatusLabel,
  getStatusTransitionDescription,
  isCriticalStatusChange,
  requiresReason,
} from "@/lib/status-utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RequestStatus } from "@/types/request";
import { Textarea } from "@/components/ui/textarea";
import { UserRole } from "@/types/user";
import { useState } from "react";
import { useUpdateRequestStatus } from "@/hooks/useRequests";

interface StatusSelectProps {
  currentStatus: RequestStatus;
  requestId: string;
  userRole?: UserRole;
  onStatusChange?: (requestId: string, newStatus: RequestStatus) => void;
  disabled?: boolean;
}

export function StatusSelect({
  currentStatus,
  requestId,
  userRole,
  onStatusChange,
  disabled = false,
}: StatusSelectProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | null>(
    null
  );
  const [reason, setReason] = useState("");
  const [showReasonDialog, setShowReasonDialog] = useState(false);

  const updateStatusMutation = useUpdateRequestStatus();

  const availableStatuses = userRole
    ? getAvailableStatuses(userRole, currentStatus)
    : [];
  const canUpdate = userRole ? canUpdateStatus(userRole) && !disabled : false;

  const handleStatusSelect = (newStatus: RequestStatus) => {
    setSelectedStatus(newStatus);

    // Check if reason is required
    if (requiresReason(newStatus)) {
      setShowReasonDialog(true);
      return;
    }

    // Check if this is a critical status change
    if (isCriticalStatusChange(currentStatus, newStatus)) {
      setShowConfirmation(true);
      return;
    }

    // Direct update for non-critical changes
    updateStatus(newStatus);
  };

  const updateStatus = (newStatus: RequestStatus, statusReason?: string) => {
    updateStatusMutation.mutate(
      {
        requestId,
        data: {
          status: newStatus,
          reason: statusReason,
        },
      },
      {
        onSuccess: () => {
          onStatusChange?.(requestId, newStatus);
          setShowConfirmation(false);
          setShowReasonDialog(false);
          setReason("");
          setSelectedStatus(null);
        },
      }
    );
  };

  const handleConfirmStatusChange = () => {
    if (selectedStatus) {
      updateStatus(selectedStatus, reason || undefined);
    }
  };

  const handleReasonSubmit = () => {
    if (selectedStatus) {
      if (isCriticalStatusChange(currentStatus, selectedStatus)) {
        setShowReasonDialog(false);
        setShowConfirmation(true);
      } else {
        updateStatus(selectedStatus, reason);
      }
    }
  };

  if (!canUpdate || availableStatuses.length === 0) {
    return (
      <Badge className={getStatusColor(currentStatus)}>
        {getStatusLabel(currentStatus)}
      </Badge>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="bg-transparent border-none shadow-none"
        >
          <Button
            variant="outline"
            className="h-8 gap-2"
            disabled={updateStatusMutation.isPending}
          >
            <Badge className={getStatusColor(currentStatus)}>
              {getStatusLabel(currentStatus)}
            </Badge>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 ">
          {availableStatuses.map((status) => (
            <DropdownMenuItem
              key={status}
              onClick={() => handleStatusSelect(status)}
              className="flex items-center gap-2"
            >
              <Badge className={getStatusColor(status)}>
                {getStatusLabel(status)}
              </Badge>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Reason Dialog */}
      <Dialog open={showReasonDialog} onOpenChange={setShowReasonDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة سبب للتغيير</DialogTitle>
            <DialogDescription>
              يرجى إضافة سبب لتغيير الحالة إلى{" "}
              {selectedStatus && getStatusLabel(selectedStatus)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">السبب (اختياري)</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="أدخل سبب تغيير الحالة..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReasonDialog(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleReasonSubmit}>متابعة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              تأكيد تغيير الحالة
            </DialogTitle>
            <DialogDescription>
              {selectedStatus &&
                getStatusTransitionDescription(currentStatus, selectedStatus)}
              <br />
              <strong>هل أنت متأكد من هذا التغيير؟</strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleConfirmStatusChange}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? "جاري التحديث..." : "تأكيد"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
