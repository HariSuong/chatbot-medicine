// src/auth/auth.controller.ts

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Req,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  ForgotPasswordBodyDTO,
  LoginBodyDTO,
  LoginResDTO,
  RefreshTokenBodyDTO,
  RefreshTokenResDTO,
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

  @Post('forgot-password/reset')
  @ZodSerializerDto(RegisterResDto) // Có thể tạo DTO trả về riêng nếu cần, nhưng tạm dùng RegisterResDto
  async resetPassword(@Body() body: ForgotPasswordBodyDTO) {
    return this.authService.forgotPassword(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) // Trả về status 200 OK khi thành công
  @ZodSerializerDto(LoginResDTO)
  login(
    @Body() body: LoginBodyDTO,
    @Req() req: Request, // Dùng @Req() để lấy thông tin request
    @Ip() ipAddress: string, // Dùng @Ip() để lấy IP address
  ) {
    const userAgent = req.headers['user-agent'] || '';
    return this.authService.login({ ...body, userAgent, ipAddress });
  }

  // --- THÊM MỚI: Endpoint Làm mới Token ---
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(RefreshTokenResDTO)
  refreshToken(
    @Body() body: RefreshTokenBodyDTO,
    @Req() req: Request,
    @Ip() ipAddress: string,
  ) {
    const userAgent = req.headers['user-agent'] || '';
    return this.authService.refreshToken({ ...body, userAgent, ipAddress });
  }
}
