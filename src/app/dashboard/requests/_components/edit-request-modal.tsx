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
import { useEffect, useState } from "react";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MaintenanceRequest } from "@/types/request";
import { REQUEST_PRIORITY } from "@/constants/app-constants";
import { Textarea } from "@/components/ui/textarea";
import { getPriorityText } from "@/constants/translations";

interface EditRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: MaintenanceRequest;
  onSubmit: (data: {
    title: string;
    description: string;
    location: string;
    building: string;
    specificLocation: string;
    priority: string;
    categoryId: number;
  }) => void;
  isLoading?: boolean;
}

export function EditRequestModal({
  open,
  onOpenChange,
  request,
  onSubmit,
  isLoading = false,
}: EditRequestModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    building: "",
    specificLocation: "",
    priority: REQUEST_PRIORITY.MEDIUM as string,
    categoryId: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (request) {
      setFormData({
        title: request.title,
        description: request.description,
        location: request.location,
        building: request.building,
        specificLocation: request.specificLocation,
        priority: request.priority,
        categoryId: request.categoryId,
      });
    }
  }, [request]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "العنوان مطلوب";
    if (!formData.description.trim()) newErrors.description = "الوصف مطلوب";
    if (!formData.location.trim()) newErrors.location = "الموقع مطلوب";
    if (!formData.building.trim()) newErrors.building = "المبنى مطلوب";
    if (!formData.specificLocation.trim())
      newErrors.specificLocation = "الموقع المحدد مطلوب";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      // Don't close modal immediately - let parent handle it after API completes
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>تعديل طلب الصيانة</DialogTitle>
          <DialogDescription>
            قم بتحديث تفاصيل طلب الصيانة هذا
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">العنوان *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="مثال: إصلاح مكيف الهواء"
            />
            {errors.title && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">الفئة *</Label>
            <Select
              value={formData.categoryId.toString()}
              onValueChange={(value) => handleNumberChange("categoryId", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">سباكة</SelectItem>
                <SelectItem value="2">كهرباء</SelectItem>
                <SelectItem value="3">تكييف وتدفئة</SelectItem>
                <SelectItem value="4">أعمال إنشائية</SelectItem>
                <SelectItem value="5">نجارة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">الوصف *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="اشرح المشكلة بالتفصيل"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">الموقع العام *</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="مثال: الطابق الثالث"
            />
            {errors.location && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.location}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="building">المبنى *</Label>
            <Input
              id="building"
              name="building"
              value={formData.building}
              onChange={handleChange}
              placeholder="مثال: المبنى أ"
            />
            {errors.building && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.building}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="specificLocation">الموقع المحدد *</Label>
            <Input
              id="specificLocation"
              name="specificLocation"
              value={formData.specificLocation}
              onChange={handleChange}
              placeholder="مثال: قاعة الاجتماعات"
            />
            {errors.specificLocation && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.specificLocation}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">الأولوية *</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleSelectChange("priority", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={REQUEST_PRIORITY.LOW}>
                  {getPriorityText(REQUEST_PRIORITY.LOW)}
                </SelectItem>
                <SelectItem value={REQUEST_PRIORITY.MEDIUM}>
                  {getPriorityText(REQUEST_PRIORITY.MEDIUM)}
                </SelectItem>
                <SelectItem value={REQUEST_PRIORITY.HIGH}>
                  {getPriorityText(REQUEST_PRIORITY.HIGH)}
                </SelectItem>
                <SelectItem value={REQUEST_PRIORITY.URGENT}>
                  {getPriorityText(REQUEST_PRIORITY.URGENT)}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "جاري التحديث..." : "تحديث الطلب"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
