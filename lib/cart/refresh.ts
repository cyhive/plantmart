import { normalizeCartProductId } from '@/lib/cart/product-id';
import { resolveProductImages } from '@/lib/products/defaults';

export interface CartLineItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  stock?: number;
  seller: { name: string; shopName: string };
  size?: string;
}

export function cartLinesEqual(a: CartLineItem[], b: CartLineItem[]): boolean {
  if (a.length !== b.length) return false;
  return a.every(
    (line, i) =>
      line.id === b[i].id &&
      line.name === b[i].name &&
      line.price === b[i].price &&
      line.image === b[i].image &&
      line.quantity === b[i].quantity &&
      line.seller.shopName === b[i].seller.shopName,
  );
}

export async function refreshCartLinesFromCatalog(items: CartLineItem[]): Promise<CartLineItem[]> {
  if (items.length === 0) return items;

  return Promise.all(
    items.map(async (item) => {
      const productId = normalizeCartProductId(item.id);
      try {
        const res = await fetch(`/api/catalog/products/${encodeURIComponent(productId)}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.product) return item;

        const p = data.product;
        return {
          id: p._id,
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice,
          image: resolveProductImages(p.images)[0],
          quantity: item.quantity,
          stock: p.stock,
          seller: {
            name: p.seller.name,
            shopName: p.seller.shopName,
          },
        };
      } catch {
        return item;
      }
    }),
  );
}
