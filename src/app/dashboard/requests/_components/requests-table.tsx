"use client";

import { MaintenanceRequest, RequestPriority } from "@/types/request";
import { MapPin, User } from "lucide-react";
import { canAssign, canDelete, canEdit } from "@/lib/role-permissions";
import { getPriorityText, priorityColors } from "@/lib/status-utils";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { DataTableActions } from "@/components/ui/data-table-actions";
import { StatusSelect } from "@/components/ui/status-select";
import { UserRole } from "@/types/user";

interface RequestsTableProps {
  requests: MaintenanceRequest[];
  userRole: UserRole;
  onAssign: (requestId: string) => void;
  onView: (requestId: string) => void;
  onEdit: (requestId: string) => void;
  onDelete: (requestId: string) => void;
  onStatusChange: (requestId: string, status: string) => void;
  // Pagination props
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
}

export function RequestsTable({
  requests,
  userRole,
  onAssign,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
  isLoading = false,
}: RequestsTableProps) {
  const columns: ColumnDef<MaintenanceRequest>[] = [
    {
      accessorKey: "customIdentifier",
      header: "رقم الطلب",
      cell: ({ row }) => (
        <div className="font-mono text-primary">{row.getValue("customIdentifier")}</div>
      ),
      meta: {
        roles: [
          "SUPER_ADMIN",
          "BASMA_ADMIN",
          "MAINTENANCE_ADMIN",
          "TECHNICIAN",
        ],
      },
    },
    {
      accessorKey: "title",
      header: "العنوان",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("title")}</div>
      ),
      meta: {
        roles: [
          "SUPER_ADMIN",
          "BASMA_ADMIN",
          "MAINTENANCE_ADMIN",
          "TECHNICIAN",
        ],
      },
    },
    {
      accessorKey: "priority",
      header: "الأولوية",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as RequestPriority;
        return (
          <Badge className={priorityColors[priority]}>
            {getPriorityText(priority)}
          </Badge>
        );
      },
      meta: {
        roles: [
          "SUPER_ADMIN",
          "BASMA_ADMIN",
          "MAINTENANCE_ADMIN",
          "TECHNICIAN",
        ],
      },
    },
    {
      accessorKey: "status",
      header: "الحالة",
      cell: ({ row }) => {
        const request = row.original;
        return (
          <StatusSelect
            currentStatus={request.status}
            requestId={request.id}
            userRole={userRole}
            onStatusChange={onStatusChange}
          />
        );
      },
      meta: {
        roles: [
          "SUPER_ADMIN",
          "BASMA_ADMIN",
          "MAINTENANCE_ADMIN",
          "TECHNICIAN",
        ],
      },
    },
    {
      accessorKey: "location",
      header: "الموقع",
      cell: ({ row }) => (
        <div className="flex items-center">
          <MapPin size={16} className="text-muted-foreground ml-2" />
          <span className="max-w-xs truncate">{row.getValue("location")}</span>
        </div>
      ),
      meta: {
        roles: [
          "SUPER_ADMIN",
          "BASMA_ADMIN",
          "MAINTENANCE_ADMIN",
          "TECHNICIAN",
        ],
      },
    },
    {
      accessorKey: "assignedTo",
      header: "مُعيّن لـ",
      cell: ({ row }) => {
        const assignedTo = row.getValue("assignedTo") as {
          name: string;
        } | null;
        return (
          <div className="flex items-center">
            <User size={16} className="text-muted-foreground ml-2" />
            <span>{assignedTo?.name || "-"}</span>
          </div>
        );
      },
      meta: {
        roles: ["SUPER_ADMIN", "BASMA_ADMIN", "MAINTENANCE_ADMIN"], // Hide from technicians
      },
    },
    {
      accessorKey: "createdAt",
      header: "التاريخ",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div className="text-muted-foreground">
            {date.toLocaleDateString("ar-SA")}
          </div>
        );
      },
      meta: {
        roles: [
          "SUPER_ADMIN",
          "BASMA_ADMIN",
          "MAINTENANCE_ADMIN",
          "TECHNICIAN",
        ],
      },
    },
    {
      id: "actions",
      header: "الإجراءات",
      cell: ({ row }) => {
        const request = row.original;
        return (
          <DataTableActions
            onView={() => onView(request.id)}
            onEdit={canEdit(userRole) ? () => onEdit(request.id) : undefined}
            onDelete={
              canDelete(userRole) ? () => onDelete(request.id) : undefined
            }
            onAssign={
              request.status === "SUBMITTED" && canAssign(userRole)
                ? () => onAssign(request.id)
                : undefined
            }
            canEdit={canEdit(userRole)}
            canDelete={canDelete(userRole)}
            canAssign={canAssign(userRole)}
            showAssign={request.status === "SUBMITTED"}
          />
        );
      },
      meta: {
        roles: ["SUPER_ADMIN", "BASMA_ADMIN", "MAINTENANCE_ADMIN"], // Hide from technicians
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={requests}
      userRole={userRole}
      emptyMessage="لا يوجد طلبات مطابقة للبحث"
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      onPageChange={onPageChange}
      isLoading={isLoading}
    />
  );
}
