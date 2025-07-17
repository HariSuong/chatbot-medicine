// src/shared/constains/appointment.constains.ts

export const APPOINTMENT_STATUS_VALUES = [
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
  'COMPLETED',
  'RESCHEDULED',
] as const;
export type AppointmentStatusType = (typeof APPOINTMENT_STATUS_VALUES)[number];
