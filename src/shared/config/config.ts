// src/shared/config/config.ts

import z from 'zod';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

// Đọc file .env
config({
  path: '.env',
});

if (!fs.existsSync(path.resolve('.env'))) {
  console.log(
    'Không tìm thấy file .env, vui lòng tạo file này với các biến môi trường cần thiết.',
  );
  process.exit(1);
}

const configSchema = z.object({
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  SECRET_API_KEY: z.string(),
  ADMIN_NAME: z.string(),
  ADMIN_PASSWORD: z.string(),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PHONE_NUMBER: z.string().regex(/^\d{10,11}$/, {
    message: 'Số điện thoại phải có 10 hoặc 11 chữ số',
  }),
  OTP_EXPIRE_IN: z.string().optional().default('5m'), // Thêm trường OTP_EXPIRE_IN với giá trị mặc định là '5m'
  SENDGRID_API_KEY: z.string(),
  MAILER_DEFAULT_FROM_EMAIL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),
  GOOGLE_CLIENT_REDIRECT_URI: z.string(),
  GOOGLE_API_KEY: z.string(),
});

// Chuyển đổi process.env thành instance của ConfigSchema
const configServer = configSchema.safeParse(process.env);

if (!configServer.success) {
  console.error('Các giá trị khai báo trong file .env không hợp lệ:');
  console.error(configServer.error);
  process.exit(1);
}

const envConfig = configServer.data;
export default envConfig;
