'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  CreditCard, 
  Wallet, 
  Banknote,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  ArrowLeft,
  ChevronRight,
  Package,
  Truck,
  Loader2,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressId = searchParams.get('addressId');
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  
  const [address, setAddress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await fetch('/api/addresses');
        if (res.ok) {
          const data = await res.json();
          if (data.addresses && data.addresses.length > 0) {
            if (addressId) {
              const found = data.addresses.find((a: any) => a.id === addressId);
              setAddress(found || data.addresses[0]);
            } else {
              const defaultAddr = data.addresses.find((a: any) => a.isDefault);
              setAddress(defaultAddr || data.addresses[0]);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch address:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAddress();
  }, [addressId]);

  // If cart is empty and we haven't just placed an order, redirect back to cart
  useEffect(() => {
    if (!loading && items.length === 0 && !showSuccessModal) {
      router.push('/cart');
    }
  }, [items, loading, router, showSuccessModal]);

  const handleCompleteOrder = async () => {
    if (!address) {
      alert('Please select a delivery address');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const payload = {
        items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
        addressId: address.id || address._id,
        paymentMethod
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to place order');
      }

      clearCart();
      setShowSuccessModal(true);
    } catch (err: any) {
      alert(err.message);
      setIsProcessing(false);
    }
  };

  const deliveryFee = totalAmount > 999 ? 0 : 99;
  const grandTotal = totalAmount + deliveryFee;

  if (loading || (items.length === 0 && !showSuccessModal)) {
    return (
      <div className="min-h-screen bg-[#92B031]/20 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#92B031]/20 py-12 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-200/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="mb-10 flex items-center gap-6">
          <Link href="/cart" className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-emerald-800 hover:bg-emerald-100 transition-colors shadow-sm">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-display font-black text-emerald-950 tracking-tight">Secure Checkout</h1>
            <p className="text-sm font-medium text-emerald-800/70 italic mt-1">Complete your botanical purchase securely.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Checkout Area */}
          <div className="flex-grow space-y-8">
            
            {/* Delivery Address Summary */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-[32px] p-8 md:p-10 border border-white/60 shadow-xl relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 p-8 text-emerald-900/5 pointer-events-none">
                <MapPin className="w-48 h-48" />
              </div>
              <div className="relative z-10 space-y-6">
                <h2 className="text-xl font-black uppercase tracking-widest text-emerald-950 flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-emerald-600" /> Delivery Hub
                </h2>
                {address ? (
                  <div className="p-6 bg-white/60 backdrop-blur-md border border-white rounded-3xl shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-4 py-1.5 bg-emerald-100/80 text-emerald-800 text-[10px] font-black uppercase tracking-widest rounded-full">
                        {address.type || 'Address'}
                      </span>
                      <Link href="/profile/addresses" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-4">Change</Link>
                    </div>
                    <p className="text-2xl font-display font-black text-slate-900 italic leading-tight">{address.street}</p>
                    <p className="text-sm text-slate-700 font-medium mt-2">{address.building}</p>
                    <p className="text-sm text-slate-600 font-medium mt-1">{address.city}, {address.state} {address.zipCode}</p>
                    {address.phone && <p className="text-xs font-bold text-emerald-700 mt-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {address.phone}</p>}
                  </div>
                ) : (
                  <div className="p-8 bg-white/40 border border-white/60 rounded-3xl text-center flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-lg text-slate-800 font-black">No Delivery Address</p>
                      <p className="text-sm text-slate-600 font-medium mt-1">Please add an address to continue.</p>
                    </div>
                    <Link href="/profile/addresses" className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20">
                      <Plus className="w-4 h-4" /> Add Address
                    </Link>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Payment Methods */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-[32px] p-8 md:p-10 border border-white/60 shadow-xl relative overflow-hidden"
            >
               <div className="absolute -top-10 -right-10 p-8 text-emerald-900/5 pointer-events-none">
                <CreditCard className="w-48 h-48" />
              </div>
              <div className="relative z-10 space-y-8">
                <h2 className="text-xl font-black uppercase tracking-widest text-emerald-950 flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" /> Secure Payment
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'card', icon: <CreditCard className="w-6 h-6" />, label: 'Credit/Debit Card' },
                    { id: 'upi', icon: <Wallet className="w-6 h-6" />, label: 'UPI / Wallets' },
                    { id: 'cod', icon: <Banknote className="w-6 h-6" />, label: 'Cash on Delivery' },
                  ].map(method => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`flex flex-col items-center justify-center gap-4 p-6 rounded-3xl border-2 transition-all duration-300 ${
                        paymentMethod === method.id 
                          ? 'border-emerald-500 bg-white shadow-xl shadow-emerald-500/20 text-emerald-700 scale-[1.02]' 
                          : 'border-white/50 bg-white/40 text-slate-600 hover:border-emerald-300 hover:bg-white/60'
                      }`}
                    >
                      {method.icon}
                      <span className="text-xs font-black uppercase tracking-widest text-center">{method.label}</span>
                    </button>
                  ))}
                </div>

                {/* Simulated Payment Inputs */}
                <div className="min-h-[220px]">
                  <AnimatePresence mode="wait">
                    {paymentMethod === 'card' && (
                      <motion.div
                        key="card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-5 pt-4"
                      >
                        <div className="space-y-2 relative">
                          <label className="text-[10px] font-black uppercase tracking-widest text-emerald-800 ml-4 absolute -top-2.5 left-4 bg-white/90 px-2 rounded-full backdrop-blur-sm shadow-sm z-10">Card Number</label>
                          <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-6 py-5 bg-white/70 backdrop-blur-md border border-white/80 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-400 outline-none transition-all font-bold text-slate-700 tracking-widest placeholder:tracking-normal text-lg" />
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <div className="space-y-2 relative">
                            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-800 ml-4 absolute -top-2.5 left-4 bg-white/90 px-2 rounded-full backdrop-blur-sm shadow-sm z-10">Expiry Date</label>
                            <input type="text" placeholder="MM/YY" className="w-full px-6 py-5 bg-white/70 backdrop-blur-md border border-white/80 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-400 outline-none transition-all font-bold text-slate-700 text-lg" />
                          </div>
                          <div className="space-y-2 relative">
                            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-800 ml-4 absolute -top-2.5 left-4 bg-white/90 px-2 rounded-full backdrop-blur-sm shadow-sm z-10">CVV</label>
                            <input type="password" placeholder="•••" className="w-full px-6 py-5 bg-white/70 backdrop-blur-md border border-white/80 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-400 outline-none transition-all font-bold text-slate-700 text-lg" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {paymentMethod === 'upi' && (
                      <motion.div
                        key="upi"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-5 pt-4"
                      >
                        <div className="space-y-2 relative">
                          <label className="text-[10px] font-black uppercase tracking-widest text-emerald-800 ml-4 absolute -top-2.5 left-4 bg-white/90 px-2 rounded-full backdrop-blur-sm shadow-sm z-10">UPI ID</label>
                          <input type="text" placeholder="username@bank" className="w-full px-6 py-5 bg-white/70 backdrop-blur-md border border-white/80 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-400 outline-none transition-all font-bold text-slate-700 text-lg" />
                        </div>
                        <div className="p-4 bg-emerald-100/50 rounded-2xl border border-emerald-200/50">
                          <p className="text-sm text-emerald-800 font-medium flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Waiting for payment request approval on your UPI app...</p>
                        </div>
                      </motion.div>
                    )}
                    {paymentMethod === 'cod' && (
                      <motion.div
                        key="cod"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="pt-4"
                      >
                        <div className="p-6 bg-emerald-100/50 rounded-2xl border border-emerald-200/50 flex flex-col items-center justify-center text-center gap-3">
                           <Truck className="w-10 h-10 text-emerald-600" />
                           <p className="text-emerald-900 font-bold">Pay comfortably at your doorstep when your plants arrive.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.section>

          </div>

          {/* Order Summary Sidebar */}
          <aside className="w-full lg:w-[420px] shrink-0">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-950/90 backdrop-blur-2xl rounded-[40px] p-8 text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-white/10 lg:sticky lg:top-8"
            >
              <h2 className="text-xl font-display font-black mb-8 flex items-center gap-3">
                <Package className="w-6 h-6 text-emerald-400" /> Order Summary
              </h2>

              <div className="space-y-6 mb-8 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <AnimatePresence>
                  {items.map((item, idx) => (
                    <motion.div 
                      key={item.id} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-4 group bg-white/5 p-3 rounded-3xl hover:bg-white/10 transition-colors"
                    >
                      <div className="w-20 h-20 rounded-2xl bg-white/10 overflow-hidden flex-shrink-0 relative">
                        <Image src={item.image} alt={item.name} className="object-cover group-hover:scale-110 transition-transform duration-500" fill />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-base font-bold leading-tight line-clamp-2 text-slate-100">{item.name}</h3>
                        <p className="text-xs font-medium text-emerald-400/80 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right pr-2">
                        {item.originalPrice && item.originalPrice > item.price && (
                          <div className="text-[10px] font-medium text-slate-500 line-through">
                            ₹{(item.originalPrice * item.quantity).toFixed(0)}
                          </div>
                        )}
                        <div className="text-lg font-black text-white">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between text-sm font-medium text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-400">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 rounded-md">FREE</span>
                  ) : (
                    <span className="text-white">₹{deliveryFee}</span>
                  )}
                </div>
                <div className="flex justify-between items-end pt-6 border-t border-white/10">
                  <span className="text-sm font-black uppercase tracking-widest text-slate-400">Grand Total</span>
                  <span className="text-4xl font-display font-black text-emerald-400">₹{grandTotal}</span>
                </div>
              </div>

              <button 
                onClick={handleCompleteOrder}
                disabled={isProcessing || !address}
                className="w-full mt-10 bg-emerald-500 text-emerald-950 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-emerald-400 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isProcessing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing Securely...</>
                ) : (
                  <><CheckCircle2 className="w-6 h-6" /> Place Order Now</>
                )}
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                 <ShieldCheck className="w-4 h-4 text-emerald-500/70" /> 256-bit Secure Encryption
              </div>
            </motion.div>
          </aside>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="glass border border-white/40 rounded-[48px] p-10 max-w-md w-full shadow-2xl text-center space-y-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-400/20 to-transparent pointer-events-none" />
              <div className="w-24 h-24 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40 transform rotate-12">
                <CheckCircle2 className="w-12 h-12 text-white -rotate-12" />
              </div>
              <div className="relative z-10">
                <h3 className="text-4xl font-display font-black text-slate-900 tracking-tight leading-tight">Order<br/>Confirmed!</h3>
                <p className="text-slate-600 font-medium mt-4 text-lg">Your beautiful plants will be on their way soon.</p>
              </div>
              <button
                onClick={() => router.push('/')}
                className="w-full relative z-10 bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 active:scale-95 text-sm"
              >
                Back to Home
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#92B031]/20 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-emerald-600" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
