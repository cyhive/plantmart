import { NextResponse } from 'next/server';
import { requireSellerSession, parseObjectId } from '@/lib/auth/require-seller';
import { getPromotionsCollection } from '@/lib/promotions/collection';
import { toClientPromotion } from '@/lib/models/promotion';

export async function GET() {
  const { session, response } = await requireSellerSession();
  if (response) return response;

  try {
    const col = await getPromotionsCollection();
    const sellerId = parseObjectId(session!.sub);
    if (!sellerId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const docs = await col.find({ sellerId }).sort({ createdAt: -1 }).limit(100).toArray();
    return NextResponse.json({ promotions: docs.map(toClientPromotion) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load promotions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { session, response } = await requireSellerSession();
  if (response) return response;

  if (session!.role !== 'seller') {
    return NextResponse.json({ error: 'Only sellers can create promotions' }, { status: 403 });
  }

  try {
    const json = await req.json();
    const { title, code, discountPercentage, minPurchase, description, validFrom, validUntil } = json;

    if (!title || !code || !discountPercentage || !validFrom || !validUntil) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sellerId = parseObjectId(session!.sub);
    if (!sellerId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const col = await getPromotionsCollection();
    
    // Check if code already exists
    const existing = await col.findOne({ code: code.toUpperCase() });
    if (existing) {
      return NextResponse.json({ error: 'Promotion code already exists' }, { status: 400 });
    }

    const now = new Date();
    const { insertedId } = await col.insertOne({
      sellerId,
      title,
      code: code.toUpperCase(),
      discountPercentage: Number(discountPercentage),
      minPurchase: Number(minPurchase) || 0,
      description: description || '',
      isApproved: false,
      isActive: false,
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
      createdAt: now,
      updatedAt: now,
    } as never);

    const doc = await col.findOne({ _id: insertedId });
    if (!doc) {
      return NextResponse.json({ error: 'Failed to create promotion' }, { status: 500 });
    }

    return NextResponse.json({ promotion: toClientPromotion(doc) }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create promotion' }, { status: 500 });
  }
}
