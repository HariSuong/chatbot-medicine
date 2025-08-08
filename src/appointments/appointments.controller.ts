// src/appointments/appointments.controller.ts

import { Body, Controller, Get, Post } from '@nestjs/common';

import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { AccessTokenPayload } from 'src/shared/types/jwt.type';
import { AppointmentsService } from './appointments.service';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  AppointmentResDTO,
  CreateAppointmentDTO,
} from 'src/appointments/appointments.dto';

@Controller('appointments')
// Toàn bộ controller này sẽ được bảo vệ bởi AuthenticationGuard toàn cục.
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  /**
   * API để người dùng đã đăng nhập tạo một lịch hẹn mới.
   * API: POST /appointments
   */
  @Post()
  @ZodSerializerDto(AppointmentResDTO)
  create(
    @CurrentUser() user: AccessTokenPayload,
    @Body() body: CreateAppointmentDTO,
  ) {
    return this.appointmentsService.create(user.userId, body);
  }

  /**
   * API để người dùng đã đăng nhập xem tất cả lịch hẹn của mình.
   * API: GET /appointments/me
   */
  @Get('me')
  @ZodSerializerDto(AppointmentResDTO)
  findByUserId(@CurrentUser() user: AccessTokenPayload) {
    return this.appointmentsService.findByUserId(user.userId);
  }
}
