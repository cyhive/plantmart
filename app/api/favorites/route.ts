import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getSessionFromCookies } from '@/lib/auth/get-session';
import { getFavoritesCollection } from '@/lib/favorites/collection';
import { toPublicFavorite } from '@/lib/models/favorite';
import { getProductsCollection } from '@/lib/products/collection';
import { loadCatalogProducts } from '@/lib/products/catalog';

export async function GET(req: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const col = await getFavoritesCollection();
    const cursor = col.find({ userId: new ObjectId(session.sub) }).sort({ createdAt: -1 });
    const docs = await cursor.toArray();

    const productIds = docs.map(d => d.productId);
    const productsDocs = await loadCatalogProducts({ _id: { $in: productIds } });
    
    const favorites = docs.map(doc => {
      const product = productsDocs.find(p => p._id === doc.productId.toHexString());
      return {
        ...toPublicFavorite(doc),
        product: product || null,
      };
    });

    return NextResponse.json({ favorites });
  } catch (err) {
    console.error('Error fetching favorites:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    }

    const col = await getFavoritesCollection();
    const userId = new ObjectId(session.sub);
    const productId = new ObjectId(body.productId);
    
    const now = new Date();
    
    await col.updateOne(
      { userId, productId },
      { $setOnInsert: { userId, productId, createdAt: now } },
      { upsert: true }
    );
    
    const savedFavorite = await col.findOne({ userId, productId });
    
    if (!savedFavorite) {
      return NextResponse.json({ error: 'Failed to save favorite' }, { status: 500 });
    }

    return NextResponse.json({ favorite: toPublicFavorite(savedFavorite) }, { status: 201 });
  } catch (err) {
    console.error('Error adding favorite:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
