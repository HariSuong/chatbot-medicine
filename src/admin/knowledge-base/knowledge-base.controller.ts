// src/admin/knowledge-base/knowledge-base.controller.ts

import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { ROLE_NAME_VALUES } from 'src/shared/constains/role.constain';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { AccessTokenPayload } from 'src/shared/types/jwt.type';

import { KnowledgeBaseService } from './knowledge-base.service';
import { DocumentDTO } from 'src/admin/knowledge-base/knowledge-base.dto';

@Controller('admin/knowledge-base')
@UseGuards(RolesGuard)
@Roles(ROLE_NAME_VALUES.ADMIN) // Bảo vệ toàn bộ controller cho Admin
export class KnowledgeBaseController {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  /**
   * API: GET /admin/knowledge-base/documents
   * Lấy danh sách tài liệu của công ty.
   */
  @Get('documents')
  @ZodSerializerDto(DocumentDTO)
  findAllByCompanyId(@CurrentUser() admin: AccessTokenPayload) {
    return this.knowledgeBaseService.findAllByCompanyId(admin.companyId);
  }

  /**
   * API: DELETE /admin/knowledge-base/documents/:id
   * Xóa một tài liệu.
   */
  @Delete('documents/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @CurrentUser() admin: AccessTokenPayload,
    @Param('id', ParseUUIDPipe) documentId: string,
  ) {
    return this.knowledgeBaseService.delete(admin.companyId, documentId);
  }
}
