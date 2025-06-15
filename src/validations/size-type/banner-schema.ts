import { MESSAGES } from '@/constant/messages';
import { z } from 'zod';

export const sizeTypeSchema = z.object({
  name: z.string().min(1, { message: MESSAGES.ZOD.SIZE_TYPE.CREATE.NAME.REQUIRED }),
  sizeCode: z.string().min(1, { message: MESSAGES.ZOD.SIZE_TYPE.CREATE.SIZE_CODE.REQUIRED }),
  sizeType: z.string().min(1, { message: MESSAGES.ZOD.SIZE_TYPE.CREATE.SIZE_TYPE.REQUIRED }),
});
