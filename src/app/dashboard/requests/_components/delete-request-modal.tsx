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
            Delete Request
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this maintenance request? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium">{request.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">
            ID: {request.id} • {request.category} • {request.priority} priority
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
