import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { AppointmentRepository } from 'src/appointments/appointments.repo';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AppointmentRepository],
})
export class AppointmentsModule {}
