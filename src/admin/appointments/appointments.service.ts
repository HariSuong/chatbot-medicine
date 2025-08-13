// src/admin/appointments/appointments.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repo';
import { UpdateAppointmentBodyType } from './appointments.model';

@Injectable()
export class AppointmentsService {
  constructor(private readonly appointmentsRepo: AppointmentsRepository) {}

  /**
   * Logic để Admin lấy danh sách tất cả các lịch hẹn.
   */
  findAll() {
    return this.appointmentsRepo.findAll();
  }

  /**
   * Logic để Admin cập nhật một lịch hẹn.
   */
  async update(appointmentId: string, data: UpdateAppointmentBodyType) {
    // 1. Kiểm tra xem lịch hẹn có tồn tại không
    const existingAppointment =
      await this.appointmentsRepo.findById(appointmentId);
    if (!existingAppointment) {
      throw new NotFoundException('Không tìm thấy lịch hẹn.');
    }

    // 2. Nếu tồn tại, tiến hành cập nhật
    return this.appointmentsRepo.update(appointmentId, data);
  }
}
