"use client";

import { CheckCircle, Edit, MapPin, Trash, User, Wrench } from "lucide-react";

import { MaintenanceRequest } from "@/types/request";

interface RequestsTableProps {
  requests: MaintenanceRequest[];
  onEditRequest: (requestId: string) => void;
  onDeleteRequest: (requestId: string) => void;
}

const priorityColors: Record<string, string> = {
  urgent: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};

const statusColors: Record<string, string> = {
  pending: "bg-slate-100 text-slate-800",
  assigned: "bg-blue-100 text-blue-800",
  "in-progress": "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const getPriorityText = (priority: string) => {
  const priorityMap: Record<string, string> = {
    urgent: "عاجل",
    high: "عالي",
    medium: "متوسط",
    low: "منخفض",
  };
  return priorityMap[priority] || priority;
};

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: "في الانتظار",
    assigned: "مُعيّن",
    "in-progress": "قيد التنفيذ",
    completed: "مكتمل",
    rejected: "مرفوض",
  };
  return statusMap[status] || status;
};

export function RequestsTable({
  requests,
  onEditRequest,
  onDeleteRequest,
}: RequestsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-right font-medium text-gray-500">
                رقم الطلب
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">
                العنوان
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">
                الأولوية
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">
                الحالة
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">
                الموقع
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">
                مُعيّن لـ
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">
                التاريخ
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.length > 0 ? (
              requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-primary">
                    {request.id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <span className="font-medium">{request.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[request.priority]}`}
                    >
                      {getPriorityText(request.priority)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[request.status]}`}
                    >
                      {getStatusText(request.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <MapPin size={16} className="text-gray-400 ml-2" />
                      <span className="max-w-xs truncate">
                        {request.location}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <User size={16} className="text-gray-400 ml-2" />
                      <span>{request.assignedToName || "-"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(request.date).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditRequest(request.id)}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Edit size={14} />
                        تعديل
                      </button>
                      <button
                        onClick={() => onDeleteRequest(request.id)}
                        className="text-red-600 hover:underline flex items-center gap-1"
                      >
                        <Trash size={14} />
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  لا يوجد طلبات مطابقة للبحث
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
