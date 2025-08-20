// src/appointments/appointments.service.ts

import { Injectable } from '@nestjs/common';
import { AppointmentRepository } from './appointments.repo';
import { CreateAppointmentBodyType } from './appointments.model';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo';
import { UserNotFoundException } from 'src/shared/constains/exception.constains';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentRepo: AppointmentRepository,
    private readonly userRepo: SharedUserRepository,
  ) {}

  /**
   * Tạo một lịch hẹn mới cho người dùng.
   * @param userId ID của người dùng đang đăng nhập.
   * @param data Dữ liệu lịch hẹn từ request body.
   * @returns Lịch hẹn vừa được tạo.
   */
  async create(userId: string, data: CreateAppointmentBodyType) {
    console.log('--- SERVICE: Tạo lịch hẹn mới cho user:', userId);

    // 1. Lấy thông tin chi tiết của user để tìm companyId
    const user = await this.userRepo.findUnique({ id: userId });
    if (!user) {
      // Trường hợp hiếm gặp, nhưng cần xử lý để đảm bảo an toàn
      throw UserNotFoundException;
    }

    return this.appointmentRepo.create(userId, user.companyId, data);
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
