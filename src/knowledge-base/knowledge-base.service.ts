// src/knowledge-base/knowledge-base.service.ts

import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Injectable } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import pdfParse from 'pdf-parse';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class KnowledgeBaseService {
  private readonly textSplitter: RecursiveCharacterTextSplitter;
  private readonly embeddings: GoogleGenerativeAIEmbeddings;

  constructor(private readonly prisma: PrismaService) {
    // Khởi tạo các "công cụ" của LangChain
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000, // Cắt văn bản thành các đoạn có tối đa 1000 ký tự
      chunkOverlap: 200, // Các đoạn sẽ có 200 ký tự gối lên nhau để không mất ngữ cảnh
    });

    this.embeddings = new GoogleGenerativeAIEmbeddings({
      model: 'embedding-001', // Model chuyên dụng để tạo vector
    });
  }

  async processAndEmbedPdf(fileBuffer: Buffer, fileName: string) {
    console.log('--- 2. SERVICE: Bắt đầu xử lý file PDF ---');

    // --- BƯỚC A: ĐỌC NỘI DUNG TỪ PDF ---
    const pdfData = await pdfParse(fileBuffer);
    const rawText = pdfData.text;
    console.log(
      '--- 2A. SERVICE: Đã đọc xong file PDF, có',
      rawText.length,
      'ký tự.',
    );

    // --- BƯỚC B: CẮT VĂN BẢN THÀNH CÁC ĐOẠN NHỎ (CHUNKS) ---
    const chunks = await this.textSplitter.splitText(rawText);
    console.log(
      '--- 2B. SERVICE: Đã cắt văn bản thành',
      chunks.length,
      'đoạn (chunks).',
    );
    console.log('Ví dụ chunk đầu tiên:', chunks[0].substring(0, 100) + '...');

    // --- BƯỚC C: TẠO VECTOR (EMBEDDING) CHO TỪNG ĐOẠN ---
    console.log(
      '--- 2C. SERVICE: Bắt đầu tạo vector... (bước này có thể mất vài giây)',
    );
    const vectors = await this.embeddings.embedDocuments(chunks);
    console.log('--- 2C. SERVICE: Đã tạo xong', vectors.length, 'vector.');

    // --- BƯỚC D: LƯU VÀO DATABASE ---
    console.log('--- 2D. SERVICE: Chuẩn bị lưu vào database... ---');
    // Tạo bản ghi Document trước
    const document = await this.prisma.document.create({
      data: {
        fileName: fileName,
        category: 'veterinary', // Tạm thời để cố định, sau này có thể lấy từ request
      },
    });

    // Lưu từng chunk và vector tương ứng
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const vector = vectors[i];

      // Prisma chưa hỗ trợ trực tiếp kiểu vector, chúng ta cần dùng $executeRawUnsafe
      // Đảm bảo bạn đã bật extension "vector" trên Supabase
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO "KnowledgeChunk" (id, "documentId", content, embedding, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3::vector, NOW(), NOW())`,
        document.id,
        chunk,
        `[${vector.join(',')}]`, // Chuyển mảng số thành chuỗi vector '[1,2,3,...]'
      );
    }

    console.log(
      '--- 3. SERVICE: Hoàn tất! Đã lưu',
      chunks.length,
      'chunk vào database.',
    );
    return {
      message: 'Tải lên và xử lý tài liệu thành công!',
      chunksCreated: chunks.length,
    };
  }
}
