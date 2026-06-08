import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/require-session';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { ORDERS_COLLECTION } from '@/lib/models/order';
import { USERS_COLLECTION } from '@/lib/models/user';

export async function GET(request: Request) {
  const { session, response } = await requireSession();
  if (response) return response;

  if (session?.role !== 'seller' && session?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const db = await getDb();
    
    const orders = await db.collection(ORDERS_COLLECTION)
      .find({ sellerId: new ObjectId(session.sub) })
      .sort({ createdAt: -1 })
      .toArray();

    // Fetch buyers for these orders
    const buyerIds = [...new Set(orders.map(o => o.userId.toString()))];
    const buyers = await db.collection(USERS_COLLECTION)
      .find({ _id: { $in: buyerIds.map(id => new ObjectId(id)) } })
      .toArray();

    const buyersMap = new Map(buyers.map(b => [b._id.toString(), b.name]));

    const populatedOrders = orders.map(order => ({
      ...order,
      _id: order._id.toString(),
      userId: order.userId.toString(),
      sellerId: order.sellerId.toString(),
      buyerName: buyersMap.get(order.userId.toString()) || 'Unknown Buyer',
    }));

    return NextResponse.json({ orders: populatedOrders });
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
