import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConsultantsModule } from './consultants/consultants.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [UsersModule, ConsultantsModule, AppointmentsModule, CompaniesModule],
})
export class AdminModule {}
