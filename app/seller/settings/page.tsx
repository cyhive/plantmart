'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Store, 
  Mail, 
  User as UserIcon, 
  ShieldCheck, 
  Save, 
  Globe, 
  Phone, 
  MapPin, 
  ImageIcon, 
  FileText,
  Camera,
  RefreshCw
} from 'lucide-react';

export default function SellerSettingsPage() {
  const { user } = useAuth();
  
  // Expanded state to include all fields from the Nursery Detail Page
  const [formData, setFormData] = useState({
    name: user?.name || 'Alexander Garden',
    email: user?.email || 'alexander@green-garden.com',
    shopName: user?.shopName || 'Green Garden Nursery',
    phone: '+91 98765 43210',
    location: 'Pune, Maharashtra',
    website: 'www.greengarden.com',
    description: 'Specializing in exotic indoor foliage and rare succulents. Our family-run nursery has been providing high-quality botanical specimens since 2012.',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1200'
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulation of API call
    await new Promise(r => setTimeout(r, 1500));
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Immersive Header Backdrop - Matches Nursery Detail Page style */}
      <div className="relative h-[30vh] overflow-hidden">
        <img src={formData.image} alt="" className="w-full h-full object-cover blur-[2px] opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/0 to-slate-50" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Page Title */}
          <div className="space-y-2">
            <h1 className="text-5xl font-display font-black text-slate-900 tracking-tight italic">Storefront Control</h1>
            <p className="text-slate-500 font-medium italic">Update your nursery's public identity and botanical story.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Sidebar: Visual Branding */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl text-center space-y-6">
                <div className="relative w-40 h-40 mx-auto group">
                  <div className="w-full h-full bg-emerald-50 rounded-[32px] flex items-center justify-center border-4 border-white shadow-inner overflow-hidden">
                    <img src={formData.image} alt="Shop Preview" className="w-full h-full object-cover" />
                  </div>
                  <button type="button" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px] flex items-center justify-center text-white">
                    <Camera className="w-8 h-8" />
                  </button>
                </div>
                
                <div>
                  <h3 className="font-display font-black text-2xl text-slate-900 italic">{formData.shopName}</h3>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified Merchant</p>
                  </div>
                </div>

                <div className="pt-4 flex justify-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all border border-slate-100 cursor-pointer">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all border border-slate-100 cursor-pointer">
                    <Phone className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Quick Stats Preview */}
              <div className="bg-slate-900 p-8 rounded-[40px] text-white space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Live Status</h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-400 italic">Page Visibility</span>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase">Active</span>
                </div>
              </div>
            </div>

            {/* Right Side: Form Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-12">
                
                {/* Section: Identity */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                    <Store className="w-6 h-6 text-emerald-600" />
                    <h3 className="text-xl font-display font-bold text-slate-900 uppercase tracking-tight">Identity & Reach</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nursery Shop Name</label>
                      <input 
                        type="text" 
                        value={formData.shopName}
                        onChange={e => setFormData({...formData, shopName: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Business Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input 
                          type="text" 
                          value={formData.location}
                          onChange={e => setFormData({...formData, location: e.target.value})}
                          className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: The Story (Long Description) */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                    <FileText className="w-6 h-6 text-emerald-600" />
                    <h3 className="text-xl font-display font-bold text-slate-900 uppercase tracking-tight">Botanical Story</h3>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">About the Nursery</label>
                    <textarea 
                      rows={4}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full px-6 py-5 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-medium text-slate-600 italic leading-relaxed resize-none"
                    />
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-50">
                   <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
                      <ShieldCheck className="w-5 h-5" />
                      Encrypted Cloud Sync
                   </div>
                   <button 
                    type="submit" 
                    disabled={saving}
                    className="w-full sm:w-auto bg-emerald-600 text-white px-12 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
                   >
                     {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                     {saving ? 'Synchronizing...' : 'Save Configuration'}
                   </button>
                </div>
              </div>

              <AnimatePresence>
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-emerald-500 text-white p-6 rounded-[32px] font-black text-xs uppercase tracking-widest text-center shadow-xl shadow-emerald-500/20"
                  >
                    Nursery profile updated successfully!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}