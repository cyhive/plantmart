import { NextResponse } from 'next/server';
import { requireSellerSession, parseObjectId } from '@/lib/auth/require-seller';
import { getPromotionsCollection } from '@/lib/promotions/collection';
import { toClientPromotion } from '@/lib/models/promotion';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireSellerSession();
  if (response) return response;

  if (session!.role !== 'seller') {
    return NextResponse.json({ error: 'Only sellers can update their promotions' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const promotionId = parseObjectId(id);
    const sellerId = parseObjectId(session!.sub);
    
    if (!promotionId || !sellerId) {
      return NextResponse.json({ error: 'Invalid ID or session' }, { status: 400 });
    }

    const json = await req.json();
    const { isActive } = json;

    if (typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'Sellers can only toggle isActive' }, { status: 400 });
    }

    const col = await getPromotionsCollection();
    
    const existing = await col.findOne({ _id: promotionId, sellerId });
    if (!existing) {
      return NextResponse.json({ error: 'Promotion not found' }, { status: 404 });
    }

    if (isActive && !existing.isApproved) {
      return NextResponse.json({ error: 'Promotion cannot be active unless it is approved by an admin' }, { status: 400 });
    }

    const result = await col.findOneAndUpdate(
      { _id: promotionId, sellerId },
      { $set: { isActive, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ error: 'Failed to update promotion' }, { status: 500 });
    }

    return NextResponse.json({ promotion: toClientPromotion(result) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update promotion' }, { status: 500 });
  }
}
