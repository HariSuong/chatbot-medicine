// src/admin/consultants/consultants.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { HasingService } from 'src/shared/services/hasing.service';
import { ConsultantsRepository } from './consultants.repo';
import {
  CreateConsultantBodyType,
  UpdateConsultantBodyType,
} from './consultants.model';
import { RoleService } from 'src/auth/role.service';
import { isUniqueConstraintPrismaError } from 'src/shared/helpers';
import { EmailAlreadyExistsException } from 'src/shared/constains/exception.constains';

@Injectable()
export class ConsultantsService {
  constructor(
    private readonly consultantsRepo: ConsultantsRepository,
    private readonly roleService: RoleService,
    private readonly hasingService: HasingService,
  ) {}

  /**
   * Logic để lấy danh sách tất cả các bác sĩ.
   */
  findAll() {
    return this.consultantsRepo.findAll();
  }

  /**
   * Logic để tạo một hồ sơ bác sĩ mới.
   * Bao gồm việc tạo tài khoản User và hồ sơ Consultant.
   */
  async create(data: CreateConsultantBodyType) {
    try {
      // 1. Lấy roleId của DOCTOR
      const doctorRoleId = await this.roleService.getDoctorRoleId(); // Cần tạo hàm này trong RoleService

      // 2. Mã hóa mật khẩu
      const hashedPassword = await this.hasingService.hash(data.password);

      // 3. Tạo tài khoản User với vai trò DOCTOR
      const doctorUser = await this.consultantsRepo.createDoctorUser(
        {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          phoneNumber: data.phoneNumber,
        },
        doctorRoleId,
      );

      // 4. Tạo hồ sơ Consultant liên kết với User vừa tạo
      return this.consultantsRepo.createConsultantProfile(doctorUser.id, {
        specialty: data.specialty,
        bio: data.bio,
      });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw EmailAlreadyExistsException;
      }
      throw error;
    }
  }

  /**
   * Logic để cập nhật thông tin một bác sĩ.
   */
  async update(consultantId: string, data: UpdateConsultantBodyType) {
    // Kiểm tra xem consultant có tồn tại không trước khi cập nhật
    const existingConsultant =
      await this.consultantsRepo.findById(consultantId);
    if (!existingConsultant) {
      throw new NotFoundException('Không tìm thấy hồ sơ chuyên gia tư vấn.');
    }
    return this.consultantsRepo.update(consultantId, data);
  }

  /**
   * Logic để xóa một hồ sơ bác sĩ.
   */
  async delete(consultantId: string) {
    const existingConsultant =
      await this.consultantsRepo.findById(consultantId);
    if (!existingConsultant) {
      throw new NotFoundException('Không tìm thấy hồ sơ chuyên gia tư vấn.');
    }
    await this.consultantsRepo.delete(consultantId);
    return { message: 'Đã xóa hồ sơ chuyên gia tư vấn thành công.' };
  }
}
