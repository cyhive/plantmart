import { getDb } from '@/lib/mongodb';
import { PRODUCTS_COLLECTION, type ProductDocument } from '@/lib/models/product';

let indexReady: Promise<void> | null = null;

async function ensureProductIndexes() {
  const db = await getDb();
  const col = db.collection<ProductDocument>(PRODUCTS_COLLECTION);
  await col.createIndex({ sellerId: 1, createdAt: -1 });
  await col.createIndex({ category: 1 });
  await col.createIndex({ isApproved: 1 });
}

export async function getProductsCollection() {
  if (!indexReady) {
    indexReady = ensureProductIndexes().catch((err) => {
      indexReady = null;
      throw err;
    });
  }
  await indexReady;
  const db = await getDb();
  return db.collection<ProductDocument>(PRODUCTS_COLLECTION);
}
