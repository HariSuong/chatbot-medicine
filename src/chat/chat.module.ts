import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatRepository } from 'src/chat/chat.repo';
import { KnowledgeBaseModule } from 'src/knowledge-base/knowledge-base.module';

@Module({
  imports: [KnowledgeBaseModule], // <-- Thêm vào đây
  controllers: [ChatController],
  providers: [ChatService, ChatRepository],
})
export class ChatModule {}
