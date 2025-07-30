// src/shared/service/hasing.service.ts
import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

// Số vòng salt (salt rounds) càng cao thì mật khẩu càng an toàn,
// nhưng cũng tốn nhiều tài nguyên CPU hơn.
// 10 là một giá trị phổ biến và an toàn cho hầu hết các ứng dụng.
const saltRounds = 10;

@Injectable()
export class HasingService {
  /**
   * Mã hóa một chuỗi (ví dụ: mật khẩu) bằng thuật toán bcrypt.
   *
   * @param value Chuỗi cần mã hóa.
   * @returns Promise<string> - Chuỗi đã được mã hóa.
   */
  hash(value: string): Promise<string> {
    // Hàm hash của bcrypt là bất đồng bộ và trả về một Promise.
    // Chúng ta sử dụng async/await để xử lý Promise này một cách rõ ràng.
    return hash(value, saltRounds);
  }

  /**
   * So sánh một chuỗi (ví dụ: mật khẩu người dùng nhập vào)
   * với một chuỗi đã được mã hóa (ví dụ: mật khẩu lưu trong DB).
   *
   * @param value Chuỗi cần so sánh (mật khẩu dạng plaintext).
   * @param hashedValue Chuỗi đã được mã hóa để so sánh với.
   * @returns Promise<boolean> - True nếu khớp, false nếu không khớp.
   */
  compare(value: string, hashedValue: string): Promise<boolean> {
    // Hàm compare của bcrypt cũng là bất đồng bộ và trả về một Promise.
    return compare(value, hashedValue);
  }
}
