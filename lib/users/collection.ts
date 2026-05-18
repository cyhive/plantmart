import { getDb } from '@/lib/mongodb';
import { USERS_COLLECTION, type UserDocument } from '@/lib/models/user';
import { ensureSeededAdmin } from '@/lib/auth/seedAdmin';

let initReady: Promise<void> | null = null;

async function ensureUserIndexes() {
  const db = await getDb();
  const col = db.collection<UserDocument>(USERS_COLLECTION);
  await col.createIndex({ email: 1 }, { unique: true });
  await col.createIndex({ role: 1 });
}

async function ensureDbReady() {
  await ensureUserIndexes();
  await ensureSeededAdmin().catch((err) => {
    console.error('[plantmart] Admin seed failed:', err);
  });
}

export async function getUsersCollection() {
  if (!initReady) {
    initReady = ensureDbReady().catch((err) => {
      initReady = null;
      throw err;
    });
  }
  await initReady;
  const db = await getDb();
  return db.collection<UserDocument>(USERS_COLLECTION);
}
