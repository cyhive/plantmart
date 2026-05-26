import { NextResponse } from 'next/server';
import { requireSellerSession } from '@/lib/auth/require-seller';
import { getProductDiscountsCollection } from '@/lib/product_discounts/collection';
import { toClientProductDiscount } from '@/lib/models/product_discount';

export async function GET(req: Request) {
  const { session, response } = await requireSellerSession();
  if (response) return response;

  if (session!.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can view all discounts' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    
    const filter: any = {};
    if (status === 'pending') {
      filter.isApproved = false;
    }

    const col = await getProductDiscountsCollection();
    const docs = await col.find(filter).sort({ createdAt: -1 }).limit(100).toArray();
    
    return NextResponse.json({ discounts: docs.map(toClientProductDiscount) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load product discounts' }, { status: 500 });
  }
}
