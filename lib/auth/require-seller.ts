import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getSessionFromCookies } from '@/lib/auth/get-session';
import type { SessionPayload } from '@/lib/auth/session';

type SellerSession = SessionPayload & { role: 'seller' | 'admin' };

export async function requireSellerSession() {
  const session = await getSessionFromCookies();
  if (!session) {
    return {
      session: null as SellerSession | null,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
  if (session.role !== 'seller' && session.role !== 'admin') {
    return {
      session: null as SellerSession | null,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }
  return { session: session as SellerSession, response: null };
}

export function parseObjectId(value: string) {
  try {
    return new ObjectId(value);
  } catch {
    return null;
  }
}

export function canManageProduct(session: SellerSession, sellerId: ObjectId) {
  if (session.role === 'admin') return true;
  return session.role === 'seller' && session.sub === sellerId.toHexString();
}
