import {
  GetSubscriptionsResponse,
  RegisterDeviceRequest,
  RegisterDeviceResponse,
  SendAnnouncementRequest,
  SendAnnouncementResponse,
  SendTestNotificationRequest,
  SendTestNotificationResponse,
  SubscribeTopicRequest,
  TopicSubscriptionResponse,
  UnregisterDeviceRequest,
  UnsubscribeTopicRequest,
} from "@/types/notifications";

import { apiClient } from "./client";

/**
 * Register a device to receive push notifications
 */
export async function registerDevice(
  data: RegisterDeviceRequest
): Promise<RegisterDeviceResponse> {
  const response = await apiClient.post<RegisterDeviceResponse>(
    "fcm/register",
    data
  );
  return response.data;
}

/**
 * Unregister a device from receiving push notifications
 */
export async function unregisterDevice(
  data: UnregisterDeviceRequest
): Promise<TopicSubscriptionResponse> {
  const response = await apiClient.delete<TopicSubscriptionResponse>(
    "fcm/unregister",
    { data }
  );
  return response.data;
}

/**
 * Subscribe a device to a specific topic
 */
export async function subscribeToTopic(
  data: SubscribeTopicRequest
): Promise<TopicSubscriptionResponse> {
  const response = await apiClient.post<TopicSubscriptionResponse>(
    "fcm/subscribe",
    data
  );
  return response.data;
}

/**
 * Unsubscribe a device from a specific topic
 */
export async function unsubscribeFromTopic(
  data: UnsubscribeTopicRequest
): Promise<TopicSubscriptionResponse> {
  const response = await apiClient.post<TopicSubscriptionResponse>(
    "fcm/unsubscribe",
    data
  );
  return response.data;
}

/**
 * Get all registered devices for the current user
 */
export async function getSubscriptions(): Promise<GetSubscriptionsResponse> {
  const response =
    await apiClient.get<GetSubscriptionsResponse>("fcm/subscriptions");
  return response.data;
}

/**
 * Send an announcement to users (Admin only)
 */
export async function sendAnnouncement(
  data: SendAnnouncementRequest
): Promise<SendAnnouncementResponse> {
  const response = await apiClient.post<SendAnnouncementResponse>(
    "fcm/announcement",
    data
  );
  return response.data;
}

/**
 * Send a test notification (Development only)
 */
export async function sendTestNotification(
  data: SendTestNotificationRequest
): Promise<SendTestNotificationResponse> {
  const response = await apiClient.post<SendTestNotificationResponse>(
    "fcm/test/send",
    data
  );
  return response.data;
}
