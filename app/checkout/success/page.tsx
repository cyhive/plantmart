'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ShoppingBag, 
  ArrowRight,
  Sparkles,
  PackageCheck
} from 'lucide-react';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export default function OrderSuccessPage() {
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    // Generate a mock order ID
    const randomId = 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    setOrderId(randomId);
    
    // Trigger confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#059669', '#34d399', '#fbbf24']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#059669', '#34d399', '#fbbf24']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl w-full bg-white rounded-[48px] p-10 md:p-14 shadow-2xl shadow-emerald-900/5 border border-slate-100 text-center relative z-10"
      >
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
            className="w-24 h-24 bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-[32px] flex items-center justify-center relative shadow-inner"
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -top-3 -right-3"
            >
               <Sparkles className="w-8 h-8 text-amber-400 fill-amber-400" />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
           className="space-y-4 mb-10"
        >
           <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight">Order Confirmed</h1>
           <p className="text-slate-500 text-lg font-medium italic max-w-sm mx-auto">
             Your botanical companions are being carefully prepared for their journey to you.
           </p>
           
           <div className="inline-flex flex-col items-center gap-2 mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Reference</span>
             <span className="text-2xl font-bold text-slate-900 font-mono tracking-wider">{orderId}</span>
           </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.8 }}
           className="space-y-4"
        >
          <Link 
            href="/profile?tab=orders" 
            className="w-full py-5 rounded-[24px] bg-slate-900 text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 group"
          >
            <PackageCheck className="w-5 h-5" /> Track Order Status
          </Link>
          <Link 
            href="/plants" 
            className="w-full py-5 rounded-[24px] bg-white text-slate-900 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all border-2 border-slate-100 active:scale-95 group"
          >
            <ShoppingBag className="w-5 h-5" /> Continue Shopping <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
}
