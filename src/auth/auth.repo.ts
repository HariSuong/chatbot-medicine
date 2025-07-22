// src/auth/auth.repo.ts

import { Injectable } from '@nestjs/common';
import { RoleType, VerificationCodeType } from 'src/auth/auth.model';
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
        email: payload.email,
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
   * Tìm một mã xác thực duy nhất dựa trên email, ID hoặc sự kết hợp của email, code và type.
   *
   * @param uniqueValue Đối tượng chứa tiêu chí tìm kiếm duy nhất.
   * @returns Promise<VerificationCodeType | null> - Trả về mã xác thực nếu tìm thấy, ngược lại là null (kiểu Zod).
   */
  findUniqueVerificationCode(
    uniqueValue:
      | { email: string }
      | { id: string }
      | { email: string; code: string; type: VerificationCodeTypeType },
  ): Promise<VerificationCodeType | null> {
    console.log('uniqueValue', uniqueValue);
    return this.prismaService.verificationCode.findUnique({
      where: {
        ...uniqueValue,
      },
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
}
