import { NextResponse } from 'next/server';
import { requireSellerSession } from '@/lib/auth/require-seller';
import { getDb } from '@/lib/mongodb';
import { USERS_COLLECTION } from '@/lib/models/user';
import { PRODUCTS_COLLECTION } from '@/lib/models/product';
import { PROMOTIONS_COLLECTION } from '@/lib/models/promotion';

export async function GET() {
  const { session, response } = await requireSellerSession();
  if (response) return response;

  if (session!.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const db = await getDb();
    const usersCol = db.collection(USERS_COLLECTION);
    const productsCol = db.collection(PRODUCTS_COLLECTION);
    const promosCol = db.collection(PROMOTIONS_COLLECTION);

    const [
      totalSellers,
      totalBuyers,
      totalProducts,
      pendingProducts,
      activePromos,
      productsWithSales
    ] = await Promise.all([
      usersCol.countDocuments({ role: 'seller' }),
      usersCol.countDocuments({ role: 'buyer' }),
      productsCol.countDocuments({ isApproved: true }),
      productsCol.countDocuments({ isApproved: false }),
      promosCol.countDocuments({ isActive: true }),
      productsCol.find({ sales: { $gt: 0 } }).toArray()
    ]);

    let totalOrders = 0;
    let totalRevenue = 0;

    for (const product of productsWithSales) {
      totalOrders += product.sales || 0;
      totalRevenue += (product.sales || 0) * (product.price || 0);
    }

    return NextResponse.json({
      stats: {
        totalSellers,
        totalBuyers,
        totalProducts,
        pendingProducts,
        pendingSellers: 0, // Not implemented in user schema
        totalOrders,
        totalRevenue,
        activePromos
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
