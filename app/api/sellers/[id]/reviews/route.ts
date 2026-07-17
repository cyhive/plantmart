import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid seller ID' }, { status: 400 });
    }

    const db = await getDb();
    const products = await db.collection('products').find({ sellerId: new ObjectId(id) }).toArray();
    const productIds = products.map(p => p._id.toHexString());
    
    const reviews = await db.collection('productReviews').find({ productId: { "": productIds } }).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ reviews });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load seller reviews' }, { status: 500 });
  }
}
