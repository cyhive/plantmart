import type { ObjectId } from 'mongodb';

export type ProductDiscountDocument = {
  _id: ObjectId;
  sellerId: ObjectId;
  productId: ObjectId;
  productName: string;
  productImage: string;
  originalPrice: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountedPrice: number;
  validFrom: Date;
  validUntil: Date;
  isApproved: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const PRODUCT_DISCOUNTS_COLLECTION = 'product_discounts';

export function toClientProductDiscount(doc: ProductDiscountDocument) {
  return {
    _id: doc._id.toHexString(),
    id: doc._id.toHexString(),
    sellerId: doc.sellerId.toHexString(),
    productId: doc.productId.toHexString(),
    productName: doc.productName,
    productImage: doc.productImage,
    originalPrice: doc.originalPrice,
    discountType: doc.discountType,
    discountValue: doc.discountValue,
    discountedPrice: doc.discountedPrice,
    validFrom: doc.validFrom.toISOString(),
    validUntil: doc.validUntil.toISOString(),
    isApproved: doc.isApproved,
    isActive: doc.isActive,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}
