import { Injectable } from '@nestjs/common';
import { UserType } from 'src/shared/models/shared-user.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class SharedUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUnique(
    uniqueObject: { email: string } | { id: string },
  ): Promise<UserType | null> {
    return this.prismaService.user.findUnique({
      where: uniqueObject,
    });
  }

  // --- HÀM MỚI: Cập nhật mật khẩu người dùng ---
  async updateUserPassword(payload: {
    email: string;
    password: string;
  }): Promise<void> {
    await this.prismaService.user.update({
      where: { email: payload.email },
      data: { password: payload.password },
    });
  }
}
