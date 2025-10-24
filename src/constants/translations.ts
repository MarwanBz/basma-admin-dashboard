/**
 * Arabic Translations
 */

import {
  REQUEST_STATUS,
  REQUEST_PRIORITY,
  USER_ROLE,
  HTTP_STATUS_CODE,
  ERROR_CODE,
  BUILDING_STATUS,
  NOTIFICATION_PLATFORM,
  NOTIFICATION_TARGET_ROLE,
  NOTIFICATION_TOPIC,
  NOTIFICATION_TYPE,
  type RequestStatus,
  type RequestPriority,
  type UserRole,
  type HttpStatusCode,
  type ErrorCode,
  type BuildingStatus,
  type NotificationPlatform,
  type NotificationTargetRole,
  type NotificationTopic,
  type NotificationType,
} from "./app-constants";

// Request Status Labels
export const statusLabels: Record<string, string> = {
  [REQUEST_STATUS.DRAFT]: "مسودة",
  [REQUEST_STATUS.SUBMITTED]: "في الانتظار",
  [REQUEST_STATUS.ASSIGNED]: "مُعيّن",
  [REQUEST_STATUS.IN_PROGRESS]: "قيد التنفيذ",
  [REQUEST_STATUS.COMPLETED]: "مكتمل",
  [REQUEST_STATUS.CLOSED]: "مغلق",
  [REQUEST_STATUS.REJECTED]: "مرفوض",
};

// Request Status Colors
export const statusColors: Record<string, string> = {
  [REQUEST_STATUS.DRAFT]: "bg-gray-100 text-gray-800",
  [REQUEST_STATUS.SUBMITTED]: "bg-slate-100 text-slate-800",
  [REQUEST_STATUS.ASSIGNED]: "bg-blue-100 text-blue-800",
  [REQUEST_STATUS.IN_PROGRESS]: "bg-purple-100 text-purple-800",
  [REQUEST_STATUS.COMPLETED]: "bg-green-100 text-green-800",
  [REQUEST_STATUS.CLOSED]: "bg-emerald-100 text-emerald-800",
  [REQUEST_STATUS.REJECTED]: "bg-red-100 text-red-800",
};

// Request Priority Labels
export const priorityLabels: Record<string, string> = {
  [REQUEST_PRIORITY.LOW]: "منخفض",
  [REQUEST_PRIORITY.MEDIUM]: "متوسط",
  [REQUEST_PRIORITY.HIGH]: "عالي",
  [REQUEST_PRIORITY.URGENT]: "عاجل",
};

// Request Priority Colors
export const priorityColors: Record<string, string> = {
  [REQUEST_PRIORITY.LOW]: "bg-green-100 text-green-800",
  [REQUEST_PRIORITY.MEDIUM]: "bg-yellow-100 text-yellow-800",
  [REQUEST_PRIORITY.HIGH]: "bg-orange-100 text-orange-800",
  [REQUEST_PRIORITY.URGENT]: "bg-red-100 text-red-800",
};

// User Role Labels
export const roleLabels: Record<string, string> = {
  [USER_ROLE.SUPER_ADMIN]: "مدير تنفيذي",
  [USER_ROLE.BASMA_ADMIN]: "مدير بسمة",
  [USER_ROLE.MAINTENANCE_ADMIN]: "مدير صيانة",
};

// HTTP Status Code Messages
export const statusCodeMessages: Record<number, string> = {
  [HTTP_STATUS_CODE.OK]: "تم بنجاح",
  [HTTP_STATUS_CODE.CREATED]: "تم الإنشاء بنجاح",
  [HTTP_STATUS_CODE.BAD_REQUEST]: "طلب غير صحيح",
  [HTTP_STATUS_CODE.UNAUTHORIZED]: "غير مصرح",
  [HTTP_STATUS_CODE.FORBIDDEN]: "ممنوع",
  [HTTP_STATUS_CODE.NOT_FOUND]: "غير موجود",
  [HTTP_STATUS_CODE.CONFLICT]: "تعارض",
  [HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY]: "بيانات غير صالحة",
  [HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR]: "خطأ في الخادم",
};

// Error Code Messages
export const errorMessages: Record<string, string> = {
  [ERROR_CODE.VALIDATION_ERROR]: "خطأ في التحقق من البيانات",
  [ERROR_CODE.AUTHENTICATION_FAILED]: "فشل في المصادقة",
  [ERROR_CODE.AUTHORIZATION_FAILED]: "فشل في التفويض",
  [ERROR_CODE.RESOURCE_NOT_FOUND]: "المورد غير موجود",
  [ERROR_CODE.DUPLICATE_RESOURCE]: "المورد موجود مسبقاً",
  [ERROR_CODE.INTERNAL_ERROR]: "خطأ داخلي",
  [ERROR_CODE.NETWORK_ERROR]: "خطأ في الشبكة",
  [ERROR_CODE.TIMEOUT_ERROR]: "انتهت مهلة الاتصال",
};

// Building Status Labels
export const buildingStatusLabels: Record<string, string> = {
  [BUILDING_STATUS.ACTIVE]: "نشط",
  [BUILDING_STATUS.INACTIVE]: "غير نشط",
  [BUILDING_STATUS.MAINTENANCE]: "صيانة",
};

// Building Status Colors
export const buildingStatusColors: Record<string, string> = {
  [BUILDING_STATUS.ACTIVE]: "bg-green-100 text-green-800",
  [BUILDING_STATUS.INACTIVE]: "bg-gray-100 text-gray-800",
  [BUILDING_STATUS.MAINTENANCE]: "bg-yellow-100 text-yellow-800",
};

// Helper Functions
export function getStatusLabel(status: RequestStatus): string {
  return statusLabels[status] || status;
}

export function getStatusColor(status: RequestStatus): string {
  return statusColors[status] || "bg-gray-100 text-gray-800";
}

export function getPriorityText(priority: RequestPriority): string {
  return priorityLabels[priority] || priority;
}

export function getPriorityColor(priority: RequestPriority): string {
  return priorityColors[priority] || "bg-gray-100 text-gray-800";
}

export function getRoleLabel(role: UserRole): string {
  return roleLabels[role] || role;
}

export function getStatusCodeMessage(code: HttpStatusCode): string {
  return statusCodeMessages[code] || "خطأ غير معروف";
}

export function getErrorMessage(code: ErrorCode): string {
  return errorMessages[code] || "خطأ غير معروف";
}

export function getBuildingStatusLabel(status: BuildingStatus): string {
  return buildingStatusLabels[status] || status;
}

export function getBuildingStatusColor(status: BuildingStatus): string {
  return buildingStatusColors[status] || "bg-gray-100 text-gray-800";
}

// Notification Platform Labels
export const notificationPlatformLabels: Record<string, string> = {
  [NOTIFICATION_PLATFORM.IOS]: "iOS",
  [NOTIFICATION_PLATFORM.ANDROID]: "أندرويد",
  [NOTIFICATION_PLATFORM.WEB]: "ويب",
};

// Notification Target Role Labels
export const notificationTargetRoleLabels: Record<string, string> = {
  [NOTIFICATION_TARGET_ROLE.ALL]: "الجميع",
  [NOTIFICATION_TARGET_ROLE.CUSTOMER]: "العملاء",
  [NOTIFICATION_TARGET_ROLE.TECHNICIAN]: "الفنيين",
  [NOTIFICATION_TARGET_ROLE.MAINTENANCE_ADMIN]: "مدراء الصيانة",
  [NOTIFICATION_TARGET_ROLE.BASMA_ADMIN]: "مدراء بسمة",
  [NOTIFICATION_TARGET_ROLE.SUPER_ADMIN]: "المدراء التنفيذيين",
};

// Notification Topic Labels
export const notificationTopicLabels: Record<string, string> = {
  [NOTIFICATION_TOPIC.ALL_USERS]: "جميع المستخدمين",
  [NOTIFICATION_TOPIC.MAINTENANCE_UPDATES]: "تحديثات الصيانة",
  [NOTIFICATION_TOPIC.CHAT_MESSAGES]: "رسائل الدردشة",
  [NOTIFICATION_TOPIC.ANNOUNCEMENTS]: "الإعلانات",
};

// Notification Type Labels
export const notificationTypeLabels: Record<string, string> = {
  [NOTIFICATION_TYPE.REQUEST_STATUS_CHANGE]: "تغيير حالة الطلب",
  [NOTIFICATION_TYPE.REQUEST_ASSIGNED]: "تعيين فني",
  [NOTIFICATION_TYPE.REQUEST_COMMENT]: "تعليق جديد",
  [NOTIFICATION_TYPE.CHAT_MESSAGE]: "رسالة دردشة",
  [NOTIFICATION_TYPE.ANNOUNCEMENT]: "إعلان",
  [NOTIFICATION_TYPE.SYSTEM_UPDATE]: "تحديث النظام",
};

// Notification Success/Error Messages
export const notificationMessages = {
  deviceRegistered: "تم تسجيل الجهاز بنجاح",
  deviceUnregistered: "تم إلغاء تسجيل الجهاز بنجاح",
  topicSubscribed: "تم الاشتراك في الموضوع بنجاح",
  topicUnsubscribed: "تم إلغاء الاشتراك من الموضوع بنجاح",
  announcementSent: "تم إرسال الإعلان بنجاح",
  testNotificationSent: "تم إرسال الإشعار التجريبي بنجاح",
  error: "حدث خطأ أثناء العملية",
  invalidToken: "رمز الجهاز غير صالح",
  unauthorized: "غير مصرح لك بهذه العملية",
  deviceNotFound: "الجهاز غير موجود",
};

// Notification Helper Functions
export function getNotificationPlatformLabel(
  platform: NotificationPlatform
): string {
  return notificationPlatformLabels[platform] || platform;
}

export function getNotificationTargetRoleLabel(
  role: NotificationTargetRole
): string {
  return notificationTargetRoleLabels[role] || role;
}

export function getNotificationTopicLabel(topic: NotificationTopic): string {
  return notificationTopicLabels[topic] || topic;
}

export function getNotificationTypeLabel(type: NotificationType): string {
  return notificationTypeLabels[type] || type;
}
