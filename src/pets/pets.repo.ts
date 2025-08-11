// src/pets/pets.repo.ts

import { Injectable } from '@nestjs/common';
import {
  CreatePetBodyType,
  PetType,
  UpdatePetBodyType,
} from 'src/pets/pets.model';
import { PrismaService } from 'src/shared/services/prisma.service';

/**
 * PetsRepository chịu trách nhiệm cho tất cả các tương tác với database
 * liên quan đến hồ sơ thú cưng (Pet).
 * Nó trừu tượng hóa các truy vấn Prisma khỏi business logic trong Service.
 */
@Injectable()
export class PetsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tạo một hồ sơ thú cưng mới và liên kết nó với một người dùng.
   * @param userId ID của người dùng sở hữu thú cưng.
   * @param data Dữ liệu chi tiết của thú cưng cần tạo.
   * @returns Promise<PetType> - Trả về hồ sơ thú cưng vừa được tạo.
   */
  async createPet(userId: string, data: CreatePetBodyType): Promise<PetType> {
    const pet = await this.prisma.pet.create({
      data: {
        ...data,
        ownerId: userId, // Gán ID của chủ sở hữu
      },
    });
    return pet;
  }

  /**
   * Tìm tất cả các hồ sơ thú cưng thuộc sở hữu của một người dùng.
   * @param userId ID của người dùng cần tìm thú cưng.
   * @returns Promise<PetType[]> - Trả về một mảng các hồ sơ thú cưng.
   */
  async findPetsByUserId(userId: string): Promise<PetType[]> {
    const pets = await this.prisma.pet.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });
    return pets;
  }

  /**
   * Tìm một hồ sơ thú cưng duy nhất bằng ID của nó.
   * @param petId ID của thú cưng cần tìm.
   * @returns Promise<PetType | null> - Trả về hồ sơ thú cưng nếu tìm thấy, ngược lại là null.
   */
  async findPetById(petId: string): Promise<PetType | null> {
    const pet = await this.prisma.pet.findUnique({
      where: { id: petId },
    });
    return pet;
  }

  /**
   * Cập nhật thông tin cho một hồ sơ thú cưng.
   * @param petId ID của thú cưng cần cập nhật.
   * @param data Dữ liệu mới cần cập nhật.
   * @returns Promise<PetType> - Trả về hồ sơ thú cưng sau khi đã được cập nhật.
   */
  async updatePet(petId: string, data: UpdatePetBodyType): Promise<PetType> {
    const pet = await this.prisma.pet.update({
      where: { id: petId },
      data,
    });
    return pet;
  }

  /**
   * Xóa một hồ sơ thú cưng khỏi database.
   * @param petId ID của thú cưng cần xóa.
   * @returns Promise<void>
   */
  async deletePet(petId: string): Promise<void> {
    await this.prisma.pet.delete({
      where: { id: petId },
    });
  }
}
