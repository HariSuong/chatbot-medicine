// src/admin/knowledge-base/knowledge-base.repo.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { DocumentResType } from './knowledge-base.model';

@Injectable()
export class KnowledgeBaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lấy danh sách tất cả các tài liệu thuộc một công ty cụ thể.
   * @param companyId ID của công ty.
   * @returns Mảng các tài liệu.
   */
  async findAllByCompanyId(companyId: string): Promise<DocumentResType[]> {
    const documents = await this.prisma.document.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
    return documents;
  }

  /**
   * Tìm một tài liệu duy nhất bằng ID của nó.
   * @param documentId ID của tài liệu.
   * @returns Tài liệu nếu tìm thấy, ngược lại là null.
   */
  async findById(documentId: string): Promise<DocumentResType | null> {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });
    return document;
  }

  /**
   * Xóa một tài liệu.
   * Nhờ có `onDelete: Cascade` trong schema, việc xóa Document
   * sẽ tự động xóa tất cả các KnowledgeChunk liên quan.
   * @param documentId ID của tài liệu cần xóa.
   */
  async delete(documentId: string): Promise<void> {
    await this.prisma.document.delete({
      where: { id: documentId },
    });
  }
}
