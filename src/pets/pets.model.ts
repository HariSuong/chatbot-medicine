// src/pets/pets.model.ts

import {
  PET_GENDER_VALUES,
  PET_SPECIES_VALUES,
} from 'src/shared/constains/pets.constain';
import { z } from 'zod';

// Schema cơ bản cho một Thú cưng, khớp với Prisma Model
export const PetSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  species: z.enum(PET_SPECIES_VALUES), // Dùng z.enum với hằng số
  breed: z.string().nullable(),
  gender: z.enum(PET_GENDER_VALUES), // Dùng z.enum với hằng số
  birthDate: z.coerce.date().nullable(),
  avatarUrl: z.string().url().nullable(),
  notes: z.string().nullable(),
  ownerId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// --- Schemas cho Request Body ---
export const CreatePetBodySchema = PetSchema.pick({
  name: true,
  species: true,
  breed: true,
  gender: true,
  birthDate: true,
  avatarUrl: true,
  notes: true,
}).extend({
  // Ghi đè lại để các trường optional thực sự là optional
  breed: z.string().optional(),
  birthDate: z.coerce.date().optional(),
  avatarUrl: z.string().url().optional(),
  notes: z.string().optional(),
});

export const UpdatePetBodySchema = CreatePetBodySchema.partial(); // .partial() biến tất cả các trường thành optional

// --- Schema cho Response ---
export const PetResSchema = PetSchema;

// --- Suy ra các Type ---
export type PetType = z.infer<typeof PetSchema>;
export type CreatePetBodyType = z.infer<typeof CreatePetBodySchema>;
export type UpdatePetBodyType = z.infer<typeof UpdatePetBodySchema>;
export type PetResType = z.infer<typeof PetResSchema>;
