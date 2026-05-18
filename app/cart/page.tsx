'use client';

import { useState } from 'react';

import { useCart } from '@/context/CartContext';
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
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
export default function CartPage() {
  const { items, removeItem, updateQuantity, totalAmount, totalItems } = useCart();
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const shipping = totalAmount > 2000 ? 0 : 150;
  const tax = (totalAmount - discount) * 0.18; // 18% GST after discount
  const finalTotal = totalAmount - discount + shipping + tax;

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'MONSOON20') {
      setDiscount(totalAmount * 0.2);
      setIsCouponApplied(true);
    } else if (couponCode.toUpperCase() === 'WELCOME100') {
      setDiscount(100);
      setIsCouponApplied(true);
    } else {
      alert('Invalid Coupon Code');
    }
  };

  const breadcrumbs = [
    { label: 'Botanical Bag' }
  ];

  if (items.length === 0) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full text-center space-y-10 glass p-16 rounded-[80px] border-4 border-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-12 opacity-5">
             <ShoppingBag className="w-64 h-64 text-slate-900" />
          </div>
          
          <div className="w-40 h-40 bg-emerald-50 rounded-[56px] flex items-center justify-center mx-auto shadow-inner relative z-10">
            <ShoppingBag className="w-20 h-20 text-emerald-600" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-2xl border-4 border-emerald-50 flex items-center justify-center shadow-lg"
            >
               <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            </motion.div>
          </div>
          
          <div className="space-y-4 relative z-10">
            <h1 className="text-5xl font-display font-black text-slate-900 tracking-tight leading-tight italic">Your bag is seeking greenery.</h1>
            <p className="text-slate-500 text-xl font-medium max-w-sm mx-auto">Explore our curated collection of verified specimens to start your indoor jungle.</p>
          </div>
          
          <Link 
            href="/plants" 
            className="inline-flex items-center gap-4 bg-slate-900 text-white px-12 py-6 rounded-[32px] font-black text-lg hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-900/10 active:scale-95 group"
          >
            Explore Catalog <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
           <Breadcrumbs items={breadcrumbs} />
        </div>
        
        <div className="flex flex-col xl:flex-row gap-16">
          {/* Cart Items */}
          <div className="flex-grow space-y-12">
            <div className="flex items-end justify-between border-b-4 border-slate-100 pb-8">
              <div className="space-y-2">
                <h1 className="text-6xl font-display font-black text-slate-900 tracking-tighter">Botanical Bag</h1>
                <p className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px]">Verified Specimens Only</p>
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
                    className="group bg-white rounded-[56px] border border-slate-100 p-8 flex flex-col md:flex-row gap-10 hover:shadow-2xl transition-all duration-700 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-bl-[120px] -z-10 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-y-10 translate-x-10 group-hover:translate-y-0 group-hover:translate-x-0" />
                    
                    <div className="w-full md:w-56 h-56 rounded-[40px] overflow-hidden bg-slate-50 flex-shrink-0 shadow-2xl group-hover:rotate-2 transition-transform duration-700">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    </div>

                    <div className="flex-grow flex flex-col justify-between py-2 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-6">
                          <div className="space-y-1">
                            <Link href={`/plants/${item.id.split('-')[0]}`}>
                              <h3 className="text-3xl font-display font-black text-slate-900 hover:text-emerald-700 transition-colors tracking-tight italic">{item.name}</h3>
                            </Link>
                            <div className="flex items-center gap-3">
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
                            className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-[24px] transition-all active:scale-90 shadow-sm bg-slate-50"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-8">
                        <div className="flex items-center bg-slate-50 rounded-[24px] border border-slate-100 p-2 shadow-inner">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-white hover:shadow-lg text-slate-600 transition-all active:scale-90"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <div className="w-14 text-center font-display font-black text-2xl text-slate-900 select-none">
                            {item.quantity}
                          </div>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-white hover:shadow-lg text-slate-600 transition-all active:scale-90"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="space-y-1 text-right">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtotal</p>
                           <div className="text-4xl font-display font-black text-emerald-900 tracking-tighter">
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
            <div className="bg-slate-900 p-12 rounded-[60px] text-white flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full group-hover:bg-emerald-500/20 transition-colors" />
               <div className="w-20 h-20 bg-emerald-500/20 rounded-[32px] flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <Package className="w-10 h-10" />
               </div>
               <div className="space-y-2">
                  <h4 className="text-2xl font-display font-bold">Safe Passage Guaranteed</h4>
                  <p className="text-slate-400 font-medium leading-relaxed italic max-w-2xl">Every specimen in your bag is hand-inspected by our botanical experts. We use specialized eco-friendly packaging that maintains humidity and temperature during transit.</p>
               </div>
            </div>
          </div>

          {/* Order Summary */}
          <aside className="w-full xl:w-[450px]">
            <div className="glass p-12 rounded-[64px] border-4 border-white shadow-2xl sticky top-28 space-y-10 backdrop-blur-3xl">
              <div className="space-y-2">
                <h2 className="text-4xl font-display font-black text-slate-900 tracking-tighter italic">Investment</h2>
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
                  <div className="flex items-baseline gap-2">
                     <span className="text-2xl font-display font-black text-emerald-900">₹</span>
                     <span className="text-6xl font-display font-black text-emerald-900 tracking-tighter">{finalTotal.toFixed(0)}</span>
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
                    className="flex-grow bg-white/50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold focus:border-emerald-500/30 focus:bg-white outline-none transition-all placeholder:text-slate-300 disabled:opacity-50"
                  />
                  <button 
                    onClick={applyCoupon}
                    disabled={isCouponApplied || !couponCode}
                    className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:bg-slate-200"
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
                   <Link href="/address" className="text-[10px] font-black text-emerald-600 uppercase hover:underline">Change</Link>
                </div>
                
                {user?.address?.street ? (
                  <div className="space-y-1">
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
                  className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-xl hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center gap-4 group"
                  disabled={!user?.address?.street}
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
