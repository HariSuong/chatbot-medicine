import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { AppointmentsRepository } from 'src/admin/appointments/appointments.repo';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AppointmentsRepository],
})
export class AppointmentsModule {}
