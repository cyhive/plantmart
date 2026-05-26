import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/require-session';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { ORDERS_COLLECTION } from '@/lib/models/order';

export async function GET() {
  const { session, response } = await requireSession();
  if (response) return response;

  try {
    const db = await getDb();
    const ordersCol = db.collection(ORDERS_COLLECTION);
    
    const orders = await ordersCol.find({ userId: new ObjectId(session!.sub) })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ orders });
  } catch (err) {
    console.error('Failed to fetch user orders', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
