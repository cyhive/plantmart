import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { loginBodySchema } from '@/lib/validators/auth';
import { getUsersCollection } from '@/lib/users/collection';
import { toPublicUser } from '@/lib/models/user';
import { signSessionToken, sessionCookieOptions } from '@/lib/auth/session';

/**
 * Admin-only login. Same session cookie as /api/auth/login, but rejects non-admin users.
 */
export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = loginBodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;
    const col = await getUsersCollection();
    const user = await col.findOne({ email: email.toLowerCase() });
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const valid = await compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = await signSessionToken({
      sub: user._id.toHexString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const opts = sessionCookieOptions();
    const res = NextResponse.json({ user: toPublicUser(user) });
    res.cookies.set(opts.name, token, {
      httpOnly: opts.httpOnly,
      secure: opts.secure,
      sameSite: opts.sameSite,
      path: opts.path,
      maxAge: opts.maxAge,
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
