"use client";

import { Unauthorized } from "@/components/Unauthorized";
import { useRoleGuard } from "@/hooks/useRoleGuard";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hasAccess, isLoading } = useRoleGuard(["SUPER_ADMIN"]);

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

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">الإعدادات</h2>
        <p className="text-muted-foreground">إدارة إعدادات النظام والإشعارات</p>
      </div>
      {children}
    </div>
  );
}
