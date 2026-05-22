import type { CartLineItem } from '@/lib/cart/refresh';

export const GUEST_CART_STORAGE_KEY = 'cart';

export function readGuestCart(): CartLineItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as CartLineItem[]) : [];
  } catch {
    return [];
  }
}

export function writeGuestCart(items: CartLineItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items));
}

export function clearGuestCart() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GUEST_CART_STORAGE_KEY);
}
