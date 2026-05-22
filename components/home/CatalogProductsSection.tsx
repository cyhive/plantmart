'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowRight, Heart, Leaf, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';

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
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

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

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
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
            const image = product.images[0] || 'https://via.placeholder.com/400?text=Plant';
            const seller = { name: product.seller.name, shopName: product.seller.shopName };
            return (
              <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group bg-white rounded-[24px] border p-3 flex flex-col">
                <Link href={`/plants/${product._id}`} className="flex flex-col flex-1 justify-between">
                  <motion.div>
                    <motion.div className="relative aspect-square rounded-[18px] overflow-hidden bg-slate-50 mb-4">
                      <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <motion.div className="absolute top-3 left-3 glass py-1 px-2 rounded-lg text-[9px] font-bold uppercase">{product.category}</motion.div>
                    </motion.div>
                    <h3 className="font-bold text-slate-900 line-clamp-1">{product.name}</h3>
                    <p className="text-[10px] text-slate-400 truncate">{product.seller.shopName}</p>
                    <p className="text-emerald-700 font-bold">₹{product.price}</p>
                  </motion.div>
                  <motion.div className="flex gap-2 mt-3 pt-3 border-t">
                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem({ id: product._id, name: product.name, price: product.price, image, quantity: 1, seller }); }} className="flex-1 bg-emerald-50 text-emerald-700 py-2 rounded-xl text-xs font-bold"><ShoppingBag className="w-3.5 h-3.5 inline" /> Add</button>
                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem({ id: product._id, name: product.name, price: product.price, image, quantity: 1, seller }); router.push('/cart'); }} className="flex-1 bg-slate-900 text-white py-2 rounded-xl text-xs font-bold">Buy</button>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </section>
  );
}
