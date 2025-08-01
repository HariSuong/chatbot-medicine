// src/shared/guards/roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY } from 'src/shared/constains/auth.constains';
import { ROLES_KEY } from 'src/shared/decorators/roles.decorator';
import { AccessTokenPayload } from 'src/shared/types/jwt.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('--- 3B. [RolesGuard] Bắt đầu kiểm tra vai trò ---');

    // 1. Lấy danh sách các vai trò được yêu cầu từ decorator @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Nếu không có decorator @Roles nào, tức là không yêu cầu quyền đặc biệt -> cho qua
    if (!requiredRoles) {
      console.log(
        '--- 3B. [RolesGuard] Endpoint không yêu cầu vai trò. Cho qua.',
      );

      return true;
    }

    // 2. Lấy thông tin người dùng từ request (đã được AccessTokenGuard gắn vào)
    const request = context.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY] as AccessTokenPayload;

    console.log(
      `--- 3B. [RolesGuard] Yêu cầu vai trò: [${requiredRoles.join(', ')}], Vai trò của user: ${user.roleName}`,
    );

    // 3. So sánh vai trò của người dùng với các vai trò được yêu cầu
    // Chỉ cần người dùng có MỘT trong các vai trò được yêu cầu là đủ
    return requiredRoles.some((role) => user.roleName === role);
  }
}
