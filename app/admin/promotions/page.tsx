'use client';

import { motion, AnimatePresence } from 'motion/react';
import { 
  Tag, 
  Plus, 
  Search, 
  Calendar, 
  Percent, 
  Trash2, 
  Edit2, 
  ToggleLeft, 
  ToggleRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';

// Mock data for promotions
const initialPromotions = [
  { 
    id: '1', 
    title: 'Monsoon Sale', 
    description: 'Get 20% off on all indoor plants', 
    type: 'percentage', 
    value: 20, 
    startDate: '2024-06-01', 
    endDate: '2024-07-31', 
    status: 'Active',
    usageCount: 450
  },
  { 
    id: '2', 
    title: 'New User Bonus', 
    description: '₹100 off on first order above ₹500', 
    type: 'fixed', 
    value: 100, 
    startDate: '2024-01-01', 
    endDate: '2024-12-31', 
    status: 'Active',
    usageCount: 1200
  },
  { 
    id: '3', 
    title: 'Succulent Sunday', 
    description: 'Buy 2 Get 1 Free on all succulents', 
    type: 'bogo', 
    value: 0, 
    startDate: '2024-05-10', 
    endDate: '2024-05-15', 
    status: 'Expired',
    usageCount: 89
  }
];

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState(initialPromotions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPromo, setNewPromo] = useState({
    title: '',
    description: '',
    type: 'percentage',
    value: '',
    startDate: '',
    endDate: '',
    status: 'Active'
  });

  const handleAddPromotion = (e: React.FormEvent) => {
    e.preventDefault();
    const promo = {
      ...newPromo,
      id: Date.now().toString(),
      value: Number(newPromo.value),
      usageCount: 0
    };
    setPromotions([promo, ...promotions]);
    setIsModalOpen(false);
    setNewPromo({
      title: '',
      description: '',
      type: 'percentage',
      value: '',
      startDate: '',
      endDate: '',
      status: 'Active'
    });
  };

  const deletePromotion = (id: string) => {
    setPromotions(promotions.filter(p => p.id !== id));
  };

  const toggleStatus = (id: string) => {
    setPromotions(promotions.map(p => 
      p.id === id ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p
    ));
  };

  const filteredPromotions = promotions.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Promotions & Offers</h1>
          <p className="text-slate-500 font-medium italic">Manage platform-wide marketing campaigns and discount codes.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-8 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-3 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Create New Offer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Offers', value: promotions.filter(p => p.status === 'Active').length, icon: <TrendingUp />, color: 'bg-emerald-500' },
          { label: 'Total Claims', value: promotions.reduce((acc, curr) => acc + curr.usageCount, 0).toLocaleString(), icon: <CheckCircle2 />, color: 'bg-blue-500' },
          { label: 'Ending Soon', value: '2', icon: <Clock />, color: 'bg-amber-500' }
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

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-[28px] border border-slate-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search promotions by title or description..."
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
              {filteredPromotions.map((promo) => (
                <tr key={promo.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                        <Tag className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900">{promo.title}</p>
                        <p className="text-xs text-slate-500 font-medium max-w-xs truncate italic">{promo.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900">
                        {promo.type === 'percentage' ? `${promo.value}% Off` : `₹${promo.value} Off`}
                        {promo.type === 'bogo' && 'Buy 1 Get 1'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{promo.usageCount} Claims</span>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      <span>{promo.startDate}</span>
                      <span className="text-slate-300">→</span>
                      <span>{promo.endDate}</span>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <button 
                      onClick={() => toggleStatus(promo.id)}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                        promo.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' 
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${promo.status === 'Active' ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                      {promo.status}
                    </button>
                  </td>
                  <td className="px-8 py-8 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deletePromotion(promo.id)}
                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPromotions.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto border border-slate-100">
                <AlertCircle className="w-10 h-10 text-slate-300" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-xl">No promotions found</h3>
                <p className="text-slate-500 text-sm italic font-medium">Try searching for something else or create a new offer.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Promotion Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[48px] shadow-3xl border border-white/20 p-12 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-600/20">
                  <Plus className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">New Promotion</h2>
                  <p className="text-slate-500 font-medium italic">Configure your marketing offer details.</p>
                </div>
              </div>

              <form onSubmit={handleAddPromotion} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Promotion Title</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Summer Blast Sale"
                    className="w-full px-8 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 placeholder:italic"
                    value={newPromo.title}
                    onChange={(e) => setNewPromo({...newPromo, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Short Description</label>
                  <textarea 
                    required
                    placeholder="Briefly describe the offer benefits..."
                    className="w-full px-8 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 placeholder:italic min-h-[100px]"
                    value={newPromo.description}
                    onChange={(e) => setNewPromo({...newPromo, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Type</label>
                    <select 
                      className="w-full px-8 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900"
                      value={newPromo.type}
                      onChange={(e) => setNewPromo({...newPromo, type: e.target.value})}
                    >
                      <option value="percentage">Percentage Off (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                      <option value="bogo">Buy 1 Get 1 (BOGO)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Value</label>
                    <input 
                      required
                      type="number" 
                      placeholder="e.g. 20"
                      className="w-full px-8 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900"
                      value={newPromo.value}
                      onChange={(e) => setNewPromo({...newPromo, value: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Start Date</label>
                    <input 
                      required
                      type="date" 
                      className="w-full px-8 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900"
                      value={newPromo.startDate}
                      onChange={(e) => setNewPromo({...newPromo, startDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">End Date</label>
                    <input 
                      required
                      type="date" 
                      className="w-full px-8 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900"
                      value={newPromo.endDate}
                      onChange={(e) => setNewPromo({...newPromo, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-grow py-5 rounded-[24px] font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all active:scale-95 border border-slate-100"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-grow py-5 rounded-[24px] font-black text-xs uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
                  >
                    Publish Offer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
