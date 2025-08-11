// src/admin/consultants/consultants.model.ts

import { z } from 'zod';
import { RoleSchema } from 'src/auth/auth.model';
import { UserSchema } from 'src/shared/models/shared-user.model';

// Schema cho Consultant, khớp với Prisma Model
export const ConsultantSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  specialty: z.string().nullable(),
  bio: z.string().nullable(),
  isAvailable: z.boolean(),
});

// --- Schemas cho Request Body ---

// Schema cho body khi Admin tạo một hồ sơ Consultant mới
// Admin sẽ cần tạo một tài khoản User trước, sau đó tạo hồ sơ Consultant
// Tái sử dụng các trường từ UserSchema và mở rộng thêm
export const CreateConsultantBodySchema = UserSchema.pick({
  email: true,
  password: true,
  name: true,
  phoneNumber: true,
})
  .extend({
    // Ghi đè lại validation cho các trường của User để phù hợp với use case này
    email: z.string().email('Email không hợp lệ.'),
    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự.'),
    name: z.string().min(1, 'Tên không được để trống.'), // Ghi đè vì name trong UserSchema có thể null
    phoneNumber: z.string().optional(),
    // Thêm các trường riêng cho Consultant
    specialty: z.string().optional(),
    bio: z.string().optional(),
  })
  .strict();

// Schema cho body khi Admin cập nhật hồ sơ Consultant
export const UpdateConsultantBodySchema = CreateConsultantBodySchema.pick({
  name: true,
  phoneNumber: true,
  specialty: true,
  bio: true,
}).partial(); // Tất cả các trường đều là optional

// --- Schema cho Response ---

// Schema cho response trả về, bao gồm cả thông tin User và Role
export const ConsultantResSchema = ConsultantSchema.extend({
  user: UserSchema.omit({ password: true }).extend({
    role: RoleSchema,
  }),
});

// --- Suy ra các Type ---
export type ConsultantType = z.infer<typeof ConsultantSchema>;
export type CreateConsultantBodyType = z.infer<
  typeof CreateConsultantBodySchema
>;
export type UpdateConsultantBodyType = z.infer<
  typeof UpdateConsultantBodySchema
>;
export type ConsultantResType = z.infer<typeof ConsultantResSchema>;
