// src/knowledge-base/knowledge-base.repo.ts

import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { KnowledgeChunkType } from './knowledge-base.model';

@Injectable()
export class KnowledgeBaseRepository {
  private readonly embeddings: GoogleGenerativeAIEmbeddings;

  constructor(private readonly prisma: PrismaService) {
    this.embeddings = new GoogleGenerativeAIEmbeddings({
      model: 'embedding-001',
    });
  }

  /**
   * Tìm kiếm các chunk kiến thức liên quan nhất đến một câu hỏi.
   * @param queryText Câu hỏi của người dùng.
   * @param limit Số lượng chunk trả về.
   * @returns Mảng các KnowledgeChunk liên quan.
   */
  async findRelevantChunks(
    queryText: string,
    limit = 10,
  ): Promise<KnowledgeChunkType[]> {
    console.log('--- REPO: Bắt đầu tìm kiếm vector ---');

    // 1. Tạo vector từ câu hỏi của người dùng
    const queryVector = await this.embeddings.embedQuery(queryText);
    console.log('--- REPO: Đã tạo vector cho câu hỏi.');

    // 2. Chuyển vector thành chuỗi để dùng trong câu lệnh SQL
    const vectorString = `[${queryVector.join(',')}]`;
    // console.log('vectorString', vectorString);

    // 3. Dùng toán tử <=> (khoảng cách cosine) của pgvector để tìm các vector gần nhất
    const results = await this.prisma.$queryRaw<KnowledgeChunkType[]>`
      SELECT id, "documentId", content, "createdAt", "updatedAt" 
      FROM "KnowledgeChunk"
      ORDER BY embedding <=> ${vectorString}::vector
      LIMIT ${limit}
    `;

    console.log(`--- REPO: Đã tìm thấy ${results.length} chunk liên quan.`);
    return results;
  }
}
