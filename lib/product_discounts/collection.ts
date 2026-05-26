import { getDb } from '@/lib/mongodb';
import { PRODUCT_DISCOUNTS_COLLECTION, type ProductDiscountDocument } from '@/lib/models/product_discount';

let indexReady: Promise<void> | null = null;

async function ensureProductDiscountIndexes() {
  const db = await getDb();
  const col = db.collection<ProductDiscountDocument>(PRODUCT_DISCOUNTS_COLLECTION);
  await col.createIndex({ sellerId: 1, createdAt: -1 });
  await col.createIndex({ productId: 1 });
  await col.createIndex({ isApproved: 1 });
}

export async function getProductDiscountsCollection() {
  if (!indexReady) {
    indexReady = ensureProductDiscountIndexes().catch((err) => {
      indexReady = null;
      throw err;
    });
  }
  await indexReady;
  const db = await getDb();
  return db.collection<ProductDiscountDocument>(PRODUCT_DISCOUNTS_COLLECTION);
}
