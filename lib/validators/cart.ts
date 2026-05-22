import { z } from 'zod';

export const cartLineSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().min(0),
  image: z.string(),
  quantity: z.number().int().min(1).max(99),
  seller: z.object({
    name: z.string().min(1),
    shopName: z.string().min(1),
  }),
  size: z.string().optional(),
});

export const cartPutBodySchema = z.object({
  items: z.array(cartLineSchema).max(50),
});
