import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import CustomZodValidationPipe from 'src/shared/pipes/custom-zod-validation.pipe';
import { SharedModule } from 'src/shared/shared.module';
import { AuthModule } from 'src/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from 'src/shared/config/mailer.config';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { ZodSerializerInterceptor } from 'nestjs-zod';
import { ProfileModule } from './profile/profile.module';
import { ChatModule } from './chat/chat.module';
import { KnowledgeBaseModule } from './knowledge-base/knowledge-base.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { PetsModule } from './pets/pets.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [SharedModule, AuthModule, MailerModule.forRoot(mailerConfig), ProfileModule, ChatModule, KnowledgeBaseModule, AppointmentsModule, PetsModule, AdminModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    {
      provide: APP_GUARD, // Đăng ký AuthenticationGuard toàn cầu ở đây
      useClass: AuthenticationGuard,
    },
  ],
})
export class AppModule {}
