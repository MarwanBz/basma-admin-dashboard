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
import { useState } from "react";

interface AssignTechnicianModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  technicians: Technician[];
  onSubmit: (technicianId: string) => void;
}

export function AssignTechnicianModal({
  open,
  onOpenChange,
  technicians,
  onSubmit,
}: AssignTechnicianModalProps) {
  const [selectedTechnician, setSelectedTechnician] = useState("");

  // All technicians are available since API doesn't return status
  const availableTechnicians = technicians;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTechnician) {
      onSubmit(selectedTechnician);
      setSelectedTechnician("");
      onOpenChange(false);
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
                !selectedTechnician || availableTechnicians.length === 0
              }
            >
              تعيين الفني
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
