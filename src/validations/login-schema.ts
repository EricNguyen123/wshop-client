import { messages } from '@/utils/messages';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, messages.form.login.email.required)
    .email(messages.form.login.email.invalid),
  password: z.string().trim().min(1, messages.form.login.password.required),
});
