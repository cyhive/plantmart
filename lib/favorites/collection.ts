import { getDb } from '@/lib/mongodb';
import { FAVORITES_COLLECTION, type FavoriteDocument } from '@/lib/models/favorite';

let initReady: Promise<void> | null = null;

async function ensureFavoriteIndexes() {
  const db = await getDb();
  const col = db.collection<FavoriteDocument>(FAVORITES_COLLECTION);
  await col.createIndex({ userId: 1, productId: 1 }, { unique: true });
}

export async function getFavoritesCollection() {
  if (!initReady) {
    initReady = ensureFavoriteIndexes().catch((err) => {
      initReady = null;
      throw err;
    });
  }
  await initReady;
  const db = await getDb();
  return db.collection<FavoriteDocument>(FAVORITES_COLLECTION);
}
