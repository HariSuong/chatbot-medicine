// src/auth/auth.repo.ts (PHIÊN BẢN MỚI NHẤT - ĐÃ BỎ STATUS KHỎI INPUT)

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
  async createUser(
    user: Pick<
      UserType, // Sử dụng kiểu UserType từ Zod schema của bạn
      'email' | 'name' | 'password' | 'phoneNumber' | 'roleId'
    >,
  ): Promise<Omit<UserType, 'password'>> {
    const createdUser = await this.prismaService.user.create({
      data: {
        ...user,
        // Đảm bảo roleId là string (uuid)
        roleId: user.roleId,
      },
      omit: {
        password: true,
      },
    });
    return createdUser as Omit<UserType, 'password'>;
  }

  /**
   * Tạo một người dùng mới và bao gồm thông tin vai trò của họ.
   * Status sẽ được đặt mặc định là ACTIVE bởi database.
   *
   * @param user Dữ liệu người dùng cần tạo.
   * @returns Promise<UserType & { role: RoleType }> - Trả về người dùng và thông tin vai trò (kiểu Zod).
   */
  async createUserIncludeRole(
    user: Pick<
      UserType, // Sử dụng kiểu UserType từ Zod schema của bạn
      'email' | 'name' | 'password' | 'phoneNumber' | 'avatarUrl' | 'roleId'
    >,
  ): Promise<UserType & { role: RoleType }> {
    const createdUserWithRole = await this.prismaService.user.create({
      data: {
        ...user,
      },
      include: {
        role: true,
      },
    });
    return createdUserWithRole as UserType & { role: RoleType };
  }

  /**
   * Tạo hoặc cập nhật một mã xác thực (OTP) trong database.
   *
   * @param payload Dữ liệu mã xác thực (email, code, type, expiresAt).
   * @returns Promise<VerificationCodeType> - Trả về mã xác thực đã tạo/cập nhật (kiểu Zod).
   */
  async createVerificationCode(
    payload: Pick<
      VerificationCodeType,
      'email' | 'code' | 'type' | 'expiresAt'
    >,
  ): Promise<VerificationCodeType> {
    const createdVerification =
      await this.prismaService.verificationCode.upsert({
        where: {
          email: payload.email,
        },
        create: {
          ...payload,
        },
        update: {
          code: payload.code,
          expiresAt: payload.expiresAt,
        },
      });
    return createdVerification as VerificationCodeType;
  }

  /**
   * Tìm một mã xác thực duy nhất dựa trên email, ID hoặc sự kết hợp của email, code và type.
   *
   * @param uniqueValue Đối tượng chứa tiêu chí tìm kiếm duy nhất.
   * @returns Promise<VerificationCodeType | null> - Trả về mã xác thực nếu tìm thấy, ngược lại là null (kiểu Zod).
   */
  async findUniqueVerificationCode(
    uniqueValue:
      | { email: string }
      | { id: string }
      | { email: string; code: string; type: VerificationCodeTypeType },
  ): Promise<VerificationCodeType | null> {
    const foundVerification =
      await this.prismaService.verificationCode.findUnique({
        where: {
          ...uniqueValue,
        },
      });
    return foundVerification as VerificationCodeType | null;
  }
}
