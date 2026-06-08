import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/require-session';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { ORDERS_COLLECTION, OrderStatus } from '@/lib/models/order';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { session, response } = await requireSession();
  if (response) return response;

  if (session?.role !== 'seller') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { status } = body as { status: OrderStatus };

    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const db = await getDb();
    const resolvedParams = await params;
    const orderId = resolvedParams.orderId;

    const order = await db.collection(ORDERS_COLLECTION).findOne({
      _id: new ObjectId(orderId),
      sellerId: new ObjectId(session.sub)
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status === 'awaiting_approval' && status !== 'cancelled') {
      return NextResponse.json({ error: 'Order must be approved first' }, { status: 400 });
    }

    await db.collection(ORDERS_COLLECTION).updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error('Update status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
