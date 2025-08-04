import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import envConfig from 'src/shared/config/config';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import { APIKeyGuard } from 'src/shared/guards/api-key.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo';
import { AIService } from 'src/shared/services/ai.service';
import { EmailService } from 'src/shared/services/email.service';
import { HasingService } from 'src/shared/services/hasing.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { TokenService } from 'src/shared/services/token.service';

const sharedServices = [
  PrismaService,
  HasingService,
  SharedUserRepository,
  EmailService,
  TokenService,
  AccessTokenGuard,
  APIKeyGuard,
  RolesGuard,
  AIService,
];

@Global() // Có thể thêm @Global() cho SharedModule nếu muốn các service trong nó dùng chung
@Module({
  imports: [
    JwtModule.register({
      secret: envConfig.ACCESS_TOKEN_SECRET,
      signOptions: {
        expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN,
        algorithm: 'HS256', // <-- Thêm lại thuật toán ở đây
      },
    }),
  ],
  providers: sharedServices,
  exports: sharedServices,
})
export class SharedModule {}
