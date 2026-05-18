'use client';

import { useState } from 'react';
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
  Info
} from 'lucide-react';
import Link from 'next/link';

const trackSteps = [
  { status: 'Order Placed', date: 'May 14, 2026', time: '10:30 AM', completed: true, icon: <CheckCircle2 className="w-5 h-5" /> },
  { status: 'Processed at Nursery', date: 'May 14, 2026', time: '04:15 PM', completed: true, icon: <CheckCircle2 className="w-5 h-5" /> },
  { status: 'Shipped', date: 'May 15, 2026', time: '09:00 AM', completed: true, icon: <Truck className="w-5 h-5" /> },
  { status: 'In Transit', date: 'Today', time: '08:45 AM', completed: false, active: true, icon: <Package className="w-5 h-5" /> },
  { status: 'Out for Delivery', date: 'Expected Tomorrow', time: 'By 06:00 PM', completed: false, icon: <MapPin className="w-5 h-5" /> },
];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [isTracked, setIsTracked] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId) setIsTracked(true);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden mesh-gradient">
        <div className="absolute inset-0 bg-slate-900/60 z-10" />
        <div className="absolute inset-0 z-0">
          <img 
            src="/botanical_delivery_tracking_1778929633492.png" 
            alt="Delivery Tracking" 
            className="w-full h-full object-cover"
          />
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
            <form onSubmit={handleTrack} className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-3xl flex items-center gap-4">
              <div className="pl-6 text-emerald-400">
                <Search className="w-6 h-6" />
              </div>
              <input 
                type="text" 
                placeholder="Enter Order ID (e.g. PM-123456)" 
                className="flex-grow bg-transparent border-none focus:ring-0 text-white placeholder-emerald-100/50 text-lg py-4"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black px-8 py-4 rounded-2xl transition-all active:scale-95">
                Track
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Tracking Results */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {!isTracked ? (
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
                <p className="text-slate-500">You can find your order ID in your confirmation email or SMS.</p>
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
              <div className="lg:col-span-2 bg-white rounded-[60px] p-12 border border-slate-100 shadow-xl shadow-emerald-900/5">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h2 className="text-3xl font-display font-black text-slate-900">Order Status</h2>
                    <p className="text-slate-500 font-medium">Tracking ID: {orderId}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-200">
                      In Transit
                    </span>
                  </div>
                </div>

                <div className="space-y-0 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-[26px] top-6 bottom-6 w-0.5 bg-slate-100" />
                  
                  {trackSteps.map((step, i) => (
                    <div key={i} className="relative flex gap-8 pb-12 last:pb-0">
                      <div className={`w-[54px] h-[54px] rounded-2xl flex items-center justify-center z-10 border-4 border-white shadow-sm transition-all duration-500 ${
                        step.completed ? 'bg-emerald-500 text-white' : 
                        step.active ? 'bg-emerald-100 text-emerald-600 animate-pulse' : 
                        'bg-slate-100 text-slate-400'
                      }`}>
                        {step.icon}
                      </div>
                      <div className="pt-1">
                        <h4 className={`text-xl font-bold ${step.completed || step.active ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.status}
                        </h4>
                        <p className="text-slate-500 text-sm mt-1">{step.date} • {step.time}</p>
                        {step.active && (
                          <div className="mt-4 flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <MapPin className="w-5 h-5 text-emerald-600" />
                            <p className="text-sm text-emerald-800 font-medium">Currently at Bangalore Sorting Facility</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Info Sidebar */}
              <div className="space-y-8">
                <div className="bg-slate-900 rounded-[48px] p-10 text-white">
                  <h3 className="text-xl font-bold mb-8">Shipment Details</h3>
                  <div className="space-y-8">
                    <div className="flex gap-4">
                      <Calendar className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Expected Delivery</p>
                        <p className="text-lg font-bold">May 17, 2026</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <MapPin className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Delivery Address</p>
                        <p className="text-sm font-medium leading-relaxed">Green Avenue, Whitefield, Bangalore, KA 560066</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Truck className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Courier Partner</p>
                        <p className="text-lg font-bold">PlantLogistics Prime</p>
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

                <div className="bg-white border border-slate-100 rounded-[40px] p-8">
                  <h4 className="font-bold text-slate-900 mb-4">Issues with delivery?</h4>
                  <Link href="/contact" className="flex items-center justify-between group p-4 bg-slate-50 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all">
                    <span className="font-bold text-sm">Contact Support</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
                  </Link>
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
