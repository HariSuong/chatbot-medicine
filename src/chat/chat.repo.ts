// src/chat/chat.repo.ts

import { Injectable } from '@nestjs/common';
import { ConversationType, MessageType } from 'src/chat/chat.model';

import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class ChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  createConversation(userId: string): Promise<ConversationType> {
    return this.prisma.conversation.create({
      data: {
        userId: userId,
        title: 'Cuộc trò chuyện mới',
      },
    });
  }

  findConversationsByUserId(userId: string): Promise<ConversationType[]> {
    return this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  findConversationById(id: string): Promise<ConversationType | null> {
    return this.prisma.conversation.findUnique({
      where: { id },
    });
  }

  createMessage(data: {
    conversationId: string;
    role: 'user' | 'assistant';
    content: string;
  }): Promise<MessageType> {
    return this.prisma.message.create({
      data,
    }) as unknown as Promise<MessageType>;
  }

  /**
   * Lấy lịch sử tin nhắn của một cuộc trò chuyện.
   * @param conversationId ID của cuộc trò chuyện.
   * @param limit Số lượng tin nhắn gần nhất cần lấy.
   * @returns Mảng các tin nhắn.
   */
  findMessagesByConversationId(
    conversationId: string,
    limit = 10, // Lấy 10 tin nhắn gần nhất (5 cặp hỏi-đáp)
  ): Promise<MessageType[]> {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' }, // Lấy những tin nhắn mới nhất trước
      take: limit,
    }) as unknown as Promise<MessageType[]>;
  }
}
