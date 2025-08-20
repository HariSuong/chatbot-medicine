import { Module } from '@nestjs/common';
import { CompaniesModule } from 'src/admin/companies/companies.module';
import { AuthController } from 'src/auth/auth.controller';
import { AuthRepository } from 'src/auth/auth.repo';
import { AuthService } from 'src/auth/auth.service';
import { GoogleService } from 'src/auth/google.service';
import { RoleService } from 'src/auth/role.service';

@Module({
  imports: [CompaniesModule],
  controllers: [AuthController],
  providers: [AuthService, RoleService, AuthRepository, GoogleService],
})
export class AuthModule {}
