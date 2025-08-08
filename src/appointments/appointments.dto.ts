// src/appointments/dto/appointments.dto.ts

import { createZodDto } from 'nestjs-zod';
import {
  AppointmentResSchema,
  CreateAppointmentBodySchema,
} from 'src/appointments/appointments.model';

// DTO cho body của request tạo lịch hẹn
export class CreateAppointmentDTO extends createZodDto(
  CreateAppointmentBodySchema,
) {}

// DTO cho response trả về
export class AppointmentResDTO extends createZodDto(AppointmentResSchema) {}
