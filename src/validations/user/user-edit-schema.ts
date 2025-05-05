import { StatusEnum, ValidRolesEnum } from '@/common/enum';
import { VALIDATION_CONFIG } from '@/constant';
import { MESSAGES } from '@/constant/messages';
import { z } from 'zod';

export const userEditSchema = z.object({
  name: z
    .string()
    .trim()
    .min(VALIDATION_CONFIG.MIN_LENGTH_STRING, MESSAGES.ZOD.AUTH.REGISTER.NAME.SHORT),
  phone: z.string().trim().optional(),
  role: z.nativeEnum(ValidRolesEnum).optional(),
  status: z.nativeEnum(StatusEnum).optional(),
  prefecture: z.string().trim().or(z.literal('')).optional(),
  city: z.string().trim().or(z.literal('')).optional(),
  street: z.string().trim().or(z.literal('')).optional(),
  building: z.string().trim().or(z.literal('')).optional(),
  zipcode: z.string().trim().or(z.literal('')).optional(),
});
