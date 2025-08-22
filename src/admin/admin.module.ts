import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConsultantsModule } from './consultants/consultants.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { CompaniesModule } from './companies/companies.module';
import { KnowledgeBaseModule } from './knowledge-base/knowledge-base.module';

@Module({
  imports: [UsersModule, ConsultantsModule, AppointmentsModule, CompaniesModule, KnowledgeBaseModule],
})
export class AdminModule {}
