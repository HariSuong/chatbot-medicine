import { Global, Module } from '@nestjs/common';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo';
import { HasingService } from 'src/shared/services/hasing.service';
import { PrismaService } from 'src/shared/services/prisma.service';

const sharedServices = [PrismaService, HasingService, SharedUserRepository];

@Global() // Có thể thêm @Global() cho SharedModule nếu muốn các service trong nó dùng chung
@Module({
  providers: sharedServices,
  exports: sharedServices,
})
export class SharedModule {}
