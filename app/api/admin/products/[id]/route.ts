import { NextResponse } from 'next/server';
import { requireSellerSession, parseObjectId } from '@/lib/auth/require-seller';
import { getProductsCollection } from '@/lib/products/collection';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireSellerSession();
  if (response) return response;

  if (session!.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can approve products' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const productId = parseObjectId(id);
    if (!productId) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const json = await req.json();
    const { isApproved } = json;

    if (typeof isApproved !== 'boolean') {
      return NextResponse.json({ error: 'isApproved boolean is required' }, { status: 400 });
    }

    const col = await getProductsCollection();
    const result = await col.findOneAndUpdate(
      { _id: productId },
      { $set: { isApproved, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, isApproved: result.isApproved });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireSellerSession();
  if (response) return response;

  if (session!.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can delete products' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const productId = parseObjectId(id);
    if (!productId) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const col = await getProductsCollection();
    const result = await col.deleteOne({ _id: productId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
