// src/knowledge-base/knowledge-base.controller.ts

import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import 'multer';
import { ROLE_NAME_VALUES } from 'src/shared/constains/role.constain';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { KnowledgeBaseService } from './knowledge-base.service';

@Controller('knowledge-base')
export class KnowledgeBaseController {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  /**
   * Endpoint để Admin upload MỘT file kiến thức (PDF).
   * API: POST /knowledge-base/upload-single
   */
  @Post('upload-single')
  @UseGuards(RolesGuard)
  @Roles(ROLE_NAME_VALUES.ADMIN)
  @UseInterceptors(FileInterceptor('file')) // Dùng FileInterceptor cho 1 file
  async uploadKnowledgeBase(
    @UploadedFile(
      // Dùng @UploadedFile cho 1 file
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // Log ra để xem object file chứa những gì
    console.log('--- 1. CONTROLLER: Nhận được 1 file upload ---');
    console.log('Tên gốc:', file.originalname);
    console.log('Loại file (mimetype):', file.mimetype);
    console.log('Kích thước (bytes):', file.size);
    console.log('Buffer (dữ liệu nhị phân của file):', file.buffer);

    return this.knowledgeBaseService.processAndEmbedPdf(
      file.buffer,
      file.originalname,
    );
  }

  /**
   * Endpoint để Admin upload NHIỀU file kiến thức cùng lúc.
   * API: POST /knowledge-base/upload-multiple
   */
  @Post('upload-multiple')
  @UseGuards(RolesGuard)
  @Roles(ROLE_NAME_VALUES.ADMIN)
  @UseInterceptors(FilesInterceptor('files', 5)) // Dùng FilesInterceptor cho nhiều file, giới hạn 5 file
  async uploadMultipleFiles(
    @UploadedFiles(
      // Dùng @UploadedFiles cho nhiều file
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    )
    files: Array<Express.Multer.File>, // Biến nhận được là một MẢNG các file
  ) {
    console.log(
      `--- 1. CONTROLLER: Nhận được ${files.length} file(s) upload ---`,
    );

    // Lặp qua từng file và xử lý
    for (const file of files) {
      console.log('Đang xử lý file:', file.originalname);
      await this.knowledgeBaseService.processAndEmbedPdf(
        file.buffer,
        file.originalname,
      );
    }

    return {
      message: `Đã xử lý thành công ${files.length} file.`,
    };
  }
}
