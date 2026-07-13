'use client';

import { motion } from 'motion/react';
import { 
  Tag, 
  Search, 
  Calendar, 
  Trash2, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

type Promotion = {
  id: string;
  sellerId: string;
  title: string;
  code: string;
  description: string;
  discountPercentage: number;
  validFrom: string;
  validUntil: string;
  isApproved: boolean;
  isActive: boolean;
};

type ProductDiscount = {
  id: string;
  sellerId: string;
  productId: string;
  productName: string;
  productImage: string;
  originalPrice: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountedPrice: number;
  validFrom: string;
  validUntil: string;
  isApproved: boolean;
  isActive: boolean;
};

export default function PromotionsPage() {
  const [activeTab, setActiveTab] = useState<'promotions' | 'discounts'>('promotions');
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [discounts, setDiscounts] = useState<ProductDiscount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [promoRes, discRes] = await Promise.all([
        fetch('/api/admin/promotions'),
        fetch('/api/admin/product-discounts')
      ]);
      if (promoRes.ok) {
        const pData = await promoRes.json();
        setPromotions(pData.promotions || []);
      }
      if (discRes.ok) {
        const dData = await discRes.json();
        setDiscounts(dData.discounts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    if (!confirm('Approve this promotion?')) return;
    try {
      const res = await fetch(`/api/admin/promotions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: true, isActive: true })
      });
      if (res.ok) {
        const { promotion } = await res.json();
        setPromotions(promotions.map(p => p.id === id ? promotion : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Reject and delete this promotion?')) return;
    try {
      const res = await fetch(`/api/admin/promotions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPromotions(promotions.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveDiscount = async (id: string) => {
    if (!confirm('Approve this discount?')) return;
    try {
      const res = await fetch(`/api/admin/product-discounts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: true, isActive: true })
      });
      if (res.ok) {
        const { discount } = await res.json();
        setDiscounts(discounts.map(d => d.id === id ? discount : d));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectDiscount = async (id: string) => {
    if (!confirm('Reject and delete this discount?')) return;
    try {
      const res = await fetch(`/api/admin/product-discounts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDiscounts(discounts.filter(d => d.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPromotions = promotions.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDiscounts = discounts.filter(d => 
    d.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentList = activeTab === 'promotions' ? filteredPromotions : filteredDiscounts;
  const currentTotalPending = activeTab === 'promotions' ? promotions.filter(p => !p.isApproved).length : discounts.filter(d => !d.isApproved).length;
  const currentTotalActive = activeTab === 'promotions' ? promotions.filter(p => p.isActive).length : discounts.filter(d => d.isActive).length;
  const currentTotalApproved = activeTab === 'promotions' ? promotions.filter(p => p.isApproved).length : discounts.filter(d => d.isApproved).length;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Seller Promotions</h1>
          <p className="text-slate-500 font-medium italic">Review and approve discount codes requested by merchants.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Pending', value: currentTotalPending, icon: <Clock />, color: 'bg-amber-500' },
          { label: 'Active', value: currentTotalActive, icon: <TrendingUp />, color: 'bg-emerald-500' },
          { label: 'Approved', value: currentTotalApproved, icon: <CheckCircle2 />, color: 'bg-blue-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all duration-500">
            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-3xl font-display font-black text-slate-900">{stat.value}</h3>
            </div>
            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('promotions')}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'promotions' 
              ? 'bg-white text-emerald-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Coupon Codes
        </button>
        <button
          onClick={() => setActiveTab('discounts')}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'discounts' 
              ? 'bg-white text-emerald-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Specimen Discounts
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-[28px] border border-slate-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by title, code, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900"
          />
        </div>
      </div>

      {/* Promotions List */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Promotion Details</th>
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Discount</th>
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Duration</th>
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="px-8 py-12 text-center text-slate-400 font-medium">Loading...</td></tr>
              ) : currentList.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-4">
                      {activeTab === 'promotions' ? (
                        <>
                          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                            <Tag className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-bold text-slate-900">{item.title}</p>
                            <p className="text-xs text-slate-500 font-medium max-w-xs truncate italic">{item.description}</p>
                            <span className="inline-block mt-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">
                              {item.code}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Image src={item.productImage} alt={item.productName} className="w-12 h-12 rounded-xl object-cover" width={100} height={100} />
                          <div className="space-y-1">
                            <p className="font-bold text-slate-900">{item.productName}</p>
                            <p className="text-xs text-slate-500 font-medium max-w-xs truncate italic">Product Discount</p>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    {activeTab === 'promotions' ? (
                      <span className="font-black text-emerald-700 text-lg">
                        {item.discountPercentage}% Off
                      </span>
                    ) : (
                      <div className="space-y-1">
                        <span className="font-black text-emerald-700 text-lg flex items-center gap-1">
                          {item.discountType === 'percentage' ? `${item.discountValue}%` : `₹${item.discountValue}`} Off
                        </span>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 line-through">₹{item.originalPrice}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">₹{item.discountedPrice}</p>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      <span>{new Date(item.validFrom).toLocaleDateString()}</span>
                      <span className="text-slate-300">→</span>
                      <span>{new Date(item.validUntil).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    {!item.isApproved ? (
                       <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest">
                         <Clock className="w-3 h-3" /> Pending
                       </span>
                    ) : item.isActive ? (
                       <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                         <CheckCircle2 className="w-3 h-3" /> Active
                       </span>
                    ) : (
                       <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                         Inactive
                       </span>
                    )}
                  </td>
                  <td className="px-8 py-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!item.isApproved ? (
                        <>
                          <button 
                            onClick={() => activeTab === 'promotions' ? handleApprove(item.id) : handleApproveDiscount(item.id)}
                            className="p-3 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
                          >
                            <Check className="w-4 h-4" /> Approve
                          </button>
                          <button 
                            onClick={() => activeTab === 'promotions' ? handleReject(item.id) : handleRejectDiscount(item.id)}
                            className="p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
                          >
                            <X className="w-4 h-4" /> Reject
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => activeTab === 'promotions' ? handleReject(item.id) : handleRejectDiscount(item.id)}
                          className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && currentList.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto border border-slate-100">
                <AlertCircle className="w-10 h-10 text-slate-300" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-xl">No promotions found</h3>
                <p className="text-slate-500 text-sm italic font-medium">There are currently no promotions waiting for approval.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
