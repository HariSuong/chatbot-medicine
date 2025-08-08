// src/knowledge-base/knowledge-base.model.ts

import { z } from 'zod';

// Schema cho Document, khớp với Prisma Model
export const DocumentSchema = z.object({
  id: z.string().uuid(),
  fileName: z.string(),
  sourceUrl: z.string().nullable(),
  category: z.string(),
  createdAt: z.date(),
});

// Schema cho KnowledgeChunk, khớp với Prisma Model
// Lưu ý: Chúng ta không đưa trường `embedding` vào đây vì nó là vector,
// không cần thiết cho việc xác thực hay truyền tải qua API.
export const KnowledgeChunkSchema = z.object({
  id: z.string().uuid(),
  documentId: z.string().uuid(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Suy ra các Type
export type DocumentType = z.infer<typeof DocumentSchema>;
export type KnowledgeChunkType = z.infer<typeof KnowledgeChunkSchema>;
