import { z } from 'zod';

export const registerBodySchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(255),
    password: z.string().min(8).max(128),
    role: z.enum(['buyer', 'seller']),
    shopName: z.string().trim().max(200).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === 'seller' && !data.shopName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Shop name is required for sellers',
        path: ['shopName'],
      });
    }
  });

export const loginBodySchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const bootstrapAdminSchema = z.object({
  secret: z.string().min(1),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128),
});
