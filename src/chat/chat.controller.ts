// src/chat/chat.controller.ts

import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { AccessTokenPayload } from 'src/shared/types/jwt.type';
import { ChatService } from './chat.service';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  ConversationResDTO,
  CreateMessageDTO,
  MessageResDTO,
} from 'src/chat/chat.dto';

@Controller('chat') // Tất cả các API trong đây sẽ có tiền tố /chat
// Lưu ý: Vì không có @IsPublic(), toàn bộ controller này sẽ được AuthenticationGuard bảo vệ.
// Chỉ người dùng đã đăng nhập mới có thể truy cập.
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * Bắt đầu một cuộc trò chuyện mới cho người dùng hiện tại.
   * API: POST /chat/conversations
   */
  @Post('conversations')
  @ZodSerializerDto(ConversationResDTO)
  startConversation(@CurrentUser() user: AccessTokenPayload) {
    console.log('--- 1. CONTROLLER: Nhận request tạo cuộc trò chuyện mới ---');
    console.log('User ID từ token:', user.userId);
    return this.chatService.startConversation(user.userId);
  }

  /**
   * Lấy tất cả các cuộc trò chuyện của người dùng hiện tại.
   * API: GET /chat/conversations
   */
  @Get('conversations')
  getConversations(@CurrentUser() user: AccessTokenPayload) {
    console.log(
      '--- 1. CONTROLLER: Nhận request lấy danh sách cuộc trò chuyện ---',
    );
    console.log('User ID từ token:', user.userId);
    return this.chatService.getConversations(user.userId);
  }

  /**
   * Gửi một tin nhắn mới trong một cuộc trò chuyện đã có.
   * API: POST /chat/conversations/:conversationId/messages
   * @param conversationId Lấy từ URL, được validate phải là dạng UUID.
   */
  @Post('conversations/:conversationId/messages')
  @ZodSerializerDto(MessageResDTO)
  sendMessage(
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
    @CurrentUser() user: AccessTokenPayload,
    @Body() body: CreateMessageDTO,
  ) {
    console.log('--- 1. CONTROLLER: Nhận request gửi tin nhắn mới ---');
    console.log('Conversation ID từ URL:', conversationId);
    console.log('User ID từ token:', user.userId);
    console.log('Nội dung tin nhắn từ body:', body.content);
    return this.chatService.sendMessage({
      conversationId,
      userId: user.userId,
      content: body.content,
    });
  }
}
