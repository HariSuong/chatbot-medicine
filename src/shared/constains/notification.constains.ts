// src/shared/constains/notification.constains.ts

export const NOTIFICATION_TYPE_VALUES = ['EMAIL', 'SMS', 'IN_APP'] as const;
export type NotificationTypeType = (typeof NOTIFICATION_TYPE_VALUES)[number];

export const NOTIFICATION_STATUS_VALUES = [
  'PENDING',
  'SENT',
  'FAILED',
  'READ',
] as const;
export type NotificationStatusType =
  (typeof NOTIFICATION_STATUS_VALUES)[number];
