"use client";

import {
  ArrowLeft,
  BarChart3,
  Building,
  ClipboardList,
  Package,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getPriorityColor, getPriorityText } from "@/constants/translations";

import { Button } from "@/components/ui/button";
import { RequestDetailsModal } from "../requests/_components/request-details-modal";
import { RequestPriority } from "@/constants/app-constants";
import { Skeleton } from "@/components/ui/skeleton";
import { useBuildingStatistics } from "@/hooks/useBuildingConfigs";
import { useRequest } from "@/hooks/useRequests";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function BasmaAdminDashboard() {
  const router = useRouter();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: buildingStatsResponse, isLoading: statsLoading } =
    useBuildingStatistics();

  // Fetch full request details when a request is selected
  const { data: selectedRequest, isLoading: requestLoading } = useRequest(
    selectedRequestId || ""
  );

  const buildingStats = buildingStatsResponse?.data;

  // Calculate stats from API data
  const totalRequests = buildingStats?.totalRequests || 0;
  const completedRequests =
    buildingStats?.requestsByStatus?.find((item) => item.status === "COMPLETED")
      ?._count || 0;
  const pendingRequests =
    buildingStats?.requestsByStatus?.find((item) => item.status === "SUBMITTED")
      ?._count || 0;
  const inProgressRequests =
    buildingStats?.requestsByStatus?.find(
      (item) => item.status === "IN_PROGRESS"
    )?._count || 0;

  // Get recent requests from API
  const recentRequests = buildingStats?.recentRequests?.slice(0, 4) || [];

  const handleReviewRequest = (requestId: string) => {
    setSelectedRequestId(requestId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequestId(null);
  };

  const stats = [
    {
      title: "طلبات المنشأة",
      value: totalRequests.toString(),
      description: `${pendingRequests} طلبات جديدة اليوم`,
      icon: <Building className="h-6 w-6" />,
      color: "text-blue-600",
    },
    {
      title: "الطلبات المكتملة",
      value: completedRequests.toString(),
      description: "هذا الشهر",
      icon: <ClipboardList className="h-6 w-6" />,
      color: "text-green-600",
    },
    {
      title: "الطلبات قيد التنفيذ",
      value: inProgressRequests.toString(),
      description: "حالياً",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "text-orange-600",
    },
    {
      title: "الطلبات المعلقة",
      value: pendingRequests.toString(),
      description: "بانتظار المراجعة",
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

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle>الطلبات بانتظار المراجعة</CardTitle>
          <CardDescription>الطلبات التي تحتاج إلى موافقتك</CardDescription>
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
                      <div className="flex space-x-2">
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                      </div>
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
                      {request.customIdentifier || request.id} •{" "}
                      {request.createdAt}
                    </p>
                  </div>
                  <div className="text-left">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${getPriorityColor(request.priority as RequestPriority)}`}
                    >
                      {getPriorityText(request.priority as RequestPriority)}
                    </span>
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReviewRequest(request.id)}
                      >
                        مراجعة
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                لا توجد طلبات بانتظار المراجعة
              </p>
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

      {/* Request Details Modal */}
      {selectedRequestId && (
        <>
          {requestLoading ? (
            <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
              <DialogContent className="max-w-2xl">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Skeleton className="h-10 w-16" />
                    <Skeleton className="h-10 w-20" />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ) : selectedRequest ? (
            <RequestDetailsModal
              open={isModalOpen}
              onOpenChange={handleCloseModal}
              request={selectedRequest}
              userRole="BASMA_ADMIN"
              onEdit={() => {}}
              onDelete={() => {}}
              onAssign={() => {}}
            />
          ) : null}
        </>
      )}
    </>
  );
}
