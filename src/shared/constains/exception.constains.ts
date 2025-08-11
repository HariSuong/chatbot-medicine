// src/shared/constains/exception.constains.ts

import {
  UnauthorizedException,
  UnprocessableEntityException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

// --- Lỗi liên quan đến Mã xác thực (OTP) ---
export const InvalidOTPException = new UnprocessableEntityException([
  {
    message: 'Mã OTP không hợp lệ. Vui lòng kiểm tra lại.',
    path: 'code',
  },
]);

export const OTPExpiredException = new UnprocessableEntityException([
  {
    message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.',
    path: 'code',
  },
]);

export const FailedToSendOTPException = new UnprocessableEntityException([
  {
    message: 'Không thể gửi mã OTP. Vui lòng thử lại sau.',
    path: 'code',
  },
]);

// --- Lỗi liên quan đến Email ---
// Lý do đổi sang ConflictException: HTTP 409 Conflict là mã trạng thái thích hợp hơn
// khi một yêu cầu không thể hoàn thành do xung đột với trạng thái hiện tại của tài nguyên,
// ví dụ như tạo một tài nguyên (user) mà đã tồn tại (email).

export const EmailAlreadyExistsException = new ConflictException([
  {
    message: 'Địa chỉ email đã được đăng ký. Vui lòng sử dụng email khác.',
    path: 'email',
  },
]);

export const EmailNotFoundException = new NotFoundException([
  {
    message: 'Địa chỉ email không tồn tại trong hệ thống.',
    path: 'email',
  },
]);

// --- Lỗi liên quan đến Mật khẩu ---
export const InvalidPasswordException = new UnauthorizedException([
  {
    message: 'Mật khẩu không chính xác.',
    path: 'password',
  },
]);
// Lưu ý: Tùy ngữ cảnh, có thể là Unauthorized (nếu liên quan đến đăng nhập sai)
// hoặc UnprocessableEntity (nếu mật khẩu không đáp ứng quy tắc khi đăng ký/đổi)

// --- Lỗi liên quan đến Xác thực (Authentication) & Quyền (Authorization) ---
export const RefreshTokenAlreadyUsedException = new UnauthorizedException(
  'Refresh token đã được sử dụng hoặc không hợp lệ.',
);

export const UnauthorizedAccessException = new UnauthorizedException(
  'Bạn không có quyền truy cập tài nguyên này. Vui lòng đăng nhập.',
);

export const ForbiddenResourceException = new ForbiddenException(
  'Bạn không có đủ quyền để thực hiện hành động này.',
);

// --- Lỗi liên quan đến Google Auth ---
// Đối với lỗi nội bộ không phải HTTP (ví dụ: từ một thư viện bên thứ 3), bạn có thể
// tạo một lớp lỗi tùy chỉnh hoặc chỉ đơn giản là ném một Error thông thường
// và sau đó bắt nó trong một Global Exception Filter để chuyển đổi thành HTTP 500.
// Tuy nhiên, nếu bạn muốn nó là một HttpException ngay từ đầu:
export const GoogleUserInfoError = new InternalServerErrorException(
  'Không thể lấy thông tin người dùng từ Google.',
);

// --- Lỗi liên quan đến tài nguyên (Resource) ---
export const ConversationAccessException = new ForbiddenException(
  'Bạn không có quyền truy cập cuộc trò chuyện này.',
);

export const PetNotFoundException = new NotFoundException( // <-- THÊM MỚI
  'Không tìm thấy hồ sơ thú cưng.',
);

// --- Ví dụ thêm một số lỗi phổ biến khác ---
export const UserNotFoundException = new NotFoundException([
  {
    message: 'Người dùng không tồn tại.',
    path: 'userId',
  },
]);

export const MissingRequiredFieldsException = new BadRequestException([
  {
    message: 'Thiếu các trường bắt buộc trong yêu cầu.',
    path: '',
  },
]);
