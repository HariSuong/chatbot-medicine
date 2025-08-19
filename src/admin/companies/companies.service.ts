// src/admin/companies/companies.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { CompaniesRepository } from './companies.repo';
import {
  CreateCompanyBodyType,
  UpdateCompanyBodyType,
} from './companies.model';

@Injectable()
export class CompaniesService {
  constructor(private readonly companiesRepo: CompaniesRepository) {}

  /**
   * Logic để Super Admin tạo một công ty mới.
   */
  create(data: CreateCompanyBodyType) {
    return this.companiesRepo.create(data);
  }

  /**
   * Logic để Super Admin lấy danh sách tất cả các công ty.
   */
  findAll() {
    return this.companiesRepo.findAll();
  }

  /**
   * Logic để Super Admin cập nhật thông tin một công ty.
   */
  async update(companyId: string, data: UpdateCompanyBodyType) {
    // Kiểm tra xem công ty có tồn tại không trước khi cập nhật
    // (Chúng ta sẽ cần thêm hàm findById vào repo)
    const existingCompany = await this.companiesRepo.findById(companyId);
    if (!existingCompany) {
      throw new NotFoundException('Không tìm thấy công ty.');
    }
    return this.companiesRepo.update(companyId, data);
  }
}
