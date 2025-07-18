// src/prisma/prisma.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      // Tùy chọn cấu hình logging cho Prisma
      // 'query': Log tất cả các câu truy vấn SQL được gửi đến database
      // 'info': Log thông tin chung của Prisma (ví dụ: kết nối, ngắt kết nối)
      // 'warn': Log các cảnh báo
      // 'error': Log các lỗi
      log: ['query', 'info', 'warn', 'error'], // Nên bật 'query' trong môi trường dev để dễ debug
    });
  }

  async onModuleInit() {
    // Phương thức này được gọi khi module chứa PrismaService được khởi tạo.
    // Chúng ta kết nối với database tại đây để đảm bảo Prisma sẵn sàng trước khi ứng dụng bắt đầu xử lý request.
    await this.$connect();
    console.log('Prisma connected to database.'); // Thêm log để biết đã kết nối thành công
  }

  // Tùy chọn: Thêm hook onModuleDestroy để ngắt kết nối an toàn khi ứng dụng tắt
  // Nếu không, có thể giữ kết nối mở và gây rò rỉ tài nguyên trong một số trường hợp.
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Prisma disconnected from database.'); // Thêm log để biết đã ngắt kết nối
  }
}
