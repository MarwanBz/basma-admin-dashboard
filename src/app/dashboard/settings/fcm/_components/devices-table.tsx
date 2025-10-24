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
import { Loader2, Smartphone, Trash2 } from "lucide-react";
import { useDevices, useUnregisterDevice } from "@/hooks/useNotifications";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Device } from "@/types/notifications";
import { getNotificationPlatformLabel } from "@/constants/translations";
import { toast } from "sonner";
import { useState } from "react";

// Simple date formatter
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function DevicesTable() {
  const { data, isLoading, error } = useDevices();
  const unregisterMutation = useUnregisterDevice();
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);

  const handleUnregister = async () => {
    if (!deviceToDelete) return;

    try {
      await unregisterMutation.mutateAsync({
        token: deviceToDelete.id, // Using device ID as token for deletion
      });
      toast.success("تم إلغاء تسجيل الجهاز بنجاح");
      setDeviceToDelete(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "فشل إلغاء تسجيل الجهاز";
      toast.error(errorMessage);
    }
  };

  const columns: ColumnDef<Device>[] = [
    {
      accessorKey: "platform",
      header: "المنصة",
      cell: ({ row }) => {
        const platform = row.getValue("platform") as string;
        const platformLabel = getNotificationPlatformLabel(
          platform as "IOS" | "ANDROID" | "WEB"
        );
        const platformColors = {
          IOS: "bg-blue-100 text-blue-800",
          ANDROID: "bg-green-100 text-green-800",
          WEB: "bg-purple-100 text-purple-800",
        };
        return (
          <Badge
            variant="outline"
            className={
              platformColors[platform as keyof typeof platformColors] ||
              "bg-gray-100 text-gray-800"
            }
          >
            {platformLabel}
          </Badge>
        );
      },
    },
    {
      accessorKey: "deviceId",
      header: "معرف الجهاز",
      cell: ({ row }) => {
        const deviceId = row.getValue("deviceId") as string;
        return (
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono text-sm">{deviceId || "غير محدد"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "appVersion",
      header: "إصدار التطبيق",
      cell: ({ row }) => {
        const version = row.getValue("appVersion") as string;
        return <span className="text-sm">{version || "غير محدد"}</span>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "تاريخ التسجيل",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string;
        return (
          <span className="text-sm text-muted-foreground">
            {formatDate(date)}
          </span>
        );
      },
    },
    {
      accessorKey: "lastUsedAt",
      header: "آخر استخدام",
      cell: ({ row }) => {
        const date = row.getValue("lastUsedAt") as string;
        return (
          <span className="text-sm text-muted-foreground">
            {formatDate(date)}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "الإجراءات",
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeviceToDelete(row.original)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        حدث خطأ أثناء تحميل الأجهزة
      </div>
    );
  }

  const devices = data?.data?.devices || [];

  return (
    <>
      <DataTable columns={columns} data={devices} />

      <AlertDialog
        open={!!deviceToDelete}
        onOpenChange={() => setDeviceToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد إلغاء التسجيل</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من إلغاء تسجيل هذا الجهاز؟ لن يتلقى الجهاز أي إشعارات
              بعد ذلك.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnregister}
              disabled={unregisterMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {unregisterMutation.isPending ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الإلغاء...
                </>
              ) : (
                "تأكيد"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
