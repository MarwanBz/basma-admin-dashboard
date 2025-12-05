import {
  GetSubscriptionsResponse,
  RegisterDeviceRequest,
  RegisterDeviceResponse,
  SendAnnouncementRequest,
  SendAnnouncementResponse,
  SendTestNotificationRequest,
  SendTestNotificationResponse,
  SendToTopicRequest,
  SendToTopicResponse,
  SubscribeTopicRequest,
  TopicSubscriptionResponse,
  UnregisterDeviceRequest,
  UnsubscribeTopicRequest,
} from "@/types/notifications";

import { apiClient } from "./client";

/**
 * Register a device to receive push notifications
 * POST /api/v1/notifications/token
 */
export async function registerDevice(
  data: RegisterDeviceRequest
): Promise<RegisterDeviceResponse> {
  const response = await apiClient.post<RegisterDeviceResponse>(
    "notifications/token",
    data
  );
  return response.data;
}

/**
 * Unregister a device from receiving push notifications
 * DELETE /api/v1/notifications/token
 */
export async function unregisterDevice(
  data: UnregisterDeviceRequest
): Promise<TopicSubscriptionResponse> {
  const response = await apiClient.delete<TopicSubscriptionResponse>(
    "notifications/token",
    { data }
  );
  return response.data;
}

/**
 * Subscribe a device to a specific topic
 * NOTE: Backend endpoint not yet implemented - will return error for now
 */
export async function subscribeToTopic(
  data: SubscribeTopicRequest
): Promise<TopicSubscriptionResponse> {
  const response = await apiClient.post<TopicSubscriptionResponse>(
    "notifications/subscribe-topic",
    data
  );
  return response.data;
}


/**
 * Unsubscribe a device from a specific topic
 * POST /api/v1/notifications/unsubscribe-topic
 */
export async function unsubscribeFromTopic(
  data: UnsubscribeTopicRequest
): Promise<TopicSubscriptionResponse> {
  const response = await apiClient.post<TopicSubscriptionResponse>(
    "notifications/unsubscribe-topic",
    data
  );
  return response.data;
}

/**
 * Get all registered devices for the current user
 * NOTE: Backend endpoint not yet implemented - will return error for now
 */
export async function getSubscriptions(): Promise<GetSubscriptionsResponse> {
  const response =
    await apiClient.get<GetSubscriptionsResponse>("notifications/subscriptions");
  return response.data;
}

/**
 * Send an announcement to users (Admin only)
 * NOTE: Backend endpoint not yet implemented - will return error for now
 */
export async function sendAnnouncement(
  data: SendAnnouncementRequest
): Promise<SendAnnouncementResponse> {
  const response = await apiClient.post<SendAnnouncementResponse>(
    "notifications/announcement",
    data
  );
  return response.data;
}

/**
 * Send a test notification (Development only)
 * POST /api/v1/notifications/test
 */
export async function sendTestNotification(
  data: SendTestNotificationRequest
): Promise<SendTestNotificationResponse> {
  const response = await apiClient.post<SendTestNotificationResponse>(
    "notifications/test",
    data
  );
  return response.data;
}

/**
 * Send notification to a topic
 * POST /api/v1/notifications/send-to-topic
 */
export async function sendToTopic(
  data: SendToTopicRequest
): Promise<SendToTopicResponse> {
  const response = await apiClient.post<SendToTopicResponse>(
    "notifications/send-to-topic",
    data
  );
  return response.data;
}
