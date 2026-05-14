import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { bootstrapAdminSchema } from '@/lib/validators/auth';
import { getUsersCollection } from '@/lib/users/collection';

/**
 * One-time setup: creates the first admin when no admin exists.
 * Requires BOOTSTRAP_ADMIN_SECRET in the environment and matching `secret` in the body.
 */
export async function POST(req: Request) {
  const expected = process.env.BOOTSTRAP_ADMIN_SECRET;
  if (!expected) {
    return NextResponse.json({ error: 'Bootstrap is not configured' }, { status: 503 });
  }

  try {
    const json = await req.json();
    const parsed = bootstrapAdminSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    if (parsed.data.secret !== expected) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const col = await getUsersCollection();
    const existingAdmin = await col.findOne({ role: 'admin' });
    if (existingAdmin) {
      return NextResponse.json({ error: 'An admin account already exists' }, { status: 400 });
    }

    const { name, email, password } = parsed.data;
    const passwordHash = await hash(password, 12);
    const now = new Date();
    const emailNorm = email.toLowerCase();

    await col.insertOne({
      email: emailNorm,
      passwordHash,
      name,
      role: 'admin',
      createdAt: now,
      updatedAt: now,
    } as never);

    return NextResponse.json({ ok: true, message: 'Admin created. Sign in with /login.' });
  } catch (err: unknown) {
    const code = typeof err === 'object' && err !== null && 'code' in err ? (err as { code?: number }).code : undefined;
    if (code === 11000) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Bootstrap failed' }, { status: 500 });
  }
}
