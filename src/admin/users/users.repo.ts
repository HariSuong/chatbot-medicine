// src/admin/users/users.repo.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { UpdateUserBodyType, UserWithRoleResType } from './users.model';
import { UserType } from 'src/shared/models/shared-user.model';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lấy danh sách tất cả người dùng, bao gồm cả thông tin vai trò.
   * @param companyId ID của công ty cần lọc.
   * @returns Mảng các người dùng.
   */
  async findAll(companyId: string): Promise<UserWithRoleResType[]> {
    const users = await this.prisma.user.findMany({
      where: {
        companyId, // <-- Thêm điều kiện lọc ở đây
      },
      include: {
        role: true, // Lấy cả thông tin từ bảng Role
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Dùng ép kiểu vì chúng ta biết `include: { role: true }` sẽ trả về đúng cấu trúc
    return users;
  }

  /**
   * Tìm một người dùng duy nhất bằng ID.
   */
  async findById(userId: string): Promise<UserType | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  /**
   * Cập nhật thông tin của một người dùng.
   */
  async update(
    userId: string,
    data: UpdateUserBodyType,
  ): Promise<UserWithRoleResType> {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data,
      include: {
        role: true,
      },
    });
    return updatedUser;
  }

  /**
   * Xóa một người dùng khỏi database.
   */
  async delete(userId: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
