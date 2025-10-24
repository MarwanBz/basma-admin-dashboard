// Notification Types

import { ApiResponse } from "./user";

// Platform Types
export type Platform = "IOS" | "ANDROID" | "WEB";

// Target Role Types
export type TargetRole =
  | "ALL"
  | "CUSTOMER"
  | "TECHNICIAN"
  | "MAINTENANCE_ADMIN"
  | "BASMA_ADMIN"
  | "SUPER_ADMIN";

// Device Registration
export interface Device {
  id: string;
  platform: Platform;
  deviceId?: string;
  appVersion?: string;
  createdAt: string;
  lastUsedAt: string;
}

export interface RegisterDeviceRequest {
  token: string;
  platform: Platform;
  deviceId?: string;
  appVersion?: string;
}

export interface RegisterDeviceResponse extends ApiResponse<Device> {}

// Device Unregistration
export interface UnregisterDeviceRequest {
  token: string;
}

// Topic Subscription
export interface SubscribeTopicRequest {
  token: string;
  topic: string;
}

export interface UnsubscribeTopicRequest {
  token: string;
  topic: string;
}

export interface TopicSubscriptionResponse {
  success: boolean;
  message: string;
}

// Subscriptions
export interface DeviceSubscriptions {
  devices: Device[];
  count: number;
}

export interface GetSubscriptionsResponse
  extends ApiResponse<DeviceSubscriptions> {}

// Notification Payload
export interface NotificationData {
  type?: string;
  entityId?: string;
  entityType?: string;
  newStatus?: string;
  action?: string;
  [key: string]: any;
}

export interface NotificationPayload {
  title: string;
  body: string;
  data?: NotificationData;
}

// Announcement
export interface SendAnnouncementRequest {
  title: string;
  body: string;
  targetRole?: TargetRole;
  announcementId?: string;
}

export interface SendAnnouncementResponse {
  success: boolean;
  message: string;
}

// Test Notification
export interface SendTestNotificationRequest {
  token?: string;
  userId?: string;
  topic?: string;
  title: string;
  body: string;
  data?: NotificationData;
}

export interface TestNotificationResult {
  success: boolean;
  messageId?: string;
  successCount: number;
  failureCount: number;
}

export interface SendTestNotificationResponse {
  success: boolean;
  message: string;
  data: TestNotificationResult;
}

// Notification Topic Names (Constants)
export const DEFAULT_TOPICS = {
  ALL_USERS: "all-users",
  MAINTENANCE_UPDATES: "maintenance-updates",
  CHAT_MESSAGES: "chat-messages",
  ANNOUNCEMENTS: "announcements",
} as const;

export const ROLE_TOPICS = {
  CUSTOMER: "role-customer",
  TECHNICIAN: "role-technician",
  MAINTENANCE_ADMIN: "role-maintenance_admin",
  BASMA_ADMIN: "role-basma_admin",
  SUPER_ADMIN: "role-super_admin",
} as const;

// Notification Types
export type NotificationType =
  | "request_status_change"
  | "request_assigned"
  | "request_comment"
  | "chat_message"
  | "announcement"
  | "system_update";
