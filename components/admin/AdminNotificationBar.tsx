'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Info, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function AdminNotificationBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto-show after a short delay for effect
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.6, bounce: 0.3 }}
          className="relative z-40 bg-slate-900 border-b border-white/5 overflow-hidden"
        >
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[100%] -left-[10%] w-[40%] h-[300%] bg-emerald-500/10 blur-[100px] rotate-12 animate-pulse" />
            <div className="absolute -top-[100%] -right-[10%] w-[30%] h-[300%] bg-blue-500/5 blur-[100px] -rotate-12" />
          </div>

          {/* <div className="max-w-[1600px] mx-auto px-6 py-2.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-grow overflow-hidden">
              <div className="hidden sm:flex items-center justify-center w-8 h-8 bg-emerald-500/20 rounded-lg border border-emerald-500/20">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 overflow-hidden">
                <span className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest whitespace-nowrap">
                  <Sparkles className="w-3 h-3" /> System Update
                </span>
                <p className="text-slate-300 text-xs font-medium truncate">
                  <span className="text-white font-bold">Action Required:</span> 3 new seller verification requests and 12 products are awaiting your review.
                </p>
              </div>

              <Link 
                href="/admin/sellers"
                className="hidden md:flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-white transition-colors ml-2 group"
              >
                Review Now <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <button 
              onClick={() => setIsVisible(false)}
              className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all flex-shrink-0"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div> */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
