import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { PROMOTIONS_COLLECTION, type PromotionDocument } from '@/lib/models/promotion';
import { PRODUCT_DISCOUNTS_COLLECTION, type ProductDiscountDocument } from '@/lib/models/product_discount';

export async function GET() {
  try {
    const db = await getDb();
    const promotionsCol = db.collection<PromotionDocument>(PROMOTIONS_COLLECTION);
    const discountsCol = db.collection<ProductDiscountDocument>(PRODUCT_DISCOUNTS_COLLECTION);

    const now = new Date();

    const [promotions, discounts] = await Promise.all([
      promotionsCol.find({
        isActive: true,
        validUntil: { $gte: now }
      }).sort({ createdAt: -1 }).limit(20).toArray(),
      
      discountsCol.find({
        isActive: true,
        validUntil: { $gte: now }
      }).sort({ createdAt: -1 }).limit(20).toArray()
    ]);

    return NextResponse.json({
      promotions: promotions.map(p => ({
        id: p._id.toString(),
        title: p.title,
        code: p.code,
        discountPercentage: p.discountPercentage,
        minPurchase: p.minPurchase,
        description: p.description,
        validUntil: p.validUntil
      })),
      discounts: discounts.map(d => ({
        id: d._id.toString(),
        productId: d.productId.toString(),
        productName: d.productName,
        productImage: d.productImage,
        originalPrice: d.originalPrice,
        discountType: d.discountType,
        discountValue: d.discountValue,
        discountedPrice: d.discountedPrice,
        validUntil: d.validUntil
      }))
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load offers' }, { status: 500 });
  }
}
