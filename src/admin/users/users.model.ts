// src/admin/users/users.model.ts

import { z } from 'zod';
import { RoleSchema } from 'src/auth/auth.model';
import { UserSchema } from 'src/shared/models/shared-user.model';

// Schema cho response trả về, bao gồm cả thông tin Role
export const UserWithRoleResSchema = UserSchema.omit({ password: true }).extend(
  {
    role: RoleSchema,
  },
);

export const UpdateUserBodySchema = UserSchema.pick({
  name: true,
  phoneNumber: true,
  status: true,
  roleId: true,
}).partial(); // .partial() biến tất cả các trường thành optional

// Suy ra Type
export type UserWithRoleResType = z.infer<typeof UserWithRoleResSchema>;
export type UpdateUserBodyType = z.infer<typeof UpdateUserBodySchema>;
