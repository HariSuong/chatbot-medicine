import { Controller, Get, UseGuards } from '@nestjs/common';
import { ROLE_NAME_VALUES } from 'src/shared/constains/role.constain';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { AccessTokenPayload } from 'src/shared/types/jwt.type';

@Controller('profile')
export class ProfileController {
  // Endpoint này sẽ tự động được bảo vệ bởi AuthenticationGuard toàn cục
  @Get('me')
  getProfile(@CurrentUser() user: AccessTokenPayload) {
    // Nhờ decorator @CurrentUser, bạn có thể dễ dàng lấy thông tin user
    console.log('Thông tin user đăng nhập:', user);
    return user;
  }

  // --- THÊM MỚI: Endpoint chỉ dành cho ADMIN ---
  @Get('admin-only')
  @UseGuards(RolesGuard) // <-- 1. Áp dụng RolesGuard cho endpoint này
  @Roles(ROLE_NAME_VALUES.ADMIN) // <-- 2. Ra lệnh: chỉ cho phép vai trò 'ADMIN'
  adminOnlyResource(@CurrentUser() user: AccessTokenPayload) {
    console.log(
      '--- 4. [Controller] Request đã vào đến controller adminOnlyResource ---',
    );

    return {
      message: 'Chào mừng Admin!',
      userInfo: user,
    };
  }
}
