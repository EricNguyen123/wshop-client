import { VALIDATION_CONFIG } from '@/constant';
import { MESSAGES } from '@/constant/messages';
import { z } from 'zod';

export const userInfoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(VALIDATION_CONFIG.MIN_LENGTH_STRING, MESSAGES.ZOD.AUTH.REGISTER.NAME.SHORT),

  phone: z.string().trim().optional(),
});
