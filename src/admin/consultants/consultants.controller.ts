// src/admin/consultants/consultants.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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

import { ConsultantsService } from './consultants.service';
import {
  ConsultantDTO,
  CreateConsultantDTO,
  UpdateConsultantDTO,
} from 'src/admin/consultants/consultants.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { AccessTokenPayload } from 'src/shared/types/jwt.type';

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
  findAll(
    @CurrentUser() admin: AccessTokenPayload, // Lấy thông tin admin đang thực hiện
  ) {
    return this.consultantsService.findAll(admin.companyId);
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

  /**
   * API: PATCH /admin/consultants/:id
   * Cập nhật thông tin một bác sĩ.
   */
  @Patch(':id')
  @ZodSerializerDto(ConsultantDTO)
  update(
    @Param('id', ParseUUIDPipe) consultantId: string,
    @Body() body: UpdateConsultantDTO,
  ) {
    return this.consultantsService.update(consultantId, body);
  }

  /**
   * API: DELETE /admin/consultants/:id
   * Xóa một hồ sơ bác sĩ.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseUUIDPipe) consultantId: string) {
    return this.consultantsService.delete(consultantId);
  }
}
