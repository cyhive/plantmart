import type { ObjectId } from 'mongodb';

export type OrderItem = {
  productId: ObjectId;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
};

export type OrderAddress = {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  building?: string;
};

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type OrderDocument = {
  _id: ObjectId;
  userId: ObjectId;
  sellerId: ObjectId;
  items: OrderItem[];
  shippingAddress: OrderAddress;
  paymentMethod: string;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
};

export const ORDERS_COLLECTION = 'orders';
