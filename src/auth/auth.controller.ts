import { Body, Controller, Post } from '@nestjs/common';
import { RegisterBodyDto } from 'src/auth/auth.dto';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('register')
  register(@Body() body: RegisterBodyDto) {
    console.log(body);
  }
}
