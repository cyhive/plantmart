import { NextResponse } from 'next/server';
import { loadCatalogProductById } from '@/lib/products/catalog';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const product = await loadCatalogProductById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load product' }, { status: 500 });
  }
}
