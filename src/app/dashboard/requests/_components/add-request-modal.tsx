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
import {
  useBuildingConfigs,
  useNextIdentifier,
} from "@/hooks/useBuildingConfigs";
import { useEffect, useState } from "react";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { REQUEST_PRIORITY } from "@/constants/app-constants";
import { Textarea } from "@/components/ui/textarea";
import { getPriorityText } from "@/constants/translations";
import { useRoleGuard } from "@/hooks/useRoleGuard";

interface AddRequestModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onSubmit: (data: {
    title: string;
    description: string;
    location: string;
    building: string;
    specificLocation: string;
    priority: string;
    categoryId: number;
    customIdentifier?: string;
  }) => void;
  isLoading?: boolean;
}

export function AddRequestModal({
  showModal,
  setShowModal,
  onSubmit,
  isLoading = false,
}: AddRequestModalProps) {
  const { user } = useRoleGuard([]);
  const { data: buildingsResponse } = useBuildingConfigs();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    building: "",
    specificLocation: "",
    priority: REQUEST_PRIORITY.MEDIUM as string,
    categoryId: 1,
    customIdentifier: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nextId, setNextId] = useState<string>("");

  const { data: nextIdResponse } = useNextIdentifier(formData.building);

  useEffect(() => {
    if (nextIdResponse?.data?.nextIdentifier) {
      setNextId(nextIdResponse.data.nextIdentifier);
    }
  }, [nextIdResponse]);

  const buildings = buildingsResponse?.data || [];
  const isSuperAdmin = user?.roles?.includes("SUPER_ADMIN");

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
    if (name === "building") {
      setNextId("");
    }
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
      const submitData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        building: formData.building,
        specificLocation: formData.specificLocation,
        priority: formData.priority,
        categoryId: formData.categoryId,
        ...(isSuperAdmin &&
          formData.customIdentifier && {
            customIdentifier: formData.customIdentifier,
          }),
      };
      onSubmit(submitData);
      // Don't close modal immediately - let parent handle it after API completes
      // Don't reset form immediately - let parent handle it after success
    }
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>إضافة طلب صيانة جديد</DialogTitle>
          <DialogDescription>
            املأ التفاصيل لإنشاء طلب صيانة جديد
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
            <Label htmlFor="building">المبنى *</Label>
            <Select
              value={formData.building}
              onValueChange={(value) => handleSelectChange("building", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر المبنى" />
              </SelectTrigger>
              <SelectContent>
                {buildings.map((building) => (
                  <SelectItem
                    key={building.buildingName}
                    value={building.buildingName}
                  >
                    {building.displayName} ({building.buildingName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.building && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.building}
              </p>
            )}
            {nextId && (
              <p className="text-xs text-blue-600 font-medium">
                المعرف التالي: <span className="font-bold">{nextId}</span>
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

          {isSuperAdmin && (
            <div className="space-y-2">
              <Label htmlFor="customIdentifier">معرف مخصص (اختياري)</Label>
              <Input
                id="customIdentifier"
                name="customIdentifier"
                value={formData.customIdentifier}
                onChange={handleChange}
                placeholder="ترك فارغ لاستخدام المعرف التلقائي"
              />
              <p className="text-xs text-gray-500">
                اترك الحقل فارغاً للسماح للنظام بإنشاء معرف تلقائي
              </p>
            </div>
          )}

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
              onClick={() => setShowModal(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "جاري الإضافة..." : "إضافة الطلب"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
