import { Module } from '@nestjs/common';
import { AuthController } from 'src/auth/auth.controller';
import { AuthRepository } from 'src/auth/auth.repo';
import { AuthService } from 'src/auth/auth.service';
import { RoleService } from 'src/auth/role.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, RoleService, AuthRepository],
})
export class AuthModule {}
