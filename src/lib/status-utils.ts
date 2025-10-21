import {
  getPriorityColor as getPriorityColorFromTranslations,
  getPriorityText as getPriorityTextFromTranslations,
  getStatusColor as getStatusColorFromTranslations,
  getStatusLabel as getStatusLabelFromTranslations,
  priorityColors,
  priorityLabels,
  statusColors,
  statusLabels,
} from "@/constants/translations";

import { REQUEST_STATUS } from "@/constants/app-constants";
import { RequestStatus } from "@/types/request";
import { UserRole } from "@/types/user";

// Re-export for backward compatibility
export {
  statusColors,
  statusLabels,
  priorityColors,
  priorityLabels,
  getStatusLabelFromTranslations as getStatusLabel,
  getStatusColorFromTranslations as getStatusColor,
  getPriorityTextFromTranslations as getPriorityText,
  getPriorityColorFromTranslations as getPriorityColor,
};

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _currentStatus: RequestStatus
): RequestStatus[] {
  // BASMA_ADMIN cannot update any status
  // Note: _currentStatus parameter is reserved for future status transition validation
  if (userRole === "BASMA_ADMIN") {
    return [];
  }

  // SUPER_ADMIN can update to all statuses
  if (userRole === "SUPER_ADMIN") {
    return [
      REQUEST_STATUS.DRAFT,
      REQUEST_STATUS.SUBMITTED,
      REQUEST_STATUS.ASSIGNED,
      REQUEST_STATUS.IN_PROGRESS,
      REQUEST_STATUS.COMPLETED,
      REQUEST_STATUS.CLOSED,
      REQUEST_STATUS.REJECTED,
    ];
  }

  // MAINTENANCE_ADMIN can update to specific statuses
  if (userRole === "MAINTENANCE_ADMIN") {
    return [
      REQUEST_STATUS.ASSIGNED,
      REQUEST_STATUS.REJECTED,
      REQUEST_STATUS.IN_PROGRESS,
      REQUEST_STATUS.COMPLETED,
    ];
  }

  // Other roles cannot update status
  return [];
}

/**
 * Check if a status change requires a reason/comment
 */
export function requiresReason(newStatus: RequestStatus): boolean {
  return (
    newStatus === REQUEST_STATUS.REJECTED || newStatus === REQUEST_STATUS.CLOSED
  );
}

/**
 * Check if a status change is critical and should show confirmation
 */
export function isCriticalStatusChange(
  currentStatus: RequestStatus,
  newStatus: RequestStatus
): boolean {
  const criticalTransitions = [
    { from: REQUEST_STATUS.COMPLETED, to: REQUEST_STATUS.REJECTED },
    { from: REQUEST_STATUS.CLOSED, to: REQUEST_STATUS.REJECTED },
    { from: REQUEST_STATUS.COMPLETED, to: REQUEST_STATUS.DRAFT },
    { from: REQUEST_STATUS.CLOSED, to: REQUEST_STATUS.DRAFT },
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
  const currentLabel = getStatusLabelFromTranslations(currentStatus);
  const newLabel = getStatusLabelFromTranslations(newStatus);
  return `تغيير حالة الطلب من "${currentLabel}" إلى "${newLabel}"`;
}
