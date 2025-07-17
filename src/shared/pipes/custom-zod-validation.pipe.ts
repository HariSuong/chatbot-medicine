// src/shared/pipes/custom-zod-validation.pipe.ts

import { UnprocessableEntityException } from '@nestjs/common';
import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod'; // ZodError vẫn được export trực tiếp

const CustomZodValidationPipe = createZodValidationPipe({
  // provide custom validation exception factory
  createValidationException: (error: ZodError) => {
    // SỬA TỪ error.errors SANG error.issues
    return new UnprocessableEntityException(
      error.issues.map((issue) => {
        // Đổi tên biến 'error' thành 'issue' cho rõ ràng
        return {
          ...issue,
          path: issue.path.join('.'),
        };
      }),
    );
  },
});

export default CustomZodValidationPipe;
