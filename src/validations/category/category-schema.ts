import { MESSAGES } from '@/constant/messages';
import { z } from 'zod';

export const categoryCreateSchema = z.object({
  name: z.string().min(1, { message: MESSAGES.ZOD.CATEGORY.CREATE.NAME.REQUIRED }),
  parentCategoryId: z.string().optional(),
  subCategoryIds: z.array(z.string()).optional(),
});

export const categoryEditSchema = z.object({
  name: z.string().optional(),
  parentCategoryId: z.string().optional(),
  subCategoryIds: z.array(z.string()).optional(),
});
