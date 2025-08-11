// src/pets/dto/pets.dto.ts

import { createZodDto } from 'nestjs-zod';
import {
  CreatePetBodySchema,
  PetResSchema,
  UpdatePetBodySchema,
} from 'src/pets/pets.model';
export class CreatePetDTO extends createZodDto(CreatePetBodySchema) {}
export class UpdatePetDTO extends createZodDto(UpdatePetBodySchema) {}
export class PetDTO extends createZodDto(PetResSchema) {}
