// src/chat/dto/chat.dto.ts

import { createZodDto } from 'nestjs-zod';
import {
  ConversationResSchema,
  CreateMessageBodySchema,
  MessageResSchema,
} from 'src/chat/chat.model';

// DTO cho body của request gửi tin nhắn
export class CreateMessageDTO extends createZodDto(CreateMessageBodySchema) {}

// DTO cho response trả về khi tạo cuộc trò chuyện
export class ConversationResDTO extends createZodDto(ConversationResSchema) {}

// DTO cho response trả về khi gửi tin nhắn
export class MessageResDTO extends createZodDto(MessageResSchema) {}
