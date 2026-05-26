import type { ObjectId } from 'mongodb';

export type PromotionDocument = {
  _id: ObjectId;
  sellerId: ObjectId;
  title: string;
  code: string;
  discountPercentage: number;
  minPurchase: number;
  description: string;
  isApproved: boolean;
  isActive: boolean;
  validFrom: Date;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
};

export const PROMOTIONS_COLLECTION = 'promotions';

export function toClientPromotion(doc: PromotionDocument) {
  return {
    _id: doc._id.toHexString(),
    id: doc._id.toHexString(),
    sellerId: doc.sellerId.toHexString(),
    title: doc.title,
    code: doc.code,
    discountPercentage: doc.discountPercentage,
    minPurchase: doc.minPurchase,
    description: doc.description,
    isApproved: doc.isApproved,
    isActive: doc.isActive,
    validFrom: doc.validFrom.toISOString(),
    validUntil: doc.validUntil.toISOString(),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}
