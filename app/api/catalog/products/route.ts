import { NextResponse } from 'next/server';
import {
  buildCatalogMongoFilter,
  filterCatalogProducts,
  loadCatalogProducts,
  sortCatalogProducts,
  uniqueCatalogSellers,
} from '@/lib/products/catalog';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category')?.trim() || undefined;
    const search = searchParams.get('search')?.trim() || undefined;
    const sellerId = searchParams.get('sellerId')?.trim() || undefined;
    const tag = searchParams.get('tag')?.trim() || undefined;
    const city = searchParams.get('city')?.trim() || undefined;
    const sort = searchParams.get('sort')?.trim() || 'newest';
    const inStock = searchParams.get('inStock') === 'true';
    const minPrice = searchParams.has('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.has('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

    const mongoFilter = buildCatalogMongoFilter({
      category,
      search,
      sellerId,
      inStock,
      minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
      maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    });

    let products = await loadCatalogProducts(mongoFilter);
    products = filterCatalogProducts(products, { city, tag });
    products = sortCatalogProducts(products, sort);

    return NextResponse.json({
      products,
      sellers: uniqueCatalogSellers(products),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load catalog' }, { status: 500 });
  }
}
