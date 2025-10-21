"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { BuildingStatistics } from "@/types/building-config";
import { Card } from "@/components/ui/card";

interface BuildingStatsModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  stats: BuildingStatistics | null | undefined;
}

export function BuildingStatsModal({
  showModal,
  setShowModal,
  stats,
}: BuildingStatsModalProps) {
  if (!stats) {
    return null;
  }

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>إحصائيات الطلبات</DialogTitle>
          <DialogDescription>
            ملخص شامل لجميع طلبات الصيانة في النظام
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Total Requests */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <p className="text-gray-600 text-sm mb-1">إجمالي الطلبات</p>
            <p className="text-3xl font-bold text-blue-900">
              {stats.totalRequests}
            </p>
          </Card>

          {/* By Status */}
          <div>
            <h3 className="font-semibold text-sm mb-3">الطلبات حسب الحالة</h3>
            <div className="grid grid-cols-2 gap-2">
              {stats.requestsByStatus.map((item) => (
                <Card key={item.status} className="p-3 bg-gray-50">
                  <p className="text-xs text-gray-600">{item.status}</p>
                  <p className="text-xl font-bold text-gray-900">
                    {item._count}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* By Priority */}
          <div>
            <h3 className="font-semibold text-sm mb-3">الطلبات حسب الأولوية</h3>
            <div className="grid grid-cols-2 gap-2">
              {stats.requestsByPriority.map((item) => (
                <Card key={item.priority} className="p-3 bg-gray-50">
                  <p className="text-xs text-gray-600">{item.priority}</p>
                  <p className="text-xl font-bold text-gray-900">
                    {item._count}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Requests */}
          {stats.recentRequests && stats.recentRequests.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-3">آخر الطلبات</h3>
              <div className="space-y-2">
                {stats.recentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-3 bg-gray-50 rounded border border-gray-200"
                  >
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {request.title}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString(
                          "ar-SA"
                        )}
                      </span>
                      <div className="flex gap-1">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          {request.status}
                        </span>
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                          {request.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
