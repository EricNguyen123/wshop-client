import { MESSAGES } from '@/constant/messages';
import { z } from 'zod';
import { strongPassword } from '../base-schema';

export const forgotPasswordSchema = z
  .object({
    password: strongPassword,
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: MESSAGES.ZOD.AUTH.REGISTER.CONFIRM_PASSWORD.INVALID,
    path: ['confirmPassword'],
  });
