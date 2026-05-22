import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getSessionFromCookies } from '@/lib/auth/get-session';
import { getFavoritesCollection } from '@/lib/favorites/collection';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await getSessionFromCookies();
    if (!session?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await params;
    const col = await getFavoritesCollection();
    
    await col.deleteOne({
      userId: new ObjectId(session.sub),
      productId: new ObjectId(productId)
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting favorite:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
