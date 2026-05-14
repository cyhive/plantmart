import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getSessionFromCookies } from '@/lib/auth/get-session';
import { getUsersCollection } from '@/lib/users/collection';
import { toPublicUser } from '@/lib/models/user';

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session?.sub) {
      return NextResponse.json({ user: null });
    }

    const col = await getUsersCollection();
    let oid: ObjectId;
    try {
      oid = new ObjectId(session.sub);
    } catch {
      return NextResponse.json({ user: null });
    }

    const doc = await col.findOne({ _id: oid });
    if (!doc) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: toPublicUser(doc) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ user: null });
  }
}
