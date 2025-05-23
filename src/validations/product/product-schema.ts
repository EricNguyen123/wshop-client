import { MESSAGES } from '@/constant/messages';
import { z } from 'zod';

export const productCreateSchema = z.object({
  name: z.string().min(1, { message: MESSAGES.ZOD.PRODUCT.CREATE.NAME.REQUIRED }),
  code: z.string().min(1, { message: MESSAGES.ZOD.PRODUCT.CREATE.CODE.REQUIRED }),
  price: z.coerce.number().min(0, { message: MESSAGES.ZOD.PRODUCT.CREATE.PRICE.REQUIRED }),
  quantity: z.coerce
    .number()
    .int()
    .min(0, { message: MESSAGES.ZOD.PRODUCT.CREATE.QUANTITY.REQUIRED }),
  quantityAlert: z.coerce
    .number()
    .int()
    .min(0, { message: MESSAGES.ZOD.PRODUCT.CREATE.QUANTITY_ALERT.REQUIRED }),
  orderUnit: z.coerce
    .number()
    .int()
    .min(0, { message: MESSAGES.ZOD.PRODUCT.CREATE.ORDER_UNIT.REQUIRED }),
  description: z.string().optional(),
  status: z.coerce.number().int().optional(),
  multiplicationRate: z.coerce
    .number()
    .min(0, { message: MESSAGES.ZOD.PRODUCT.CREATE.MULTIPLICATION_RATE.REQUIRED }),
  discount: z.coerce.number().optional(),
});

export const productEditSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  price: z.coerce.number().optional(),
  quantity: z.coerce.number().int().optional(),
  quantityAlert: z.coerce.number().int().optional(),
  orderUnit: z.coerce.number().int().optional(),
  description: z.string().optional(),
  status: z.coerce.number().int().optional(),
  multiplicationRate: z.coerce.number().optional(),
  discount: z.coerce.number().optional(),
  mediaIds: z.array(z.string()).optional(),
});
