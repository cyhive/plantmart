'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  SlidersHorizontal, 
  ShoppingBag, 
  Store, 
  MapPin, 
  Star, 
  Leaf, 
  IndianRupee, 
  ChevronDown, 
  Search,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface Seller {
  _id: string;
  name: string;
  shopName: string;
  avatar?: string;
  address?: {
    city?: string;
  };
}

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  images: string[];
  seller: Seller;
  ratings: { average: number; count: number };
  stock: number;
  sales?: number;
  originalPrice?: number;
  discountText?: string;
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CatalogPageContent />
    </Suspense>
  );
}

function CatalogPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Price Slider Constants
  const MIN_LIMIT = 0;
  const MAX_LIMIT = 5000;

  useEffect(() => {
    if (user) {
      fetch('/api/favorites')
        .then(res => res.json())
        .then(data => {
          if (data.favorites) {
            setFavorites(data.favorites.map((f: any) => f.productId));
          }
        })
        .catch(console.error);
    } else {
      setFavorites([]);
    }
  }, [user]);

  const toggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    const isFavorite = favorites.includes(id);
    // Optimistic update
    setFavorites(prev => 
      isFavorite ? prev.filter(fId => fId !== id) : [...prev, id]
    );

    try {
      if (isFavorite) {
        await fetch(`/api/favorites/${id}`, { method: 'DELETE' });
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: id })
        });
      }
    } catch (err) {
      console.error('Failed to toggle favorite', err);
      // Revert on error
      setFavorites(prev => 
        isFavorite ? [...prev, id] : prev.filter(fId => fId !== id)
      );
    }
  };
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sellerId: searchParams.get('sellerId') || '',
    tag: searchParams.get('tag') || '',
    minPrice: MIN_LIMIT,
    maxPrice: MAX_LIMIT,
    inStock: false,
    city: '',
    sort: 'newest',
  });

  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    nurseries: true,
    location: true
  });

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: searchParams.get('category') || '',
      search: searchParams.get('search') || '',
      sellerId: searchParams.get('sellerId') || '',
      tag: searchParams.get('tag') || '',
    }));
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    const loadCatalog = async () => {
      setLoading(true);
      setLoadError('');

      const params = new URLSearchParams();
      if (filters.category) params.set('category', filters.category);
      if (filters.search) params.set('search', filters.search);
      if (filters.sellerId) params.set('sellerId', filters.sellerId);
      if (filters.tag) params.set('tag', filters.tag);
      if (filters.city) params.set('city', filters.city);
      if (filters.sort) params.set('sort', filters.sort);
      if (filters.inStock) params.set('inStock', 'true');
      params.set('minPrice', String(filters.minPrice));
      params.set('maxPrice', String(filters.maxPrice));

      try {
        const res = await fetch(`/api/catalog/products?${params.toString()}`);
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) {
          setLoadError(typeof data.error === 'string' ? data.error : 'Failed to load catalog');
          setProducts([]);
          setSellers([]);
          return;
        }
        setProducts(data.products ?? []);
        setSellers(data.sellers ?? []);
      } catch {
        if (!cancelled) {
          setLoadError('Network error while loading catalog');
          setProducts([]);
          setSellers([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadCatalog();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  const categories = ['Indoor', 'Outdoor', 'Succulents', 'Medicinal', 'Pots', 'Other'];
  const cities = Array.from(new Set(sellers.map(s => s.address?.city).filter(Boolean)));

  const breadcrumbs = [
    { label: 'Plants', href: '/plants' },
    ...(filters.category ? [{ label: filters.category }] : []),
    ...(filters.sellerId ? [{ label: sellers.find(s => s._id === filters.sellerId)?.shopName || 'Nursery' }] : []),
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <style jsx global>{`
        input[type='range']::-webkit-slider-thumb {
          pointer-events: auto;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 2px solid #10b981;
          cursor: pointer;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          margin-top: -6px;
        }
        input[type='range']::-moz-range-thumb {
          pointer-events: auto;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 2px solid #10b981;
          cursor: pointer;
        }
        .slider-track {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          background: transparent;
          position: absolute;
        }
      `}</style>
      
      <Breadcrumbs items={breadcrumbs} />
      
      <div className="flex flex-col lg:flex-row gap-12 mt-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-80 space-y-8 h-fit lg:sticky lg:top-28">
          <div className="glass p-8 rounded-[40px] space-y-10 shadow-sm border border-white/20">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl flex items-center gap-3">
                <SlidersHorizontal className="w-5 h-5 text-emerald-600" /> Catalog Filters
              </h2>
              <button
                onClick={() => {
                  setFilters({ category: '', search: '', sellerId: '', tag: '', minPrice: MIN_LIMIT, maxPrice: MAX_LIMIT, inStock: false, city: '', sort: 'newest' });
                  router.push('/plants');
                }}
                className="text-emerald-600 text-[10px] font-black uppercase tracking-widest hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-6">
              <button onClick={() => toggleSection('price')} className="w-full flex items-center justify-between group">
                <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 group-hover:text-emerald-600 transition-colors">
                   <IndianRupee className="w-4 h-4" /> Price Range
                </h3>
                <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {expandedSections.price && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-8">
                    
                    <div className="px-2 pt-4">
                      <div className="relative h-1.5 w-full bg-slate-100 rounded-full">
                        {/* Colored Track */}
                        <div 
                          className="absolute h-full bg-emerald-500 rounded-full"
                          style={{
                            left: `${(filters.minPrice / MAX_LIMIT) * 100}%`,
                            right: `${100 - (filters.maxPrice / MAX_LIMIT) * 100}%`
                          }}
                        />
                        {/* Min Range Handle */}
                        <input
                          type="range"
                          min={MIN_LIMIT}
                          max={MAX_LIMIT}
                          step="50"
                          value={filters.minPrice}
                          onChange={(e) => {
                            const val = Math.min(Number(e.target.value), filters.maxPrice - 200);
                            setFilters({ ...filters, minPrice: val });
                          }}
                          className="slider-track pointer-events-none"
                        />
                        {/* Max Range Handle */}
                        <input
                          type="range"
                          min={MIN_LIMIT}
                          max={MAX_LIMIT}
                          step="50"
                          value={filters.maxPrice}
                          onChange={(e) => {
                            const val = Math.max(Number(e.target.value), filters.minPrice + 200);
                            setFilters({ ...filters, maxPrice: val });
                          }}
                          className="slider-track pointer-events-none"
                        />
                      </div>
                      <div className="flex justify-between mt-4">
                        <span className="text-[10px] font-bold text-slate-400 italic">₹{filters.minPrice}</span>
                        <span className="text-[10px] font-bold text-slate-400 italic">₹{filters.maxPrice}+</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative flex-grow">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">₹</span>
                        <input 
                          type="number" 
                          value={filters.minPrice}
                          onChange={(e) => setFilters({...filters, minPrice: Number(e.target.value)})}
                          className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-7 pr-3 text-xs font-bold focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                      <div className="h-px w-3 bg-slate-200" />
                      <div className="relative flex-grow">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">₹</span>
                        <input 
                          type="number" 
                          value={filters.maxPrice}
                          onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
                          className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-7 pr-3 text-xs font-bold focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Categories */}
            <div className="space-y-6">
              <button onClick={() => toggleSection('categories')} className="w-full flex items-center justify-between group">
                <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 group-hover:text-emerald-600 transition-colors">
                   <Leaf className="w-4 h-4" /> Botanical Type
                </h3>
                <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform ${expandedSections.categories ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {expandedSections.categories && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="space-y-3 pt-2">
                      {categories.map(cat => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="radio"
                              name="category"
                              checked={filters.category === cat}
                              onChange={() => setFilters({ ...filters, category: cat })}
                              className="peer appearance-none w-5 h-5 border-2 border-slate-100 rounded-full checked:border-emerald-500 transition-all cursor-pointer"
                            />
                            <div className="absolute w-2.5 h-2.5 bg-emerald-500 rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                          </div>
                          <span className={`text-xs font-bold transition-colors ${filters.category === cat ? 'text-emerald-700' : 'text-slate-500 group-hover:text-emerald-700'}`}>{cat}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Location */}
            <div className="space-y-6">
              <button onClick={() => toggleSection('location')} className="w-full flex items-center justify-between group">
                <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 group-hover:text-emerald-600 transition-colors">
                   <MapPin className="w-4 h-4" /> Nursery Location
                </h3>
                <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform ${expandedSections.location ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {expandedSections.location && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="pt-2">
                      <select 
                        value={filters.city}
                        onChange={(e) => setFilters({...filters, city: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      >
                        <option value="">All Regions</option>
                        {cities.map(city => (
                          <option key={city as string} value={city as string}>{city as string}</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Nurseries */}
            <div className="space-y-6">
              <button onClick={() => toggleSection('nurseries')} className="w-full flex items-center justify-between group">
                <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 group-hover:text-emerald-600 transition-colors">
                   <Store className="w-4 h-4" /> Trusted Nurseries
                </h3>
                <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform ${expandedSections.nurseries ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {expandedSections.nurseries && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="space-y-3 pt-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                      {sellers.map(seller => (
                        <button 
                          key={seller._id}
                          onClick={() => setFilters(prev => ({ ...prev, sellerId: prev.sellerId === seller._id ? '' : seller._id }))}
                          className={`flex items-center gap-3 w-full p-2 rounded-xl transition-all border ${filters.sellerId === seller._id ? 'bg-emerald-50 border-emerald-200' : 'border-transparent hover:bg-slate-50'}`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-[10px] overflow-hidden flex-shrink-0">
                            {seller.avatar ? <img src={seller.avatar} className="w-full h-full object-cover" alt="" /> : seller.shopName.charAt(0)}
                          </div>
                          <div className="text-left overflow-hidden">
                            <p className={`text-[10px] font-black uppercase tracking-tight truncate ${filters.sellerId === seller._id ? 'text-emerald-900' : 'text-slate-700'}`}>{seller.shopName}</p>
                            <p className="text-[9px] text-slate-400 font-medium italic leading-none truncate">{seller.address?.city || 'Local Nursery'}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Availability */}
            <div className="pt-4 border-t border-slate-100">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-600 transition-colors">Only In Stock</span>
                <div className="relative">
                   <input 
                     type="checkbox" 
                     checked={filters.inStock}
                     onChange={(e) => setFilters({...filters, inStock: e.target.checked})}
                     className="sr-only peer" 
                   />
                   <div className="w-10 h-6 bg-slate-100 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </div>
              </label>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow space-y-10">
          {loadError && (
            <motion.div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100">
              {loadError}
            </motion.div>
          )}

          {/* Header & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">
                  {filters.search 
                    ? `Results for "${filters.search}"` 
                    : filters.tag === 'new' 
                      ? 'New Arrivals 🔥' 
                      : 'Marketplace Catalog'}
                </h1>
                <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">
                  {products.length} Items
                </span>
              </div>
              <p className="text-slate-400 text-sm font-medium italic">
                {filters.tag === 'new' 
                  ? 'Check out the latest botanical specimens added to our marketplace.'
                  : 'Discover premium specimens from India\'s finest nurseries.'}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group hidden md:block">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Quick search..." 
                   value={filters.search}
                   onChange={(e) => setFilters(f => ({...f, search: e.target.value}))}
                   className="bg-white border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm"
                 />
              </div>
              <div className="flex items-center gap-3 bg-white border border-slate-100 px-5 py-3 rounded-2xl shadow-sm">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Sort By:</span>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                  className="bg-transparent font-bold text-slate-900 border-none cursor-pointer text-xs outline-none focus:ring-0 p-0"
                >
                  <option value="newest">Recent</option>
                  <option value="price-low">Lowest Price</option>
                  <option value="price-high">Highest Price</option>
                  <option value="top-sold">Top Sold</option>
                  <option value="top-rated">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-[24px] border border-slate-100 p-5 space-y-6 animate-pulse shadow-sm">
                    <div className="aspect-square bg-slate-50 rounded-[18px]" />
                    <div className="space-y-3">
                      <div className="h-5 bg-slate-50 rounded-full w-2/3" />
                      <div className="h-4 bg-slate-50 rounded-full w-1/3" />
                    </div>
                  </div>
                ))
              ) : products.length > 0 ? (
                products.map((product, i) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ delay: i * 0.04 }}
                    className="group relative bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden h-full"
                  >
                    <div className="relative aspect-square overflow-hidden m-1.5 rounded-xl bg-slate-50 flex-shrink-0">
                      <img
                        src={product.images[0] || 'https://via.placeholder.com/400x400?text=No+Image'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        <div className="glass px-2.5 py-0.5 rounded-full text-[7.5px] font-black text-emerald-900 uppercase tracking-widest shadow-xs backdrop-blur-md border border-white/40">
                          {product.category}
                        </div>
                        {product.price > 2000 && (
                          <div className="bg-slate-900 text-white px-2.5 py-0.5 rounded-full text-[7.5px] font-black uppercase tracking-widest shadow-xs flex items-center gap-1">
                            <Star className="w-1.5 h-1.5 fill-amber-400 text-amber-400" /> Rare Specimen
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={(e) => toggleFavorite(product._id, e)}
                        className="absolute top-2.5 right-2.5 z-20 w-7.5 h-7.5 glass rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 backdrop-blur-md border border-white/40 shadow-xs"
                      >
                        <Heart className={`w-3.5 h-3.5 transition-colors duration-300 ${favorites.includes(product._id) ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
                      </button>

                      {product.stock <= 0 && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[3px] flex items-center justify-center z-30">
                           <div className="bg-white/10 backdrop-blur-xl text-white px-5 py-2 rounded-full font-black uppercase tracking-[0.2em] text-[9px] border border-white/20 shadow-2xl">Sold Out</div>
                        </div>
                      )}
                    </div>

                    <div className="px-4 pb-4 pt-2.5 space-y-3 flex flex-col justify-between flex-grow">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                           <button 
                             onClick={() => product.seller?._id && setFilters(f => ({...f, sellerId: product.seller._id}))}
                             className="flex items-center gap-1 group/seller"
                           >
                             <div className="w-4.5 h-4.5 rounded bg-emerald-50 flex items-center justify-center text-[6px] font-black text-emerald-700 border border-emerald-100 group-hover/seller:bg-emerald-600 group-hover/seller:text-white transition-colors">
                               {product.seller?.shopName?.charAt(0)}
                             </div>
                             <span className="text-[8.5px] font-black uppercase tracking-widest text-slate-400 group-hover/seller:text-emerald-600 transition-colors truncate max-w-[90px]">{product.seller?.shopName}</span>
                           </button>
                           <div className="flex items-center gap-1 text-amber-500">
                             <Star className="w-3 h-3 fill-current" />
                             <span className="text-[11px] font-black text-slate-900">{product.ratings?.average || '4.5'}</span>
                           </div>
                        </div>
                        <Link href={`/plants/${product._id}`} className="block">
                          <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 group-hover:text-emerald-700 transition-colors tracking-tight line-clamp-1 italic">{product.name}</h3>
                        </Link>
                        <div className="flex items-center gap-2 text-[8.5px] font-bold text-slate-400 italic">
                           <span className="flex items-center gap-1 truncate max-w-[80px]"><MapPin className="w-2.5 h-2.5" /> {product.seller?.address?.city}</span>
                           <span className="w-0.5 h-0.5 bg-slate-200 rounded-full" />
                           <span className="flex items-center gap-1"><Leaf className="w-2.5 h-2.5" /> Healthy Specimen</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100/60 space-y-2.5">
                        <div className="flex items-baseline justify-between">
                           <span className="text-[8.5px] font-black uppercase tracking-widest text-slate-400">
                             {product.originalPrice ? (
                               <span className="text-[8px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/80">
                                 {product.discountText}
                               </span>
                             ) : 'Starting from'}
                           </span>
                           <div className="flex items-baseline gap-1.5 flex-wrap justify-end">
                             {product.originalPrice && (
                               <span className="text-[10px] text-slate-450 font-medium line-through">₹{product.originalPrice}</span>
                             )}
                             <div className="flex items-baseline gap-0.5">
                               <span className="text-xs font-black text-emerald-600 italic">₹</span>
                               <span className="text-lg font-display font-black text-slate-900">{product.price}</span>
                             </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 w-full">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addItem({
                                id: product._id,
                                name: product.name,
                                price: product.price,
                                image: product.images[0] || '',
                                quantity: 1,
                                seller: { name: product.seller.name, shopName: product.seller.shopName }
                              });
                            }}
                            className="flex-1 bg-emerald-50 text-emerald-700 h-9 rounded-lg flex items-center justify-center hover:bg-emerald-100 transition-colors border border-emerald-500/10 text-[9px] font-bold cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" /> <span className="ml-1 text-[9px] hidden sm:inline">Add to Cart</span><span className="ml-1 text-[9px] sm:hidden">Add</span>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addItem({
                                id: product._id,
                                name: product.name,
                                price: product.price,
                                image: product.images[0] || '',
                                quantity: 1,
                                seller: { name: product.seller.name, shopName: product.seller.shopName }
                              });
                              router.push('/cart');
                            }}
                            className="flex-1 bg-slate-900 text-white h-9 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-all shadow-xs text-[9px] font-black uppercase tracking-wider cursor-pointer"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-40 text-center space-y-8 glass rounded-[48px] border border-white/20">
                   <div className="relative w-32 h-32 mx-auto">
                      <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20" />
                      <div className="relative w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center text-6xl">🌵</div>
                   </div>
                   <div className="space-y-3">
                     <h3 className="text-3xl font-display font-bold text-slate-900 tracking-tight">No Botanical Matches Found</h3>
                     <p className="text-slate-500 font-medium italic max-w-sm mx-auto">We couldn't find any specimens that match your current selection. Try broadening your criteria.</p>
                   </div>
                   <button 
                     onClick={() => {
                       setFilters({ category: '', search: '', sellerId: '', tag: '', minPrice: MIN_LIMIT, maxPrice: MAX_LIMIT, inStock: false, city: '', sort: 'newest' });
                       router.push('/plants');
                     }}
                     className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
                   >
                     Reset All Filters
                   </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}