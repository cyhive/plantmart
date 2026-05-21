import type { ObjectId } from 'mongodb';

export type UserRole = 'admin' | 'seller' | 'buyer';

export type UserDocument = {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  phone?: string;
  shopName?: string;
  createdAt: Date;
  updatedAt: Date;
};

export const USERS_COLLECTION = 'users';

export function toPublicUser(doc: UserDocument) {
  return {
    id: doc._id.toHexString(),
    email: doc.email,
    name: doc.name,
    role: doc.role,
    phone: doc.phone,
    shopName: doc.shopName,
    createdAt: doc.createdAt.toISOString(),
  };
}
