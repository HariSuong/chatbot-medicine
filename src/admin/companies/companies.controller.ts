// src/admin/companies/companies.controller.ts

import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { ROLE_NAME_VALUES } from 'src/shared/constains/role.constain';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';

import { CompaniesService } from './companies.service';
import {
  CompanyDTO,
  CreateCompanyDTO,
  UpdateCompanyDTO,
} from 'src/admin/companies/companies.dto';

@Controller('admin/companies')
@UseGuards(RolesGuard)
@Roles(ROLE_NAME_VALUES.ADMIN) // Bảo vệ toàn bộ controller cho Admin
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  /**
   * API: POST /admin/companies
   * Tạo một công ty mới.
   */
  @Post()
  @ZodSerializerDto(CompanyDTO)
  create(@Body() body: CreateCompanyDTO) {
    return this.companiesService.create(body);
  }

  /**
   * API: GET /admin/companies
   * Lấy danh sách tất cả các công ty.
   */
  @Get()
  @ZodSerializerDto(CompanyDTO)
  findAll() {
    return this.companiesService.findAll();
  }

  /**
   * API: PATCH /admin/companies/:id
   * Cập nhật thông tin một công ty.
   */
  @Patch(':id')
  @ZodSerializerDto(CompanyDTO)
  update(
    @Param('id', ParseUUIDPipe) companyId: string,
    @Body() body: UpdateCompanyDTO,
  ) {
    return this.companiesService.update(companyId, body);
  }
}
