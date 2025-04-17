import { MESSAGES } from '@/constant/messages';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, MESSAGES.ZOD.AUTH.LOGIN.EMAIL.REQUIRED)
    .email(MESSAGES.ZOD.AUTH.LOGIN.EMAIL.INVALID),
  password: z.string().trim().min(1, MESSAGES.ZOD.AUTH.LOGIN.PASSWORD.REQUIRED),
});
