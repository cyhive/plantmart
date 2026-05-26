'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Tag, Sparkles, Clock, Copy, ArrowRight, IndianRupee } from 'lucide-react';
import Link from 'next/link';

type PublicPromotion = {
  id: string;
  title: string;
  code: string;
  discountPercentage: number;
  minPurchase: number;
  description: string;
  validUntil: string;
};

type PublicDiscount = {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  originalPrice: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountedPrice: number;
  validUntil: string;
};

export default function OffersPage() {
  const [promotions, setPromotions] = useState<PublicPromotion[]>([]);
  const [discounts, setDiscounts] = useState<PublicDiscount[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch('/api/offers');
        if (res.ok) {
          const data = await res.json();
          setPromotions(data.promotions || []);
          setDiscounts(data.discounts || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs uppercase tracking-widest">
            <Sparkles className="w-4 h-4" /> Live Deals
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight">
            Special Offers & <span className="text-emerald-600">Discounts</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            Discover the best deals from our top nurseries. Apply these codes at checkout or shop directly discounted specimens!
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 font-medium animate-pulse">Loading active offers...</div>
        ) : (
          <>
            {/* Coupon Codes */}
            {promotions.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-2xl font-display font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-4">
                  <Tag className="w-6 h-6 text-emerald-500" /> Coupon Codes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {promotions.map((promo) => (
                    <motion.div 
                      key={promo.id}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                      
                      <div className="space-y-4 relative z-10">
                        <div className="flex items-start justify-between">
                          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                            {promo.discountPercentage}% OFF
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-md">
                            <Clock className="w-3 h-3" /> Ends {new Date(promo.validUntil).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{promo.title}</h3>
                          <p className="text-sm text-slate-500 mt-1">{promo.description}</p>
                        </div>
                        
                        {promo.minPurchase > 0 && (
                          <p className="text-xs font-bold text-slate-400">Min. order ₹{promo.minPurchase}</p>
                        )}
                        
                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-3">
                          <div className="flex-1 font-mono font-bold text-slate-700 bg-slate-50 px-4 py-3 rounded-xl text-center tracking-widest border border-slate-200 border-dashed">
                            {promo.code}
                          </div>
                          <button 
                            onClick={() => handleCopyCode(promo.code)}
                            className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 active:scale-95"
                          >
                            {copiedCode === promo.code ? <span className="text-xs font-bold px-1">Copied!</span> : <Copy className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Product Discounts */}
            {discounts.length > 0 && (
              <section className="space-y-6 pt-10">
                <h2 className="text-2xl font-display font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-4">
                  <Sparkles className="w-6 h-6 text-emerald-500" /> Direct Specimen Discounts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {discounts.map((disc) => (
                    <motion.div 
                      key={disc.id}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm group"
                    >
                      <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
                        <img src={disc.productImage} alt={disc.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-black shadow-lg">
                          {disc.discountType === 'percentage' ? `${disc.discountValue}% OFF` : `₹${disc.discountValue} OFF`}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-slate-900 truncate">{disc.productName}</h3>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-emerald-600 text-lg flex items-center">
                            <IndianRupee className="w-4 h-4" />{disc.discountedPrice}
                          </span>
                          <span className="text-xs font-bold text-slate-400 line-through">₹{disc.originalPrice}</span>
                        </div>
                        <Link 
                          href={`/products/${disc.productId}`}
                          className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-700 font-bold text-xs rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          View Details <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
            
            {!loading && promotions.length === 0 && discounts.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tag className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No Active Offers</h3>
                <p className="text-slate-500">Check back later for seasonal discounts and special deals!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
