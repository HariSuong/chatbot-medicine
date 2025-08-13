// src/admin/users/dto/users.dto.ts

import { createZodDto } from 'nestjs-zod';
import {
  UpdateUserBodySchema,
  UserWithRoleResSchema,
} from 'src/admin/users/users.model';

export class UserWithRoleDTO extends createZodDto(UserWithRoleResSchema) {}
export class UpdateUserDTO extends createZodDto(UpdateUserBodySchema) {}
