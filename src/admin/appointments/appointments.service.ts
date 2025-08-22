// src/admin/appointments/appointments.service.ts

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repo';
import { UpdateAppointmentBodyType } from './appointments.model';

@Injectable()
export class AppointmentsService {
  constructor(private readonly appointmentsRepo: AppointmentsRepository) {}

  /**
   * Logic để Admin lấy danh sách tất cả các lịch hẹn.
   */
  findAll(companyId: string) {
    return this.appointmentsRepo.findAll(companyId);
  }

  /**
   * Logic để Admin cập nhật một lịch hẹn.
   */
  async update(
    adminCompanyId: string,
    appointmentId: string,
    data: UpdateAppointmentBodyType,
  ) {
    // 1. Kiểm tra xem lịch hẹn có tồn tại không
    const existingAppointment =
      await this.appointmentsRepo.findById(appointmentId);
    if (!existingAppointment) {
      throw new NotFoundException('Không tìm thấy lịch hẹn.');
    }

    // Kiểm tra xem lịch hẹn này có thuộc công ty của admin không
    if (existingAppointment.companyId !== adminCompanyId) {
      throw new ForbiddenException(
        'Bạn không có quyền thao tác trên lịch hẹn này.',
      );
    }

    // 2. Nếu tồn tại, tiến hành cập nhật
    return this.appointmentsRepo.update(appointmentId, data);
  }

  async delete(adminCompanyId: string, appointmentId: string) {
    // <-- Thêm companyId của admin
    const appointment = await this.appointmentsRepo.findById(appointmentId);
    if (!appointment) {
      throw new NotFoundException('Không tìm thấy lịch hẹn.');
    }
    // Kiểm tra xem lịch hẹn này có thuộc công ty của admin không
    if (appointment.companyId !== adminCompanyId) {
      throw new ForbiddenException('Bạn không có quyền xóa lịch hẹn này.');
    }
    await this.appointmentsRepo.delete(appointmentId);
    return { message: 'Đã xóa lịch hẹn thành công.' };
  }
}
