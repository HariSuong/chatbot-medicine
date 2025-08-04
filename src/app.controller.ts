import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IsPublic } from 'src/shared/decorators/auth.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Thêm endpoint mới để test AI
  @Get('test-ai')
  @IsPublic()
  testAI() {
    return this.appService.testAI();
  }
}
