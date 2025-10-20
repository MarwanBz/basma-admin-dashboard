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

interface AddUserModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  userForm: UserFormData;
  formErrors: FormErrors;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleAddUser: (e: React.FormEvent) => void;
}

export function AddUserModal({
  showModal,
  setShowModal,
  userForm,
  formErrors,
  handleInputChange,
  handleAddUser,
}: AddUserModalProps) {
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة مستخدم جديد</DialogTitle>
          <DialogDescription>
            قم بإضافة مستخدم جديد إلى نظام إدارة المستخدمين.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم</Label>
            <Input
              id="name"
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
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
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
            <Label htmlFor="role">الدور</Label>
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
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={userForm.password}
              onChange={handleInputChange}
            />
            {formErrors.password && (
              <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
            <Input
              id="confirmPassword"
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
            <Button type="submit">إضافة</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
