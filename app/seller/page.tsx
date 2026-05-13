'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';
import { 
  Package, 
  ShoppingBag, 
  PieChart, 
  Plus, 
  TrendingUp, 
  ArrowUpRight,
  ChevronRight,
  Box,
  IndianRupee,
  Store
} from 'lucide-react';
import Link from 'next/link';

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = () => {
      // Mock Stats Logic
      setTimeout(() => {
        setStats({
          totalProducts: 42,
          totalOrders: 156,
          totalRevenue: 84500
        });
        setLoading(false);
      }, 600);
    };

    if (user) fetchStats();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Nursery Overview</h1>
          <p className="text-slate-500 font-medium italic">Welcome back, {user?.name}. Here's how your business is growing.</p>
        </div>
        <Link href="/seller/products" className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95">
          <Plus className="w-5 h-5" /> Add New Specimen
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Revenue', value: stats.totalRevenue, icon: <TrendingUp className="text-emerald-600" />, sub: 'Net nursery earnings', isPrice: true },
          { label: 'Total Sales', value: stats.totalOrders, icon: <ShoppingBag className="text-blue-600" />, sub: 'Orders with your items' },
          { label: 'Inventory Size', value: stats.totalProducts, icon: <Package className="text-purple-600" />, sub: 'Active plant specimens' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[60px] -z-10 group-hover:bg-emerald-50 transition-colors" />
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-display font-bold text-slate-900 flex items-center gap-1">
                {stat.isPrice && <IndianRupee className="w-6 h-6" />}
                {stat.value}
              </p>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-[10px] text-emerald-600 font-bold italic mt-2">{stat.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden flex flex-col"
        >
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-display font-bold text-xl text-slate-900 flex items-center gap-3 italic">
               <Store className="w-5 h-5 text-emerald-500" /> Management Hubs
            </h3>
          </div>
          <div className="p-8 space-y-4 flex-grow">
             <Link href="/seller/products" className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-emerald-50 hover:border-emerald-100 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                    <Box className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Inventory Management</p>
                    <p className="text-xs text-slate-500">Update stock levels and rates.</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-all" />
             </Link>

             <Link href="/seller/orders" className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-emerald-50 hover:border-emerald-100 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Order Fulfillment</p>
                    <p className="text-xs text-slate-500">Track sales and update statuses.</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-all" />
             </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-emerald-900 rounded-[48px] shadow-2xl relative overflow-hidden group p-12 flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="space-y-6 relative z-10">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400">
               <PieChart className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-display font-bold text-white">Performance Insights</h3>
            <p className="text-emerald-100/60 text-sm font-medium leading-relaxed max-w-sm">We're aggregating your sales data to provide detailed growth analytics and customer heatmaps.</p>
          </div>
          
          <button className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-3 mt-8 hover:bg-emerald-400 shadow-xl shadow-emerald-500/20">
             Coming Soon: Market Reports <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
