// initialScript/index.ts

/**
 * Công dụng của file này:
 * - Đảm bảo các vai trò mặc định (ADMIN, USER) tồn tại.
 * - Đảm bảo người dùng admin mặc định tồn tại.
 * - Script này có thể chạy lại nhiều lần một cách an toàn.
 */

import envConfig from 'src/shared/config/config';
import { ROLE_NAME_VALUES } from 'src/shared/constains/role.constain';
import { HasingService } from 'src/shared/services/hasing.service';
import { PrismaService } from 'src/shared/services/prisma.service';

const prisma = new PrismaService();
const hasingService = new HasingService();

const main = async () => {
  console.log('Bắt đầu chạy script khởi tạo dữ liệu...');

  // --- 1. Đảm bảo "Công ty Mặc định" tồn tại ---
  // Thay thế upsert bằng logic findFirst + create để tránh lỗi
  console.log('Đang kiểm tra/tạo "Công ty Mặc định"...');
  let defaultCompany = await prisma.company.findFirst({
    where: { name: 'Default Company' },
  });

  if (!defaultCompany) {
    console.log('"Công ty Mặc định" chưa tồn tại, đang tạo mới...');
    defaultCompany = await prisma.company.create({
      data: {
        name: 'Default Company',
      },
    });
  }
  console.log('✅ Công ty Mặc định đã sẵn sàng.');

  // Dùng `upsert` để tạo role nếu chưa có, hoặc bỏ qua nếu đã có.
  // Điều này an toàn hơn là kiểm tra `count`.
  console.log('Đang đảm bảo các vai trò cơ bản tồn tại...');
  const adminRole = await prisma.role.upsert({
    where: { name: ROLE_NAME_VALUES.ADMIN },
    update: {},
    create: {
      name: ROLE_NAME_VALUES.ADMIN,
      description: 'Quản trị viên hệ thống',
    },
  });

  await prisma.role.upsert({
    where: { name: ROLE_NAME_VALUES.USER },
    update: {},
    create: {
      name: ROLE_NAME_VALUES.USER,
      description: 'Người dùng thông thường',
    },
  });

  // Thêm logic upsert cho DOCTOR
  await prisma.role.upsert({
    where: { name: ROLE_NAME_VALUES.DOCTOR },
    update: {},
    create: {
      name: ROLE_NAME_VALUES.DOCTOR,
      description: 'Bác sĩ/Chuyên gia tư vấn',
    },
  });

  console.log('✅ Các vai trò cơ bản (ADMIN, USER, DOCTOR) đã sẵn sàng.');

  // --- Cũng kiểm tra sự tồn tại của admin một cách độc lập ---
  console.log('Đang kiểm tra người dùng admin...');
  const existingAdmin = await prisma.user.findUnique({
    where: { email: envConfig.ADMIN_EMAIL },
  });

  if (existingAdmin) {
    console.warn('✅ Người dùng Admin đã tồn tại, bỏ qua việc tạo mới.');
  } else {
    // Chỉ tạo admin nếu chưa có
    const hashedPassword = await hasingService.hash(envConfig.ADMIN_PASSWORD);
    const adminUser = await prisma.user.create({
      data: {
        name: envConfig.ADMIN_NAME,
        email: envConfig.ADMIN_EMAIL,
        phoneNumber: envConfig.ADMIN_PHONE_NUMBER,
        password: hashedPassword,
        roleId: adminRole.id, // Dùng ID của vai trò admin vừa được đảm bảo ở trên
        status: 'ACTIVE',
        companyId: defaultCompany.id, // <-- THÊM MỚI: Gán admin vào công ty mặc định
      },
    });
    console.log(`✅ Đã tạo người dùng Admin thành công: ${adminUser.email}`);
  }
};

// Gói lời gọi trong một hàm async và gọi nó ngay lập tức (IIFE)
// Đây là cách làm đúng chuẩn để xử lý async ở top-level
// Thêm "void" ở đầu để tắt cảnh báo no-floating-promises
void (async () => {
  try {
    await main();
    console.log('✅ Script khởi tạo đã chạy thành công.');
  } catch (error) {
    console.error('❌ Lỗi khi chạy script khởi tạo:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('Đã ngắt kết nối Prisma.');
  }
})();
