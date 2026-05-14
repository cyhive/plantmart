import type { ObjectId } from 'mongodb';

export type ProductDocument = {
  _id: ObjectId;
  sellerId: ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  isApproved: boolean;
  ratings: { average: number; count: number };
  sales: number;
  createdAt: Date;
  updatedAt: Date;
};

export const PRODUCTS_COLLECTION = 'products';

export function toSellerProduct(doc: ProductDocument) {
  return {
    _id: doc._id.toHexString(),
    id: doc._id.toHexString(),
    sellerId: doc.sellerId.toHexString(),
    name: doc.name,
    description: doc.description,
    price: doc.price,
    category: doc.category,
    stock: doc.stock,
    images: doc.images,
    isApproved: doc.isApproved,
    ratings: doc.ratings,
    sales: doc.sales,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}
