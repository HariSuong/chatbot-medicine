import { createZodDto } from 'nestjs-zod';
import {
  RegisterBodySchema,
  RegisterResSchema,
  SendOTPBodySchema,
} from 'src/auth/auth.model';

export class RegisterBodyDto extends createZodDto(RegisterBodySchema) {}

export class RegisterResDto extends createZodDto(RegisterResSchema) {}

export class SendOTPBodyDTO extends createZodDto(SendOTPBodySchema) {}
