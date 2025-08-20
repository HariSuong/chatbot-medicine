// src/admin/consultants/consultants.repo.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  ConsultantResType,
  CreateConsultantBodyType,
  UpdateConsultantBodyType,
} from './consultants.model';
import { User } from '@prisma/client';

@Injectable()
export class ConsultantsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tạo một tài khoản User mới với vai trò DOCTOR.
   */
  async createDoctorUser(
    data: Pick<
      CreateConsultantBodyType,
      'email' | 'password' | 'name' | 'phoneNumber'
    >,
    doctorRoleId: string,
    companyId: string,
  ): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        roleId: doctorRoleId,
        companyId: companyId, // <-- THÊM MỚI: Gán companyId
        status: 'ACTIVE', // Kích hoạt tài khoản bác sĩ ngay lập tức
      },
    });
  }

  /**
   * Tạo một hồ sơ Consultant mới và liên kết với một User.
   */
  async createConsultantProfile(
    userId: string,
    data: Pick<CreateConsultantBodyType, 'specialty' | 'bio'>,
    companyId: string,
  ): Promise<ConsultantResType> {
    const consultant = await this.prisma.consultant.create({
      data: {
        userId,
        specialty: data.specialty,
        bio: data.bio,
        companyId: companyId, // <-- THÊM MỚI: Gán companyId
      },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });
    return consultant as unknown as ConsultantResType;
  }

  /**
   * Lấy danh sách tất cả các consultant, bao gồm thông tin user và role.
   */
  async findAll(companyId: string): Promise<ConsultantResType[]> {
    const consultants = await this.prisma.consultant.findMany({
      where: {
        companyId, // <-- Thêm điều kiện lọc
      },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
      orderBy: {
        user: {
          createdAt: 'desc',
        },
      },
    });
    return consultants;
  }

  /**
   * Tìm một hồ sơ consultant duy nhất bằng ID của nó.
   */
  async findById(consultantId: string): Promise<ConsultantResType | null> {
    const consultant = await this.prisma.consultant.findUnique({
      where: { id: consultantId },
      include: { user: { include: { role: true } } },
    });
    return consultant as unknown as ConsultantResType | null;
  }

  /**
   * Cập nhật thông tin cho một hồ sơ Consultant và User liên quan.
   */
  async update(
    consultantId: string,
    data: UpdateConsultantBodyType,
  ): Promise<ConsultantResType> {
    const { name, phoneNumber, specialty, bio } = data;
    const consultant = await this.prisma.consultant.update({
      where: { id: consultantId },
      data: {
        specialty,
        bio,
        // Cập nhật cả thông tin trong bảng User liên quan
        user: {
          update: {
            name,
            phoneNumber,
          },
        },
      },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });
    return consultant as unknown as ConsultantResType;
  }

  /**
   * Xóa một hồ sơ Consultant.
   * Lưu ý: Việc xóa User liên quan có thể phức tạp, ở đây chúng ta chỉ xóa hồ sơ Consultant.
   */
  async delete(consultantId: string): Promise<void> {
    // Để an toàn, chúng ta có thể chỉ xóa hồ sơ consultant
    // và admin sẽ phải vô hiệu hóa tài khoản User riêng.
    // Hoặc có thể xóa cả hai trong một transaction.
    // Tạm thời, chúng ta chỉ xóa consultant profile.
    await this.prisma.consultant.delete({
      where: { id: consultantId },
    });
  }
}
