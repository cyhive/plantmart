/** Shown when a specimen has no uploaded image or URL. */
export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1416879595882-3373a0480a5f?auto=format&fit=crop&q=80&w=800';

export function resolveProductImages(images?: string[]): string[] {
  const trimmed = (images ?? []).map((u) => u.trim()).filter(Boolean);
  return trimmed.length > 0 ? trimmed : [DEFAULT_PRODUCT_IMAGE];
}
