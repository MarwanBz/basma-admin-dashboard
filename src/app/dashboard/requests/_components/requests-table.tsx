"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  Eye,
  MapPin,
  MoreHorizontal,
  Trash2,
  User,
  UserPlus,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPriorityText, priorityColors } from "@/lib/status-utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MaintenanceRequest } from "@/types/request";
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
}

export function RequestsTable({
  requests,
  userRole,
  onAssign,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}: RequestsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">رقم الطلب</TableHead>
            <TableHead className="text-right">العنوان</TableHead>
            <TableHead className="text-right">الأولوية</TableHead>
            <TableHead className="text-right">الحالة</TableHead>
            <TableHead className="text-right">الموقع</TableHead>
            <TableHead className="text-right">مُعيّن لـ</TableHead>
            <TableHead className="text-right">التاريخ</TableHead>
            <TableHead className="text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-mono text-primary">
                  {request.id}
                </TableCell>
                <TableCell className="font-medium">{request.title}</TableCell>
                <TableCell>
                  <Badge className={priorityColors[request.priority]}>
                    {getPriorityText(request.priority)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <StatusSelect
                    currentStatus={request.status}
                    requestId={request.id}
                    userRole={userRole}
                    onStatusChange={onStatusChange}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPin size={16} className="text-muted-foreground ml-2" />
                    <span className="max-w-xs truncate">
                      {request.location}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <User size={16} className="text-muted-foreground ml-2" />
                    <span>{request.assignedTo?.name || "-"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(request.createdAt).toLocaleDateString("ar-SA")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onView(request.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        عرض التفاصيل
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(request.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        تعديل
                      </DropdownMenuItem>
                      {request.status === "SUBMITTED" && (
                        <DropdownMenuItem onClick={() => onAssign(request.id)}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          تعيين فني
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => onDelete(request.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={8}
                className="h-24 text-center text-muted-foreground"
              >
                لا يوجد طلبات مطابقة للبحث
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
