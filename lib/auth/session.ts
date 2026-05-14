import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { AUTH_COOKIE } from '@/lib/auth/cookie';

export type SessionPayload = JWTPayload & {
  sub: string;
  email: string;
  name: string;
  role: 'admin' | 'seller' | 'buyer';
};

export type SessionSignInput = {
  sub: string;
  email: string;
  name: string;
  role: 'admin' | 'seller' | 'buyer';
};

const DAY_MS = 86_400_000;

function getSecretKey() {
  const raw = process.env.AUTH_SECRET;
  if (!raw || raw.length < 32) {
    throw new Error('AUTH_SECRET must be set and at least 32 characters');
  }
  return new TextEncoder().encode(raw);
}

export async function signSessionToken(payload: SessionSignInput) {
  const key = getSecretKey();
  return new SignJWT({ email: payload.email, name: payload.name, role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const key = getSecretKey();
    const { payload } = await jwtVerify(token, key);
    const sub = typeof payload.sub === 'string' ? payload.sub : '';
    const email = typeof payload.email === 'string' ? payload.email : '';
    const name = typeof payload.name === 'string' ? payload.name : '';
    const role = payload.role;
    if (!sub || !email || !name || (role !== 'admin' && role !== 'seller' && role !== 'buyer')) {
      return null;
    }
    return { ...payload, sub, email, name, role } as SessionPayload;
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    name: AUTH_COOKIE,
    httpOnly: true as const,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: Math.floor(7 * DAY_MS / 1000),
  };
}
