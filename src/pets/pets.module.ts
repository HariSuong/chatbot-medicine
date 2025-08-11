import { Module } from '@nestjs/common';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { PetsRepository } from 'src/pets/pets.repo';

@Module({
  controllers: [PetsController],
  providers: [PetsService, PetsRepository],
})
export class PetsModule {}
