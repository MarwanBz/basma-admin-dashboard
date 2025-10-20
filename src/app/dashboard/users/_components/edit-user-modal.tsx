"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormErrors, UserFormData } from "@/types/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditUserModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  userForm: UserFormData;
  formErrors: FormErrors;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleUpdateUser: (e: React.FormEvent) => void;
}

export function EditUserModal({
  showModal,
  setShowModal,
  userForm,
  formErrors,
  handleInputChange,
  handleUpdateUser,
}: EditUserModalProps) {
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تعديل بيانات المستخدم</DialogTitle>
          <DialogDescription>
            قم بتعديل بيانات المستخدم في نظام إدارة المستخدمين.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">الاسم</Label>
            <Input
              id="edit-name"
              name="name"
              type="text"
              value={userForm.name}
              onChange={handleInputChange}
            />
            {formErrors.name && (
              <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">البريد الإلكتروني</Label>
            <Input
              id="edit-email"
              name="email"
              type="email"
              value={userForm.email}
              onChange={handleInputChange}
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-role">الدور</Label>
            <Select
              value={userForm.role}
              onValueChange={(value) =>
                handleInputChange({
                  target: { name: "role", value },
                } as React.ChangeEvent<HTMLSelectElement>)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الدور" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CUSTOMER">عميل</SelectItem>
                <SelectItem value="TECHNICIAN">فني</SelectItem>
                <SelectItem value="BASMA_ADMIN">مدير بسمة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-password">كلمة المرور (اختياري)</Label>
            <Input
              id="edit-password"
              name="password"
              type="password"
              value={userForm.password}
              onChange={handleInputChange}
              placeholder="اترك فارغاً للاحتفاظ بكلمة المرور الحالية"
            />
            {formErrors.password && (
              <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-confirmPassword">تأكيد كلمة المرور</Label>
            <Input
              id="edit-confirmPassword"
              name="confirmPassword"
              type="password"
              value={userForm.confirmPassword}
              onChange={handleInputChange}
            />
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.confirmPassword}
              </p>
            )}
          </div>

          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              إلغاء
            </Button>
            <Button type="submit">حفظ التغييرات</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
