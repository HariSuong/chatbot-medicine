// src/auth/auth.controller.ts

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  ForgotPasswordBodyDTO,
  GetAuthorizationUrlResDTO,
  LoginBodyDTO,
  LoginResDTO,
  RefreshTokenBodyDTO,
  RefreshTokenResDTO,
  RegisterBodyDto,
  RegisterResDto,
  SendOTPBodyDTO,
} from 'src/auth/auth.dto';
import { LogoutBodyType } from 'src/auth/auth.model';
import { AuthService } from 'src/auth/auth.service';
import { GoogleService } from 'src/auth/google.service';
import envConfig from 'src/shared/config/config';
import { IsPublic } from 'src/shared/decorators/auth.decorator';
import { UserAgent } from 'src/shared/decorators/user-agent.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleService: GoogleService,
  ) {}
  @IsPublic()
  @Post('register')
  @ZodSerializerDto(RegisterResDto)
  register(@Body() body: RegisterBodyDto) {
    return this.authService.register(body);
  }
  @IsPublic()
  @Post('otp')
  sendOTP(@Body() body: SendOTPBodyDTO) {
    return this.authService.sendOTP(body);
  }
  @IsPublic()
  @Post('forgot-password/reset')
  @ZodSerializerDto(RegisterResDto) // Có thể tạo DTO trả về riêng nếu cần, nhưng tạm dùng RegisterResDto
  async resetPassword(@Body() body: ForgotPasswordBodyDTO) {
    return this.authService.forgotPassword(body);
  }
  @IsPublic()
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

  @IsPublic() // --- THÊM MỚI: Endpoint Làm mới Token ---
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(RefreshTokenResDTO)
  refreshToken(
    @Body() body: RefreshTokenBodyDTO,
    @UserAgent() userAgent: string,
    @Ip() ipAddress: string,
  ) {
    return this.authService.refreshToken({ ...body, userAgent, ipAddress });
  }

  @Post('logout')
  @ZodSerializerDto(MessageResDTO)
  async logout(@Body() body: LogoutBodyType) {
    return await this.authService.logout(body.refreshToken);
  }

  @IsPublic()
  @Get('google-link')
  @ZodSerializerDto(GetAuthorizationUrlResDTO)
  getAuthorizationUrl(@UserAgent() userAgent: string, @Ip() ipAddress: string) {
    return this.googleService.getAuthorizationUrl({ userAgent, ipAddress });
  }

  @IsPublic()
  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    try {
      const data = await this.googleService.googleCallback({ code, state });
      return res.redirect(
        `${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?accessToken=${data?.accessToken}&refreshToken=${data?.refreshToken}`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Đã xảy ra lỗi khi đăng nhập bằng Google, vui lòng thử lại bằng cách khác';
      return res.redirect(
        `${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?errorMessage=${message}`,
      );
    }
  }
}
