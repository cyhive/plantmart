import { NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/users/collection';
import { toPublicUser } from '@/lib/models/user';

import { getProductsCollection } from '@/lib/products/collection';

export async function GET(req: Request) {
  try {
    const col = await getUsersCollection();
    const productCol = await getProductsCollection();
    // Only fetch registered sellers
    const cursor = col.find({ role: 'seller' }).sort({ createdAt: -1 });
    const docs = await cursor.toArray();
    
    // Map them to the format expected by the frontend
    const sellers = await Promise.all(docs.map(async (doc) => {
      const publicUser = toPublicUser(doc);
      
      const sellerProducts = await productCol.find({ sellerId: doc._id }).toArray();
      const plantsCount = sellerProducts.length;
      
      let averageRating = 0;
      let totalScore = 0;
      let totalCount = 0;
      
      sellerProducts.forEach(product => {
        if (product.ratings && product.ratings.count > 0) {
          totalScore += (product.ratings.average * product.ratings.count);
          totalCount += product.ratings.count;
        }
      });
      
      if (totalCount > 0) {
        averageRating = Number((totalScore / totalCount).toFixed(1));
      }
      
      return {
        id: publicUser.id,
        name: publicUser.shopName || publicUser.name,
        location: publicUser.address?.city 
          ? `${publicUser.address.city}, ${publicUser.address.state || ''}`
          : 'India',
        rating: averageRating,
        plants: plantsCount,
        image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=400', // Default image
        description: (doc as any).businessDescription || 'Providing high-quality botanical specimens and expert plant care advice.',
        category: 'Premium',
        verified: (doc as any).isApproved || true,
        tags: ['Indoor', 'Outdoor', 'Plants']
      };
    }));

    return NextResponse.json({ sellers });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load sellers' }, { status: 500 });
  }
}
