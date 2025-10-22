"use client";

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
import { Label } from "@/components/ui/label";
import { Technician } from "@/types/request";
import { toast } from "sonner";
import { useState } from "react";

interface AssignTechnicianModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  technicians: Technician[];
  onSubmit: (technicianId: string) => void;
  isLoading?: boolean;
}

export function AssignTechnicianModal({
  open,
  onOpenChange,
  technicians,
  onSubmit,
  isLoading = false,
}: AssignTechnicianModalProps) {
  const [selectedTechnician, setSelectedTechnician] = useState("");

  // All technicians are available since API doesn't return status
  const availableTechnicians = technicians;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTechnician) {
      const technician = technicians.find((t) => t.id === selectedTechnician);
      onSubmit(selectedTechnician);
      toast.success("تم تعيين الفني بنجاح", {
        description: `تم تعيين ${technician?.name} للطلب`,
      });
      // Don't close modal immediately - let parent handle it after API completes
      // Don't reset form immediately - let parent handle it after success
    } else {
      toast.warning("يرجى اختيار فني للتعيين");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>تعيين فني</DialogTitle>
          <DialogDescription>
            اختر فني لتعيينه على طلب الصيانة هذا
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="technician">الفني *</Label>
            <Select
              value={selectedTechnician}
              onValueChange={setSelectedTechnician}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر فني" />
              </SelectTrigger>
              <SelectContent>
                {availableTechnicians.map((technician) => (
                  <SelectItem key={technician.id} value={technician.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{technician.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {technician.email}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {availableTechnicians.length === 0 && (
            <p className="text-sm text-muted-foreground">
              لا يوجد فنيون متاحون في الوقت الحالي.
            </p>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={
                !selectedTechnician ||
                availableTechnicians.length === 0 ||
                isLoading
              }
            >
              {isLoading ? "جاري التعيين..." : "تعيين الفني"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
