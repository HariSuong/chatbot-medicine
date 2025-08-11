// src/admin/consultants/consultants.controller.ts

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { ROLE_NAME_VALUES } from 'src/shared/constains/role.constain';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';

import { ConsultantsService } from './consultants.service';
import {
  ConsultantDTO,
  CreateConsultantDTO,
} from 'src/admin/consultants/consultants.dto';

@Controller('admin/consultants')
@UseGuards(RolesGuard)
@Roles(ROLE_NAME_VALUES.ADMIN) // Bảo vệ toàn bộ controller này cho Admin
export class ConsultantsController {
  constructor(private readonly consultantsService: ConsultantsService) {}

  /**
   * API: GET /admin/consultants
   * Lấy danh sách tất cả các bác sĩ.
   */
  @Get()
  @ZodSerializerDto(ConsultantDTO)
  findAll() {
    return this.consultantsService.findAll();
  }

  /**
   * API: POST /admin/consultants
   * Tạo một hồ sơ bác sĩ mới.
   */
  @Post()
  @ZodSerializerDto(ConsultantDTO)
  create(@Body() body: CreateConsultantDTO) {
    return this.consultantsService.create(body);
  }
}
