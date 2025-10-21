/**
  Translation constant.
 */

// Request Status Constants
export const REQUEST_STATUS = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  ASSIGNED: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CLOSED: "CLOSED",
  REJECTED: "REJECTED",
} as const;

// Request Priority Constants
export const REQUEST_PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;

// User Role Constants
export const USER_ROLE = {
  SUPER_ADMIN: "SUPER_ADMIN",
  BASMA_ADMIN: "BASMA_ADMIN",
  MAINTENANCE_ADMIN: "MAINTENANCE_ADMIN",
} as const;

// HTTP Status Code Constants
export const HTTP_STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Common Error Code Constants
export const ERROR_CODE = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTHENTICATION_FAILED: "AUTHENTICATION_FAILED",
  AUTHORIZATION_FAILED: "AUTHORIZATION_FAILED",
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
  DUPLICATE_RESOURCE: "DUPLICATE_RESOURCE",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
} as const;

// Building Status Constants
export const BUILDING_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  MAINTENANCE: "MAINTENANCE",
} as const;

// Type definitions for type safety
export type RequestStatus =
  (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS];
export type RequestPriority =
  (typeof REQUEST_PRIORITY)[keyof typeof REQUEST_PRIORITY];
export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export type HttpStatusCode =
  (typeof HTTP_STATUS_CODE)[keyof typeof HTTP_STATUS_CODE];
export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];
export type BuildingStatus =
  (typeof BUILDING_STATUS)[keyof typeof BUILDING_STATUS];
