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
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
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
    address: doc.address,
    createdAt: doc.createdAt.toISOString(),
  };
}
