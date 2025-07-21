// initialScript/index.ts

/**
 * Công dụng của file này
 * - Tạo các role mặc định trong hệ thống
 * - Tạo người dùng admin mặc định
 * - Chạy một lần duy nhất khi khởi tạo hệ thống
 */

import envConfig from 'src/shared/config';
import { ROLE_NAME_VALUES } from 'src/shared/constains/role.constain'; // <-- Sử dụng ROLE_NAME_VALUES
import { HasingService } from 'src/shared/services/hasing.service';
import { PrismaService } from 'src/shared/services/prisma.service';

// Tạo các instance của PrismaService và HasingService
// Lưu ý: Trong môi trường NestJS thông thường, bạn sẽ inject các service này.
// Nhưng đây là một script độc lập chạy bên ngoài NestJS context, nên chúng ta khởi tạo thủ công.
const prisma = new PrismaService();
const hasingService = new HasingService();

const main = async () => {
  console.log('Bắt đầu chạy script khởi tạo dữ liệu...');

  // Kiểm tra xem các vai trò đã tồn tại trong database chưa
  const roleCount = await prisma.role.count();
  console.log(`Số lượng vai trò hiện có: ${roleCount}`);
  if (roleCount > 0) {
    console.warn(
      'Các vai trò đã tồn tại trong database. Bỏ qua việc tạo vai trò.',
    );
    return { createdRoleCount: 0, adminUser: null };
  }

  // Tạo các vai trò nếu chúng chưa tồn tại
  const rolesData = [
    {
      name: ROLE_NAME_VALUES.ADMIN,
      description: 'Quản trị viên hệ thống',
      isActive: true,
    }, // <-- Thêm isActive
    {
      name: ROLE_NAME_VALUES.USER,
      description: 'Người dùng thông thường',
      isActive: true,
    }, // <-- Thêm isActive
  ];
  const roles = await prisma.role.createMany({
    data: rolesData,
  });
  console.log(`Đã tạo ${roles.count} vai trò.`);

  // Lấy vai trò admin
  const adminRole = await prisma.role.findFirstOrThrow({
    where: { name: ROLE_NAME_VALUES.ADMIN }, // <-- Sử dụng ROLE_NAME_VALUES
  });
  console.log(`Đã tìm thấy vai trò Admin với ID: ${adminRole.id}`);

  // Mã hóa mật khẩu admin
  const hashedPassword = await hasingService.hash(envConfig.ADMIN_PASSWORD);
  console.log('Đã mã hóa mật khẩu admin.');

  // Tạo người dùng admin
  const adminUser = await prisma.user.create({
    data: {
      name: envConfig.ADMIN_NAME,
      email: envConfig.ADMIN_EMAIL,
      phoneNumber: envConfig.ADMIN_PHONE_NUMBER,
      password: hashedPassword,
      roleId: adminRole.id, // ID là String
      status: 'ACTIVE', // Đặt trạng thái ACTIVE cho admin
    },
  });
  console.log(`Đã tạo người dùng Admin: ${adminUser.email}`);

  return {
    createdRoleCount: roles.count,
    adminUser,
  };
};

main()
  .then(({ adminUser, createdRoleCount }) => {
    if (createdRoleCount > 0) {
      console.log(
        `Khởi tạo database thành công: Đã tạo ${createdRoleCount} vai trò.`,
      );
      console.log(
        `Người dùng Admin đã được tạo: ${adminUser?.name} (${adminUser?.email})`,
      );
    } else {
      console.log('Database đã có dữ liệu vai trò, không cần khởi tạo lại.');
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('Lỗi khi khởi tạo vai trò hoặc người dùng admin:', error);
    process.exit(1);
  });
