// src/admin/consultants/consultants.repo.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  ConsultantResType,
  CreateConsultantBodyType,
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
  ): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        roleId: doctorRoleId,
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
  ): Promise<ConsultantResType> {
    const consultant = await this.prisma.consultant.create({
      data: {
        userId,
        specialty: data.specialty,
        bio: data.bio,
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
  async findAll(): Promise<ConsultantResType[]> {
    const consultants = await this.prisma.consultant.findMany({
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
    return consultants as unknown as ConsultantResType[];
  }
}
