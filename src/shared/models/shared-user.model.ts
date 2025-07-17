import { USER_STATUS_VALUES } from 'src/shared/constains/auth.constains';
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.uuid(), // id là String @default(uuid()), nên là string và validate dạng UUID
  email: z.email(), // email là String @unique, nên là string dạng email
  password: z.string(), // password là String, không có giới hạn độ dài cụ thể trong Prisma, nên chỉ cần z.string()
  name: z.string().max(255).nullable(), // name là String?, có thể null, max 255 nếu bạn muốn giới hạn ở tầng Zod
  phoneNumber: z.string().min(9).max(15).nullable(), // phoneNumber là String?, có thể null, thêm min/max cho chuẩn sđt
  avatarUrl: z.url().nullable(), // avatarUrl là String?, có thể null, thêm .url() nếu là đường dẫn URL
  status: z.enum(USER_STATUS_VALUES), // status là UserStatus enum, dùng z.enum với const array

  roleId: z.uuid(), // roleId là String, nên là string và validate dạng UUID

  createdAt: z.date(), // createdAt là DateTime @default(now()), nên là Date
  updatedAt: z.date(), // updatedAt là DateTime @updatedAt, nên là Date

  // Lưu ý: Các mối quan hệ (conversations, devices, refreshTokens, appointments, notifications)
  // không được đưa vào Zod schema cho User Model ở đây, vì chúng ta chỉ định nghĩa
  // cấu trúc dữ liệu của User, không phải toàn bộ quan hệ của nó.
  // Các DTO cho request/response sẽ sử dụng .pick() hoặc .extend() từ UserSchema này.
});

export type UserType = z.infer<typeof UserSchema>;
