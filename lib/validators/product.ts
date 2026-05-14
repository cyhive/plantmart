import { z } from 'zod';

const productCategories = [
  'Indoor',
  'Outdoor',
  'Medicinal',
  'Pots',
  'Succulents',
  'Other',
] as const;

const imageUrlSchema = z.string().trim().url().max(2048);

export const createProductSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  price: z.coerce.number().positive().max(1_000_000),
  category: z.enum(productCategories),
  stock: z.coerce.number().int().min(0).max(1_000_000),
  images: z.array(imageUrlSchema).min(1).max(10),
});

export const updateProductSchema = createProductSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field is required' },
);

export const productCategoriesList = productCategories;
