import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_PIPE } from '@nestjs/core';
import CustomZodValidationPipe from 'src/shared/pipes/custom-zod-validation.pipe';
import { SharedModule } from 'src/shared/shared.module';
import { AuthModule } from 'src/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from 'src/shared/config/mailer.config';

@Module({
  imports: [SharedModule, AuthModule, MailerModule.forRoot(mailerConfig)],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
  ],
})
export class AppModule {}
