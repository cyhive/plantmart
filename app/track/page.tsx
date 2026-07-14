'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  Info,
  Clock3
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Component logic extracted so we can wrap it in Suspense for useSearchParams
function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';
  
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [activeOrderId, setActiveOrderId] = useState(initialOrderId);
  const [isTracked, setIsTracked] = useState(!!initialOrderId);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialOrderId) {
      fetchOrder(initialOrderId);
    }
  }, [initialOrderId]);

  const fetchOrder = async (id: string) => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) {
        let errStr = 'Order not found or access denied';
        try {
          const errData = await res.json();
          if (errData.error) errStr = errData.error;
        } catch(e) {}
        throw new Error(errStr);
      }
      const data = await res.json();
      setOrderData(data.order);
      setIsTracked(true);
      setActiveOrderId(id);
    } catch (err: any) {
      setError(err.message || 'Failed to track order');
      setIsTracked(false);
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderIdInput) {
      fetchOrder(orderIdInput);
    }
  };

  // Status mapping
  const statuses = ['awaiting_approval', 'pending', 'processing', 'shipped', 'delivered'];
  
  const getStatusIndex = (status: string) => {
    if (status === 'cancelled') return -1;
    return statuses.indexOf(status);
  };

  const currentStatusIndex = orderData ? getStatusIndex(orderData.status) : -1;
  const isCancelled = orderData?.status === 'cancelled';

  // Helper to determine step states
  const getStepState = (stepIndex: number) => {
    if (isCancelled) return { completed: false, active: false };
    if (currentStatusIndex > stepIndex) return { completed: true, active: false };
    if (currentStatusIndex === stepIndex) return { completed: false, active: true };
    return { completed: false, active: false };
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Pending';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const orderDate = orderData?.createdAt ? formatDate(orderData.createdAt) : '';
  const orderTime = orderData?.createdAt ? formatTime(orderData.createdAt) : '';
  const updateDate = orderData?.updatedAt ? formatDate(orderData.updatedAt) : '';
  const updateTime = orderData?.updatedAt ? formatTime(orderData.updatedAt) : '';

  const trackSteps = [
    { 
      title: 'Order Placed', 
      desc: 'Awaiting Seller Approval',
      date: orderDate, 
      time: orderTime, 
      ...getStepState(0), 
      icon: <Clock3 className="w-5 h-5" /> 
    },
    { 
      title: 'Approved', 
      desc: 'Order Confirmed',
      date: currentStatusIndex >= 1 ? updateDate : 'Pending', 
      time: currentStatusIndex >= 1 ? updateTime : '--:--', 
      ...getStepState(1), 
      icon: <CheckCircle2 className="w-5 h-5" /> 
    },
    { 
      title: 'Processing', 
      desc: 'Preparing at Nursery',
      date: currentStatusIndex >= 2 ? updateDate : 'Pending', 
      time: currentStatusIndex >= 2 ? updateTime : '--:--', 
      ...getStepState(2), 
      icon: <Package className="w-5 h-5" /> 
    },
    { 
      title: 'Shipped', 
      desc: 'In Transit',
      date: currentStatusIndex >= 3 ? updateDate : 'Pending', 
      time: currentStatusIndex >= 3 ? updateTime : '--:--', 
      ...getStepState(3), 
      icon: <Truck className="w-5 h-5" /> 
    },
    { 
      title: 'Delivered', 
      desc: 'Package Arrived',
      date: currentStatusIndex >= 4 ? updateDate : 'Pending', 
      time: currentStatusIndex >= 4 ? updateTime : '--:--', 
      ...getStepState(4), 
      icon: <MapPin className="w-5 h-5" /> 
    },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-20 overflow-hidden mesh-gradient">
        <div className="absolute inset-0 bg-slate-900/60 z-10" />
        <div className="absolute inset-0 z-0">
          <Image src="/botanical_delivery_tracking_1778929633492.png" 
            alt="Delivery Tracking" 
            className="object-cover" fill />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center space-y-8 md:space-y-12">
          <div className="space-y-4 md:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1 md:gap-2 px-4 md:px-6 py-2 bg-emerald-500/20 backdrop-blur-md rounded-full text-emerald-400 text-xs md:text-sm font-bold border border-emerald-500/30"
            >
              <Package className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
              <span className="tracking-widest uppercase">Real-Time Tracking</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-8xl font-display font-black text-white tracking-tighter"
            >
              Track Your <br />
              <span className="text-emerald-400 italic font-serif">Companions</span>
            </motion.h1>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto relative group"
          >
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl group-hover:bg-emerald-500/30 transition-all rounded-3xl"></div>
            <form onSubmit={handleTrack} className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-[24px] md:rounded-3xl flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4">
              <div className="pl-4 md:pl-6 text-emerald-400 hidden md:block">
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <input 
                type="text" 
                placeholder="Enter Order ID (e.g. 64abc...)" 
                className="flex-grow w-full md:w-auto bg-transparent border-none focus:ring-0 text-white placeholder-emerald-100/50 text-base md:text-lg py-3 px-4 md:py-4 outline-none text-center md:text-left"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
              />
              <button disabled={loading} type="submit" className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl transition-all active:scale-95 disabled:opacity-70 text-sm md:text-base">
                {loading ? 'Searching...' : 'Track'}
              </button>
            </form>
            {error && (
              <p className="mt-4 text-red-400 text-xs md:text-sm font-bold bg-red-900/50 inline-block px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl backdrop-blur-md">{error}</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Tracking Results */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {!isTracked || !orderData ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 md:py-20 space-y-4 md:space-y-6"
            >
              <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Search className="w-8 h-8 md:w-12 md:h-12" />
              </div>
              <div className="space-y-1 md:space-y-2 px-4">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900">Enter your order ID to start</h3>
                <p className="text-sm md:text-base text-slate-500">You can find your order ID in your profile or confirmation email.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12"
            >
              {/* Main Timeline */}
              <div className="lg:col-span-2 bg-white rounded-[32px] md:rounded-[60px] p-6 md:p-12 border border-slate-100 shadow-xl shadow-emerald-900/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-12 gap-4">
                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl md:text-3xl font-display font-black text-slate-900">Order Status</h2>
                    <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">Tracking ID: {activeOrderId.substring(0, 8)}...</p>
                  </div>
                  <div className="text-center sm:text-right">
                    <span className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest border ${
                      isCancelled 
                      ? 'bg-red-100 text-red-700 border-red-200' 
                      : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    }`}>
                      {isCancelled ? 'CANCELLED' : orderData.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="space-y-0 relative pl-4 sm:pl-8 md:pl-0">
                  {/* Vertical Line */}
                  {!isCancelled && <div className="absolute left-[24px] sm:left-[40px] md:left-[26px] top-6 bottom-6 w-0.5 bg-slate-100" />}
                  
                  {isCancelled ? (
                    <div className="text-center py-8 md:py-12 space-y-3 md:space-y-4">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-900">Order Cancelled</h3>
                      <p className="text-sm md:text-base text-slate-500">This order has been cancelled and will not be delivered.</p>
                    </div>
                  ) : (
                    trackSteps.map((step, i) => (
                      <div key={i} className="relative flex gap-4 md:gap-8 pb-8 md:pb-12 last:pb-0">
                        <div className={`w-[40px] h-[40px] md:w-[54px] md:h-[54px] shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center z-10 border-[3px] md:border-4 border-white shadow-sm transition-all duration-500 ${
                          step.completed ? 'bg-emerald-500 text-white' : 
                          step.active ? 'bg-emerald-100 text-emerald-600 animate-pulse' : 
                          'bg-slate-100 text-slate-400'
                        }`}>
                          <div className="scale-75 md:scale-100">{step.icon}</div>
                        </div>
                        <div className="pt-0.5 md:pt-1 min-w-0">
                          <h4 className={`text-base md:text-xl font-bold truncate ${step.completed || step.active ? 'text-slate-900' : 'text-slate-400'}`}>
                            {step.title}
                          </h4>
                          <p className={`text-xs md:text-sm mt-0.5 md:mt-1 font-medium ${step.completed || step.active ? 'text-slate-600' : 'text-slate-400'}`}>
                            {step.desc}
                          </p>
                          <p className="text-slate-400 text-[10px] md:text-xs mt-1">{step.date} • {step.time}</p>
                          
                          {step.active && step.title === 'Processing' && (
                            <div className="mt-3 md:mt-4 flex items-start md:items-center gap-2 md:gap-3 p-3 md:p-4 bg-indigo-50 rounded-xl md:rounded-2xl border border-indigo-100">
                              <Package className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 shrink-0 mt-0.5 md:mt-0" />
                              <p className="text-xs md:text-sm text-indigo-800 font-medium">Your plants are being carefully packaged.</p>
                            </div>
                          )}
                          
                          {step.active && step.title === 'Shipped' && (
                            <div className="mt-3 md:mt-4 flex items-start md:items-center gap-2 md:gap-3 p-3 md:p-4 bg-emerald-50 rounded-xl md:rounded-2xl border border-emerald-100">
                              <Truck className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 shrink-0 mt-0.5 md:mt-0" />
                              <p className="text-xs md:text-sm text-emerald-800 font-medium">Handed over to delivery partner.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Order Info Sidebar */}
              <div className="space-y-6 md:space-y-8">
                <div className="bg-slate-900 rounded-[32px] md:rounded-[48px] p-6 md:p-10 text-white">
                  <h3 className="text-lg md:text-xl font-bold mb-6 md:mb-8">Shipment Details</h3>
                  <div className="space-y-6 md:space-y-8">
                    <div className="flex gap-3 md:gap-4">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Delivery Address</p>
                        <p className="text-xs md:text-sm font-medium leading-relaxed mt-1">
                          {orderData.shippingAddress?.street}, {orderData.shippingAddress?.city}, {orderData.shippingAddress?.state} {orderData.shippingAddress?.zipCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 md:gap-4">
                      <Package className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Items</p>
                        <p className="text-base md:text-lg font-bold mt-1">{orderData.items?.length || 0} Plants</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-[32px] md:rounded-[40px] p-6 md:p-8 space-y-3 md:space-y-4">
                  <div className="flex items-center gap-2 md:gap-3 text-emerald-700">
                    <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
                    <h4 className="font-bold text-sm md:text-base">Freshness Guaranteed</h4>
                  </div>
                  <p className="text-xs md:text-sm text-emerald-800/70 leading-relaxed">
                    Your plants are being transported in specialized climate-controlled containers to ensure they arrive fresh.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Helpful Info Section */}
      <section className="py-16 md:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="flex gap-4 md:gap-6 items-start md:items-center text-left">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-lg md:rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Info className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1 md:mb-2 text-sm md:text-base">Transit Hours</h4>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed">Orders are delivered between 9:00 AM and 7:00 PM on business days.</p>
              </div>
            </div>
            <div className="flex gap-4 md:gap-6 items-start md:items-center text-left">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-lg md:rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Clock className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1 md:mb-2 text-sm md:text-base">Weekend Policy</h4>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed">We schedule shipments to avoid plants staying in warehouses over Sunday.</p>
              </div>
            </div>
            <div className="flex gap-4 md:gap-6 items-start md:items-center text-left">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-lg md:rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                <MapPin className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1 md:mb-2 text-sm md:text-base">Live Tracking</h4>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed">Once 'Out for Delivery', you'll receive a link for live agent tracking via SMS.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8fafc] flex items-center justify-center"><div className="animate-pulse text-emerald-600 font-bold">Loading Tracker...</div></div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
