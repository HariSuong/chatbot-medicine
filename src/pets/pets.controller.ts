// src/pets/pets.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { AccessTokenPayload } from 'src/shared/types/jwt.type';

import { PetsService } from './pets.service';
import { CreatePetDTO, PetDTO, UpdatePetDTO } from 'src/pets/pets.dto';

@Controller('pets')
// Toàn bộ controller này mặc định được bảo vệ bởi AuthenticationGuard
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  /**
   * API: POST /pets
   * Tạo một hồ sơ thú cưng mới cho người dùng đang đăng nhập.
   */
  @Post()
  @ZodSerializerDto(PetDTO)
  create(@CurrentUser() user: AccessTokenPayload, @Body() body: CreatePetDTO) {
    return this.petsService.create(user.userId, body);
  }

  /**
   * API: GET /pets/me
   * Lấy danh sách thú cưng của người dùng đang đăng nhập.
   */
  @Get('me')
  @ZodSerializerDto(PetDTO)
  findByUserId(@CurrentUser() user: AccessTokenPayload) {
    return this.petsService.findByUserId(user.userId);
  }

  /**
   * API: PATCH /pets/:id
   * Cập nhật thông tin của một thú cưng.
   */
  @Patch(':id')
  @ZodSerializerDto(PetDTO)
  update(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id', ParseUUIDPipe) petId: string,
    @Body() body: UpdatePetDTO,
  ) {
    return this.petsService.update(user.userId, petId, body);
  }

  /**
   * API: DELETE /pets/:id
   * Xóa một hồ sơ thú cưng.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Trả về 204 No Content khi xóa thành công
  delete(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id', ParseUUIDPipe) petId: string,
  ) {
    return this.petsService.delete(user.userId, petId);
  }
}
