import { NextResponse } from 'next/server';
import { requireSellerSession, parseObjectId } from '@/lib/auth/require-seller';
import { getPromotionsCollection } from '@/lib/promotions/collection';
import { toClientPromotion } from '@/lib/models/promotion';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireSellerSession();
  if (response) return response;

  if (session!.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can update promotion status' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const promotionId = parseObjectId(id);
    if (!promotionId) {
      return NextResponse.json({ error: 'Invalid promotion ID' }, { status: 400 });
    }

    const json = await req.json();
    const { isApproved, isActive } = json;

    if (typeof isApproved !== 'boolean' && typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'No valid update fields provided' }, { status: 400 });
    }

    const col = await getPromotionsCollection();
    
    const existing = await col.findOne({ _id: promotionId });
    if (!existing) {
      return NextResponse.json({ error: 'Promotion not found' }, { status: 404 });
    }

    const finalIsApproved = typeof isApproved === 'boolean' ? isApproved : existing.isApproved;
    const finalIsActive = typeof isActive === 'boolean' ? isActive : existing.isActive;

    if (finalIsActive && !finalIsApproved) {
      return NextResponse.json({ error: 'Promotion cannot be active unless it is approved' }, { status: 400 });
    }

    const update: any = { updatedAt: new Date() };
    if (typeof isApproved === 'boolean') update.isApproved = isApproved;
    if (typeof isActive === 'boolean') update.isActive = isActive;

    const result = await col.findOneAndUpdate(
      { _id: promotionId },
      { $set: update },
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

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireSellerSession();
  if (response) return response;

  if (session!.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can delete promotions' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const promotionId = parseObjectId(id);
    if (!promotionId) {
      return NextResponse.json({ error: 'Invalid promotion ID' }, { status: 400 });
    }

    const col = await getPromotionsCollection();
    
    const result = await col.deleteOne({ _id: promotionId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Promotion not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete promotion' }, { status: 500 });
  }
}
