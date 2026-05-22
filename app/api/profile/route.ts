import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getSessionFromCookies } from '@/lib/auth/get-session';
import { getUsersCollection } from '@/lib/users/collection';
import { toPublicUser } from '@/lib/models/user';

export async function PUT(req: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, phone, address } = body;

    const col = await getUsersCollection();
    const oid = new ObjectId(session.sub);

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    updateData.updatedAt = new Date();

    const result = await col.findOneAndUpdate(
      { _id: oid },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: toPublicUser(result as any) });
  } catch (err) {
    console.error('Profile update error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
