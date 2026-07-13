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
      <section className="relative pt-32 pb-20 overflow-hidden mesh-gradient">
        <div className="absolute inset-0 bg-slate-900/60 z-10" />
        <div className="absolute inset-0 z-0">
          <Image src="/botanical_delivery_tracking_1778929633492.png" 
            alt="Delivery Tracking" 
            className="object-cover" fill />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center space-y-12">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-500/20 backdrop-blur-md rounded-full text-emerald-400 text-sm font-bold border border-emerald-500/30"
            >
              <Package className="w-4 h-4" />
              <span className="tracking-widest uppercase">Real-Time Tracking</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-display font-black text-white tracking-tighter"
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
            <form onSubmit={handleTrack} className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-3xl flex flex-col md:flex-row items-center gap-4">
              <div className="pl-6 text-emerald-400 hidden md:block">
                <Search className="w-6 h-6" />
              </div>
              <input 
                type="text" 
                placeholder="Enter Order ID (e.g. 64abc123...)" 
                className="flex-grow w-full md:w-auto bg-transparent border-none focus:ring-0 text-white placeholder-emerald-100/50 text-lg py-4 px-6 md:px-0 outline-none"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
              />
              <button disabled={loading} type="submit" className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black px-8 py-4 rounded-2xl transition-all active:scale-95 disabled:opacity-70">
                {loading ? 'Searching...' : 'Track'}
              </button>
            </form>
            {error && (
              <p className="mt-4 text-red-400 text-sm font-bold bg-red-900/50 inline-block px-4 py-2 rounded-xl backdrop-blur-md">{error}</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Tracking Results */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {!isTracked || !orderData ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 space-y-6"
            >
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Search className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">Enter your order ID to start</h3>
                <p className="text-slate-500">You can find your order ID in your profile or confirmation email.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
              {/* Main Timeline */}
              <div className="lg:col-span-2 bg-white rounded-[60px] p-8 md:p-12 border border-slate-100 shadow-xl shadow-emerald-900/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                  <div>
                    <h2 className="text-3xl font-display font-black text-slate-900">Order Status</h2>
                    <p className="text-slate-500 font-medium">Tracking ID: {activeOrderId}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${
                      isCancelled 
                      ? 'bg-red-100 text-red-700 border-red-200' 
                      : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    }`}>
                      {isCancelled ? 'CANCELLED' : orderData.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="space-y-0 relative pl-4 md:pl-0">
                  {/* Vertical Line */}
                  {!isCancelled && <div className="absolute left-[30px] md:left-[26px] top-6 bottom-6 w-0.5 bg-slate-100" />}
                  
                  {isCancelled ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Order Cancelled</h3>
                      <p className="text-slate-500">This order has been cancelled and will not be delivered.</p>
                    </div>
                  ) : (
                    trackSteps.map((step, i) => (
                      <div key={i} className="relative flex gap-6 md:gap-8 pb-12 last:pb-0">
                        <div className={`w-[48px] h-[48px] md:w-[54px] md:h-[54px] shrink-0 rounded-2xl flex items-center justify-center z-10 border-4 border-white shadow-sm transition-all duration-500 ${
                          step.completed ? 'bg-emerald-500 text-white' : 
                          step.active ? 'bg-emerald-100 text-emerald-600 animate-pulse' : 
                          'bg-slate-100 text-slate-400'
                        }`}>
                          {step.icon}
                        </div>
                        <div className="pt-1">
                          <h4 className={`text-lg md:text-xl font-bold ${step.completed || step.active ? 'text-slate-900' : 'text-slate-400'}`}>
                            {step.title}
                          </h4>
                          <p className={`text-sm mt-1 font-medium ${step.completed || step.active ? 'text-slate-600' : 'text-slate-400'}`}>
                            {step.desc}
                          </p>
                          <p className="text-slate-400 text-xs mt-1">{step.date} • {step.time}</p>
                          
                          {step.active && step.title === 'Processing' && (
                            <div className="mt-4 flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                              <Package className="w-5 h-5 text-indigo-600 shrink-0" />
                              <p className="text-sm text-indigo-800 font-medium">Your plants are being carefully packaged.</p>
                            </div>
                          )}
                          
                          {step.active && step.title === 'Shipped' && (
                            <div className="mt-4 flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                              <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
                              <p className="text-sm text-emerald-800 font-medium">Handed over to delivery partner.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Order Info Sidebar */}
              <div className="space-y-8">
                <div className="bg-slate-900 rounded-[48px] p-8 md:p-10 text-white">
                  <h3 className="text-xl font-bold mb-8">Shipment Details</h3>
                  <div className="space-y-8">
                    <div className="flex gap-4">
                      <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Delivery Address</p>
                        <p className="text-sm font-medium leading-relaxed mt-1">
                          {orderData.shippingAddress?.street}, {orderData.shippingAddress?.city}, {orderData.shippingAddress?.state} {orderData.shippingAddress?.zipCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Package className="w-5 h-5 text-emerald-500 shrink-0" />
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Items</p>
                        <p className="text-lg font-bold mt-1">{orderData.items?.length || 0} Plants</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-[40px] p-8 space-y-4">
                  <div className="flex items-center gap-3 text-emerald-700">
                    <ShieldCheck className="w-6 h-6" />
                    <h4 className="font-bold">Freshness Guaranteed</h4>
                  </div>
                  <p className="text-sm text-emerald-800/70 leading-relaxed">
                    Your plants are being transported in specialized climate-controlled containers to ensure they arrive fresh.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Helpful Info Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Transit Hours</h4>
                <p className="text-slate-500 text-sm leading-relaxed">Orders are delivered between 9:00 AM and 7:00 PM on business days.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Weekend Policy</h4>
                <p className="text-slate-500 text-sm leading-relaxed">We schedule long-distance shipments to avoid plants staying in warehouses over Sunday.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Live Tracking</h4>
                <p className="text-slate-500 text-sm leading-relaxed">Once 'Out for Delivery', you'll receive a link for live agent tracking via SMS.</p>
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
