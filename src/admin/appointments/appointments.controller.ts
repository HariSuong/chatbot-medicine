// src/admin/appointments/appointments.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { AccessTokenPayload } from 'src/shared/types/jwt.type';

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
  findAll(@CurrentUser() admin: AccessTokenPayload) {
    return this.appointmentsService.findAll(admin.companyId);
  }

  /**
   * API: PATCH /admin/appointments/:id
   * Cập nhật thông tin của một lịch hẹn (status, thời gian, bác sĩ).
   */
  @Patch(':id')
  @ZodSerializerDto(AppointmentForAdminDTO)
  update(
    @CurrentUser() admin: AccessTokenPayload,
    @Param('id', ParseUUIDPipe) appointmentId: string,
    @Body() body: UpdateAppointmentDTO,
  ) {
    return this.appointmentsService.update(
      admin.companyId,
      appointmentId,
      body,
    );
  }

  /**
   * API: DELETE /admin/appointments/:id
   * Cập nhật thông tin của một lịch hẹn (status, thời gian, bác sĩ).
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @CurrentUser() admin: AccessTokenPayload, // <-- Lấy thông tin admin
    @Param('id', ParseUUIDPipe) appointmentId: string,
  ) {
    return this.appointmentsService.delete(admin.companyId, appointmentId); // <-- Truyền companyId
  }
}
