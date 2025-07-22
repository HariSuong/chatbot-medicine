// src/shared/services/email.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import envConfig from 'src/shared/config/config'; // Import envConfig của bạn
import { FailedToSendOTPException } from 'src/shared/constains/exception.constains';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

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

  // Bạn có thể thêm các phương thức gửi email khác ở đây nếu cần (ví dụ: email chào mừng)
}
