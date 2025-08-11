// src/shared/constains/role.constain.ts

export const ROLE_NAME_VALUES = {
  ADMIN: 'ADMIN',
  USER: 'USER', // Đổi CLIENT thành USER như đã thống nhất cho vai trò người dùng thông thường
  DOCTOR: 'DOCTOR',
} as const;

export type RoleName = (typeof ROLE_NAME_VALUES)[keyof typeof ROLE_NAME_VALUES];
