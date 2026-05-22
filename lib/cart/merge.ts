import { normalizeCartProductId } from '@/lib/cart/product-id';
import type { CartLineItem } from '@/lib/cart/refresh';

/** Combine guest and server carts; quantities add for the same product. */
export function mergeCartLines(local: CartLineItem[], remote: CartLineItem[]): CartLineItem[] {
  const map = new Map<string, CartLineItem>();

  for (const item of remote) {
    const id = normalizeCartProductId(item.id);
    map.set(id, { ...item, id });
  }

  for (const item of local) {
    const id = normalizeCartProductId(item.id);
    const existing = map.get(id);
    if (existing) {
      map.set(id, {
        ...existing,
        quantity: existing.quantity + item.quantity,
      });
    } else {
      map.set(id, { ...item, id });
    }
  }

  return Array.from(map.values());
}
