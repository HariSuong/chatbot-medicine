// src/admin/appointments/dto/appointments.dto.ts

import { createZodDto } from 'nestjs-zod';
import {
  AppointmentForAdminResSchema,
  UpdateAppointmentBodySchema,
} from 'src/admin/appointments/appointments.model';

export class UpdateAppointmentDTO extends createZodDto(
  UpdateAppointmentBodySchema,
) {}

export class AppointmentForAdminDTO extends createZodDto(
  AppointmentForAdminResSchema,
) {}
