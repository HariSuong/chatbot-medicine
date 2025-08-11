import { Module } from '@nestjs/common';
import { ConsultantsController } from './consultants.controller';
import { ConsultantsService } from './consultants.service';
import { RoleService } from 'src/auth/role.service';
import { ConsultantsRepository } from 'src/admin/consultants/consultants.repo';

@Module({
  controllers: [ConsultantsController],
  providers: [ConsultantsService, ConsultantsRepository, RoleService],
})
export class ConsultantsModule {}
