// src/shared/constains/pets.constain.ts

export const PET_SPECIES_VALUES = ['DOG', 'CAT', 'OTHER'] as const;
export type PetSpeciesType = (typeof PET_SPECIES_VALUES)[number];

export const PET_GENDER_VALUES = ['MALE', 'FEMALE'] as const;
export type PetGenderType = (typeof PET_GENDER_VALUES)[number];
