// src/appointments/appointments.repo.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  AppointmentType,
  CreateAppointmentBodyType,
} from './appointments.model';

@Injectable()
export class AppointmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tạo một lịch hẹn mới trong database.
   * @param userId ID của người dùng đặt hẹn.
   * @param companyId ID của công ty.
   * @param data Dữ liệu của lịch hẹn.
   * @returns Lịch hẹn vừa được tạo.
   */
  create(
    userId: string,
    companyId: string,
    data: CreateAppointmentBodyType,
  ): Promise<AppointmentType> {
    return this.prisma.appointment.create({
      data: {
        userId,
        companyId,
        consultantId: data.consultantId,
        appointmentDateTime: data.appointmentDateTime,
        notes: data.notes,
      },
    }) as unknown as Promise<AppointmentType>;
  }

  /**
   * Tìm tất cả các lịch hẹn của một người dùng.
   * @param userId ID của người dùng.
   * @returns Danh sách các lịch hẹn.
   */
  findByUserId(userId: string): Promise<AppointmentType[]> {
    return this.prisma.appointment.findMany({
      where: { userId },
      orderBy: { appointmentDateTime: 'desc' },
    }) as unknown as Promise<AppointmentType[]>;
  }
}
