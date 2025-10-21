"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { FormErrors } from "@/types/building-config";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface AddBuildingModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onSubmit: (data: {
    buildingName: string;
    buildingCode: string;
    displayName: string;
    allowCustomId: boolean;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function AddBuildingModal({
  showModal,
  setShowModal,
  onSubmit,
  isLoading = false,
}: AddBuildingModalProps) {
  const [form, setForm] = useState({
    buildingName: "",
    buildingCode: "",
    displayName: "",
    allowCustomId: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!form.buildingName.trim()) {
      newErrors.buildingName = "اسم المنشأ مطلوب";
    }
    if (!form.buildingCode.trim()) {
      newErrors.buildingCode = "الكود مطلوب";
    }
    if (!form.displayName.trim()) {
      newErrors.displayName = "الاسم بالعربية مطلوب";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(form);
      setForm({
        buildingName: "",
        buildingCode: "",
        displayName: "",
        allowCustomId: false,
      });
      setErrors({});
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة منشأ جديد</DialogTitle>
          <DialogDescription>
            قم بإضافة منشأة جديدة إلى النظام
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="buildingName">اسم المنشأ</Label>
            <Input
              id="buildingName"
              name="buildingName"
              placeholder="مثال: ABRAJ-1"
              value={form.buildingName}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.buildingName && (
              <p className="text-red-500 text-xs">{errors.buildingName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="buildingCode">الكود</Label>
            <Input
              id="buildingCode"
              name="buildingCode"
              placeholder="مثال: ABRAJ1"
              value={form.buildingCode}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.buildingCode && (
              <p className="text-red-500 text-xs">{errors.buildingCode}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">الاسم بالعربية</Label>
            <Input
              id="displayName"
              name="displayName"
              placeholder="مثال: برج أول"
              value={form.displayName}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.displayName && (
              <p className="text-red-500 text-xs">{errors.displayName}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="allowCustomId"
              name="allowCustomId"
              type="checkbox"
              checked={form.allowCustomId}
              onChange={handleChange}
              disabled={isLoading}
              className="rounded border-gray-300"
            />
            <Label htmlFor="allowCustomId">السماح بمعرف مخصص</Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "جاري الإضافة..." : "إضافة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
