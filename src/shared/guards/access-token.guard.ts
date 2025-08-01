import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST_USER_KEY } from 'src/shared/constains/auth.constains';
import { TokenService } from 'src/shared/services/token.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('--- 3A. [AccessTokenGuard] Bắt đầu kiểm tra token ---');

    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers.authorization?.split(' ')[1];
    console.log('AccessTokenGuard - accessToken:', accessToken);
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    try {
      const decodedAccessToken =
        await this.tokenService.verifyAccessToken(accessToken);
      request[REQUEST_USER_KEY] = decodedAccessToken;
      console.log(
        '--- 3A. [AccessTokenGuard] Token hợp lệ! Gắn user vào request.',
      );

      return true;
    } catch {
      console.error('--- 3A. [AccessTokenGuard] Token KHÔNG hợp lệ! ---');

      // Handle the error if needed
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
