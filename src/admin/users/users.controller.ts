// src/admin/users/users.controller.ts

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
  UseGuards,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { ROLE_NAME_VALUES } from 'src/shared/constains/role.constain';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';

import { UsersService } from './users.service';
import { UpdateUserDTO, UserWithRoleDTO } from 'src/admin/users/users.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { AccessTokenPayload } from 'src/shared/types/jwt.type';

@Controller('admin/users') // Đặt tiền tố /admin cho tất cả API trong đây
@UseGuards(RolesGuard) // Áp dụng RolesGuard cho cả controller
@Roles(ROLE_NAME_VALUES.ADMIN) // Yêu cầu vai trò ADMIN cho cả controller
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * API: GET /admin/users
   * Lấy danh sách tất cả người dùng trong hệ thống.
   */
  @Get()
  @ZodSerializerDto(UserWithRoleDTO)
  findAll(@CurrentUser() admin: AccessTokenPayload) {
    return this.usersService.findAll(admin.companyId);
  }

  @Patch(':id')
  @ZodSerializerDto(UserWithRoleDTO)
  update(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() body: UpdateUserDTO,
  ) {
    return this.usersService.update(userId, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('id', ParseUUIDPipe) userId: string,
    @CurrentUser() admin: AccessTokenPayload, // Lấy thông tin admin đang thực hiện
  ) {
    return this.usersService.delete(userId, admin.userId);
  }
}
