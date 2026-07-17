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
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const db = await getDb();
    const reviews = await db.collection('productReviews').find({ productId: id }).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ reviews });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load product reviews' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const { author, rating, comment } = await req.json();

    if (!rating || !comment) {
      return NextResponse.json({ error: 'Rating and comment are required' }, { status: 400 });
    }

    const db = await getDb();
    const newReview = {
      productId: id,
      author: author || 'Anonymous',
      rating,
      comment,
      createdAt: new Date(),
    };

    const result = await db.collection('productReviews').insertOne(newReview);
    
    const allReviews = await db.collection('productReviews').find({ productId: id }).toArray();
    const count = allReviews.length;
    const average = count > 0 ? allReviews.reduce((acc, rev) => acc + rev.rating, 0) / count : 0;
    
    await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $set: { "ratings.average": average, "ratings.count": count } }
    );
    
    return NextResponse.json({ 
      review: { 
        _id: result.insertedId,
        ...newReview 
      } 
    }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
  }
}
