import { getDb } from '@/lib/mongodb';
import { PROMOTIONS_COLLECTION, type PromotionDocument } from '@/lib/models/promotion';

let indexReady: Promise<void> | null = null;

async function ensurePromotionIndexes() {
  const db = await getDb();
  const col = db.collection<PromotionDocument>(PROMOTIONS_COLLECTION);
  await col.createIndex({ sellerId: 1, createdAt: -1 });
  await col.createIndex({ code: 1 }, { unique: true });
  await col.createIndex({ isApproved: 1 });
}

export async function getPromotionsCollection() {
  if (!indexReady) {
    indexReady = ensurePromotionIndexes().catch((err) => {
      indexReady = null;
      throw err;
    });
  }
  await indexReady;
  const db = await getDb();
  return db.collection<PromotionDocument>(PROMOTIONS_COLLECTION);
}
