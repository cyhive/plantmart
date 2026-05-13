'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';
import { 
  Store, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Package,
  Calendar
} from 'lucide-react';

interface Seller {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  shopName: string;
  isVerified: boolean;
  createdAt: string;
  avatar?: string;
}

export default function AdminSellersPage() {
  const { user } = useAuth();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const MOCK_SELLERS: Seller[] = [
    { _id: 's1', name: 'Nandan K.', email: 'nandan@greengarden.com', phone: '+91 9876543210', shopName: 'Green Garden Nursery', isVerified: true, createdAt: '2023-10-15T10:00:00Z' },
    { _id: 's2', name: 'Arjun S.', email: 'arjun@pureair.in', phone: '+91 9822334455', shopName: 'Pure Air Botanicals', isVerified: false, createdAt: '2024-01-20T14:30:00Z' },
    { _id: 's3', name: 'Maya R.', email: 'maya@tropicalhaven.com', phone: '+91 9122334455', shopName: 'Tropical Haven', isVerified: true, createdAt: '2023-05-12T09:15:00Z' },
  ];

  useEffect(() => {
    setSellers(MOCK_SELLERS);
    setLoading(false);
  }, []);

  const toggleVerification = (id: string, currentStatus: boolean) => {
    setSellers(prev => prev.map(s => s._id === id ? { ...s, isVerified: !currentStatus } : s));
  };

  const deleteSeller = (id: string) => {
    if (!confirm('Are you sure you want to remove this seller?')) return;
    setSellers(prev => prev.filter(s => s._id !== id));
  };

  const filteredSellers = sellers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Vendor Management</h1>
          <p className="text-slate-500 font-medium italic">Oversee and verify marketplace nurseries.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-600/20">
              Total Vendors: {sellers.length}
           </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Verified Partners', value: sellers.filter(s => s.isVerified).length, icon: <ShieldCheck className="text-emerald-600" />, sub: 'Trusted nurseries' },
          { label: 'Pending Review', value: sellers.filter(s => !s.isVerified).length, icon: <ShieldAlert className="text-amber-600" />, sub: 'Awaiting verification' },
          { label: 'Marketplace Reach', value: '12 Cities', icon: <TrendingUp className="text-blue-600" />, sub: 'Active locations' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-display font-bold text-slate-900">{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
              <p className="text-[10px] text-emerald-600 font-bold italic mt-2">{stat.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Table */}
      <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-grow max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by Name, Shop, or Email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white text-[10px] font-black uppercase tracking-widest text-slate-400 rounded-xl border border-slate-100 shadow-sm hover:text-emerald-600 transition-colors">Export CSV</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Vendor / Shop</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Info</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Joined</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Verification</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-slate-50">
                    <td colSpan={6} className="px-8 py-6"><div className="h-12 bg-slate-50 rounded-2xl w-full" /></td>
                  </tr>
                ))
              ) : filteredSellers.length > 0 ? (
                filteredSellers.map((seller) => (
                  <tr key={seller._id} className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-bold border border-emerald-100">
                          {seller.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{seller.name}</p>
                          <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest flex items-center gap-1 italic">
                            <Store className="w-3 h-3" /> {seller.shopName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 space-y-1">
                      <p className="text-xs font-bold text-slate-600 flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> {seller.email}</p>
                      {seller.phone && <p className="text-xs font-bold text-slate-600 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {seller.phone}</p>}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(seller.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {seller.isVerified ? (
                        <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                          <CheckCircle2 className="w-4 h-4" /> Verified
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-600 text-[10px] font-black uppercase tracking-widest">
                          <ShieldAlert className="w-4 h-4" /> Unverified
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => toggleVerification(seller._id, seller.isVerified)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          seller.isVerified 
                          ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {seller.isVerified ? 'Revoke' : 'Verify'}
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-3 bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all">
                           <TrendingUp className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteSeller(seller._id)}
                          className="p-3 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Store className="w-10 h-10 text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-medium italic">No vendors found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
