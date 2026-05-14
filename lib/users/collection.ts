import { getDb } from '@/lib/mongodb';
import { USERS_COLLECTION, type UserDocument } from '@/lib/models/user';

let indexReady: Promise<void> | null = null;

async function ensureUserIndexes() {
  const db = await getDb();
  const col = db.collection<UserDocument>(USERS_COLLECTION);
  await col.createIndex({ email: 1 }, { unique: true });
  await col.createIndex({ role: 1 });
}

export async function getUsersCollection() {
  if (!indexReady) {
    indexReady = ensureUserIndexes().catch((err) => {
      indexReady = null;
      throw err;
    });
  }
  await indexReady;
  const db = await getDb();
  return db.collection<UserDocument>(USERS_COLLECTION);
}
