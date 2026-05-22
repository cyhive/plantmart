import type { ObjectId } from 'mongodb';
import type { CartLineItem } from '@/lib/cart/refresh';

export const CARTS_COLLECTION = 'carts';

export type CartDocument = {
  _id: ObjectId;
  userId: ObjectId;
  items: CartLineItem[];
  updatedAt: Date;
};
