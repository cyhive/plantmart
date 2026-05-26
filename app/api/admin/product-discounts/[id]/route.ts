import { NextResponse } from 'next/server';
import { requireSellerSession, parseObjectId } from '@/lib/auth/require-seller';
import { getProductDiscountsCollection } from '@/lib/product_discounts/collection';
import { toClientProductDiscount } from '@/lib/models/product_discount';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireSellerSession();
  if (response) return response;

  if (session!.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can update discount status' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const discountId = parseObjectId(id);
    if (!discountId) {
      return NextResponse.json({ error: 'Invalid discount ID' }, { status: 400 });
    }

    const json = await req.json();
    const { isApproved, isActive } = json;

    if (typeof isApproved !== 'boolean' && typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'No valid update fields provided' }, { status: 400 });
    }

    const col = await getProductDiscountsCollection();
    
    const existing = await col.findOne({ _id: discountId });
    if (!existing) {
      return NextResponse.json({ error: 'Discount not found' }, { status: 404 });
    }

    const finalIsApproved = typeof isApproved === 'boolean' ? isApproved : existing.isApproved;
    const finalIsActive = typeof isActive === 'boolean' ? isActive : existing.isActive;

    if (finalIsActive && !finalIsApproved) {
      return NextResponse.json({ error: 'Discount cannot be active unless it is approved' }, { status: 400 });
    }

    const update: any = { updatedAt: new Date() };
    if (typeof isApproved === 'boolean') update.isApproved = isApproved;
    if (typeof isActive === 'boolean') update.isActive = isActive;

    const result = await col.findOneAndUpdate(
      { _id: discountId },
      { $set: update },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ error: 'Failed to update discount' }, { status: 500 });
    }

    return NextResponse.json({ discount: toClientProductDiscount(result) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update discount' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireSellerSession();
  if (response) return response;

  if (session!.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can delete discounts' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const discountId = parseObjectId(id);
    if (!discountId) {
      return NextResponse.json({ error: 'Invalid discount ID' }, { status: 400 });
    }

    const col = await getProductDiscountsCollection();
    
    const result = await col.deleteOne({ _id: discountId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Discount not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete discount' }, { status: 500 });
  }
}
