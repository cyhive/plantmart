import { ObjectId } from 'mongodb';

export type AddressDocument = {
  _id: ObjectId;
  userId: ObjectId;
  type: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  building?: string;
  landmark?: string;
  deliveryInstructions?: string;
  alternatePhone?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const ADDRESSES_COLLECTION = 'addresses';

export function toPublicAddress(doc: AddressDocument) {
  return {
    id: doc._id.toHexString(),
    userId: doc.userId.toHexString(),
    type: doc.type,
    phone: doc.phone,
    street: doc.street,
    city: doc.city,
    state: doc.state,
    zipCode: doc.zipCode,
    country: doc.country,
    building: doc.building,
    landmark: doc.landmark,
    deliveryInstructions: doc.deliveryInstructions,
    alternatePhone: doc.alternatePhone,
    coordinates: doc.coordinates,
    isDefault: doc.isDefault,
    createdAt: doc.createdAt.toISOString(),
  };
}
