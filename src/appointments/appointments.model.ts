// src/appointments/appointments.model.ts

import { APPOINTMENT_STATUS_VALUES } from 'src/shared/constains/appointment.constains';
import { z } from 'zod';

// Schema cơ bản cho một Lịch hẹn, khớp với Prisma Model
export const AppointmentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  consultantId: z.string().uuid(),
  appointmentDateTime: z.coerce.date(), // Dùng coerce.date() để Zod tự động chuyển đổi chuỗi ISO thành Date object
  status: z.enum(APPOINTMENT_STATUS_VALUES),
  notes: z.string().nullable(),
  companyId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// --- Schema cho Request Body ---
export const CreateAppointmentBodySchema = AppointmentSchema.pick({
  consultantId: true,
  appointmentDateTime: true,
  notes: true,
}).extend({
  // Ghi đè lại validation cho notes để nó là optional
  notes: z.string().max(500, 'Ghi chú không được quá 500 ký tự.').optional(),
});

// --- Schema cho Response ---
// Khi trả về, chúng ta muốn có cả thông tin của user và consultant
export const AppointmentResSchema = AppointmentSchema; // Có thể mở rộng sau

// --- Suy ra các Type ---
export type AppointmentType = z.infer<typeof AppointmentSchema>;
export type CreateAppointmentBodyType = z.infer<
  typeof CreateAppointmentBodySchema
>;
export type AppointmentResType = z.infer<typeof AppointmentResSchema>;
