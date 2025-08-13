// src/tasks/tasks.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addDays, endOfDay, startOfDay } from 'date-fns';
import { PrismaService } from 'src/shared/services/prisma.service';
import { EmailService } from 'src/shared/services/email.service';

@Injectable()
export class TasksService {
  // Logger giúp chúng ta in ra các thông báo trong terminal một cách chuyên nghiệp
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Cron Job này sẽ tự động chạy vào lúc 8 giờ sáng mỗi ngày.
   * Mục đích: Tìm và gửi email nhắc nhở cho các lịch hẹn của ngày mai.
   */
  @Cron(CronExpression.EVERY_DAY_AT_8AM) // <-- Lập lịch: 8 giờ sáng mỗi ngày
  async handleAppointmentReminders() {
    this.logger.log('Bắt đầu tác vụ kiểm tra và gửi email nhắc lịch hẹn...');

    // 1. Xác định khoảng thời gian của "ngày mai"
    const tomorrow = addDays(new Date(), 1);
    const startOfTomorrow = startOfDay(tomorrow); // 00:00:00 của ngày mai
    const endOfTomorrow = endOfDay(tomorrow); // 23:59:59 của ngày mai

    this.logger.log(
      `Đang tìm các lịch hẹn từ ${startOfTomorrow.toISOString()} đến ${endOfTomorrow.toISOString()}`,
    );

    // 2. Tìm tất cả các lịch hẹn trong khoảng thời gian đó
    const appointments = await this.prisma.appointment.findMany({
      where: {
        appointmentDateTime: {
          gte: startOfTomorrow, // Lớn hơn hoặc bằng
          lte: endOfTomorrow, // Nhỏ hơn hoặc bằng
        },
        status: 'CONFIRMED', // Chỉ nhắc các lịch hẹn đã được xác nhận
      },
      include: {
        user: true, // Lấy cả thông tin user để biết email
      },
    });

    if (appointments.length === 0) {
      this.logger.log('Không có lịch hẹn nào cho ngày mai. Tác vụ kết thúc.');
      return;
    }

    this.logger.log(
      `Tìm thấy ${appointments.length} lịch hẹn. Bắt đầu gửi email...`,
    );

    // 3. Lặp qua từng lịch hẹn và gửi email
    for (const appointment of appointments) {
      try {
        await this.emailService.sendAppointmentReminderEmail(
          appointment.user.email,
          appointment.user.name ?? 'Quý khách',
          appointment.appointmentDateTime,
        );
        this.logger.log(
          `Đã gửi email nhắc nhở thành công đến ${appointment.user.email}`,
        );
      } catch (error) {
        this.logger.error(
          `Lỗi khi gửi email đến ${appointment.user.email}`,
          error,
        );
      }
    }

    this.logger.log('Hoàn tất tác vụ gửi email nhắc lịch hẹn.');
  }
}
