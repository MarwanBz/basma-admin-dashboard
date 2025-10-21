"use client";

import { BuildingConfig, FormErrors } from "@/types/building-config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditBuildingModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  building: BuildingConfig | null;
  onSubmit: (data: {
    buildingCode: string;
    displayName: string;
    allowCustomId: boolean;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function EditBuildingModal({
  showModal,
  setShowModal,
  building,
  onSubmit,
  isLoading = false,
}: EditBuildingModalProps) {
  const [form, setForm] = useState({
    buildingCode: "",
    displayName: "",
    allowCustomId: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (building) {
      setForm({
        buildingCode: building.buildingCode,
        displayName: building.displayName,
        allowCustomId: building.allowCustomId,
      });
      setErrors({});
    }
  }, [building, showModal]);

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
          <DialogTitle>تعديل المنشأ</DialogTitle>
          <DialogDescription>
            قم بتعديل معلومات المنشأة: {building?.buildingName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>اسم المنشأ</Label>
            <Input
              value={building?.buildingName || ""}
              disabled={true}
              className="bg-gray-100"
            />
            <p className="text-xs text-gray-500">لا يمكن تعديل اسم المنشأ</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="buildingCode">الكود</Label>
            <Input
              id="buildingCode"
              name="buildingCode"
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
              {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
