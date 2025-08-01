import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import envConfig from 'src/shared/config/config';

@Injectable()
export class APIKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const xApikey = request.headers['x-api-key'];

    if (xApikey !== envConfig.SECRET_API_KEY) {
      throw new UnauthorizedException('API Key không hợp lệ.');
    }
    return true;
  }
}
