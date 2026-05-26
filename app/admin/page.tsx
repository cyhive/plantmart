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
  LayoutDashboard,
  Tag
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
  activePromos: number;
}

function StatCard({ label, value, sub, icon, color = 'bg-emerald-500', delay = 0 }: { label: string; value: any; sub?: string; icon: React.ReactNode; color?: string; delay?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col gap-4"
    >
      <div className="flex justify-between items-start">
        <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
          {icon}
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-200 group-hover:text-slate-400 transition-colors" />
      </div>
      <div className="space-y-0.5">
        <p className="text-2xl md:text-3xl font-display font-black text-slate-900 tracking-tight leading-none truncate" title={value}>{value}</p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        {sub && <p className="text-[10px] text-emerald-600 font-bold mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchStats();
    }
  }, [authLoading]);

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Immersive Header */}
      <div className="relative p-6 md:p-10 bg-slate-900 rounded-[32px] md:rounded-[48px] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#065f46_0%,transparent_50%)] opacity-40" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
          <div className="space-y-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 backdrop-blur-md rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20"
            >
              <ShieldCheck className="w-3 h-3" /> System Administrator
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-display font-black text-white tracking-tight">
              Welcome back, <span className="text-emerald-500 italic">{user?.name?.split(' ')[0] || 'Admin'}</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-medium italic">Everything is running smoothly.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/5 backdrop-blur-md px-4 md:px-6 py-3 md:py-4 rounded-2xl md:rounded-3xl border border-white/10 text-center">
              <p className="text-xl md:text-2xl font-black text-white">₹2.4M</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Monthly Target</p>
            </div>
            <Link href="/admin/settings" className="w-12 h-12 md:w-14 md:h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20">
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-[32px] animate-pulse" />
          ))
        ) : stats && (
          <>
            <StatCard label="Total Sellers" value={stats.totalSellers} icon={<Store className="w-7 h-7" />} color="bg-blue-600" delay={0.1} />
            <StatCard label="Pending Review" value={stats.pendingProducts} sub="Action Required" icon={<Clock className="w-7 h-7" />} color="bg-orange-600" delay={0.2} />
            <StatCard label="Total Sales" value={stats.totalOrders} icon={<ShoppingCart className="w-7 h-7" />} color="bg-purple-600" delay={0.3} />
            <StatCard label="Active Promos" value={stats.activePromos} icon={<Tag className="w-7 h-7" />} color="bg-amber-600" delay={0.4} />
            <StatCard label="Platform Revenue" value={`₹${(stats.totalRevenue / 1000).toFixed(1)}k`} icon={<TrendingUp className="w-7 h-7" />} color="bg-emerald-600" delay={0.5} />
          </>
        )}
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Moderation Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Moderation Queue</h3>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Platform Health</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/admin/products" className="group relative overflow-hidden bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-bl-[100px] -z-10 group-hover:bg-orange-500/10 transition-colors" />
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                  <Package className="w-7 h-7" />
                </div>
                <div className="px-3 py-1 bg-orange-100 text-orange-700 text-[9px] font-black uppercase tracking-widest rounded-full">High Priority</div>
              </div>
              <h4 className="text-2xl font-display font-black text-slate-900">Review Specimens</h4>
              <p className="text-slate-500 text-sm font-medium mt-2 mb-6 italic">{stats?.pendingProducts} products are currently awaiting quality verification.</p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-600 group-hover:gap-4 transition-all">
                Access Queue <ChevronRight className="w-4 h-4" />
              </div>
            </Link>

            <Link href="/admin/sellers" className="group relative overflow-hidden bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[100px] -z-10 group-hover:bg-emerald-500/10 transition-colors" />
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Users className="w-7 h-7" />
                </div>
                <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest rounded-full">Manual Review</div>
              </div>
              <h4 className="text-2xl font-display font-black text-slate-900">Nursery Approvals</h4>
              <p className="text-slate-500 text-sm font-medium mt-2 mb-6 italic">{stats?.pendingSellers} sellers have applied for botanical verification.</p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 group-hover:gap-4 transition-all">
                View Applications <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Quick Insights</h3>
            <Link href="/admin/promotions" className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:underline">Manage All</Link>
          </div>
          
          <div className="bg-slate-900 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
                  <Tag className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-white font-display font-bold text-xl tracking-tight">Promotion ROI</p>
                  <p className="text-[9px] text-emerald-400 font-black uppercase tracking-[0.2em]">Live Performance</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-400 text-[10px] font-black uppercase">Monsoon Sale</span>
                    <span className="text-emerald-400 text-[10px] font-black">+12.5%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[75%]" />
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-400 text-[10px] font-black uppercase">First Order</span>
                    <span className="text-blue-400 text-[10px] font-black">+8.2%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[45%]" />
                  </div>
                </div>
              </div>

              <Link href="/admin/promotions" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all text-center block shadow-xl shadow-emerald-600/20">
                Optimization Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
