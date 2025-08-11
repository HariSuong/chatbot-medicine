// src/admin/users/users.controller.ts

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { ROLE_NAME_VALUES } from 'src/shared/constains/role.constain';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';

import { UsersService } from './users.service';
import { UserWithRoleDTO } from 'src/admin/users/users.dto';

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
  findAll() {
    return this.usersService.findAll();
  }
}
