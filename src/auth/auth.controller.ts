import { Body, Controller, Post } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  ForgotPasswordBodyDTO,
  RegisterBodyDto,
  RegisterResDto,
  SendOTPBodyDTO,
} from 'src/auth/auth.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ZodSerializerDto(RegisterResDto)
  register(@Body() body: RegisterBodyDto) {
    return this.authService.register(body);
  }

  @Post('otp')
  sendOTP(@Body() body: SendOTPBodyDTO) {
    return this.authService.sendOTP(body);
  }

  @Post('forgot-password/send-otp')
  async sendForgotPasswordOTP(@Body() body: SendOTPBodyDTO) {
    return this.authService.sendOTP(body);
  }

  // --- ENDPOINT MỚI: Xác minh OTP và đặt lại mật khẩu ---
  @Post('forgot-password/reset')
  @ZodSerializerDto(RegisterResDto) // Có thể tạo DTO trả về riêng nếu cần, nhưng tạm dùng RegisterResDto
  async resetPassword(@Body() body: ForgotPasswordBodyDTO) {
    return this.authService.forgotPassword(body);
  }
}
