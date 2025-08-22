// src/admin/knowledge-base/knowledge-base.service.ts

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { KnowledgeBaseRepository } from './knowledge-base.repo';

@Injectable()
export class KnowledgeBaseService {
  constructor(private readonly kbRepo: KnowledgeBaseRepository) {}

  /**
   * Logic để Admin lấy danh sách tài liệu của công ty mình.
   */
  findAllByCompanyId(companyId: string) {
    return this.kbRepo.findAllByCompanyId(companyId);
  }

  /**
   * Logic để Admin xóa một tài liệu.
   */
  async delete(adminCompanyId: string, documentId: string) {
    // 1. Kiểm tra xem tài liệu có tồn tại không
    const document = await this.kbRepo.findById(documentId);
    if (!document) {
      throw new NotFoundException('Không tìm thấy tài liệu.');
    }

    // 2. Kiểm tra xem tài liệu có thuộc công ty của Admin không
    if (document.companyId !== adminCompanyId) {
      throw new ForbiddenException('Bạn không có quyền xóa tài liệu này.');
    }

    // 3. Nếu hợp lệ, tiến hành xóa
    await this.kbRepo.delete(documentId);
    return { message: 'Đã xóa tài liệu thành công.' };
  }
}
