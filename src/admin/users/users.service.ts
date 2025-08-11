// src/admin/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repo';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  /**
   * Logic để lấy tất cả người dùng.
   */
  findAll() {
    return this.usersRepo.findAll();
  }
}
