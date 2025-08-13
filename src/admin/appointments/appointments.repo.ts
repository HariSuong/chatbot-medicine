// src/admin/appointments/appointments.repo.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  AppointmentForAdminResType,
  UpdateAppointmentBodyType,
} from './appointments.model';

/**
 * AppointmentsRepository (Admin) chịu trách nhiệm cho các tương tác với database
 * liên quan đến việc quản lý lịch hẹn từ góc độ của Admin.
 */
@Injectable()
export class AppointmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * **Chức năng:** Lấy danh sách tất cả các lịch hẹn trong hệ thống.
   * **Mục đích:** Để Admin có một cái nhìn tổng quan về tất cả các lịch hẹn đã, đang và sẽ diễn ra.
   * **Giá trị:** Dữ liệu này là nền tảng cho các trang dashboard, báo cáo và quản lý.
   * @returns Promise<AppointmentForAdminResType[]> - Một mảng các lịch hẹn, bao gồm thông tin chi tiết của khách hàng và bác sĩ.
   */
  async findAll(): Promise<AppointmentForAdminResType[]> {
    const appointments = await this.prisma.appointment.findMany({
      include: {
        user: true, // Lấy thông tin khách hàng đặt hẹn
        consultant: {
          // Lấy thông tin hồ sơ của bác sĩ
          include: {
            user: {
              // Lấy cả thông tin tài khoản của bác sĩ (tên, email...)
              include: {
                role: true,
              },
            },
          },
        },
      },
      orderBy: {
        appointmentDateTime: 'desc', // Sắp xếp theo ngày hẹn gần nhất
      },
    });
    return appointments;
  }

  /**
   * **Chức năng:** Tìm một lịch hẹn duy nhất bằng ID của nó.
   * **Mục đích:** Để lấy thông tin chi tiết của một lịch hẹn cụ thể trước khi thực hiện hành động (ví dụ: cập nhật).
   * @param appointmentId ID của lịch hẹn cần tìm.
   * @returns Promise<AppointmentForAdminResType | null> - Lịch hẹn chi tiết nếu tìm thấy, ngược lại là null.
   */
  async findById(
    appointmentId: string,
  ): Promise<AppointmentForAdminResType | null> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        user: true,
        consultant: {
          include: {
            user: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    });
    return appointment;
  }

  /**
   * **Chức năng:** Cập nhật thông tin chi tiết của một lịch hẹn.
   * **Mục đích:** Cho phép Admin thay đổi trạng thái (xác nhận, hủy), dời lịch, hoặc đổi bác sĩ cho một lịch hẹn.
   * @param appointmentId ID của lịch hẹn cần cập nhật.
   * @param data Dữ liệu mới cần cập nhật (có thể là status, appointmentDateTime, hoặc consultantId).
   * @returns Promise<AppointmentForAdminResType> - Lịch hẹn sau khi đã được cập nhật.
   */
  async update(
    appointmentId: string,
    data: UpdateAppointmentBodyType,
  ): Promise<AppointmentForAdminResType> {
    const appointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: data.status,
        appointmentDateTime: data.appointmentDateTime,
        consultantId: data.consultantId,
      },
      include: {
        user: true,
        consultant: {
          include: {
            user: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    });
    return appointment;
  }
}
