// src/admin/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repo';
import { UpdateUserBodyType } from 'src/admin/users/users.model';
import {
  ForbiddenResourceException,
  UserNotFoundException,
} from 'src/shared/constains/exception.constains';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  /**
   * Logic để lấy tất cả người dùng.
   */
  findAll(companyId: string) {
    return this.usersRepo.findAll(companyId);
  }

  async update(userIdToUpdate: string, data: UpdateUserBodyType) {
    const user = await this.usersRepo.findById(userIdToUpdate);
    if (!user) {
      throw UserNotFoundException;
    }
    return this.usersRepo.update(userIdToUpdate, data);
  }

  async delete(userIdToDelete: string, currentAdminId: string) {
    // Logic nghiệp vụ quan trọng: Ngăn admin tự xóa chính mình
    if (userIdToDelete === currentAdminId) {
      throw ForbiddenResourceException;
    }

    const user = await this.usersRepo.findById(userIdToDelete);
    if (!user) {
      throw UserNotFoundException;
    }

    await this.usersRepo.delete(userIdToDelete);
    return { message: 'Đã xóa người dùng thành công.' };
  }
}
