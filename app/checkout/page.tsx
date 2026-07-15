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
  Loader2
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex items-center gap-4">
          <Link href="/cart" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Secure Checkout</h1>
            <p className="text-sm font-medium text-slate-500 italic">Complete your botanical purchase securely.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Checkout Area */}
          <div className="flex-grow space-y-8">
            
            {/* Delivery Address Summary */}
            <section className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-slate-100 opacity-50 pointer-events-none">
                <MapPin className="w-24 h-24" />
              </div>
              <div className="relative z-10 space-y-6">
                <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600" /> Delivery Hub
                </h2>
                {address ? (
                  <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                        {address.type || 'Address'}
                      </span>
                    </div>
                    <p className="text-xl font-display font-black text-slate-900 italic leading-tight">{address.street}</p>
                    <p className="text-sm text-slate-600 font-medium mt-1">{address.building}</p>
                    <p className="text-sm text-slate-500 font-medium">{address.city}, {address.state} {address.zipCode}</p>
                    {address.phone && <p className="text-xs font-bold text-emerald-700 mt-3">📞 {address.phone}</p>}
                  </div>
                ) : (
                  <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl">
                    <p className="text-sm text-amber-700 font-bold">No delivery address found. Please go back and add one.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Payment Methods */}
            <section className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 text-slate-100 opacity-50 pointer-events-none">
                <CreditCard className="w-24 h-24" />
              </div>
              <div className="relative z-10 space-y-6">
                <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" /> Payment Method
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
                      className={`flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border-2 transition-all ${
                        paymentMethod === method.id 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-500/10' 
                          : 'border-slate-100 bg-white text-slate-500 hover:border-emerald-200 hover:bg-slate-50'
                      }`}
                    >
                      {method.icon}
                      <span className="text-xs font-black uppercase tracking-widest text-center">{method.label}</span>
                    </button>
                  ))}
                </div>

                {/* Simulated Payment Inputs */}
                <AnimatePresence mode="wait">
                  {paymentMethod === 'card' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-6"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Card Number</label>
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 font-bold text-slate-700" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Expiry Date</label>
                          <input type="text" placeholder="MM/YY" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 font-bold text-slate-700" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">CVV</label>
                          <input type="password" placeholder="•••" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 font-bold text-slate-700" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {paymentMethod === 'upi' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-6"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">UPI ID</label>
                        <input type="text" placeholder="username@bank" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 font-bold text-slate-700" />
                      </div>
                      <p className="text-xs text-slate-500 font-medium italic text-center">You will receive a payment request on your UPI app.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

          </div>

          {/* Order Summary Sidebar */}
          <aside className="w-full lg:w-[400px] shrink-0">
            <div className="bg-slate-900 rounded-[32px] md:rounded-[40px] p-6 md:p-8 text-white shadow-2xl lg:sticky lg:top-8">
              <h2 className="text-xl font-display font-black mb-8 flex items-center gap-3">
                <Package className="w-6 h-6 text-emerald-400" /> Order Summary
              </h2>

              <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} className="object-cover" fill />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-sm font-bold leading-tight line-clamp-1">{item.name}</h3>
                      <p className="text-[10px] font-medium text-slate-400">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      {item.originalPrice && item.originalPrice > item.price && (
                        <div className="text-[10px] font-medium text-slate-500 line-through">
                          ₹{(item.originalPrice * item.quantity).toFixed(0)}
                        </div>
                      )}
                      <div className="text-sm font-black text-emerald-400">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between text-sm font-medium text-slate-300">
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-300">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-400 font-bold">FREE</span>
                  ) : (
                    <span>₹{deliveryFee}</span>
                  )}
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-white/10">
                  <span className="text-sm font-black uppercase tracking-widest text-slate-400">Grand Total</span>
                  <span className="text-3xl font-display font-black text-emerald-400">₹{grandTotal}</span>
                </div>
              </div>

              <button 
                onClick={handleCompleteOrder}
                disabled={isProcessing || !address}
                className="w-full mt-8 bg-emerald-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : (
                  <><CheckCircle2 className="w-5 h-5" /> Place Order</>
                )}
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500">
                 <ShieldCheck className="w-3.5 h-3.5" /> 256-bit Secure Encryption
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl text-center space-y-6"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Order Placed!</h3>
                <p className="text-slate-500 font-medium mt-2">Your beautiful plants will be on their way soon.</p>
              </div>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98]"
              >
                OK
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
