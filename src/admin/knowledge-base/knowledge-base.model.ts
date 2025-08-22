// src/admin/knowledge-base/knowledge-base.model.ts

import { z } from 'zod';

// Schema cho response khi Admin lấy danh sách tài liệu
// Nó khớp với Prisma Model `Document`
export const DocumentResSchema = z.object({
  id: z.string().uuid(),
  fileName: z.string(),
  sourceUrl: z.string().nullable(),
  category: z.string(),
  companyId: z.string().uuid(),
  createdAt: z.date(),
});

// Suy ra Type
export type DocumentResType = z.infer<typeof DocumentResSchema>;
