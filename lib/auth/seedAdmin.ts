import { hash } from 'bcryptjs';
import { getDb } from '@/lib/mongodb';
import { USERS_COLLECTION, type UserDocument } from '@/lib/models/user';

/**
 * Ensures the admin user from env exists in MongoDB.
 * Set ADMIN_SEED_EMAIL + ADMIN_SEED_PASSWORD (and optionally ADMIN_SEED_NAME).
 * If that email exists as a non-admin, seeding is skipped and a warning is logged.
 *
 * Uses getDb() directly — must not call getUsersCollection() (deadlock: collection init awaits this seed).
 */
export async function ensureSeededAdmin(): Promise<void> {
  const emailRaw = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD;
  const name = process.env.ADMIN_SEED_NAME?.trim() || 'Admin';

  if (!emailRaw || !password) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.warn('[Pacha Bhoomi] ADMIN_SEED_* is set but MONGODB_URI is missing; skipping admin seed.');
    return;
  }

  const db = await getDb();
  const col = db.collection<UserDocument>(USERS_COLLECTION);
  const existing = await col.findOne({ email: emailRaw });

  if (existing && existing.role !== 'admin') {
    console.warn(
      `[Pacha Bhoomi] ADMIN_SEED_EMAIL ${emailRaw} is already registered as ${existing.role}; not overwriting.`,
    );
    return;
  }

  const passwordHash = await hash(password, 12);
  const now = new Date();

  if (existing) {
    await col.updateOne(
      { _id: existing._id },
      { $set: { passwordHash, name, updatedAt: now } },
    );
    return;
  }

  await col.insertOne({
    email: emailRaw,
    passwordHash,
    name,
    role: 'admin',
    createdAt: now,
    updatedAt: now,
  } as never);
}
