// src/admin/consultants/dto/consultants.dto.ts

import { createZodDto } from 'nestjs-zod';
import {
  ConsultantResSchema,
  CreateConsultantBodySchema,
  UpdateConsultantBodySchema,
} from 'src/admin/consultants/consultants.model';

export class CreateConsultantDTO extends createZodDto(
  CreateConsultantBodySchema,
) {}
export class UpdateConsultantDTO extends createZodDto(
  UpdateConsultantBodySchema,
) {}
export class ConsultantDTO extends createZodDto(ConsultantResSchema) {}
