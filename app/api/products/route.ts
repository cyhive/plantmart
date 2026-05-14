import { NextResponse } from 'next/server';
import { requireSellerSession, parseObjectId } from '@/lib/auth/require-seller';
import { getProductsCollection } from '@/lib/products/collection';
import { createProductSchema } from '@/lib/validators/product';
import { toSellerProduct } from '@/lib/models/product';

export async function GET() {
  const { session, response } = await requireSellerSession();
  if (response) return response;

  try {
    const col = await getProductsCollection();
    const sellerId = parseObjectId(session!.sub);
    if (!sellerId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const filter = session!.role === 'admin' ? {} : { sellerId };
    const docs = await col.find(filter).sort({ createdAt: -1 }).limit(500).toArray();
    return NextResponse.json({ products: docs.map(toSellerProduct) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { session, response } = await requireSellerSession();
  if (response) return response;

  if (session!.role !== 'seller') {
    return NextResponse.json({ error: 'Only sellers can create products' }, { status: 403 });
  }

  try {
    const json = await req.json();
    const parsed = createProductSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const sellerId = parseObjectId(session!.sub);
    if (!sellerId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const now = new Date();
    const col = await getProductsCollection();
    const { insertedId } = await col.insertOne({
      sellerId,
      name: parsed.data.name,
      description: parsed.data.description,
      price: parsed.data.price,
      category: parsed.data.category,
      stock: parsed.data.stock,
      images: parsed.data.images,
      isApproved: true,
      ratings: { average: 0, count: 0 },
      sales: 0,
      createdAt: now,
      updatedAt: now,
    } as never);

    const doc = await col.findOne({ _id: insertedId });
    if (!doc) {
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }

    return NextResponse.json({ product: toSellerProduct(doc) }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
