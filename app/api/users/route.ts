import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/get-session';
import { getUsersCollection } from '@/lib/users/collection';
import { toPublicUser, type UserRole } from '@/lib/models/user';

export async function GET(req: Request) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const roleParam = searchParams.get('role') as UserRole | null;
  const allowed: UserRole[] = ['admin', 'seller', 'buyer'];
  const filter =
    roleParam && allowed.includes(roleParam) ? { role: roleParam } : {};

  try {
    const col = await getUsersCollection();
    const cursor = col.find(filter).sort({ createdAt: -1 }).limit(200);
    const docs = await cursor.toArray();
    return NextResponse.json({ users: docs.map(toPublicUser) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load users' }, { status: 500 });
  }
}
