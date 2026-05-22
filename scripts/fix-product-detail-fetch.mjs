import { readFileSync, writeFileSync } from 'fs';

const p = 'app/plants/[id]/page.tsx';
let t = readFileSync(p, 'utf8');

const mockStart = t.indexOf('const MOCK_PRODUCTS: Record<string, Product> = {');
const mockEnd = t.indexOf('export default function ProductDetailPage()');
if (mockStart < 0 || mockEnd < 0) throw new Error('mock block not found');

const helper = `import { DEFAULT_PRODUCT_IMAGE } from '@/lib/products/defaults';

type CatalogApiProduct = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  ratings: { average: number; count: number };
  seller: { _id: string; name: string; shopName: string };
};

function catalogToDetailProduct(p: CatalogApiProduct): Product {
  const images =
    p.images?.filter((url) => typeof url === 'string' && url.trim()).length > 0
      ? p.images
      : [DEFAULT_PRODUCT_IMAGE];

  return {
    _id: p._id,
    name: p.name,
    description: p.description || '',
    price: p.price,
    category: p.category,
    images,
    stock: p.stock ?? 0,
    seller: {
      name: p.seller.name,
      shopName: p.seller.shopName,
      _id: p.seller._id,
    },
    careTips: {
      sunlight: 'Moderate indirect light',
      watering: 'When topsoil feels dry',
      difficulty: 'Beginner',
      soil: 'Well-draining potting mix',
      propagation: 'Stem cuttings or division',
      humidity: 'Average room humidity',
      fertilizer: 'Balanced feed during growing season',
    },
    ratings: p.ratings ?? { average: 0, count: 0 },
    specifications: {
      scientificName: p.name,
      family: '—',
      origin: 'Nursery grown',
      petFriendly: false,
      airPurifying: false,
      matureSize: 'Varies with care',
    },
  };
}

`;

t = t.slice(0, mockStart) + helper + t.slice(mockEnd);

const oldEffect = `  useEffect(() => {
    // Simulate API Fetch with Mock Data
    const mockProducts: Record<string, Product> = {
      '1': { _id: '1', name: 'Monstera Deliciosa', description: 'The Swiss Cheese plant is a classic favorite for its large, iconic leaves.', price: 1299, category: 'Indoor', images: ['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800'], stock: 10, seller: { name: 'Green Garden', shopName: 'Green Garden Nursery', _id: '1' }, careTips: { sunlight: 'Partial Shade', watering: 'Weekly', difficulty: 'Beginner' }, ratings: { average: 4.9, count: 128 } },
      '2': { _id: '2', name: 'Snake Plant', description: 'Perfect for beginners, this hardy plant can survive in low light and irregular watering.', price: 899, category: 'Indoor', images: ['https://images.unsplash.com/photo-1593482892290-f54927ae1bbc?auto=format&fit=crop&q=80&w=800'], stock: 15, seller: { name: 'Air Purifiers', shopName: 'Pure Air Nursery', _id: '2' }, careTips: { sunlight: 'Low Light', watering: 'Bi-weekly', difficulty: 'Beginner' }, ratings: { average: 4.8, count: 95 } },
      '3': { _id: '3', name: 'Fiddle Leaf Fig', description: 'An elegant statement piece with large, waxy leaves that love bright, indirect light.', price: 2499, category: 'Outdoor', images: ['https://images.unsplash.com/photo-1597055181300-e3633a207519?auto=format&fit=crop&q=80&w=800'], stock: 5, seller: { name: 'Tree Experts', shopName: 'Expert Tree Farm', _id: '3' }, careTips: { sunlight: 'Bright Indirect', watering: 'Weekly', difficulty: 'Intermediate' }, ratings: { average: 4.7, count: 64 } },
      '4': { _id: '4', name: 'Peace Lily', description: 'Known for its beautiful white blooms and air-purifying qualities.', price: 699, category: 'Indoor', images: ['https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&q=80&w=800'], stock: 20, seller: { name: 'Bloom Valley', shopName: 'Bloom Valley Florals', _id: '4' }, careTips: { sunlight: 'Partial Shade', watering: 'Twice Weekly', difficulty: 'Beginner' }, ratings: { average: 4.9, count: 82 } }
    };

    setTimeout(() => {
      const foundProduct = MOCK_PRODUCTS[id as string] || MOCK_PRODUCTS['1'];
      setProduct(foundProduct);
      setLoading(false);

      if (user) {
        setUserAddress({
          street: '88 Green Avenue',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560001'
        });
      } else {
        // Mock address for checkout simulator
        setUserAddress({
          street: '12 Orchid Lane, Indira Nagar',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560038'
        });
      }
    }, 600);
  }, [id, user]);`;

const newEffect = `  useEffect(() => {
    if (!user) {
      setUserAddress(null);
      return;
    }
    setUserAddress({
      street: '88 Green Avenue',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001',
    });
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    const productId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';
    if (!productId) {
      setProduct(null);
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(\`/api/catalog/products/\${encodeURIComponent(productId)}\`);
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok || !data.product) {
          setProduct(null);
          return;
        }
        setProduct(catalogToDetailProduct(data.product));
        setActiveImage(0);
        setQuantity(1);
      } catch {
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);`;

if (!t.includes(oldEffect.slice(0, 80))) {
  console.error('useEffect block not found');
  process.exit(1);
}
t = t.replace(oldEffect, newEffect);

// Move import to top with other imports
if (!t.includes("from '@/lib/products/defaults'")) {
  throw new Error('helper import missing');
}
t = t.replace(
  "import ProductReviewForm from '@/components/plants/ProductReviewForm';",
  "import ProductReviewForm from '@/components/plants/ProductReviewForm';\nimport { DEFAULT_PRODUCT_IMAGE } from '@/lib/products/defaults';",
);
t = t.replace(
  "import { DEFAULT_PRODUCT_IMAGE } from '@/lib/products/defaults';\n\ntype CatalogApiProduct",
  'type CatalogApiProduct',
);

writeFileSync(p, t);
console.log('done');
