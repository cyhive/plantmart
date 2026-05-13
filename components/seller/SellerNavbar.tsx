'use client';

import { useAuth } from '@/context/AuthContext';
import { Bell, Search, User } from 'lucide-react';
import { motion } from 'motion/react';

export function SellerNavbar() {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-slate-100 px-8 h-20 flex items-center justify-between sticky top-0 z-30 flex-shrink-0">
      <div className="flex items-center gap-6 flex-grow max-w-xl">
        <div className="relative w-full group hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search orders, products, or help..." 
            className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/10 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <div className="w-px h-8 bg-slate-100" />
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900">{user?.name}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{user?.shopName || 'Premium Seller'}</p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
            {user?.name?.charAt(0) || 'S'}
          </div>
        </div>
      </div>
    </header>
  );
}
