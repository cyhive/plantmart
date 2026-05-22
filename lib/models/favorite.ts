import { ObjectId } from 'mongodb';

export type FavoriteDocument = {
  _id: ObjectId;
  userId: ObjectId;
  productId: ObjectId;
  createdAt: Date;
};

export const FAVORITES_COLLECTION = 'favorites';

export function toPublicFavorite(doc: FavoriteDocument) {
  return {
    id: doc._id.toHexString(),
    userId: doc.userId.toHexString(),
    productId: doc.productId.toHexString(),
    createdAt: doc.createdAt.toISOString(),
  };
}
