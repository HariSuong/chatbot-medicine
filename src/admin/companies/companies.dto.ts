// src/admin/companies/dto/companies.dto.ts

import { createZodDto } from 'nestjs-zod';
import {
  CompanyResSchema,
  CreateCompanyBodySchema,
  UpdateCompanyBodySchema,
} from 'src/admin/companies/companies.model';

export class CreateCompanyDTO extends createZodDto(CreateCompanyBodySchema) {}
export class UpdateCompanyDTO extends createZodDto(UpdateCompanyBodySchema) {}
export class CompanyDTO extends createZodDto(CompanyResSchema) {}
