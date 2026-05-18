import { NextResponse } from 'next/server';
import { requireSellerSession, parseObjectId, canManageProduct } from '@/lib/auth/require-seller';
import { getProductsCollection } from '@/lib/products/collection';
import { updateProductSchema } from '@/lib/validators/product';
import { toSellerProduct } from '@/lib/models/product';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: RouteContext) {
  const { session, response } = await requireSellerSession();
  if (response) return response;

  const { id } = await context.params;
  const productId = parseObjectId(id);
  if (!productId) {
    return NextResponse.json({ error: 'Invalid product id' }, { status: 400 });
  }

  try {
    const col = await getProductsCollection();
    const doc = await col.findOne({ _id: productId });
    if (!doc) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    if (!canManageProduct(session!, doc.sellerId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ product: toSellerProduct(doc) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load product' }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  const { session, response } = await requireSellerSession();
  if (response) return response;

  const { id } = await context.params;
  const productId = parseObjectId(id);
  if (!productId) {
    return NextResponse.json({ error: 'Invalid product id' }, { status: 400 });
  }

  try {
    const json = await req.json();
    const parsed = updateProductSchema.safeParse(json);
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      const fieldMsg = [flat.fieldErrors, flat.formErrors]
        .flatMap((o) => (typeof o === 'object' && o ? Object.values(o).flat() : []))
        .filter((x): x is string => typeof x === 'string')
        .join(' ');
      return NextResponse.json(
        { error: fieldMsg || 'Invalid input', details: flat.fieldErrors },
        { status: 400 },
      );
    }

    const col = await getProductsCollection();
    const existing = await col.findOne({ _id: productId });
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    if (!canManageProduct(session!, existing.sellerId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updates = {
      ...parsed.data,
      updatedAt: new Date(),
    };

    const result = await col.findOneAndUpdate(
      { _id: productId },
      { $set: updates },
      { returnDocument: 'after' },
    );

    if (!result) {
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }

    return NextResponse.json({ product: toSellerProduct(result) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  const { session, response } = await requireSellerSession();
  if (response) return response;

  const { id } = await context.params;
  const productId = parseObjectId(id);
  if (!productId) {
    return NextResponse.json({ error: 'Invalid product id' }, { status: 400 });
  }

  try {
    const col = await getProductsCollection();
    const existing = await col.findOne({ _id: productId });
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    if (!canManageProduct(session!, existing.sellerId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const result = await col.deleteOne({ _id: productId });
    if (result.deletedCount !== 1) {
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
