"use client";

import {
  ArrowLeft,
  BarChart3,
  Calendar,
  ClipboardList,
  Home,
  LogOut,
  Package,
  Settings,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Unauthorized } from "@/components/Unauthorized";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { useRouter } from "next/navigation";

export default function MaintenanceDashboard() {
  const router = useRouter();
  const { hasAccess, isLoading } = useRoleGuard([
    "SUPER_ADMIN",
    "MAINTENANCE_ADMIN",
  ]);

  const handleLogout = () => {
    router.push("/auth/login");
  };

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

  const stats = [
    {
      title: "طلبات الصيانة",
      value: "24",
      description: "3 طلبات جديدة اليوم",
      icon: <ClipboardList className="h-6 w-6" />,
      color: "text-blue-600",
    },
    {
      title: "الفنيون النشطون",
      value: "12",
      description: "8 في الموقع حالياً",
      icon: <Users className="h-6 w-6" />,
      color: "text-green-600",
    },
    {
      title: "معدل الإنجاز",
      value: "87%",
      description: "هذا الشهر",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "text-orange-600",
    },
    {
      title: "القطع في المخزون",
      value: "156",
      description: "12 تحتاج إعادة تعبئة",
      icon: <Package className="h-6 w-6" />,
      color: "text-purple-600",
    },
  ];

  const recentRequests = [
    {
      id: "REQ-001",
      title: "إصلاح تكييف الوحدة 205",
      status: "قيد التنفيذ",
      priority: "عالي",
    },
    {
      id: "REQ-002",
      title: "تسريب مياه المطبخ",
      status: "قيد الانتظار",
      priority: "متوسط",
    },
    {
      id: "REQ-003",
      title: "صيانة مصعد المبنى أ",
      status: "مكتمل",
      priority: "منخفض",
    },
    {
      id: "REQ-004",
      title: "استبدال مفاتيح الباب",
      status: "قيد الانتظار",
      priority: "عالي",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-reverse space-x-4">
              <h1 className="text-2xl font-bold text-primary">
                لوحة تحكم مدير الصيانة
              </h1>
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

      {/* Sidebar Navigation */}
      <div className="flex">
        <aside className="w-64 bg-white min-h-screen border-l">
          <nav className="p-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start flex-row-reverse"
            >
              <Home className="ml-2 h-4 w-4" />
              الرئيسية
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start flex-row-reverse"
            >
              <ClipboardList className="ml-2 h-4 w-4" />
              طلبات الصيانة
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start flex-row-reverse"
              onClick={() => router.push("/dashboard/users")}
            >
              <Users className="ml-2 h-4 w-4" />
              إدارة المستخدمين
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start flex-row-reverse"
            >
              <Calendar className="ml-2 h-4 w-4" />
              جدول الصيانة
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start flex-row-reverse"
            >
              <Package className="ml-2 h-4 w-4" />
              المخزون
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start flex-row-reverse"
            >
              <BarChart3 className="ml-2 h-4 w-4" />
              التقارير
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start flex-row-reverse"
            >
              <Settings className="ml-2 h-4 w-4" />
              الإعدادات
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">مرحباً بك، مدير الصيانة</h2>
            <p className="text-muted-foreground">
              هذا هو ملخص أنشطة الصيانة اليوم
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={stat.color}>{stat.icon}</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Requests */}
          <Card>
            <CardHeader>
              <CardTitle>أحدث طلبات الصيانة</CardTitle>
              <CardDescription>آخر الطلبات التي تم استلامها</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{request.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {request.id}
                      </p>
                    </div>
                    <div className="text-left">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          request.priority === "عالي"
                            ? "bg-red-100 text-red-800"
                            : request.priority === "متوسط"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {request.priority}
                      </span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {request.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4">
                عرض جميع الطلبات
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
