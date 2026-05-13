'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  BarChart3, 
  ShieldCheck, 
  ShieldAlert, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  ArrowUpRight,
  Package,
  Store,
  ChevronRight,
  Clock,
  LayoutDashboard
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

interface Stats {
  totalSellers: number;
  totalBuyers: number;
  totalProducts: number;
  pendingProducts: number;
  pendingSellers: number;
  totalOrders: number;
  totalRevenue: number;
}

function StatCard({ label, value, sub, icon, color = 'text-slate-900', delay = 0 }: { label: string; value: any; sub?: string; icon: React.ReactNode; color?: string; delay?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[60px] -z-10 group-hover:bg-emerald-50 transition-colors" />
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
      </div>
      <div className="space-y-1">
        <p className={`text-4xl font-display font-bold ${color}`}>{value}</p>
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{label}</p>
        {sub && <p className="text-[10px] text-emerald-600 font-bold italic mt-2">{sub}</p>}
      </div>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = () => {
      // Mock Stats Data
      const mockStats: Stats = {
        totalSellers: 24,
        totalBuyers: 1450,
        totalProducts: 450,
        pendingProducts: 12,
        pendingSellers: 3,
        totalOrders: 890,
        totalRevenue: 2450000,
      };
      
      setStats(mockStats);
      setLoading(false);
    };

    if (!authLoading) {
      fetchStats();
    }
  }, [authLoading]);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Admin Overview</h1>
          <p className="text-slate-500 font-medium italic">Monitor marketplace health and operational efficiency.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Live System Status</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 bg-white rounded-[40px] animate-pulse" />
          ))
        ) : stats && (
          <>
            <StatCard label="Total Sellers" value={stats.totalSellers} icon={<Store className="text-blue-600" />} delay={0.1} />
            <StatCard label="Live Products" value={stats.totalProducts - stats.pendingProducts} sub={`${stats.pendingProducts} Awaiting Review`} icon={<Package className="text-orange-600" />} color="text-orange-600" delay={0.2} />
            <StatCard label="Platform Sales" value={stats.totalOrders} icon={<ShoppingCart className="text-purple-600" />} delay={0.3} />
            <StatCard label="Net Revenue" value={`₹${(stats.totalRevenue / 1000).toFixed(1)}k`} icon={<TrendingUp className="text-emerald-600" />} color="text-emerald-600" delay={0.4} />
          </>
        )}
      </div>

      {/* Action Hub & Moderation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-8"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-2xl text-slate-900 flex items-center gap-3">
               <LayoutDashboard className="w-6 h-6 text-emerald-600" /> Moderation Queue
            </h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Action Required</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/admin/products" className="group">
              <div className="p-8 bg-orange-50 rounded-[32px] border border-orange-100 transition-all hover:shadow-xl hover:shadow-orange-600/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Package className="w-16 h-16 text-orange-600" />
                </div>
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-display font-black text-orange-900">{stats?.pendingProducts || 0}</p>
                    <p className="text-xs font-bold text-orange-700/70 uppercase tracking-widest">Pending Specimens</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-orange-600 group-hover:gap-4 transition-all">
                    Review Catalog <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/admin/sellers" className="group">
              <div className="p-8 bg-emerald-50 rounded-[32px] border border-emerald-100 transition-all hover:shadow-xl hover:shadow-emerald-600/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Users className="w-16 h-16 text-emerald-600" />
                </div>
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-display font-black text-emerald-900">{stats?.pendingSellers || 0}</p>
                    <p className="text-xs font-bold text-emerald-700/70 uppercase tracking-widest">Nursery Verifications</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-600 group-hover:gap-4 transition-all">
                    Manage Vendors <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-900 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-emerald-500/20 transition-colors" />
          <div className="space-y-8 relative z-10 h-full flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mt-4">Platform Insights</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">Detailed revenue reports and sales performance metrics are being synchronized.</p>
            </div>
            
            <Link href="/admin/orders" className="w-full bg-white/10 hover:bg-white text-white hover:text-slate-900 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-3">
              View Global Sales <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
