import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSessionFromCookies } from '@/lib/auth/get-session';

export async function GET(req: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session?.sub || session.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sellerId = session.sub;

    const db = await getDb();
    
    // Fetch reviews for this seller
    const sellerReviews = await db.collection('sellerReviews')
      .find({ sellerId })
      .sort({ createdAt: -1 })
      .toArray();

    // Fetch product reviews
    const products = await db.collection('products').find({ sellerId: new ObjectId(sellerId) }).toArray();
    const productIds = products.map(p => p._id.toString());
    
    let productReviews = [];
    if (productIds.length > 0) {
      productReviews = await db.collection('productReviews')
        .find({ productId: { $in: productIds } })
        .toArray();
    }

    const sellerReviewsTagged = sellerReviews.map(r => ({ ...r, reviewType: 'Seller' }));
    const productReviewsTagged = productReviews.map(r => {
      const product = products.find(p => p._id.toString() === r.productId);
      return { 
        ...r, 
        reviewType: 'Product',
        productName: product ? product.name : 'Unknown Product'
      };
    });

    const reviews = [...sellerReviewsTagged, ...productReviewsTagged].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Get statistics
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? (reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0) / totalReviews).toFixed(1)
      : 0;
      
    // Rating breakdown
    const ratingBreakdown = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    return NextResponse.json({ 
      reviews,
      stats: {
        totalReviews,
        averageRating,
        ratingBreakdown
      }
    });
  } catch (err) {
    console.error('Failed to load seller reviews:', err);
    return NextResponse.json({ error: 'Failed to load reviews' }, { status: 500 });
  }
}
