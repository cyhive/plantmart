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
    
    let reviews: any[] = [];
    if (productIds.length > 0) {
      reviews = await db.collection('productReviews').find({ productId: { $in: productIds } }).sort({ createdAt: -1 }).toArray();
    }

    return NextResponse.json({ reviews });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load seller reviews' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid seller ID' }, { status: 400 });
    }

    const { rating, comment, author } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
    }

    const db = await getDb();
    
    const newReview = {
      sellerId: id, // Store as string to match how seller reviews are queried in other API
      rating,
      comment,
      author: author || 'Anonymous',
      createdAt: new Date()
    };

    const result = await db.collection('sellerReviews').insertOne(newReview);

    return NextResponse.json({ success: true, review: { ...newReview, _id: result.insertedId } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
