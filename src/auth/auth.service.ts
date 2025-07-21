import { Injectable } from '@nestjs/common';
import { RegisterBodyDto } from 'src/auth/auth.dto';
// import { SendOTPBodyType } from 'src/auth/auth.model';
import { AuthRepository } from 'src/auth/auth.repo';
import { RoleService } from 'src/auth/role.service';
import { VERIFICATION_CODE_TYPE_VALUES } from 'src/shared/constains/auth.constains';
import {
  EmailAlreadyExistsException,
  InvalidOTPException,
  OTPExpiredException,
} from 'src/shared/constains/exception.constains';
import { isUniqueConstraintPrismaError } from 'src/shared/helpers';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo';
import { HasingService } from 'src/shared/services/hasing.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly hasingService: HasingService,
    private readonly roleService: RoleService,
    private readonly authRepository: AuthRepository, // Thêm AuthRepository vào constructor
    private readonly sharedUserRepository: SharedUserRepository,
  ) {}

  async register(body: RegisterBodyDto) {
    try {
      // Tìm ra unique
      const verificationCode =
        await this.authRepository.findUniqueVerificationCode({
          email: body.email,
          code: body.code,
          type: VERIFICATION_CODE_TYPE_VALUES.REGISTER,
        });

      if (!verificationCode) {
        throw InvalidOTPException;
      }

      if (verificationCode.expiresAt < new Date()) {
        throw OTPExpiredException;
      }

      // Lấy role ID của vai trò "CLIENT" từ trong cache roleService.getClientRoleId()
      const clientRoleId = await this.roleService.getUserRoleId();
      const hashedPassword = await this.hasingService.hash(body.password);
      return await this.authRepository.createUser({
        email: body.email,
        name: body.name,
        phoneNumber: body.phoneNumber,
        password: hashedPassword,
        roleId: clientRoleId, // Sử dụng roleId đã lấy từ roleService
      });
    } catch (error) {
      // console.log('error', error);
      if (isUniqueConstraintPrismaError(error)) {
        throw EmailAlreadyExistsException;
      }
      throw error;
    }
  }

  // async sendOTP(body: SendOTPBodyType) {
  //   // 1. Kiểm tra xem email đã tồn tại trong database hay chưa
  //   const user = await this.sharedUserRepository.findUnique({
  //     email: body.email,
  //   });

  //   if (user) {
  //     throw EmailAlreadyExistsException;
  //   }

  //   // 2. Tạo mã otp
  //   const code = generateOTP();

  //   const verificationCode = this.authRepository.createVerificationCode({
  //     email: body.email,
  //     code,
  //     type: body.type,
  //     expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRE_IN)), // Hết hạn sau 5 phút
  //   });

  //   // 3. Gửi mã otp đến email

  //   return verificationCode;
  // }
}
