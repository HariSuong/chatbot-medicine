// src/chat/chat.model.ts

import { z } from 'zod';

// Schema cơ bản cho một tin nhắn, khớp với Prisma Model
export const MessageSchema = z.object({
  id: z.string().uuid(),
  conversationId: z.string().uuid(),
  role: z.enum(['user', 'assistant']), // Role có thể là user hoặc assistant
  content: z.string(),
  createdAt: z.date(),
});

// Schema cơ bản cho một cuộc trò chuyện, khớp với Prisma Model
export const ConversationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().nullable(),
  platform: z.string().nullable(), // Thêm mới: Nền tảng (web, facebook...)
  platformConversationId: z.string().nullable(), // Thêm mới: ID cuộc trò chuyện trên nền tảng đó
  createdAt: z.date(),
  updatedAt: z.date(),
});

// --- Schemas cho Request Body ---

// Schema cho body khi gửi một tin nhắn mới
export const CreateMessageBodySchema = z.object({
  content: z
    .string()
    .min(1, 'Nội dung tin nhắn không được để trống.')
    .max(2000, 'Nội dung tin nhắn không được vượt quá 2000 ký tự.'),
});

// --- Schemas cho Response ---

// Schema cho response khi tạo một cuộc trò chuyện mới
export const ConversationResSchema = ConversationSchema;

// Schema cho response khi gửi một tin nhắn (trả về tin nhắn của AI)
export const MessageResSchema = MessageSchema;

// --- Suy ra các Type từ Zod Schemas ---
export type MessageType = z.infer<typeof MessageSchema>;
export type ConversationType = z.infer<typeof ConversationSchema>;
export type CreateMessageBodyType = z.infer<typeof CreateMessageBodySchema>;
export type ConversationResType = z.infer<typeof ConversationResSchema>;
export type MessageResType = z.infer<typeof MessageResSchema>;
