import { NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/users/collection';
import { toPublicUser } from '@/lib/models/user';

export async function GET(req: Request) {
  try {
    const col = await getUsersCollection();
    // Only fetch registered sellers
    const cursor = col.find({ role: 'seller' }).sort({ createdAt: -1 });
    const docs = await cursor.toArray();
    
    // Map them to the format expected by the frontend
    const sellers = docs.map((doc) => {
      const publicUser = toPublicUser(doc);
      return {
        id: publicUser.id,
        name: publicUser.shopName || publicUser.name,
        location: publicUser.address?.city 
          ? `${publicUser.address.city}, ${publicUser.address.state || ''}`
          : 'India',
        rating: 4.8, // Default rating as we don't have a rating system yet
        plants: 150, // Default plants count
        image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=400', // Default image
        description: (doc as any).businessDescription || 'Providing high-quality botanical specimens and expert plant care advice.',
        category: 'Premium',
        verified: (doc as any).isApproved || true,
        tags: ['Indoor', 'Outdoor', 'Plants']
      };
    });

    return NextResponse.json({ sellers });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load sellers' }, { status: 500 });
  }
}
