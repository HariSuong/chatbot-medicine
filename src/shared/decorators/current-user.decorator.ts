import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from 'src/shared/constains/auth.constains';

// Decorator này sẽ lấy thông tin user đã được AccessTokenGuard gắn vào request
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request[REQUEST_USER_KEY]; // Trả về payload của token
  },
);
