// src/shared/services/email.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import envConfig from 'src/shared/config/config'; // Import envConfig của bạn
import { FailedToSendOTPException } from 'src/shared/constains/exception.constains';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * Gửi email chứa mã OTP xác thực.
   */
  async sendOtpVerificationEmail(to: string, code: string): Promise<void> {
    const otpExpireIn = envConfig.OTP_EXPIRE_IN; // Lấy thời gian hết hạn OTP từ envConfig

    try {
      await this.mailerService.sendMail({
        to: to, // Địa chỉ email của người nhận
        subject: 'Mã xác thực OTP của bạn cho Medicine Chatbot', // Tiêu đề email
        template: 'send-otp', // <-- Tên file template (không có đuôi .hbs)
        context: {
          code: code, // Biến 'code' sẽ được truyền vào template
          otpExpireIn: otpExpireIn, // Biến 'otpExpireIn' sẽ được truyền vào template
        },
      });
      console.log(`Email xác thực OTP đã được gửi thành công đến: ${to}`);
    } catch (error) {
      console.error(`Lỗi khi gửi email xác thực OTP đến ${to}:`, error);
      // Ném một lỗi cụ thể để xử lý ở tầng trên (ví dụ: controller)
      throw FailedToSendOTPException;
    }
  }

  /**
   * Gửi email nhắc nhở lịch hẹn cho người dùng.
   * @param email Email của người nhận.
   * @param name Tên của người nhận.
   * @param appointmentDateTime Thời gian diễn ra lịch hẹn.
   */
  sendAppointmentReminderEmail(
    email: string,
    name: string,
    appointmentDateTime: Date,
  ) {
    // Định dạng lại ngày và giờ cho dễ đọc
    const formattedDate = format(appointmentDateTime, 'EEEE, dd/MM/yyyy', {
      locale: vi,
    });
    const formattedTime = format(appointmentDateTime, 'HH:mm');

    return this.mailerService.sendMail({
      to: email,
      subject: `Nhắc nhở: Lịch hẹn của bạn vào lúc ${formattedTime} ngày mai`,
      template: 'reminder-email', // Tên file template: reminder-email.hbs
      context: {
        name: name,
        date: formattedDate,
        time: formattedTime,
      },
    });
  }
}
