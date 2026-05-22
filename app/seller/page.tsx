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
  Store,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/seller/dashboard');
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalProducts: data.totalProducts || 0,
            totalOrders: data.totalOrders || 0,
            totalRevenue: data.totalRevenue || 0
          });
          setSalesData(data.salesData || []);
        }
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

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

      {/* Action Hub & Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden flex flex-col lg:col-span-1"
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
                    <p className="font-bold text-slate-900">Inventory</p>
                    <p className="text-xs text-slate-500">Update stock.</p>
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
                    <p className="font-bold text-slate-900">Orders</p>
                    <p className="text-xs text-slate-500">Track sales.</p>
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
          className="bg-white border border-slate-100 rounded-[48px] shadow-sm relative overflow-hidden group p-8 flex flex-col lg:col-span-2"
        >
          <div className="space-y-2 mb-8 relative z-10">
            <h3 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
               <PieChart className="w-6 h-6 text-emerald-500" />
               Performance Insights
            </h3>
            <p className="text-slate-500 text-sm font-medium">Revenue trends over the last 7 days.</p>
          </div>
          
          <div className="w-full h-72 flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(value) => `₹${value}`} dx={-10} />
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`₹${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
