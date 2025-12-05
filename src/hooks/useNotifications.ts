import type {
  RegisterDeviceRequest,
  SendAnnouncementRequest,
  SendTestNotificationRequest,
  SendToTopicRequest,
  SubscribeTopicRequest,
  UnregisterDeviceRequest,
  UnsubscribeTopicRequest,
} from "@/types/notifications";
import {
  getNotificationHistory,
  getSubscriptions,
  markNotificationsRead,
  registerDevice,
  sendAnnouncement,
  sendTestNotification,
  sendToTopic,
  subscribeToTopic,
  unregisterDevice,
  unsubscribeFromTopic,
} from "@/apis/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query Keys
export const NOTIFICATION_QUERY_KEYS = {
  subscriptions: ["notifications", "subscriptions"] as const,
  history: ["notifications", "history"] as const,
};

/**
 * Hook to fetch all registered devices/subscriptions
 */
export function useDevices() {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.subscriptions,
    queryFn: getSubscriptions,
  });
}

/**
 * Hook to register a device
 */
export function useRegisterDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterDeviceRequest) => registerDevice(data),
    onSuccess: (response, variables) => {
      console.log("✅ Device token registered with backend:", variables.token);
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.subscriptions,
      });
    },
  });
}

/**
 * Hook to unregister a device
 */
export function useUnregisterDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UnregisterDeviceRequest) => unregisterDevice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.subscriptions,
      });
    },
  });
}

/**
 * Hook to subscribe to a topic
 */
export function useSubscribeTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubscribeTopicRequest) => subscribeToTopic(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.subscriptions,
      });
    },
  });
}

/**
 * Hook to unsubscribe from a topic
 */
export function useUnsubscribeTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UnsubscribeTopicRequest) => unsubscribeFromTopic(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.subscriptions,
      });
    },
  });
}

/**
 * Hook to send an announcement (Admin only)
 */
export function useSendAnnouncement() {
  return useMutation({
    mutationFn: (data: SendAnnouncementRequest) => sendAnnouncement(data),
  });
}

/**
 * Hook to send a test notification (Development only)
 */
export function useSendTestNotification() {
  return useMutation({
    mutationFn: (data: SendTestNotificationRequest) =>
      sendTestNotification(data),
  });
}

/**
 * Hook to send notification to a topic
 */
export function useSendToTopic() {
  return useMutation({
    mutationFn: (data: SendToTopicRequest) => sendToTopic(data),
  });
}

/**
 * Hook to fetch notification history
 */
export function useNotificationHistory(limit?: number) {
  return useQuery({
    queryKey: [...NOTIFICATION_QUERY_KEYS.history, limit],
    queryFn: () => getNotificationHistory(limit),
  });
}

/**
 * Hook to mark notifications as read
 */
export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => markNotificationsRead(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.history,
      });
    },
  });
}
