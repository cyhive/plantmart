import { getDb } from '@/lib/mongodb';
import { CARTS_COLLECTION, type CartDocument } from '@/lib/models/cart';

let indexReady: Promise<void> | null = null;

async function ensureCartIndexes() {
  const db = await getDb();
  const col = db.collection<CartDocument>(CARTS_COLLECTION);
  await col.createIndex({ userId: 1 }, { unique: true });
}

export async function getCartsCollection() {
  if (!indexReady) {
    indexReady = ensureCartIndexes().catch((err) => {
      indexReady = null;
      throw err;
    });
  }
  await indexReady;
  const db = await getDb();
  return db.collection<CartDocument>(CARTS_COLLECTION);
}
