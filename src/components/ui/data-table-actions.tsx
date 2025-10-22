"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Eye, MoreHorizontal, Trash2, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DataTableActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAssign?: () => void;
  canEdit: boolean;
  canDelete: boolean;
  canAssign: boolean;
  showAssign?: boolean; // conditional (e.g., status-based)
}

export function DataTableActions({
  onView,
  onEdit,
  onDelete,
  onAssign,
  canEdit,
  canDelete,
  canAssign,
  showAssign = false,
}: DataTableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {onView && (
          <DropdownMenuItem onClick={onView}>
            <Eye className="h-4 w-4 mr-2" />
            عرض التفاصيل
          </DropdownMenuItem>
        )}

        {canEdit && onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            تعديل
          </DropdownMenuItem>
        )}

        {canAssign && showAssign && onAssign && (
          <DropdownMenuItem onClick={onAssign}>
            <UserPlus className="h-4 w-4 mr-2" />
            تعيين فني
          </DropdownMenuItem>
        )}

        {canDelete && onDelete && (
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            حذف
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
