// src/admin/knowledge-base/knowledge-base.dto.ts

import { createZodDto } from 'nestjs-zod';
import { DocumentResSchema } from 'src/admin/knowledge-base/knowledge-base.model';

export class DocumentDTO extends createZodDto(DocumentResSchema) {}
