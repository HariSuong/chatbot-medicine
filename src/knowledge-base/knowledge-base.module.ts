import { Module } from '@nestjs/common';
import { KnowledgeBaseController } from './knowledge-base.controller';
import { KnowledgeBaseService } from './knowledge-base.service';
import { KnowledgeBaseRepository } from 'src/knowledge-base/knowledge-base.repo';

@Module({
  controllers: [KnowledgeBaseController],
  providers: [KnowledgeBaseService, KnowledgeBaseRepository],
  exports: [KnowledgeBaseRepository], // <-- Export ra để ChatModule có thể dùng
})
export class KnowledgeBaseModule {}
