"use client";

import {
  BarChart3,
  Building,
  ClipboardList,
  Database,
  Home,
  LogOut,
  Package,
  Settings,
  Shield,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { clearTokens } from "@/apis/token";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { useRouter } from "next/navigation";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  roles: string[];
  disabled?: boolean;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user } = useRoleGuard([]);

  const handleLogout = async () => {
    try {
      // Clear authentication tokens from cookies
      await clearTokens();

      // Clear user data from session storage
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("current_user");
      }

      // Redirect to login page
      router.push("/auth/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Still redirect even if clearing fails
      router.push("/auth/login");
    }
  };

  // Navigation items with role-based access
  const navItems: NavItem[] = [
    {
      label: "الرئيسية",
      icon: <Home className="ml-2 h-4 w-4" />,
      href: "/dashboard",
      roles: ["SUPER_ADMIN", "BASMA_ADMIN", "MAINTENANCE_ADMIN"],
    },
    {
      label: "إدارة المستخدمين",
      icon: <Users className="ml-2 h-4 w-4" />,
      href: "/dashboard/users",
      roles: ["SUPER_ADMIN", "MAINTENANCE_ADMIN"],
    },
    {
      label: "المنشآت",
      icon: <Building className="ml-2 h-4 w-4" />,
      href: "/dashboard/facilities",
      roles: ["SUPER_ADMIN", "BASMA_ADMIN"],
      disabled: true,
    },
    {
      label: "طلبات الصيانة",
      icon: <ClipboardList className="ml-2 h-4 w-4" />,
      href: "/dashboard/maintenance-requests",
      roles: ["SUPER_ADMIN", "BASMA_ADMIN", "MAINTENANCE_ADMIN"],
      disabled: true,
    },
    {
      label: "التقارير والتحليلات",
      icon: <BarChart3 className="ml-2 h-4 w-4" />,
      href: "/dashboard/reports",
      roles: ["SUPER_ADMIN", "BASMA_ADMIN", "MAINTENANCE_ADMIN"],
      disabled: true,
    },
    {
      label: "النسخ الاحتياطي",
      icon: <Database className="ml-2 h-4 w-4" />,
      href: "/dashboard/backup",
      roles: ["SUPER_ADMIN"],
      disabled: true,
    },
    {
      label: "المخزون",
      icon: <Package className="ml-2 h-4 w-4" />,
      href: "/dashboard/inventory",
      roles: ["SUPER_ADMIN", "MAINTENANCE_ADMIN"],
      disabled: true,
    },
    {
      label: "إعدادات النظام",
      icon: <Settings className="ml-2 h-4 w-4" />,
      href: "/dashboard/settings",
      roles: ["SUPER_ADMIN"],
      disabled: true,
    },
    {
      label: "الأمان والسجلات",
      icon: <Shield className="ml-2 h-4 w-4" />,
      href: "/dashboard/security",
      roles: ["SUPER_ADMIN"],
      disabled: true,
    },
  ];

  // Filter navigation items based on user roles
  const getUserRole = (): string[] => {
    if (user?.roles && Array.isArray(user.roles)) {
      return user.roles;
    }
    return [];
  };

  const userRoles = getUserRole();
  const visibleNavItems = navItems.filter((item) =>
    item.roles.some((role) => userRoles.includes(role))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-reverse space-x-4">
              <h1 className="text-2xl font-bold text-primary">لوحة التحكم</h1>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white min-h-screen border-l">
          <nav className="p-4 space-y-2">
            {visibleNavItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="w-full justify-start flex-row-reverse"
                onClick={() => !item.disabled && router.push(item.href)}
                disabled={item.disabled}
                title={item.disabled ? "قريباً" : ""}
              >
                {item.icon}
                <span className="flex-1 text-right">{item.label}</span>
                {item.disabled && (
                  <span className="text-xs text-gray-400 ms-2">قريباً</span>
                )}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
