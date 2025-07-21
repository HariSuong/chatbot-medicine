// src/auth/auth.model.ts

import { z } from 'zod';

import { UserSchema } from 'src/shared/models/shared-user.model'; // Import UserSchema đã cập nhật
import { VERIFICATION_CODE_TYPE_VALUES } from 'src/shared/constains/auth.constains';

// --- RegisterBodySchema ---
// Schema cho dữ liệu gửi lên khi người dùng đăng ký
export const RegisterBodySchema = UserSchema.pick({
  email: true,
  name: true,
  password: true,
  phoneNumber: true,
})
  .extend({
    // Thêm trường xác nhận mật khẩu, không có trong UserSchema gốc
    confirmPassword: z
      .string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .max(100, 'Mật khẩu không được quá 100 ký tự'),
    // Thêm trường mã xác thực (OTP)
    code: z.string().length(6, 'Mã xác thực phải có 6 ký tự'),
  })
  .strict() // Đảm bảo rằng body không chứa các trường không được định nghĩa
  .superRefine((data, ctx) => {
    // Logic kiểm tra mật khẩu và xác nhận mật khẩu khớp nhau
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu và xác nhận mật khẩu không khớp',
        path: ['confirmPassword'], // Gán lỗi vào trường confirmPassword
      });
    }
  });

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>;

// --- RegisterResSchema ---
// Schema cho dữ liệu trả về sau khi người dùng đăng ký thành công
export const RegisterResSchema = UserSchema.omit({
  password: true,
});

export type RegisterResType = z.infer<typeof RegisterResSchema>;

// --- Các Schemas khác trong auth.model.ts ---
// Bạn cũng cần cập nhật VerificationCodeSchema và SendOTPBodySchema để sử dụng
// VERIFICATION_CODE_TYPE_VALUES

export const VerificationCodeSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  code: z.string().length(6),
  type: z.enum([
    VERIFICATION_CODE_TYPE_VALUES.REGISTER,
    VERIFICATION_CODE_TYPE_VALUES.FORGOT_PASSWORD,
  ]), // Sử dụng const array cho type
  expiresAt: z.date(),
  createdAt: z.date(),
});

export const SendOTPBodySchema = z.object({
  email: z.string().email(),
  type: z.enum([
    VERIFICATION_CODE_TYPE_VALUES.REGISTER,
    VERIFICATION_CODE_TYPE_VALUES.FORGOT_PASSWORD,
  ]), // Sử dụng const array cho type
});

export const RoleSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  isActive: z.boolean(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>;
export type SendOTPBodyType = z.infer<typeof SendOTPBodySchema>;
export type RoleType = z.infer<typeof RoleSchema>;
