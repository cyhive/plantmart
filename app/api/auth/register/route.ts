import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { registerBodySchema } from '@/lib/validators/auth';
import { getUsersCollection } from '@/lib/users/collection';
import { toPublicUser } from '@/lib/models/user';
import { signSessionToken, sessionCookieOptions } from '@/lib/auth/session';

export async function POST(req: Request) {
  try {
    const json = await req.json();
    if (
      json &&
      typeof json === 'object' &&
      'role' in json &&
      (json as { role?: unknown }).role === 'admin'
    ) {
      return NextResponse.json(
        { error: 'Admin accounts cannot be created via registration' },
        { status: 403 },
      );
    }
    const parsed = registerBodySchema.safeParse(json);
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      const fieldMsg = [flat.fieldErrors, flat.formErrors]
        .flatMap((o) => (typeof o === 'object' && o ? Object.values(o).flat() : []))
        .filter((x): x is string => typeof x === 'string')
        .join(' ');
      return NextResponse.json(
        {
          error: fieldMsg || 'Invalid input',
          details: flat.fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, password, role, shopName, phone, address } = parsed.data;
    const passwordHash = await hash(password, 12);
    const col = await getUsersCollection();
    const now = new Date();
    const emailNorm = email.toLowerCase();

    const insertDoc = {
      email: emailNorm,
      passwordHash,
      name,
      role,
      ...(phone?.trim() ? { phone: phone.trim() } : {}),
      ...(role === 'seller' && shopName?.trim() ? { shopName: shopName.trim() } : {}),
      ...(address ? { address } : {}),
      createdAt: now,
      updatedAt: now,
    };

    const { insertedId } = await col.insertOne(insertDoc as never);

    const userDoc = await col.findOne({ _id: insertedId });
    if (!userDoc) {
      return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }

    const token = await signSessionToken({
      sub: userDoc._id.toHexString(),
      email: userDoc.email,
      name: userDoc.name,
      role: userDoc.role,
    });

    const opts = sessionCookieOptions();
    const res = NextResponse.json({ user: toPublicUser(userDoc) });
    res.cookies.set(opts.name, token, {
      httpOnly: opts.httpOnly,
      secure: opts.secure,
      sameSite: opts.sameSite,
      path: opts.path,
      maxAge: opts.maxAge,
    });
    return res;
  } catch (err: unknown) {
    const code = typeof err === 'object' && err !== null && 'code' in err ? (err as { code?: number }).code : undefined;
    if (code === 11000) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    const msg = err instanceof Error ? err.message : '';
    if (msg.includes('AUTH_SECRET') || msg.includes('at least 32')) {
      return NextResponse.json(
        { error: 'Server configuration error: AUTH_SECRET must be set and at least 32 characters.' },
        { status: 500 },
      );
    }
    if (
      msg.includes('MONGODB_URI') ||
      msg.includes('ECONNREFUSED') ||
      msg.includes('ENOTFOUND') ||
      msg.includes('MongoServerSelectionError') ||
      msg.includes('MongoNetworkError') ||
      msg.includes('SSL') ||
      msg.includes('tlsv1')
    ) {
      return NextResponse.json(
        { error: 'Could not reach the database. Check your network and MONGODB_URI.' },
        { status: 503 },
      );
    }
    console.error(err);
    return NextResponse.json(
      {
        error: 'Registration failed',
        ...(process.env.NODE_ENV === 'development' && msg ? { detail: msg } : {}),
      },
      { status: 500 },
    );
  }
}
