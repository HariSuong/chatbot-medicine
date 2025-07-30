// src/auth/auth.repo.ts

import { Injectable } from '@nestjs/common';
import {
  DeviceType,
  RefreshTokenType,
  RoleType,
  VerificationCodeType,
} from 'src/auth/auth.model';
import { VerificationCodeTypeType } from 'src/shared/constains/auth.constains';
import { UserType } from 'src/shared/models/shared-user.model';

import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Tạo một người dùng mới trong database.
   * Status sẽ được đặt mặc định là ACTIVE bởi database.
   *
   * @param user Dữ liệu người dùng cần tạo (email, name, password, phoneNumber, roleId).
   * @returns Promise<Omit<UserType, 'password'>> - Trả về thông tin người dùng đã tạo, loại bỏ mật khẩu.
   */
  createUser(
    user: Pick<
      UserType, // Sử dụng kiểu UserType từ Zod schema của bạn
      'email' | 'name' | 'password' | 'phoneNumber' | 'roleId'
    >,
  ): Promise<Omit<UserType, 'password'>> {
    return this.prismaService.user.create({
      data: {
        ...user,
        // Đảm bảo roleId là string (uuid)
        roleId: user.roleId,
      },
      omit: {
        password: true,
      },
    });
  }

  /**
   * Tạo một người dùng mới và bao gồm thông tin vai trò của họ.
   * Status sẽ được đặt mặc định là ACTIVE bởi database.
   *
   * @param user Dữ liệu người dùng cần tạo.
   * @returns Promise<UserType & { role: RoleType }> - Trả về người dùng và thông tin vai trò (kiểu Zod).
   */
  createUserIncludeRole(
    user: Pick<
      UserType, // Sử dụng kiểu UserType từ Zod schema của bạn
      'email' | 'name' | 'password' | 'phoneNumber' | 'avatarUrl' | 'roleId'
    >,
  ): Promise<UserType & { role: RoleType }> {
    return this.prismaService.user.create({
      data: {
        ...user,
      },
      include: {
        role: true,
      },
    });
  }

  /**
   * Tạo hoặc cập nhật một mã xác thực (OTP) trong database.
   *
   * @param payload Dữ liệu mã xác thực (email, code, type, expiresAt).
   * @returns Promise<VerificationCodeType> - Trả về mã xác thực đã tạo/cập nhật (kiểu Zod).
   */
  createVerificationCode(
    payload: Pick<
      VerificationCodeType,
      'email' | 'code' | 'type' | 'expiresAt'
    >,
  ): Promise<VerificationCodeType> {
    return this.prismaService.verificationCode.upsert({
      where: {
        email_type: { email: payload.email, type: payload.type },
      },
      create: {
        ...payload,
      },
      update: {
        code: payload.code,
        type: payload.type,
        expiresAt: payload.expiresAt,
      },
    });
  }

  /**
   * Tìm một mã xác thực duy nhất bằng ID của nó.
   * @param id ID (UUID) của mã xác thực cần tìm.
   * @returns Promise<VerificationCodeType | null> - Trả về đối tượng mã xác thực nếu tìm thấy, ngược lại là null.
   */
  findVerificationCodeById(id: string): Promise<VerificationCodeType | null> {
    return this.prismaService.verificationCode.findUnique({
      where: { id },
    });
  }

  /**
   * Tìm một mã xác thực duy nhất bằng tổ hợp email và loại mã.
   * Hữu ích để kiểm tra xem người dùng đã yêu cầu loại mã này trước đó chưa.
   * @param data Đối tượng chứa `email` và `type` của mã cần tìm.
   * @returns Promise<VerificationCodeType | null> - Trả về đối tượng mã xác thực nếu tìm thấy, ngược lại là null.
   */
  findVerificationCodeByEmailAndType(data: {
    email: string;
    type: VerificationCodeTypeType;
  }): Promise<VerificationCodeType | null> {
    return this.prismaService.verificationCode.findUnique({
      where: {
        email_type: { email: data.email, type: data.type },
      },
    });
  }

  /**
   * Tìm một mã xác thực cụ thể để tiến hành xác minh (verify).
   * Dùng `findFirst` để tìm chính xác record khớp với cả 3 trường.
   * @param data Đối tượng chứa `email`, `code`, và `type` để xác thực.
   * @returns Promise<VerificationCodeType | null> - Trả về đối tượng mã xác thực nếu khớp, ngược lại là null.
   */
  findVerificationCodeToVerify(data: {
    email: string;
    code: string;
    type: VerificationCodeTypeType;
  }): Promise<VerificationCodeType | null> {
    return this.prismaService.verificationCode.findFirst({
      where: data,
    });
  }

  /**
   * Xóa một mã xác thực (OTP) khỏi database.
   * @param id ID của mã xác thực cần xóa.
   * @returns Promise<void>
   */
  async deleteVerificationCode(id: string): Promise<void> {
    await this.prismaService.verificationCode.delete({
      where: { id },
    });
  }

  createRefreshToken(data: {
    userId: string;
    token: string;
    expiresAt: Date;
    deviceId: string;
  }) {
    return this.prismaService.refreshToken.create({
      data,
    });
  }

  createDevice(
    data: Pick<DeviceType, 'ipAddress' | 'userId' | 'userAgent'> &
      Partial<Pick<DeviceType, 'lastActiveAt' | 'isActive'>>,
  ) {
    return this.prismaService.device.create({
      data,
    });
  }

  async findUniqueUserIncludeRole(
    uniqueObject: { email: string } | { id: string },
  ): Promise<(UserType & { role: RoleType }) | null> {
    return this.prismaService.user.findUnique({
      where: uniqueObject,
      include: {
        role: true,
      },
    });
  }

  async findUniqueRefreshTokenIncludeUserRole(uniqueObject: {
    token: string;
  }): Promise<
    (RefreshTokenType & { user: UserType & { role: RoleType } }) | null
  > {
    console.log('uniqueObject', uniqueObject);
    return this.prismaService.refreshToken.findUnique({
      where: uniqueObject,
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async updateDevice(
    deviceID: string | undefined,
    data: Partial<DeviceType>,
  ): Promise<DeviceType> {
    return this.prismaService.device.update({
      where: { id: deviceID },
      data,
    });
  }

  async deleteRefreshToken(uniqueObject: { token: string }) {
    return this.prismaService.refreshToken.delete({
      where: uniqueObject,
    });
  }
}
