import { cookies } from 'next/headers';
import { AUTH_COOKIE } from '@/lib/auth/cookie';
import { verifySessionToken } from '@/lib/auth/session';

export async function getSessionFromCookies() {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
