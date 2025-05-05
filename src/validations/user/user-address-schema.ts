import { z } from 'zod';

export const userAddressSchema = z.object({
  prefecture: z.string().trim().or(z.literal('')).optional(),
  city: z.string().trim().or(z.literal('')).optional(),
  street: z.string().trim().or(z.literal('')).optional(),
  building: z.string().trim().or(z.literal('')).optional(),
  zipcode: z.string().trim().or(z.literal('')).optional(),
});
