import { MESSAGES } from '@/constant/messages';
import { z } from 'zod';
import { strongPassword } from '../base-schema';

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().trim(),
    newPassword: strongPassword,
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: MESSAGES.ZOD.AUTH.REGISTER.CONFIRM_PASSWORD.INVALID,
    path: ['confirmPassword'],
  });
