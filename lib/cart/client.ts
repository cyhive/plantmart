import type { CartLineItem } from '@/lib/cart/refresh';

export async function fetchUserCart(): Promise<CartLineItem[]> {
  const res = await fetch('/api/cart', { credentials: 'include' });
  if (!res.ok) {
    throw new Error('Failed to load cart');
  }
  const data = (await res.json()) as { items?: CartLineItem[] };
  return data.items ?? [];
}

export async function saveUserCart(items: CartLineItem[]): Promise<CartLineItem[]> {
  const res = await fetch('/api/cart', {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) {
    throw new Error('Failed to save cart');
  }
  const data = (await res.json()) as { items?: CartLineItem[] };
  return data.items ?? items;
}
