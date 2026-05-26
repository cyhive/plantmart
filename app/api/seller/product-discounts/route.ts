import { NextResponse } from 'next/server';
import { requireSellerSession, parseObjectId } from '@/lib/auth/require-seller';
import { getProductDiscountsCollection } from '@/lib/product_discounts/collection';
import { toClientProductDiscount } from '@/lib/models/product_discount';

export async function GET() {
  const { session, response } = await requireSellerSession();
  if (response) return response;

  try {
    const col = await getProductDiscountsCollection();
    const sellerId = parseObjectId(session!.sub);
    if (!sellerId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const docs = await col.find({ sellerId }).sort({ createdAt: -1 }).limit(100).toArray();
    return NextResponse.json({ discounts: docs.map(toClientProductDiscount) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load product discounts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { session, response } = await requireSellerSession();
  if (response) return response;

  if (session!.role !== 'seller') {
    return NextResponse.json({ error: 'Only sellers can create discounts' }, { status: 403 });
  }

  try {
    const json = await req.json();
    const { 
      productId, 
      productName, 
      productImage, 
      originalPrice, 
      discountType, 
      discountValue, 
      discountedPrice, 
      validFrom, 
      validUntil 
    } = json;

    if (!productId || !discountType || !discountValue || !validFrom || !validUntil) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sellerId = parseObjectId(session!.sub);
    const parsedProductId = parseObjectId(productId);
    if (!sellerId || !parsedProductId) {
      return NextResponse.json({ error: 'Invalid session or product ID' }, { status: 400 });
    }

    const col = await getProductDiscountsCollection();
    const now = new Date();
    const { insertedId } = await col.insertOne({
      sellerId,
      productId: parsedProductId,
      productName,
      productImage,
      originalPrice: Number(originalPrice),
      discountType,
      discountValue: Number(discountValue),
      discountedPrice: Number(discountedPrice),
      isApproved: false,
      isActive: false,
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
      createdAt: now,
      updatedAt: now,
    } as never);

    const doc = await col.findOne({ _id: insertedId });
    if (!doc) {
      return NextResponse.json({ error: 'Failed to create discount' }, { status: 500 });
    }

    return NextResponse.json({ discount: toClientProductDiscount(doc) }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create discount' }, { status: 500 });
  }
}
