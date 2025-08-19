// src/admin/companies/companies.model.ts

import { z } from 'zod';

// Schema cơ bản cho một Công ty, khớp với Prisma Model
export const CompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  apiKey: z.string().uuid(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// --- Schemas cho Request Body ---

// Schema cho body khi Admin tạo một công ty mới
export const CreateCompanyBodySchema = CompanySchema.pick({
  name: true, // Admin chỉ cần cung cấp tên
}).extend({
  name: z.string().min(1, 'Tên công ty không được để trống.'),
});

// Schema cho body khi Admin cập nhật thông tin công ty
export const UpdateCompanyBodySchema = CompanySchema.pick({
  name: true,
  isActive: true,
}).partial(); // .partial() biến tất cả các trường thành optional

// --- Schema cho Response ---
export const CompanyResSchema = CompanySchema;

// --- Suy ra các Type ---
export type CompanyType = z.infer<typeof CompanySchema>;
export type CreateCompanyBodyType = z.infer<typeof CreateCompanyBodySchema>;
export type UpdateCompanyBodyType = z.infer<typeof UpdateCompanyBodySchema>;
export type CompanyResType = z.infer<typeof CompanyResSchema>;
