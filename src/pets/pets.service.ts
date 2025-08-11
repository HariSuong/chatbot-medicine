// src/pets/pets.service.ts

import { Injectable } from '@nestjs/common';
import {
  ForbiddenResourceException,
  PetNotFoundException,
} from 'src/shared/constains/exception.constains';
import { CreatePetBodyType, UpdatePetBodyType } from './pets.model';
import { PetsRepository } from './pets.repo';

@Injectable()
export class PetsService {
  constructor(private readonly petsRepo: PetsRepository) {}

  /**
   * Tạo hồ sơ thú cưng mới cho người dùng đang đăng nhập.
   */
  create(userId: string, data: CreatePetBodyType) {
    return this.petsRepo.createPet(userId, data);
  }

  /**
   * Lấy danh sách thú cưng của người dùng đang đăng nhập.
   */
  findByUserId(userId: string) {
    return this.petsRepo.findPetsByUserId(userId);
  }

  /**
   * Cập nhật thông tin của một thú cưng.
   * Quan trọng: Kiểm tra xem người dùng có phải là chủ của thú cưng này không.
   */
  async update(userId: string, petId: string, data: UpdatePetBodyType) {
    // 1. Tìm hồ sơ thú cưng
    const pet = await this.petsRepo.findPetById(petId);

    // 2. Kiểm tra xem thú cưng có tồn tại không
    if (!pet) {
      throw PetNotFoundException;
    }

    // 3. Kiểm tra xem người dùng có phải là chủ không
    if (pet.ownerId !== userId) {
      throw ForbiddenResourceException;
    }

    // 4. Nếu mọi thứ hợp lệ, tiến hành cập nhật
    return this.petsRepo.updatePet(petId, data);
  }

  /**
   * Xóa một hồ sơ thú cưng.
   * Tương tự như update, cũng cần kiểm tra quyền sở hữu.
   */
  async delete(userId: string, petId: string) {
    const pet = await this.petsRepo.findPetById(petId);

    if (!pet) {
      throw PetNotFoundException;
    }

    if (pet.ownerId !== userId) {
      throw ForbiddenResourceException;
    }

    await this.petsRepo.deletePet(petId);
    return { message: 'Đã xóa hồ sơ thú cưng thành công.' };
  }
}
