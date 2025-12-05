"use client";

import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart3,
  Bell,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { clearTokens } from "@/apis/token";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  roles: string[];
  disabled?: boolean;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { user } = useRoleGuard([]);
  const { state } = useSidebar();

  const handleLogout = async () => {
    try {
      // Clear authentication tokens from cookies
      await clearTokens();

      // Clear user data from session storage
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("current_user");
      }

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Still redirect even if clearing fails
      router.push("/login");
    }
  };

  // Navigation items with role-based access
  const navItems: NavItem[] = [
    {
      label: "الرئيسية",
      icon: <Home className="h-4 w-4" />,
      href: "/dashboard",
      roles: ["SUPER_ADMIN", "BASMA_ADMIN", "MAINTENANCE_ADMIN"],
    },
    {
      label: "إدارة المستخدمين",
      icon: <Users className="h-4 w-4" />,
      href: "/dashboard/users",
      roles: ["SUPER_ADMIN"],
    },
    {
      label: "المنشآت",
      icon: <Building className="h-4 w-4" />,
      href: "/dashboard/buildings",
      roles: ["SUPER_ADMIN"],
      disabled: false,
    },
    {
      label: "طلبات الصيانة",
      icon: <ClipboardList className="h-4 w-4" />,
      href: "/dashboard/requests",
      roles: ["SUPER_ADMIN", "BASMA_ADMIN", "MAINTENANCE_ADMIN"],
      disabled: false,
    },
    {
      label: "التقارير والتحليلات",
      icon: <BarChart3 className="h-4 w-4" />,
      href: "/dashboard/reports",
      roles: ["SUPER_ADMIN", "BASMA_ADMIN", "MAINTENANCE_ADMIN"],
      disabled: true,
    },
    {
      label: "النسخ الاحتياطي",
      icon: <Database className="h-4 w-4" />,
      href: "/dashboard/backup",
      roles: ["SUPER_ADMIN"],
      disabled: true,
    },
    {
      label: "المخزون",
      icon: <Package className="h-4 w-4" />,
      href: "/dashboard/inventory",
      roles: ["SUPER_ADMIN", "MAINTENANCE_ADMIN"],
      disabled: true,
    },
    {
      label: "الإعدادات",
      icon: <Settings className="h-4 w-4" />,
      href: "/dashboard/settings/fcm",
      roles: ["SUPER_ADMIN"],
      disabled: false,
    },
    {
      label: "الأمان والسجلات",
      icon: <Shield className="h-4 w-4" />,
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
    <Sidebar collapsible="icon" side="right" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-2 px-2 py-2 flex-row-reverse">
                <div className="grid flex-1 text-right text-sm leading-tight">
                  <span className="truncate font-semibold">لوحة التحكم</span>
                  <span className="truncate text-xs">نظام إدارة الصيانة</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    disabled={item.disabled}
                    className="flex-row-reverse justify-start text-right"
                    tooltip={item.disabled ? "قريباً" : item.label}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start flex-row-reverse text-right"
                      onClick={() => !item.disabled && router.push(item.href)}
                      disabled={item.disabled}
                    >
                      <span className="flex-1 text-right">{item.label}</span>
                      {item.icon}
                      {item.disabled}
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex-row-reverse"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src="/avatars/user.jpg"
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="rounded-lg">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {state === "expanded" && (
                    <>
                      <div className="grid flex-1 text-right text-sm leading-tight">
                        <span className="truncate font-medium">
                          {user?.name || "المستخدم"}
                        </span>
                        <span className="truncate text-xs">
                          {user?.email || "user@example.com"}
                        </span>
                      </div>
                      <ChevronsUpDown className="me-auto size-4" />
                    </>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="end"
                side="top"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-right text-sm flex-row-reverse">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src="/avatars/user.jpg"
                        alt={user?.name || "User"}
                      />
                      <AvatarFallback className="rounded-lg">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-right text-sm leading-tight">
                      <span className="truncate font-medium">
                        {user?.name || "المستخدم"}
                      </span>
                      <span className="truncate text-xs">
                        {user?.email || "user@example.com"}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    router.push("/dashboard/settings/notifications")
                  }
                  className="flex-row-reverse"
                >
                  <Bell className="me-2 h-4 w-4" />
                  إعدادات الإشعارات
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex-row-reverse"
                >
                  <LogOut className="me-2 h-4 w-4" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
