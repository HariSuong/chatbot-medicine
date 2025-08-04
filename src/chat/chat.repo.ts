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
}
