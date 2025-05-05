import { DEFAULT_LENGTH_OTP } from '@/constant';
import { MESSAGES } from '@/constant/messages';
import { z } from 'zod';

export const otpSchema = z.object({
  email: z.string().trim().email(MESSAGES.ZOD.AUTH.REGISTER.EMAIL.INVALID),
});

export const verifyOtpSchema = z.object({
  email: z.string().trim().email(MESSAGES.ZOD.AUTH.REGISTER.EMAIL.INVALID),
  otp: z.string().trim().min(DEFAULT_LENGTH_OTP),
});
