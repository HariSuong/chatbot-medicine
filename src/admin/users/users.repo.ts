// src/admin/users/users.repo.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { UserWithRoleResType } from './users.model';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lấy danh sách tất cả người dùng, bao gồm cả thông tin vai trò.
   * @returns Mảng các người dùng.
   */
  async findAll(): Promise<UserWithRoleResType[]> {
    const users = await this.prisma.user.findMany({
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
}
