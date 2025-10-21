"use client";

import {
  CheckCircle2,
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
  UserPlus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MaintenanceRequest } from "@/types/request";

interface RequestTableProps {
  requests: MaintenanceRequest[];
  onAssign: (requestId: string) => void;
  onView: (requestId: string) => void;
  onEdit: (requestId: string) => void;
  onDelete: (requestId: string) => void;
  onStatusChange: (requestId: string, status: string) => void;
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

export function RequestTable({
  requests,
  onAssign,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}: RequestTableProps) {
  const getPriorityLabel = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const getStatusLabel = (status: string) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted/50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Location
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Assigned To
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {requests.map((request) => (
            <tr
              key={request.id}
              className="hover:bg-muted/50 transition-colors"
            >
              <td className="px-6 py-4 text-sm font-mono text-primary">
                {request.id}
              </td>
              <td className="px-6 py-4 text-sm font-medium max-w-xs truncate">
                {request.title}
              </td>
              <td className="px-6 py-4 text-sm">
                <Badge className={priorityColors[request.priority]}>
                  {getPriorityLabel(request.priority)}
                </Badge>
              </td>
              <td className="px-6 py-4 text-sm">
                <Badge className={statusColors[request.status]}>
                  {getStatusLabel(request.status)}
                </Badge>
              </td>
              <td className="px-6 py-4 text-sm max-w-xs truncate">
                {request.location}
              </td>
              <td className="px-6 py-4 text-sm">
                {request.assignedToName || "-"}
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">
                {new Date(request.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onView(request.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(request.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    {request.status === "pending" && (
                      <DropdownMenuItem onClick={() => onAssign(request.id)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Assign Technician
                      </DropdownMenuItem>
                    )}
                    {request.status === "assigned" && (
                      <DropdownMenuItem
                        onClick={() =>
                          onStatusChange(request.id, "in-progress")
                        }
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Start Work
                      </DropdownMenuItem>
                    )}
                    {request.status === "in-progress" && (
                      <DropdownMenuItem
                        onClick={() => onStatusChange(request.id, "completed")}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark Complete
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => onDelete(request.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
