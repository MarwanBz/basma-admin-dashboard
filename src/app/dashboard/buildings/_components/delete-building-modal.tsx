"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { BuildingConfig } from "@/types/building-config";

interface DeleteBuildingModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  building: BuildingConfig | null;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export function DeleteBuildingModal({
  showModal,
  setShowModal,
  building,
  onConfirm,
  isLoading = false,
}: DeleteBuildingModalProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting building:", error);
    }
  };

  return (
    <AlertDialog open={showModal} onOpenChange={setShowModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>حذف المنشأ</AlertDialogTitle>
          <AlertDialogDescription>
            هل أنت متأكد من رغبتك في حذف المنشأة{" "}
            <strong>{building?.buildingName}</strong>؟
            <br />
            <span className="text-red-600 font-semibold mt-2 block">
              تحذير: قد يؤثر هذا على جميع الطلبات المرتبطة بهذه المنشأة.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "جاري الحذف..." : "حذف"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
