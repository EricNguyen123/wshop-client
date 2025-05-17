import { MESSAGES } from '@/constant/messages';
import { z } from 'zod';

export const bannerCreateSchema = z.object({
  url: z.string().min(1, { message: MESSAGES.ZOD.BANNER.CREATE.URL.REQUIRED }),
  descriptions: z.string().min(1, { message: MESSAGES.ZOD.BANNER.CREATE.DESCRIPTIONS.REQUIRED }),
  startDate: z.date({ required_error: MESSAGES.ZOD.BANNER.CREATE.START_DATE.REQUIRED }),
  endDate: z.date({ required_error: MESSAGES.ZOD.BANNER.CREATE.END_DATE.REQUIRED }),
  numberOrder: z.coerce.number().int().positive(MESSAGES.ZOD.BANNER.CREATE.NUMBER_ORDER.REQUIRED),
});

export const bannerEditSchema = z.object({
  url: z.string().optional(),
  descriptions: z.string().optional(),
  startDate: z.date({ required_error: MESSAGES.ZOD.BANNER.CREATE.START_DATE.REQUIRED }).optional(),
  endDate: z.date({ required_error: MESSAGES.ZOD.BANNER.CREATE.END_DATE.REQUIRED }).optional(),
  numberOrder: z.coerce.number().int().positive().optional(),
});
