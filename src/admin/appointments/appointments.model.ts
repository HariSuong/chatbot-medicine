// src/admin/appointments/appointments.model.ts

import { z } from 'zod';
import { ConsultantResSchema } from 'src/admin/consultants/consultants.model';
import { AppointmentSchema } from 'src/appointments/appointments.model';

import { UserSchema } from 'src/shared/models/shared-user.model';
import { APPOINTMENT_STATUS_VALUES } from 'src/shared/constains/appointment.constains';

// --- Schema cho Request Body ---
export const UpdateAppointmentBodySchema = z
  .object({
    status: z.enum(APPOINTMENT_STATUS_VALUES),
    appointmentDateTime: z.coerce.date(), // Cho phép cập nhật thời gian hẹn
    consultantId: z.string().uuid(), // Cho phép cập nhật bác sĩ
  })
  .partial(); // .partial() biến tất cả các trường thành optional;

// --- Schema cho Response ---
// Khi trả về cho Admin, chúng ta muốn có cả thông tin của user và consultant
export const AppointmentForAdminResSchema = AppointmentSchema.extend({
  user: UserSchema.omit({ password: true }),
  consultant: ConsultantResSchema,
});

// --- Suy ra các Type ---
export type UpdateAppointmentBodyType = z.infer<
  typeof UpdateAppointmentBodySchema
>;
export type AppointmentForAdminResType = z.infer<
  typeof AppointmentForAdminResSchema
>;
