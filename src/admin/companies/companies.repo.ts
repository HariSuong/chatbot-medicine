// src/admin/companies/companies.repo.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  CompanyType,
  CreateCompanyBodyType,
  UpdateCompanyBodyType,
} from './companies.model';

@Injectable()
export class CompaniesRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tạo một công ty mới trong database.
   * @param data Dữ liệu tên công ty.
   * @returns Công ty vừa được tạo.
   */
  async create(data: CreateCompanyBodyType): Promise<CompanyType> {
    const company = await this.prisma.company.create({
      data: {
        name: data.name,
      },
    });
    // Không cần ép kiểu vì Zod type và Prisma type tương thích
    return company;
  }

  /**
   * Lấy danh sách tất cả các công ty.
   * @returns Mảng các công ty.
   */
  async findAll(): Promise<CompanyType[]> {
    const companies = await this.prisma.company.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    // Không cần ép kiểu
    return companies;
  }

  /**
   * Tìm một công ty duy nhất bằng ID.
   * @param companyId ID của công ty cần cập nhật.
   * @returns Thông tin công ty đó.
   */
  async findById(companyId: string): Promise<CompanyType | null> {
    return this.prisma.company.findUnique({
      where: { id: companyId },
    });
  }

  /**
   * Tìm một công ty duy nhất bằng tên.
   */
  async findByName(name: string): Promise<CompanyType | null> {
    return this.prisma.company.findFirst({
      where: { name },
    });
  }

  /**
   * Cập nhật thông tin của một công ty.
   * @param companyId ID của công ty cần cập nhật.
   * @param data Dữ liệu mới (name, isActive).
   * @returns Công ty sau khi đã cập nhật.
   */
  async update(
    companyId: string,
    data: UpdateCompanyBodyType,
  ): Promise<CompanyType> {
    const company = await this.prisma.company.update({
      where: { id: companyId },
      data,
    });
    // Không cần ép kiểu
    return company;
  }
}
