import { RequestStatus } from "@/types/request";
import { UserRole } from "@/types/user";

/**
 * Status color mappings for UI components
 */
export const statusColors: Record<RequestStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  SUBMITTED: "bg-slate-100 text-slate-800",
  ASSIGNED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-green-100 text-green-800",
  CLOSED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
};

/**
 * Arabic translations for status labels
 */
export const statusLabels: Record<RequestStatus, string> = {
  DRAFT: "مسودة",
  SUBMITTED: "في الانتظار",
  ASSIGNED: "مُعيّن",
  IN_PROGRESS: "قيد التنفيذ",
  COMPLETED: "مكتمل",
  CLOSED: "مغلق",
  REJECTED: "مرفوض",
};

/**
 * Get the Arabic label for a status
 */
export function getStatusLabel(status: RequestStatus): string {
  return statusLabels[status] || status;
}

/**
 * Get the color class for a status
 */
export function getStatusColor(status: RequestStatus): string {
  return statusColors[status] || "bg-gray-100 text-gray-800";
}

/**
 * Priority color mappings for UI components
 */
export const priorityColors: Record<string, string> = {
  URGENT: "bg-red-100 text-red-800",
  HIGH: "bg-orange-100 text-orange-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  LOW: "bg-green-100 text-green-800",
};

/**
 * Arabic translations for priority labels
 */
export const priorityLabels: Record<string, string> = {
  URGENT: "عاجل",
  HIGH: "عالي",
  MEDIUM: "متوسط",
  LOW: "منخفض",
};

/**
 * Get the Arabic label for a priority
 */
export function getPriorityText(priority: string): string {
  return priorityLabels[priority] || priority;
}

/**
 * Get the color class for a priority
 */
export function getPriorityColor(priority: string): string {
  return priorityColors[priority] || "bg-gray-100 text-gray-800";
}

/**
 * Check if a user role can update request statuses
 */
export function canUpdateStatus(userRole: UserRole): boolean {
  return userRole === "MAINTENANCE_ADMIN" || userRole === "SUPER_ADMIN";
}

/**
 * Get available statuses for a user role
 */
export function getAvailableStatuses(
  userRole: UserRole,
  _currentStatus: RequestStatus
): RequestStatus[] {
  // BASMA_ADMIN cannot update any status
  // Note: _currentStatus parameter is reserved for future status transition validation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  if (userRole === "BASMA_ADMIN") {
    return [];
  }

  // SUPER_ADMIN can update to all statuses
  if (userRole === "SUPER_ADMIN") {
    return [
      "DRAFT",
      "SUBMITTED",
      "ASSIGNED",
      "IN_PROGRESS",
      "COMPLETED",
      "CLOSED",
      "REJECTED",
    ];
  }

  // MAINTENANCE_ADMIN can update to specific statuses
  if (userRole === "MAINTENANCE_ADMIN") {
    return ["ASSIGNED", "REJECTED", "IN_PROGRESS", "COMPLETED"];
  }

  // Other roles cannot update status
  return [];
}

/**
 * Check if a status change requires a reason/comment
 */
export function requiresReason(newStatus: RequestStatus): boolean {
  return newStatus === "REJECTED" || newStatus === "CLOSED";
}

/**
 * Check if a status change is critical and should show confirmation
 */
export function isCriticalStatusChange(
  currentStatus: RequestStatus,
  newStatus: RequestStatus
): boolean {
  const criticalTransitions = [
    { from: "COMPLETED", to: "REJECTED" },
    { from: "CLOSED", to: "REJECTED" },
    { from: "COMPLETED", to: "DRAFT" },
    { from: "CLOSED", to: "DRAFT" },
  ];

  return criticalTransitions.some(
    (transition) =>
      transition.from === currentStatus && transition.to === newStatus
  );
}

/**
 * Get status transition description for confirmation dialogs
 */
export function getStatusTransitionDescription(
  currentStatus: RequestStatus,
  newStatus: RequestStatus
): string {
  const currentLabel = getStatusLabel(currentStatus);
  const newLabel = getStatusLabel(newStatus);
  return `تغيير حالة الطلب من "${currentLabel}" إلى "${newLabel}"`;
}
