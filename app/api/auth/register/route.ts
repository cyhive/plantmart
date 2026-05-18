import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { registerBodySchema } from '@/lib/validators/auth';
import { getUsersCollection } from '@/lib/users/collection';
import { toPublicUser } from '@/lib/models/user';
import { signSessionToken, sessionCookieOptions } from '@/lib/auth/session';

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = registerBodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { name, email, password, role, shopName, phone } = parsed.data;
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
    console.error(err);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
