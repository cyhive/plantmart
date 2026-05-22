import { getDb } from '@/lib/mongodb';
import { ADDRESSES_COLLECTION, type AddressDocument } from '@/lib/models/address';

let initReady: Promise<void> | null = null;

async function ensureAddressIndexes() {
  const db = await getDb();
  const col = db.collection<AddressDocument>(ADDRESSES_COLLECTION);
  // Index on userId for fast lookups of a user's addresses
  await col.createIndex({ userId: 1 });
}

export async function getAddressesCollection() {
  if (!initReady) {
    initReady = ensureAddressIndexes().catch((err) => {
      initReady = null;
      throw err;
    });
  }
  await initReady;
  const db = await getDb();
  return db.collection<AddressDocument>(ADDRESSES_COLLECTION);
}
