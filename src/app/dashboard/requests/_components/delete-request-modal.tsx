"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MaintenanceRequest } from "@/types/request";

interface DeleteRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: MaintenanceRequest;
  onConfirm: () => void;
}

export function DeleteRequestModal({
  open,
  onOpenChange,
  request,
  onConfirm,
}: DeleteRequestModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            حذف الطلب
          </DialogTitle>
          <DialogDescription>
            هل أنت متأكد من حذف طلب الصيانة هذا؟ لا يمكن التراجع عن هذا الإجراء.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium">{request.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">
            رقم الطلب: {request.id} • {request.category.name} • أولوية{" "}
            {request.priority}
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            حذف الطلب
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
