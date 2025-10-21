"use client";

import {
  Calendar,
  Clock,
  Edit,
  MapPin,
  Trash2,
  User,
  UserPlus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MaintenanceRequest } from "@/types/request";

interface RequestDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: MaintenanceRequest;
  onEdit: () => void;
  onDelete: () => void;
  onAssign: () => void;
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

export function RequestDetailsModal({
  open,
  onOpenChange,
  request,
  onEdit,
  onDelete,
  onAssign,
}: RequestDetailsModalProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {request.title}
            <Badge className={priorityColors[request.priority]}>
              {getPriorityLabel(request.priority)}
            </Badge>
            <Badge className={statusColors[request.status]}>
              {getStatusLabel(request.status)}
            </Badge>
          </DialogTitle>
          <DialogDescription>Request ID: {request.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Request Details</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {request.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Assigned To</p>
                  <p className="text-sm text-muted-foreground">
                    {request.assignedToName || "Not assigned"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(request.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-muted-foreground">
                    {request.category}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {request.description}
            </p>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {request.status === "pending" && (
            <Button onClick={onAssign} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Assign Technician
            </Button>
          )}
          <Button onClick={onEdit} variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button onClick={onDelete} variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
