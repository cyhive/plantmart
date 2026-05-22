import { ObjectId } from 'mongodb';
import { normalizeCartProductId } from '@/lib/cart/product-id';
import { getCartsCollection } from '@/lib/cart/collection';
import type { CartLineItem } from '@/lib/cart/refresh';
import { loadCatalogProductById } from '@/lib/products/catalog';
import { resolveProductImages } from '@/lib/products/defaults';

function normalizeStoredLine(item: CartLineItem): CartLineItem {
  return {
    id: normalizeCartProductId(item.id),
    name: item.name,
    price: item.price,
    image: item.image,
    quantity: item.quantity,
    seller: {
      name: item.seller.name,
      shopName: item.seller.shopName,
    },
  };
}

export async function refreshCartLinesOnServer(items: CartLineItem[]): Promise<CartLineItem[]> {
  if (items.length === 0) return items;

  return Promise.all(
    items.map(async (item) => {
      const productId = normalizeCartProductId(item.id);
      try {
        const product = await loadCatalogProductById(productId);
        if (!product) return normalizeStoredLine(item);

        return {
          id: product._id,
          name: product.name,
          price: product.price,
          image: resolveProductImages(product.images)[0],
          quantity: item.quantity,
          seller: {
            name: product.seller.name,
            shopName: product.seller.shopName,
          },
        };
      } catch {
        return normalizeStoredLine(item);
      }
    }),
  );
}

export async function getCartForUser(userId: string): Promise<CartLineItem[]> {
  const col = await getCartsCollection();
  const doc = await col.findOne({ userId: new ObjectId(userId) });
  if (!doc?.items?.length) return [];
  return refreshCartLinesOnServer(doc.items.map(normalizeStoredLine));
}

export async function saveCartForUser(userId: string, items: CartLineItem[]): Promise<CartLineItem[]> {
  const normalized = items.map(normalizeStoredLine);
  const refreshed = await refreshCartLinesOnServer(normalized);
  const col = await getCartsCollection();
  const userObjectId = new ObjectId(userId);

  await col.updateOne(
    { userId: userObjectId },
    {
      $set: {
        items: refreshed,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        userId: userObjectId,
      },
    },
    { upsert: true },
  );

  return refreshed;
}
