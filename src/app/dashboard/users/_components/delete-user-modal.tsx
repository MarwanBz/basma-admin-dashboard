"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { User } from "@/types/user"

interface DeleteUserModalProps {
  showModal: boolean
  setShowModal: (show: boolean) => void
  selectedUser: User | null
  confirmDeleteUser: () => void
}

export function DeleteUserModal({
  showModal,
  setShowModal,
  selectedUser,
  confirmDeleteUser,
}: DeleteUserModalProps) {
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>حذف المستخدم</DialogTitle>
          <DialogDescription>
            هل أنت متأكد من رغبتك في حذف هذا المستخدم؟
          </DialogDescription>
        </DialogHeader>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            هل أنت متأكد من رغبتك في حذف المستخدم <span className="font-bold">{selectedUser?.name}</span>؟
          </p>
          <p className="text-red-600 text-sm">
            هذا الإجراء لا يمكن التراجع عنه وسيؤدي إلى حذف جميع بيانات المستخدم.
          </p>
        </div>

        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
            إلغاء
          </Button>
          <Button type="button" variant="destructive" onClick={confirmDeleteUser}>
            حذف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
