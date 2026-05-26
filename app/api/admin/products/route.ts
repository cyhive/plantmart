import { NextResponse } from 'next/server';
import { requireSellerSession } from '@/lib/auth/require-seller';
import { getProductsCollection } from '@/lib/products/collection';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  const { session, response } = await requireSellerSession();
  if (response) return response;

  if (session!.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can view all products' }, { status: 403 });
  }

  try {
    const db = await getDb();
    const col = await getProductsCollection();

    const products = await col.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'sellerId',
          foreignField: '_id',
          as: 'sellerData'
        }
      },
      {
        $unwind: {
          path: '$sellerData',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: { $toString: '$_id' },
          name: 1,
          description: 1,
          price: 1,
          category: 1,
          stock: 1,
          images: 1,
          isApproved: 1,
          createdAt: 1,
          seller: {
            name: '$sellerData.name',
            shopName: { $ifNull: ['$sellerData.shopName', '$sellerData.name'] }
          }
        }
      },
      { $sort: { createdAt: -1 } }
    ]).toArray();

    return NextResponse.json({ products });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}
