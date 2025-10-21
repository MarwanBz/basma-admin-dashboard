"use client";

import {
  ArrowLeft,
  BarChart3,
  ClipboardList,
  Package,
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
import { useBuildingStatistics } from "@/hooks/useBuildingConfigs";
import { useRouter } from "next/navigation";
import { useTechnicians } from "@/hooks/useTechnicians";

export function MaintenanceAdminDashboard() {
  const router = useRouter();
  const { data: buildingStatsResponse, isLoading: statsLoading } =
    useBuildingStatistics();
  const { data: techniciansResponse } = useTechnicians();

  const buildingStats = buildingStatsResponse?.data;
  const technicians = techniciansResponse?.data?.technicians || [];

  // Calculate stats from API data
  const totalRequests = buildingStats?.totalRequests || 0;
  const completedRequests =
    buildingStats?.requestsByStatus?.find((item) => item.status === "COMPLETED")
      ?._count || 0;
  const inProgressRequests =
    buildingStats?.requestsByStatus?.find(
      (item) => item.status === "IN_PROGRESS"
    )?._count || 0;
  const activeTechnicians = technicians.filter(
    (tech) => tech.role === "TECHNICIAN"
  ).length;

  // Calculate completion rate
  const completionRate =
    totalRequests > 0
      ? Math.round((completedRequests / totalRequests) * 100)
      : 0;

  // Get recent requests from API
  const recentRequests = buildingStats?.recentRequests?.slice(0, 4) || [];

  const stats = [
    {
      title: "طلبات الصيانة",
      value: totalRequests.toString(),
      description: `${inProgressRequests} طلبات قيد التنفيذ`,
      icon: <ClipboardList className="h-6 w-6" />,
      color: "text-blue-600",
    },
    {
      title: "الفنيون ",
      value: activeTechnicians.toString(),
      description: `${activeTechnicians} فني متاح`,
      icon: <Users className="h-6 w-6" />,
      color: "text-green-600",
    },
    // {
    //   title: "معدل الإنجاز",
    //   value: `${completionRate}%`,
    //   description: "هذا الشهر",
    //   icon: <BarChart3 className="h-6 w-6" />,
    //   color: "text-orange-600",
    // },
    {
      title: "الطلبات المكتملة",
      value: completedRequests.toString(),
      description: "تم الانتهاء منها",
      icon: <Package className="h-6 w-6" />,
      color: "text-purple-600",
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
          {statsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentRequests.length > 0 ? (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{request.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.customIdentifier || request.id}
                    </p>
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
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">لا توجد طلبات صيانة حديثة</p>
            </div>
          )}
          <Button
            className="w-full mt-4"
            onClick={() => router.push("/dashboard/requests")}
          >
            عرض جميع الطلبات
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
