"use client";

import { ArrowLeft, Building, Users } from "lucide-react";
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
import { useUsers } from "@/hooks/useUsers";

export function SuperAdminDashboard() {
  const router = useRouter();
  const { data: statsResponse, isLoading: statsLoading } =
    useBuildingStatistics();
  const { data: usersResponse } = useUsers();

  const stats = statsResponse?.data;
  const users = usersResponse?.data?.users || [];

  // Calculate user stats
  const totalUsers = users.length;
  const newUsersThisWeek = users.filter((user) => {
    const userDate = new Date(user.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return userDate > weekAgo;
  }).length;

  const systemStats = [
    {
      title: "إجمالي المستخدمين",
      value: totalUsers.toString(),
      description: `${newUsersThisWeek} مستخدم جديد  `,
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
      {statsLoading ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>ملخص الطلبات</CardTitle>
            <CardDescription>
              توزيع طلبات الصيانة حسب الحالة والأولوية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-3 rounded-lg border bg-gray-100">
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-8"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : stats && stats.totalRequests > 0 ? (
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
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>ملخص الطلبات</CardTitle>
            <CardDescription>
              توزيع طلبات الصيانة حسب الحالة والأولوية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                لا توجد طلبات صيانة حالياً
              </p>
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
    </>
  );
}
