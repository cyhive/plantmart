import { NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/users/collection';
import { toPublicUser } from '@/lib/models/user';
import { ObjectId } from 'mongodb';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid seller ID' }, { status: 400 });
    }

    const col = await getUsersCollection();
    const doc = await col.findOne({ _id: new ObjectId(id), role: 'seller' });
    
    if (!doc) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }
    
    const publicUser = toPublicUser(doc);
    
    const { getProductsCollection } = await import('@/lib/products/collection');
    const productCol = await getProductsCollection();
    
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
    
    const seller = {
      id: publicUser.id,
      name: publicUser.shopName || publicUser.name,
      shopName: publicUser.shopName || publicUser.name,
      location: publicUser.address?.city 
        ? `${publicUser.address.city}, ${publicUser.address.state || ''}`
        : 'India',
      rating: averageRating,
      plants: plantsCount,
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1200',
      description: (doc as any).businessDescription || 'Providing high-quality botanical specimens and expert plant care advice.',
      joinedDate: publicUser.createdAt ? new Date(publicUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2024',
      verified: (doc as any).isApproved || true,
    };

    return NextResponse.json({ seller });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load seller details' }, { status: 500 });
  }
}
