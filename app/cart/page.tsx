'use client';

import { useState, useEffect } from 'react';

import { useCart } from '@/context/CartContext';
import { normalizeCartProductId } from '@/lib/cart/product-id';
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/products/defaults';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  Info,
  Package,
  Star,
  Tag,
  Gift,
  Sparkles,
  Wind,
  Sun,
  Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    totalAmount,
    totalItems,
    syncItemsWithCatalog,
    cartLoading,
  } = useCart();
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null);

  // Fetch addresses on mount
  useEffect(() => {
    fetch('/api/addresses')
      .then(res => res.json())
      .then(data => {
        if (data.addresses && data.addresses.length > 0) {
          setAddresses(data.addresses);
          const defaultAddr = data.addresses.find((a: any) => a.isDefault);
          setSelectedAddress(defaultAddr || data.addresses[0]);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    void syncItemsWithCatalog();
  }, [syncItemsWithCatalog]);

  const shipping = totalAmount > 2000 ? 0 : 150;
  const tax = Math.round((totalAmount - discount) * 0.18);
  const finalTotal = totalAmount - discount + shipping + tax;

  const applyCoupon = () => {
    let localPromotions = [];
    try {
      const stored = localStorage.getItem('pachabhoomi_promotions');
      if (stored) {
        localPromotions = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading promotions:', e);
    }

    const defaultPromotions = [
      { code: 'MONSOON20', type: 'percentage', value: 20, minPurchase: 0, status: 'Active' },
      { code: 'WELCOME100', type: 'fixed', value: 100, minPurchase: 499, status: 'Active' }
    ];

    const allPromotions = [...localPromotions];
    defaultPromotions.forEach(def => {
      if (!allPromotions.some(p => p.code.toUpperCase() === def.code.toUpperCase())) {
        allPromotions.push(def);
      }
    });

    const promo = allPromotions.find(
      p => p.code.toUpperCase() === couponCode.trim().toUpperCase()
    );

    if (!promo) {
      alert('Invalid Coupon Code');
      return;
    }

    if (promo.status === 'Inactive') {
      alert('This coupon code is currently inactive.');
      return;
    }

    const minSpend = Number(promo.minPurchase || 0);
    if (totalAmount < minSpend) {
      alert(`This coupon requires a minimum purchase of ₹${minSpend}. Your current order value is ₹${totalAmount}.`);
      return;
    }

    let calcDiscount = 0;
    if (promo.type === 'percentage') {
      calcDiscount = totalAmount * (Number(promo.value) / 100);
    } else {
      calcDiscount = Number(promo.value);
    }

    setDiscount(calcDiscount);
    setIsCouponApplied(true);
    alert(`Coupon code "${promo.code}" applied! You saved ₹${calcDiscount.toFixed(0)}.`);
  };

  const breadcrumbs = [
    { label: 'Botanical Bag' }
  ];

  if (cartLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[60vh] flex items-center justify-center"
      >
        <p className="text-slate-500 font-medium">Loading your botanical bag…</p>
      </motion.div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Soft glowing ambient circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-50/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-xl w-full text-center space-y-6 glass py-8 px-6 md:py-10 md:px-12 rounded-[40px] md:rounded-[48px] border border-white/60 shadow-[0_15px_40px_rgba(0,0,0,0.05)] relative overflow-hidden"
        >
          {/* Subtle botanical patterns in glass corner */}
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
          <div className="absolute top-6 right-6 text-emerald-955/5 rotate-[45deg] select-none pointer-events-none">
            <Leaf className="w-12 h-12" />
          </div>
          
          {/* Stylized Illustrated Botanical Basket */}
          <div className="w-36 h-36 bg-gradient-to-tr from-emerald-50/80 to-amber-50/50 rounded-[40px] flex items-center justify-center mx-auto shadow-inner relative z-10 border border-white/60">
            <div className="relative">
              {/* Background glowing circle */}
              <div className="absolute inset-0 m-auto w-24 h-24 bg-emerald-500/10 rounded-full blur-lg animate-pulse" />
              
              {/* Animated Floating primary icon */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <ShoppingBag className="w-16 h-16 text-emerald-955 stroke-[1.25]" />
                <Leaf className="w-6 h-6 text-emerald-600 fill-emerald-100 absolute -top-1 -right-1 transform rotate-12" />
              </motion.div>

              {/* Sparkling star */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-1 -left-1 w-7 h-7 bg-white rounded-lg shadow-xs border border-slate-100 flex items-center justify-center"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              </motion.div>
            </div>
          </div>
          
          {/* Typography */}
          <div className="space-y-3 relative z-10 max-w-md mx-auto">
            <h1 className="text-3xl md:text-4xl font-display font-black text-slate-900 tracking-tight leading-tight">
              Your botanical bag is <span className="text-emerald-800">awaiting life.</span>
            </h1>
            <p className="text-slate-500/85 font-serif italic text-xs md:text-sm leading-relaxed px-2">
              &quot;Bring the soothing presence of organic air-purifiers and rare foliage into your personal living sanctuary.&quot;
            </p>
          </div>

          {/* Quick Categories Navigation */}
          <div className="space-y-2.5 pt-1">
            <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest block">Quick Browse Conservatories</span>
            <div className="grid grid-cols-3 gap-2.5 max-w-sm mx-auto relative z-10">
              {[
                { label: 'Indoor Foliage', href: '/plants?category=Indoor', icon: <Leaf className="w-3.5 h-3.5 text-emerald-700" /> },
                { label: 'Outdoor Specimens', href: '/plants?category=Outdoor', icon: <Sun className="w-3.5 h-3.5 text-amber-600" /> },
                { label: 'Pure Air Plants', href: '/plants?category=Indoor', icon: <Wind className="w-3.5 h-3.5 text-blue-600" /> }
              ].map(cat => (
                <Link 
                  key={cat.label}
                  href={cat.href}
                  className="flex flex-col items-center gap-1.5 p-3 bg-white/70 hover:bg-emerald-50/40 rounded-xl border border-slate-200/40 hover:border-emerald-500/20 shadow-xs hover:shadow-xs transition-all active:scale-95 text-center group cursor-pointer"
                >
                  <div className="w-7.5 h-7.5 rounded-lg bg-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform border border-slate-100/50">
                    {cat.icon}
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-wider text-slate-600 leading-tight">
                    {cat.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="pt-2">
            <Link 
              href="/plants" 
              className="inline-flex items-center gap-2.5 bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-700/10 transition-all active:scale-[0.98] group cursor-pointer"
            >
              Venture to Catalog <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 md:py-16 pb-24 md:pb-16 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-12">
           <Breadcrumbs items={breadcrumbs} />
        </div>
        
        <div className="flex flex-col xl:flex-row gap-16 w-full">
          {/* Cart Items */}
          <div className="flex-grow space-y-12 min-w-0 w-full">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-4 border-slate-100 pb-6 md:pb-8 w-full">
              <div className="space-y-1 md:space-y-2">
                <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 tracking-tighter">Botanical Bag</h1>
                <p className="text-emerald-600 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px]">Verified Specimens Only</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-display font-black text-slate-900 italic">{totalItems}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Items</p>
              </div>
            </div>

            <div className="space-y-8">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group bg-white rounded-[32px] md:rounded-[56px] border border-slate-100 p-5 md:p-8 flex flex-col md:flex-row gap-6 md:gap-10 hover:shadow-2xl transition-all duration-700 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-bl-[120px] -z-10 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-y-10 translate-x-10 group-hover:translate-y-0 group-hover:translate-x-0" />
                    
                    <div className="w-full md:w-56 h-48 md:h-56 rounded-[24px] md:rounded-[40px] overflow-hidden bg-slate-50 flex-shrink-0 shadow-xl md:shadow-2xl group-hover:rotate-2 transition-transform duration-700">
                      <img
                        src={item.image || DEFAULT_PRODUCT_IMAGE}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                        }}
                      />
                    </div>

                    <div className="flex-grow flex flex-col justify-between py-2 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1 min-w-0 flex-1">
                            <Link href={`/plants/${normalizeCartProductId(item.id)}`} className="block">
                              <h3 className="text-2xl md:text-3xl font-display font-black text-slate-900 hover:text-emerald-700 transition-colors tracking-tight italic truncate pr-2">{item.name}</h3>
                            </Link>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3">
                               <div className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100">
                                  {item.seller.shopName}
                               </div>
                               {item.size && (
                                 <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                    Size: {item.size}
                                 </span>
                               )}
                               <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                  <CheckCircle2 className="w-3 h-3" /> Verified
                               </span>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="p-3 md:p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-[20px] md:rounded-[24px] transition-all active:scale-90 shadow-sm bg-slate-50 flex-shrink-0"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-8">
                        <div className="flex items-center bg-slate-50 rounded-[24px] border border-slate-100 p-2 shadow-inner">
                          <button 
                            onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${item.quantity <= 1 ? 'opacity-50 cursor-not-allowed text-slate-400' : 'hover:bg-white hover:shadow-lg text-slate-600 active:scale-90'}`}
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <div className="w-14 text-center font-display font-black text-2xl text-slate-900 select-none">
                            {item.quantity}
                          </div>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= (item.stock ?? Infinity)}
                            className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${item.quantity >= (item.stock ?? Infinity) ? 'opacity-50 cursor-not-allowed text-slate-400' : 'hover:bg-white hover:shadow-lg text-slate-600 active:scale-90'}`}
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="space-y-1 text-right">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtotal</p>
                           {item.originalPrice && item.originalPrice > item.price && (
                             <div className="text-sm font-display font-bold text-slate-400 line-through tracking-tighter">
                               ₹{(item.originalPrice * item.quantity).toFixed(0)}
                             </div>
                           )}
                           <div className="text-3xl md:text-4xl font-display font-black text-emerald-900 tracking-tighter">
                             ₹{item.price * item.quantity}
                           </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Premium Note */}
            <div className="bg-slate-900 p-8 md:p-12 rounded-[32px] md:rounded-[60px] text-white flex flex-col md:flex-row items-center gap-6 md:gap-10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full group-hover:bg-emerald-500/20 transition-colors" />
               <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500/20 rounded-[24px] md:rounded-[32px] flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <Package className="w-10 h-10" />
               </div>
               <div className="space-y-2">
                  <h4 className="text-2xl font-display font-bold">Safe Passage Guaranteed</h4>
                  <p className="text-slate-400 font-medium leading-relaxed italic max-w-2xl">Every specimen in your bag is hand-inspected by our botanical experts. We use specialized eco-friendly packaging that maintains humidity and temperature during transit.</p>
               </div>
            </div>
          </div>

          {/* Order Summary */}
          <aside className="w-full xl:w-[450px] max-w-full">
            <div className="glass p-6 md:p-12 rounded-[32px] md:rounded-[64px] border-4 border-white shadow-2xl xl:sticky xl:top-28 space-y-6 md:space-y-10 backdrop-blur-3xl w-full">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-display font-black text-slate-900 tracking-tighter italic">Investment</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Reference: {Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center text-slate-600 font-bold text-lg">
                  <span className="flex items-center gap-2 italic">Botanical Value</span>
                  <span className="text-slate-900">₹{totalAmount}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 font-bold text-lg">
                    <span className="flex items-center gap-2 italic">Promotional Saving</span>
                    <span>- ₹{discount.toFixed(0)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-slate-600 font-bold text-lg">
                  <div className="flex items-center gap-3">
                    <span className="italic">Courier Service</span>
                    <Truck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className={shipping === 0 ? 'text-emerald-600 font-black tracking-widest uppercase text-xs bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100' : 'text-slate-900'}>
                    {shipping === 0 ? 'Complimentary' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600 font-bold text-lg">
                  <span className="italic">GST (18%)</span>
                  <span className="text-slate-900">₹{tax.toFixed(0)}</span>
                </div>
                
                <div className="h-1 bg-slate-100 rounded-full" />
                
                <div className="space-y-2">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Total Payable</p>
                  <div className="flex items-baseline gap-1 md:gap-2">
                     <span className="text-xl md:text-2xl font-display font-black text-emerald-900">₹</span>
                     <span className="text-5xl md:text-6xl font-display font-black text-emerald-900 tracking-tighter">{finalTotal.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[9px]">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <span>Promotional Code</span>
                </div>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="Enter Code (e.g. MONSOON20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={isCouponApplied}
                    className="flex-grow w-full min-w-0 bg-white/50 border-2 border-slate-100 rounded-2xl px-4 md:px-5 py-3 text-sm font-bold focus:border-emerald-500/30 focus:bg-white outline-none transition-all placeholder:text-slate-300 disabled:opacity-50"
                  />
                  <button 
                    onClick={applyCoupon}
                    disabled={isCouponApplied || !couponCode}
                    className="px-4 md:px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:bg-slate-200 whitespace-nowrap"
                  >
                    {isCouponApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {isCouponApplied && (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-bold text-emerald-600 italic flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Offer successfully reflected in your investment.
                  </motion.p>
                )}
              </div>

              {/* Delivery info */}
              <div className="p-8 bg-white/50 rounded-[40px] border-2 border-white space-y-6 shadow-inner">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3 text-slate-400 font-black uppercase tracking-widest text-[9px]">
                     <MapPin className="w-4 h-4 text-emerald-600" />
                     <span>Destination</span>
                   </div>
                   <Link href="/address" className="text-[10px] font-black text-emerald-600 uppercase hover:underline">Manage Address</Link>
                </div>
                
                {addresses.length > 0 ? (
                  <div className="space-y-4">
                    <select 
                      value={selectedAddress?.id || ''} 
                      onChange={(e) => {
                        const addr = addresses.find(a => a.id === e.target.value);
                        if(addr) setSelectedAddress(addr);
                      }}
                      className="w-full max-w-full truncate bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 transition-colors cursor-pointer appearance-none"
                    >
                      {addresses.map(a => (
                        <option key={a.id} value={a.id}>
                          {(a.type || 'other').toUpperCase()} - {a.street}, {a.city}
                        </option>
                      ))}
                    </select>
                    
                    {selectedAddress && (
                      <div className="space-y-1 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                        <p className="text-lg font-display font-bold text-slate-900 leading-tight italic">
                          {selectedAddress.street}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                        </p>
                        {selectedAddress.phone && (
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 pt-2">
                            Contact: {selectedAddress.phone}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : user?.address?.street ? (
                  <div className="space-y-1 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <p className="text-lg font-display font-bold text-slate-900 leading-tight italic">
                      {user.address.street}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">{user.address.city}, {user.address.state}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                     <p className="text-sm text-red-500 font-bold italic">No delivery hub established.</p>
                     <Link href="/address" className="w-full block text-center py-3 bg-emerald-50 text-emerald-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                        Establish Hub Now
                     </Link>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <button 
                  className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-xl hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center gap-4 group disabled:opacity-50 disabled:bg-slate-300 disabled:cursor-not-allowed"
                  disabled={!selectedAddress && !user?.address?.street}
                  onClick={() => {
                    const addrId = selectedAddress?.id || (user?.address as any)?.id;
                    if(addrId) {
                       router.push(`/checkout?addressId=${addrId}`);
                    } else {
                       router.push(`/checkout`);
                    }
                  }}
                >
                  Confirm & Pay <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>

                <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  SSL Secured Transaction
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
