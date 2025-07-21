// src/role/role.service.ts (ĐÃ SỬA CHỮA)

import { Injectable, NotFoundException } from '@nestjs/common';
import { ROLE_NAME_VALUES } from 'src/shared/constains/role.constain';

import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class RoleService {
  // userRoleId nên là kiểu string (UUID) chứ không phải number.
  // Khai báo private để nó chỉ được sử dụng trong class này.
  private userRoleId: string | null = null;
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Lấy ID của vai trò 'USER'.
   * Nếu đã có trong bộ nhớ cache, trả về ngay.
   * Nếu chưa, tìm trong database. Nếu không tìm thấy, ném lỗi.
   * Cập nhật cache và trả về ID.
   *
   * @returns Promise<string> - ID của vai trò 'USER'.
   * @throws NotFoundException nếu vai trò 'USER' không tồn tại.
   */
  async getUserRoleId(): Promise<string> {
    if (this.userRoleId) {
      // Dùng userRoleId để lưu trữ ID của vai trò USER
      return this.userRoleId;
    }

    // Đảm bảo bạn đang tìm kiếm 'USER' như trong ROLE_NAME_VALUES
    const role = await this.prismaService.role.findUnique({
      where: { name: ROLE_NAME_VALUES.USER }, // Sử dụng ROLE_NAME_VALUES.USER
    });

    // findUnique trả về null nếu không tìm thấy, vì vậy bạn cần kiểm tra
    if (!role) {
      // Ném lỗi NotFoundException nếu vai trò 'USER' không được tìm thấy
      throw new NotFoundException(
        `Role ${ROLE_NAME_VALUES.USER} not found. Please ensure it exists in the database.`,
      );
    }

    // Gán ID (string) cho userRoleId
    this.userRoleId = role.id;
    return role.id;
  }

  // Bạn có thể thêm các phương thức khác ở đây nếu cần quản lý các vai trò khác (ví dụ: tạo vai trò, cập nhật vai trò)
  // Nhưng hiện tại, với mục đích chính là lấy ID của vai trò mặc định, getUserRoleId là đủ.
}
