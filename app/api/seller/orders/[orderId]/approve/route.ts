import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/require-session';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { ORDERS_COLLECTION } from '@/lib/models/order';
import { PRODUCTS_COLLECTION } from '@/lib/models/product';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { session, response } = await requireSession();
  if (response) return response;

  if (session?.role !== 'seller') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
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

    if (order.status !== 'awaiting_approval') {
      return NextResponse.json({ error: 'Order is not in awaiting_approval state' }, { status: 400 });
    }

    // 1. Update order status to pending
    await db.collection(ORDERS_COLLECTION).updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status: 'pending', updatedAt: new Date() } }
    );

    // 2. Decrement stock for purchased products
    for (const item of order.items) {
      if (item.productId) {
        await db.collection(PRODUCTS_COLLECTION).updateOne(
          { _id: new ObjectId(item.productId) },
          { 
            $inc: { 
              stock: -item.quantity,
              sales: item.quantity 
            } 
          }
        );
      }
    }

    return NextResponse.json({ success: true, message: 'Order approved and stock updated' });
  } catch (error) {
    console.error('Approve order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
