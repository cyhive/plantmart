import { z } from 'zod';

const productCategories = [
  'Indoor',
  'Outdoor',
  'Medicinal',
  'Pots',
  'Succulents',
  'Other',
] as const;

function isValidProductImage(value: string): boolean {
  if (value.startsWith('/uploads/products/')) return true;
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

const imageUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .refine(isValidProductImage, { message: 'Invalid image URL' });

export const createProductSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  price: z.coerce.number().positive().max(1_000_000),
  category: z.enum(productCategories),
  stock: z.coerce.number().int().min(0).max(1_000_000),
  images: z.array(imageUrlSchema).max(10).optional().default([]),
});

export const updateProductSchema = createProductSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field is required' },
);

export const productCategoriesList = productCategories;
