"use client";

import {
  BasmaAdminDashboard,
  MaintenanceAdminDashboard,
  SuperAdminDashboard,
} from "./_components";

import { Unauthorized } from "@/components/Unauthorized";
import { useRoleGuard } from "@/hooks/useRoleGuard";

export default function DashboardPage() {
  const { hasAccess, hasAnyRole, isLoading } = useRoleGuard([
    "SUPER_ADMIN",
    "BASMA_ADMIN",
    "MAINTENANCE_ADMIN",
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return <Unauthorized />;
  }

  const isSuperAdmin = hasAnyRole(["SUPER_ADMIN"]);
  const isBasmaAdmin = hasAnyRole(["BASMA_ADMIN"]);
  const isMaintenanceAdmin = hasAnyRole(["MAINTENANCE_ADMIN"]);

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">
          {isSuperAdmin && "مرحباً بك، المدير التنفيذي"}
          {isBasmaAdmin && "مرحباً بك، مدير بسمة"}
          {isMaintenanceAdmin && "مرحباً بك، مدير الصيانة"}
        </h2>
        <p className="text-muted-foreground">
          {isSuperAdmin && "هذا هو ملخص نظام بسمة الشامل"}
          {isBasmaAdmin && "هذا هو ملخص حالة المنشأة الحالية"}
          {isMaintenanceAdmin && "هذا هو ملخص أنشطة الصيانة"}
        </p>
      </div>

      {/* Super Admin Dashboard */}
      {isSuperAdmin && <SuperAdminDashboard />}

      {/* Basma Admin Dashboard */}
      {isBasmaAdmin && <BasmaAdminDashboard />}

      {/* Maintenance Admin Dashboard */}
      {isMaintenanceAdmin && <MaintenanceAdminDashboard />}
    </div>
  );
}
