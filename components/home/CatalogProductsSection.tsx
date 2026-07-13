'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowRight, Heart, Leaf, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

type CatalogProduct = {
  _id: string;
  name: string;
  price: number;
  category: string;
  images: string[];
  ratings: { average: number; count: number };
  seller: { name: string; shopName: string };
};

export function CatalogProductsSection() {
  const router = useRouter();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/catalog/products?sort=newest');
        const data = await res.json().catch(() => ({}));
        if (!cancelled && res.ok) setProducts((data.products ?? []).slice(0, 8));
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const toggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push('/login');
      return;
    }

    const isFavorite = favorites.includes(id);
    setFavorites((prev) => (isFavorite ? prev.filter((x) => x !== id) : [...prev, id]));

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
      setFavorites((prev) => (isFavorite ? [...prev, id] : prev.filter((x) => x !== id)));
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <motion.div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <motion.div className="text-center sm:text-left space-y-4">
          <h2 className="text-5xl font-display font-bold text-slate-900 tracking-tight">Fresh from our nurseries</h2>
          <p className="text-slate-500 text-lg font-medium">Live specimens listed by verified sellers</p>
        </motion.div>
        <Link href="/plants" className="inline-flex items-center gap-2 text-emerald-700 font-bold hover:text-emerald-800">
          View all plants <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>

      {loading ? (
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[0,1,2,3].map((i) => (
            <motion.div key={i} className="bg-white rounded-[24px] border p-3 animate-pulse">
              <motion.div className="aspect-square bg-slate-100 rounded-[18px] mb-4" />
              <motion.div className="h-4 bg-slate-100 rounded w-3/4" />
            </motion.div>
          ))}
        </motion.div>
      ) : products.length === 0 ? (
        <motion.div className="text-center py-16 bg-white rounded-[32px] border">
          <Leaf className="w-12 h-12 text-emerald-200 mx-auto mb-4" />
          <p className="text-slate-500">No specimens yet. Sellers can add plants from inventory.</p>
          <Link href="/plants" className="inline-block mt-6 text-emerald-600 font-bold">Browse catalog</Link>
        </motion.div>
      ) : (
        <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product, i) => {
            const image = product.images[0] || 'https://via.placeholder.com/400x400?text=No+Image';
            const seller = { name: product.seller.name, shopName: product.seller.shopName };
            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="group relative bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden h-full"
              >
                <div className="relative aspect-square overflow-hidden m-1.5 rounded-xl bg-slate-50 flex-shrink-0">
                  <img
                    src={image}
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
                </div>

                <div className="px-4 pb-4 pt-2.5 space-y-3 flex flex-col justify-between flex-grow">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-1 group/seller">
                         <div className="w-4.5 h-4.5 rounded bg-emerald-50 flex items-center justify-center text-[6px] font-black text-emerald-700 border border-emerald-100 group-hover/seller:bg-emerald-600 group-hover/seller:text-white transition-colors">
                           {product.seller?.shopName?.charAt(0) || 'S'}
                         </div>
                         <span className="text-[8.5px] font-black uppercase tracking-widest text-slate-400 group-hover/seller:text-emerald-600 transition-colors truncate max-w-[90px]">{product.seller?.shopName}</span>
                       </div>
                       <div className="flex items-center gap-1 text-amber-500">
                         <Star className="w-3 h-3 fill-current" />
                         <span className="text-[11px] font-black text-slate-900">{product.ratings?.average || '4.5'}</span>
                       </div>
                    </div>
                    <Link href={`/plants/${product._id}`} className="block">
                      <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 group-hover:text-emerald-700 transition-colors tracking-tight line-clamp-1 italic">{product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-2 text-[8.5px] font-bold text-slate-400 italic">
                       <span className="flex items-center gap-1 truncate max-w-[80px]"><Leaf className="w-2.5 h-2.5" /> Healthy Specimen</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100/60 space-y-2.5">
                    <div className="flex items-baseline justify-between">
                       <span className="text-[8.5px] font-black uppercase tracking-widest text-slate-400">
                         Starting from
                       </span>
                       <div className="flex items-baseline gap-1.5 flex-wrap justify-end">
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
                          if (!user) { router.push('/login'); return; }
                          addItem({ id: product._id, name: product.name, price: product.price, image, quantity: 1, seller });
                        }}
                        className="flex-1 bg-emerald-50 text-emerald-700 h-9 rounded-lg flex items-center justify-center hover:bg-emerald-100 transition-colors border border-emerald-500/10 text-[9px] font-bold cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> <span className="ml-1 text-[9px] hidden sm:inline">Add to Cart</span><span className="ml-1 text-[9px] sm:hidden">Add</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!user) { router.push('/login'); return; }
                          addItem({ id: product._id, name: product.name, price: product.price, image, quantity: 1, seller });
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
            );
          })}
        </motion.div>
      )}
    </section>
  );
}
