"use client";

import {
  ArrowLeft,
  BarChart3,
  Building,
  ClipboardList,
  Database,
  Package,
  Shield,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RequestPriority, RequestStatus } from "@/constants/app-constants";
import {
  getPriorityColor,
  getPriorityText,
  getStatusColor,
  getStatusLabel,
} from "@/constants/translations";

import { Button } from "@/components/ui/button";
import { Unauthorized } from "@/components/Unauthorized";
import { useBuildingStatistics } from "@/hooks/useBuildingConfigs";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { useRouter } from "next/navigation";

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

// Super Admin Dashboard Content
function SuperAdminDashboard() {
  const router = useRouter();
  const { data: statsResponse } = useBuildingStatistics();

  const stats = statsResponse?.data;

  const systemStats = [
    {
      title: "إجمالي المستخدمين",
      value: "1,247",
      description: "15 مستخدم جديد هذا الأسبوع",
      icon: <Users className="h-6 w-6" />,
      color: "text-blue-600",
    },
    {
      title: "إجمالي الطلبات",
      value: stats?.totalRequests || "0",
      description: "عدد طلبات الصيانة",
      icon: <Building className="h-6 w-6" />,
      color: "text-green-600",
      clickable: true,
    },
  ];

  return (
    <>
      {/* System Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {systemStats.map((stat, index) => (
          <Card
            key={index}
            className={
              stat.clickable
                ? "cursor-pointer hover:shadow-lg transition-shadow"
                : ""
            }
            onClick={() =>
              stat.clickable && router.push("/dashboard/buildings")
            }
          >
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

      {/* Building Statistics Cards */}
      {stats && stats.totalRequests > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>ملخص الطلبات</CardTitle>
            <CardDescription>
              توزيع طلبات الصيانة حسب الحالة والأولوية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* By Status */}
              {stats.requestsByStatus && stats.requestsByStatus.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">حسب الحالة</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {stats.requestsByStatus.map((item) => (
                      <div
                        key={item.status}
                        className={`p-3 rounded-lg border ${getStatusColor(item.status as RequestStatus)}`}
                      >
                        <p className="text-xs text-gray-600">
                          {getStatusLabel(item.status as RequestStatus)}
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          {item._count}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* By Priority */}
              {stats.requestsByPriority &&
                stats.requestsByPriority.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2">حسب الأولوية</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {stats.requestsByPriority.map((item) => (
                        <div
                          key={item.priority}
                          className={`p-3 rounded-lg border ${getPriorityColor(item.priority as RequestPriority)}`}
                        >
                          <p className="text-xs text-gray-600">
                            {getPriorityText(item.priority as RequestPriority)}
                          </p>
                          <p className="text-xl font-bold text-gray-900">
                            {item._count}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Recent Requests Preview */}
              {stats.recentRequests && stats.recentRequests.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">آخر الطلبات</p>
                  <div className="space-y-2">
                    {stats.recentRequests.slice(0, 3).map((request) => (
                      <div
                        key={request.id}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm truncate">
                          {request.title}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(request.status as RequestStatus)}`}
                        >
                          {getStatusLabel(request.status as RequestStatus)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button
              className="w-full mt-4"
              onClick={() => router.push("/dashboard/buildings")}
            >
              إدارة المنشآت
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {/* <Card>
        <CardHeader>
          <CardTitle>النشاط الحديث في النظام</CardTitle>
          <CardDescription>آخر التحديثات والإجراءات في النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.user ||
                      activity.version ||
                      activity.name ||
                      activity.status}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4">
            عرض السجلات الكاملة
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card> */}
    </>
  );
}

// Basma Admin Dashboard Content
function BasmaAdminDashboard() {
  const stats = [
    {
      title: "طلبات المنشأة",
      value: "18",
      description: "4 طلبات جديدة اليوم",
      icon: <Building className="h-6 w-6" />,
      color: "text-blue-600",
    },
    {
      title: "الطلبات المكتملة",
      value: "142",
      description: "هذا الشهر",
      icon: <ClipboardList className="h-6 w-6" />,
      color: "text-green-600",
    },
    {
      title: "معدل الرضا",
      value: "94%",
      description: "آخر 30 يوم",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "text-orange-600",
    },
    {
      title: "القطع الخارجية",
      value: "23",
      description: "بانتظار الموافقة",
      icon: <Package className="h-6 w-6" />,
      color: "text-purple-600",
    },
  ];

  const pendingRequests = [
    {
      id: "REQ-005",
      title: "صيانة نظام إنذار الحريق",
      floor: "الدور الأرضي",
      priority: "عالي",
    },
    {
      id: "REQ-006",
      title: "إصلاح أنظمة الإضاءة",
      floor: "الدور الخامس",
      priority: "متوسط",
    },
    {
      id: "REQ-007",
      title: "صيانة مصاعد الشحنة",
      floor: "جميع الأدوار",
      priority: "عالي",
    },
    {
      id: "REQ-008",
      title: "فحص أنظمة التكييف المركزي",
      floor: "الدور الثاني",
      priority: "منخفض",
    },
  ];

  return (
    <>
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

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle>الطلبات بانتظار المراجعة</CardTitle>
          <CardDescription>الطلبات التي تحتاج إلى موافقتك</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{request.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {request.id} • {request.floor}
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
                  <div className="mt-2 space-x-2">
                    <Button size="sm" variant="outline">
                      مراجعة
                    </Button>
                    <Button size="sm">موافقة</Button>
                  </div>
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
    </>
  );
}

// Maintenance Admin Dashboard Content
function MaintenanceAdminDashboard() {
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
      status: "IN_PROGRESS",
      priority: "HIGH",
    },
    {
      id: "REQ-002",
      title: "تسريب مياه المطبخ",
      status: "SUBMITTED",
      priority: "MEDIUM",
    },
    {
      id: "REQ-003",
      title: "صيانة مصعد المبنى أ",
      status: "COMPLETED",
      priority: "LOW",
    },
    {
      id: "REQ-004",
      title: "استبدال مفاتيح الباب",
      status: "SUBMITTED",
      priority: "HIGH",
    },
  ];

  return (
    <>
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
                  <p className="text-sm text-muted-foreground">{request.id}</p>
                </div>
                <div className="text-left">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${getPriorityColor(request.priority as RequestPriority)}`}
                  >
                    {getPriorityText(request.priority as RequestPriority)}
                  </span>
                  <p
                    className={`text-sm mt-1 px-2 py-1 rounded-full ${getStatusColor(request.status as RequestStatus)}`}
                  >
                    {getStatusLabel(request.status as RequestStatus)}
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
    </>
  );
}
