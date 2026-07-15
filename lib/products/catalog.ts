import type { ObjectId } from 'mongodb';
import type { ProductDocument } from '@/lib/models/product';
import type { UserDocument } from '@/lib/models/user';
import type { ProductDiscountDocument } from '@/lib/models/product_discount';

export type CatalogSeller = {
  _id: string;
  name: string;
  shopName: string;
  avatar?: string;
  address?: {
    city?: string;
  };
};

export type CatalogProduct = {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  stock: number;
  sales: number;
  ratings: { average: number; count: number };
  seller: CatalogSeller;
  createdAt: string;
};

export function toCatalogSeller(seller: UserDocument): CatalogSeller {
  return {
    _id: seller._id.toHexString(),
    name: seller.name,
    shopName: seller.shopName ?? seller.name,
  };
}

export function toCatalogProduct(doc: ProductDocument, seller: UserDocument | null, discount?: ProductDiscountDocument | null): CatalogProduct {
  const sellerId = doc.sellerId.toHexString();
  return {
    _id: doc._id.toHexString(),
    name: doc.name,
    description: doc.description,
    price: discount ? discount.discountedPrice : doc.price,
    originalPrice: discount ? doc.price : undefined,
    category: doc.category,
    images: doc.images,
    stock: doc.stock,
    sales: doc.sales,
    ratings: doc.ratings,
    createdAt: doc.createdAt.toISOString(),
    seller: seller
      ? toCatalogSeller(seller)
      : {
          _id: sellerId,
          name: 'Seller',
          shopName: 'Nursery',
        },
  };
}

export function uniqueCatalogSellers(products: CatalogProduct[]): CatalogSeller[] {
  const byId = new Map<string, CatalogSeller>();
  for (const product of products) {
    if (!byId.has(product.seller._id)) {
      byId.set(product.seller._id, product.seller);
    }
  }
  return Array.from(byId.values()).sort((a, b) => a.shopName.localeCompare(b.shopName));
}

export function sortCatalogProducts(products: CatalogProduct[], sort: string) {
  const sorted = [...products];
  if (sort === 'price-low') sorted.sort((a, b) => a.price - b.price);
  else if (sort === 'price-high') sorted.sort((a, b) => b.price - a.price);
  else if (sort === 'top-sold') sorted.sort((a, b) => b.sales - a.sales);
  else if (sort === 'top-rated') sorted.sort((a, b) => b.ratings.average - a.ratings.average);
  else sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return sorted;
}

export function filterCatalogProducts(
  products: CatalogProduct[],
  filters: { city?: string; tag?: string },
) {
  let filtered = products;
  if (filters.city) {
    filtered = filtered.filter((product) => product.seller.address?.city === filters.city);
  }
  if (filters.tag === 'new') {
    const cutoff = Date.now() - 30 * 86_400_000;
    filtered = filtered.filter((product) => new Date(product.createdAt).getTime() >= cutoff);
  }
  return filtered;
}

export function buildCatalogMongoFilter(params: {
  category?: string;
  search?: string;
  sellerId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}) {
  const filter: Record<string, unknown> = { isApproved: true };

  if (params.category) {
    filter.category = params.category;
  }
  if (params.sellerId) {
    filter.sellerId = params.sellerId;
  }
  if (params.search) {
    filter.name = { $regex: params.search, $options: 'i' };
  }
  if (params.inStock) {
    filter.stock = { $gt: 0 };
  }
  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    const price: Record<string, number> = {};
    if (params.minPrice !== undefined) price.$gte = params.minPrice;
    if (params.maxPrice !== undefined) price.$lte = params.maxPrice;
    filter.price = price;
  }

  return filter;
}

export async function loadCatalogProducts(filter: Record<string, unknown>) {
  const { getProductsCollection } = await import('@/lib/products/collection');
  const { getUsersCollection } = await import('@/lib/users/collection');
  const { ObjectId } = await import('mongodb');

  const productCol = await getProductsCollection();
  const userCol = await getUsersCollection();

  const mongoFilter = { ...filter };
  if (typeof mongoFilter.sellerId === 'string') {
    try {
      mongoFilter.sellerId = new ObjectId(mongoFilter.sellerId);
    } catch {
      return [];
    }
  }

  const docs = await productCol.find(mongoFilter).sort({ createdAt: -1 }).limit(500).toArray();
  if (docs.length === 0) return [];

  const sellerIds = [...new Set(docs.map((doc) => doc.sellerId.toHexString()))].map((id) => new ObjectId(id));
  const sellers = await userCol.find({ _id: { $in: sellerIds } }).toArray();
  const sellerById = new Map(sellers.map((seller) => [seller._id.toHexString(), seller]));

  const { getActiveDiscountsForProducts } = await import('@/lib/product_discounts/active');
  const discounts = await getActiveDiscountsForProducts(docs.map((d) => d._id));
  const discountByProductId = new Map(discounts.map((d) => [d.productId.toHexString(), d]));

  return docs.map((doc) => toCatalogProduct(
    doc, 
    sellerById.get(doc.sellerId.toHexString()) ?? null,
    discountByProductId.get(doc._id.toHexString())
  ));
}

export async function loadCatalogProductById(id: string) {
  const { getProductsCollection } = await import('@/lib/products/collection');
  const { getUsersCollection } = await import('@/lib/users/collection');
  const { ObjectId } = await import('mongodb');

  let productId: ObjectId;
  try {
    productId = new ObjectId(id);
  } catch {
    return null;
  }

  const productCol = await getProductsCollection();
  const doc = await productCol.findOne({ _id: productId, isApproved: true });
  if (!doc) return null;

  const userCol = await getUsersCollection();
  const seller = await userCol.findOne({ _id: doc.sellerId });
  
  const { getActiveDiscountsForProducts } = await import('@/lib/product_discounts/active');
  const discounts = await getActiveDiscountsForProducts([productId]);

  return toCatalogProduct(doc, seller, discounts[0]);
}
