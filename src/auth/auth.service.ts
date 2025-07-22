import { Injectable } from '@nestjs/common';

import { addMilliseconds } from 'date-fns';
import ms from 'ms';

import { RegisterBodyDto } from 'src/auth/auth.dto';
import { ForgotPasswordBodyType, SendOTPBodyType } from 'src/auth/auth.model';
import { AuthRepository } from 'src/auth/auth.repo';
import { RoleService } from 'src/auth/role.service';
import envConfig from 'src/shared/config/config';
import { VERIFICATION_CODE_TYPE_VALUES } from 'src/shared/constains/auth.constains';
import {
  EmailAlreadyExistsException,
  EmailNotFoundException,
  FailedToSendOTPException,
  InvalidOTPException,
  OTPExpiredException,
} from 'src/shared/constains/exception.constains';
import { generateOTP, isUniqueConstraintPrismaError } from 'src/shared/helpers';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo';
import { EmailService } from 'src/shared/services/email.service';
import { HasingService } from 'src/shared/services/hasing.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly hasingService: HasingService,
    private readonly roleService: RoleService,
    private readonly authRepository: AuthRepository, // Thêm AuthRepository vào constructor
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly emailService: EmailService, // <-- Inject EmailService
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

      console.log('verificationCode', verificationCode);
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

  async sendOTP(body: SendOTPBodyType) {
    // 1. Kiểm tra xem email đã tồn tại trong database hay chưa
    const user = await this.sharedUserRepository.findUnique({
      email: body.email,
    });
    // Logic kiểm tra sự tồn tại của email tùy thuộc vào loại OTP
    if (body.type === VERIFICATION_CODE_TYPE_VALUES.REGISTER) {
      if (user) throw EmailAlreadyExistsException; // Email đã tồn tại khi đăng ký
    } else if (body.type === VERIFICATION_CODE_TYPE_VALUES.FORGOT_PASSWORD) {
      if (!user) throw EmailNotFoundException; // Email không tồn tại khi quên mật khẩu
    }

    // 2. Tạo mã otp
    const code = generateOTP();

    await this.authRepository.createVerificationCode({
      email: body.email,
      code,
      type: body.type,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRE_IN)), // Hết hạn sau 5 phút
    });

    // 3. Gửi mã otp đến email
    try {
      // Gửi email OTP
      await this.emailService.sendOtpVerificationEmail(body.email, code);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      // Ném lỗi cụ thể khi gửi email thất bại
      throw FailedToSendOTPException;
    }

    // Trả về kết quả thành công
    return {
      message:
        'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến.',
    };
  }

  // --- HÀM MỚI: Forgot Password (Xác minh OTP và đặt lại mật khẩu) ---
  async forgotPassword(body: ForgotPasswordBodyType) {
    console.log('body', body);

    // 1. Tìm và xác minh mã OTP
    const verificationCode =
      await this.authRepository.findUniqueVerificationCode({
        email: body.email,
        code: body.code,
        type: VERIFICATION_CODE_TYPE_VALUES.FORGOT_PASSWORD, // <-- Sử dụng loại FORGOT_PASSWORD
      });

    console.log('verificationCode', verificationCode);

    if (!verificationCode) {
      throw InvalidOTPException;
    }

    if (verificationCode.expiresAt < new Date()) {
      throw OTPExpiredException;
    }

    // 2. Hash mật khẩu mới
    const hashedPassword = await this.hasingService.hash(body.password);

    // 3. Cập nhật mật khẩu người dùng
    await this.sharedUserRepository.updateUserPassword({
      // <-- Tạo hàm này trong shared-user.repo
      email: body.email,
      password: hashedPassword,
    });

    // 4. Xóa mã OTP sau khi sử dụng thành công (tùy chọn nhưng nên làm)
    await this.authRepository.deleteVerificationCode(verificationCode.id); // <-- Tạo hàm này trong auth.repo

    return {
      message: 'Mật khẩu của bạn đã được đặt lại thành công.',
    };
  }
}
