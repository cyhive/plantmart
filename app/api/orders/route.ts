import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/require-session';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { ADDRESSES_COLLECTION } from '@/lib/models/address';
import { PRODUCTS_COLLECTION } from '@/lib/models/product';
import { ORDERS_COLLECTION, OrderDocument } from '@/lib/models/order';

export async function POST(request: Request) {
  const { session, response } = await requireSession();
  if (response) return response;

  try {
    const body = await request.json();
    const { items, addressId, paymentMethod } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!addressId) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    if (!paymentMethod) {
      return NextResponse.json({ error: 'Payment method is required' }, { status: 400 });
    }

    const db = await getDb();
    const addressDoc = await db.collection(ADDRESSES_COLLECTION).findOne({
      _id: new ObjectId(addressId),
      userId: new ObjectId(session!.sub),
    });

    if (!addressDoc) {
      return NextResponse.json({ error: 'Invalid address' }, { status: 404 });
    }

    const productIds = items.map((i: any) => {
      try { return new ObjectId(i.productId); } catch { return null; }
    }).filter(Boolean);

    const products = await db.collection(PRODUCTS_COLLECTION).find({
      _id: { $in: productIds }
    }).toArray();

    if (products.length === 0) {
      return NextResponse.json({ error: 'Products not found' }, { status: 404 });
    }

    // Group items by sellerId
    const ordersBySeller = new Map<string, any[]>();

    for (const item of items) {
      const product = products.find(p => p._id.toString() === item.productId);
      if (!product) continue;

      const sellerIdStr = product.sellerId.toString();
      if (!ordersBySeller.has(sellerIdStr)) {
        ordersBySeller.set(sellerIdStr, []);
      }
      
      const priceToUse = product.discountedPrice && product.discountedPrice > 0 
          ? product.discountedPrice 
          : product.price;

      ordersBySeller.get(sellerIdStr)!.push({
        productId: product._id,
        productName: product.name,
        productImage: product.images?.[0] || '',
        quantity: item.quantity,
        price: priceToUse,
      });
    }

    const newOrders: OrderDocument[] = [];
    const now = new Date();

    const deliveryFeePerOrder = Array.from(ordersBySeller.keys()).length > 1 ? 0 : 99; // Simple delivery logic

    for (const [sellerIdStr, sellerItems] of ordersBySeller.entries()) {
      let subtotal = 0;
      for (const item of sellerItems) {
        subtotal += item.price * item.quantity;
      }

      const deliveryFee = subtotal > 999 ? 0 : deliveryFeePerOrder;

      const order: OrderDocument = {
        _id: new ObjectId(),
        userId: new ObjectId(session!.sub),
        sellerId: new ObjectId(sellerIdStr),
        items: sellerItems,
        shippingAddress: {
          street: addressDoc.street,
          city: addressDoc.city,
          state: addressDoc.state,
          zipCode: addressDoc.zipCode,
          phone: addressDoc.phone,
          building: addressDoc.building,
        },
        paymentMethod,
        status: 'pending',
        subtotal,
        deliveryFee,
        totalAmount: subtotal + deliveryFee,
        createdAt: now,
        updatedAt: now,
      };

      newOrders.push(order);
    }

    if (newOrders.length === 0) {
      return NextResponse.json({ error: 'Failed to create any orders' }, { status: 400 });
    }

    // Insert orders
    await db.collection(ORDERS_COLLECTION).insertMany(newOrders);

    // Decrement stock for purchased products
    for (const product of products) {
      const purchasedItem = items.find((i: any) => i.productId === product._id.toString());
      if (purchasedItem) {
        await db.collection(PRODUCTS_COLLECTION).updateOne(
          { _id: product._id },
          { 
            $inc: { 
              stock: -purchasedItem.quantity,
              sales: purchasedItem.quantity 
            } 
          }
        );
      }
    }

    return NextResponse.json({ success: true, orderCount: newOrders.length });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
