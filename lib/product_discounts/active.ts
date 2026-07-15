import { getProductDiscountsCollection } from '@/lib/product_discounts/collection';
import { ObjectId } from 'mongodb';

export async function getActiveDiscountsForProducts(productIds: ObjectId[]) {
  if (!productIds || productIds.length === 0) return [];
  
  const col = await getProductDiscountsCollection();
  const now = new Date();
  
  const discounts = await col.find({
    productId: { $in: productIds },
    isApproved: true,
    isActive: true,
    validFrom: { $lte: now },
    validUntil: { $gte: now }
  }).toArray();
  
  return discounts;
}
