import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getSessionFromCookies } from '@/lib/auth/get-session';
import { getProductsCollection } from '@/lib/products/collection';

export async function GET(req: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session?.sub || session.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sellerId = new ObjectId(session.sub);
    const col = await getProductsCollection();
    
    const totalProducts = await col.countDocuments({ sellerId });

    // Since the orders system is not yet fully implemented, 
    // real data for orders and revenue is 0.
    const totalOrders = 0;
    const totalRevenue = 0;
    
    // Generate a clean 7-day array with 0 revenue for the chart
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const salesData = days.map(day => ({ name: day, revenue: 0, orders: 0 }));

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      salesData
    });

  } catch (err) {
    console.error('Error fetching seller dashboard data:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
