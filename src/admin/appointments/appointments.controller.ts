// src/admin/appointments/appointments.controller.ts

import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { ROLE_NAME_VALUES } from 'src/shared/constains/role.constain';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';

import { AppointmentsService } from './appointments.service';
import {
  AppointmentForAdminDTO,
  UpdateAppointmentDTO,
} from 'src/admin/appointments/appointments.dto';

@Controller('admin/appointments')
@UseGuards(RolesGuard)
@Roles(ROLE_NAME_VALUES.ADMIN) // Bảo vệ toàn bộ controller cho Admin
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  /**
   * API: GET /admin/appointments
   * Lấy danh sách tất cả các lịch hẹn trong hệ thống.
   */
  @Get()
  @ZodSerializerDto(AppointmentForAdminDTO)
  findAll() {
    return this.appointmentsService.findAll();
  }

  /**
   * API: PATCH /admin/appointments/:id
   * Cập nhật thông tin của một lịch hẹn (status, thời gian, bác sĩ).
   */
  @Patch(':id')
  @ZodSerializerDto(AppointmentForAdminDTO)
  update(
    @Param('id', ParseUUIDPipe) appointmentId: string,
    @Body() body: UpdateAppointmentDTO,
  ) {
    return this.appointmentsService.update(appointmentId, body);
  }
}
