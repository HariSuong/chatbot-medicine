// src/chat/chat.service.ts

import { Injectable } from '@nestjs/common';
import { ChatRepository } from 'src/chat/chat.repo';
import { ConversationAccessException } from 'src/shared/constains/exception.constains';
import { AIService } from 'src/shared/services/ai.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepo: ChatRepository,
    private readonly aiService: AIService,
  ) {}

  /**
   * Bắt đầu một cuộc hội thoại mới cho user
   */
  async startConversation(userId: string) {
    return this.chatRepo.createConversation(userId);
  }

  /**
   * Lấy tất cả các cuộc hội thoại của một user
   */
  async getConversations(userId: string) {
    return this.chatRepo.findConversationsByUserId(userId);
  }

  /**
   * Xử lý khi người dùng gửi một tin nhắn mới
   */
  async sendMessage(params: {
    conversationId: string;
    userId: string;
    content: string;
  }) {
    console.log('--- 2. SERVICE: Bắt đầu xử lý tin nhắn ---');
    const { conversationId, userId, content } = params;

    // 1. Kiểm tra xem user có quyền truy cập vào cuộc hội thoại này không
    console.log('--- 2A. SERVICE: Kiểm tra quyền truy cập ---');
    const conversation =
      await this.chatRepo.findConversationById(conversationId);

    if (!conversation || conversation.userId !== userId) {
      console.error('--- LỖI: Người dùng không có quyền truy cập. ---');
      throw ConversationAccessException;
    }
    console.log('--- 2A. SERVICE: Quyền truy cập hợp lệ. ---');

    console.log('--- 2B. SERVICE: Chuẩn bị lưu tin nhắn của người dùng. ---');
    // 2. Lưu tin nhắn của người dùng vào DB
    await this.chatRepo.createMessage({
      conversationId,
      role: 'user',
      content,
    });
    console.log('--- 2B. SERVICE: Đã lưu tin nhắn của người dùng vào DB. ---');

    console.log('--- 2C. SERVICE: Gửi yêu cầu đến AI Service... ---');
    // 3. Gọi đến Gemini để lấy câu trả lời
    const aiResponseContent = await this.aiService.generateText(content);
    console.log('--- 2C. SERVICE: Đã nhận được phản hồi từ AI. ---');

    console.log('--- 2D. SERVICE: Chuẩn bị lưu tin nhắn của AI. ---');
    // 4. Lưu câu trả lời của AI vào DB
    const aiMessage = await this.chatRepo.createMessage({
      conversationId,
      role: 'assistant',
      content: aiResponseContent,
    });

    console.log('--- 2D. SERVICE: Đã lưu tin nhắn của AI vào DB. ---');

    console.log('--- 3. SERVICE: Hoàn tất, trả về tin nhắn của AI. ---');
    // 5. Trả về tin nhắn của AI cho người dùng
    return aiMessage;
  }
}
