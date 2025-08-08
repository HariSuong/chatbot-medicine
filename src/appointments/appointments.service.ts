// src/appointments/appointments.service.ts

import { Injectable } from '@nestjs/common';
import { AppointmentRepository } from './appointments.repo';
import { CreateAppointmentBodyType } from './appointments.model';

@Injectable()
export class AppointmentsService {
  constructor(private readonly appointmentRepo: AppointmentRepository) {}

  /**
   * Tạo một lịch hẹn mới cho người dùng.
   * @param userId ID của người dùng đang đăng nhập.
   * @param data Dữ liệu lịch hẹn từ request body.
   * @returns Lịch hẹn vừa được tạo.
   */
  create(userId: string, data: CreateAppointmentBodyType) {
    console.log('--- SERVICE: Tạo lịch hẹn mới cho user:', userId);
    return this.appointmentRepo.create(userId, data);
  }

  /**
   * Lấy danh sách tất cả các lịch hẹn của người dùng.
   * @param userId ID của người dùng đang đăng nhập.
   * @returns Danh sách lịch hẹn.
   */
  findByUserId(userId: string) {
    console.log('--- SERVICE: Lấy danh sách lịch hẹn cho user:', userId);
    return this.appointmentRepo.findByUserId(userId);
  }
}
