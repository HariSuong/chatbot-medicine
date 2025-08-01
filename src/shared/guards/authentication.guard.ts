import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthType, ConditionGuard } from 'src/shared/constains/auth.constains';
import {
  AUTH_TYPE_KEY,
  AuthTypeDecoratorPayload,
} from 'src/shared/decorators/auth.decorator';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import { APIKeyGuard } from 'src/shared/guards/api-key.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly authTypeGuardMap: Record<string, CanActivate>;
  // Bước 1: Khởi tạo và Chuẩn bị (Hàm constructor)
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly apiKeyGuard: APIKeyGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.APIKey]: this.apiKeyGuard,
      // Add other auth types and their corresponding guards here
      [AuthType.None]: { canActivate: () => true },
    };
  }

  //  Bước 2: Bắt đầu làm việc (Hàm canActivate)
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('--- 1. [AuthenticationGuard] BẮT ĐẦU: Luôn chạy đầu tiên ---');

    const authTypeValue = this.reflector.getAllAndOverride<
      AuthTypeDecoratorPayload | undefined
    >(AUTH_TYPE_KEY, [context.getHandler(), context.getClass()]) ?? {
      authTypes: [AuthType.Bearer],
      option: { condition: ConditionGuard.And },
    };
    console.log(
      '--- 2. [AuthenticationGuard] Đã đọc Decorator:',
      authTypeValue,
    );

    // Lấy danh sách các guard cần thực thi dựa trên authTypes
    const guardsToExecute = authTypeValue.authTypes.map(
      (authType) => this.authTypeGuardMap[authType],
    );

    if (authTypeValue.option.condition === ConditionGuard.Or) {
      for (const guard of guardsToExecute) {
        try {
          // Gọi canActivate của guard con
          const canActive = await guard.canActivate(context);
          console.log('canActive', canActive);
          if (canActive) {
            return true; // Một guard thành công là đủ
          }
        } catch (e) {
          // Bỏ qua lỗi của guard con nếu đang ở chế độ OR,
          // vì chúng ta chỉ cần một cái thành công.
          // Có thể log lỗi ở đây để debug nếu cần.
          console.warn(
            `Guard ${guard.constructor.name} failed in OR condition:`,
            e.message,
          );
        }
      }
      // Nếu không có guard nào thành công trong điều kiện OR
      throw new UnauthorizedException(
        'Không có phương thức xác thực nào hợp lệ.',
      );
    } else {
      // Xử lý điều kiện AND (mặc định): TẤT CẢ các guard phải thành công
      for (const guard of guardsToExecute) {
        try {
          const canActive = await guard.canActivate(context);
          if (!canActive) {
            // Nếu một guard thất bại, ném lỗi ngay lập tức
            throw new UnauthorizedException(
              `Xác thực thất bại bởi ${guard.constructor.name}.`,
            );
          }
        } catch (e) {
          // Nếu guard ném ra exception, bắt và ném lại UnauthorizedException
          // Điều này đảm bảo rằng lỗi từ guard con được truyền ra ngoài
          console.error(
            `Guard ${guard.constructor.name} failed in AND condition:`,
            e.message,
          );
          throw new UnauthorizedException(
            `Xác thực thất bại bởi ${guard.constructor.name}.`,
          );
        }
      }
    }

    return true;
  }
}
