import { NextResponse } from 'next/server';
import { requireSellerSession } from '@/lib/auth/require-seller';
import { getPromotionsCollection } from '@/lib/promotions/collection';
import { toClientPromotion } from '@/lib/models/promotion';

export async function GET(req: Request) {
  const { session, response } = await requireSellerSession();
  if (response) return response;

  if (session!.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can view all promotions' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status'); // e.g. 'pending'
    
    const filter: any = {};
    if (status === 'pending') {
      filter.isApproved = false;
    }

    const col = await getPromotionsCollection();
    const docs = await col.find(filter).sort({ createdAt: -1 }).limit(100).toArray();
    
    return NextResponse.json({ promotions: docs.map(toClientPromotion) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load promotions' }, { status: 500 });
  }
}
