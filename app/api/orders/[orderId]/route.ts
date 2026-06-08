import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/require-session';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { ORDERS_COLLECTION } from '@/lib/models/order';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { session, response } = await requireSession();
  if (response) return response;

  try {
    const db = await getDb();
    const resolvedParams = await params;
    const orderId = resolvedParams.orderId?.trim();

    if (!ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: 'Invalid tracking ID format' }, { status: 400 });
    }



    const order = await db.collection(ORDERS_COLLECTION).findOne({
      $or: [
        { _id: new ObjectId(orderId) },
        { _id: orderId as any }
      ]
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found in the database.' }, { status: 404 });
    }

    // Make sure buyers can only see their own orders
    if (session?.role !== 'admin' && session?.role !== 'seller') {
      if (order.userId.toString() !== session!.sub) {
        return NextResponse.json({ error: 'Access denied: You can only track your own orders.' }, { status: 403 });
      }
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Fetch order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
