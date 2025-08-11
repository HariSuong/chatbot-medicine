import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConsultantsModule } from './consultants/consultants.module';

@Module({
  imports: [UsersModule, ConsultantsModule]
})
export class AdminModule {}
