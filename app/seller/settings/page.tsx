'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';
import { Store, Mail, User as UserIcon, ShieldCheck, Save, Globe, Phone } from 'lucide-react';

export default function SellerSettingsPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    shopName: user?.shopName || '',
    phone: '',
    address: '',
    website: ''
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulation of save
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/50 mesh-gradient relative pb-20">
      <div className="absolute inset-0 bg-white/60 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="space-y-2">
            <h1 className="text-5xl font-display font-bold text-slate-900 tracking-tight text-center md:text-left">Shop Settings</h1>
            <p className="text-slate-500 font-medium italic text-center md:text-left">Configure your vendor profile and storefront details</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Profile Sidebar */}
            <div className="space-y-8">
              <div className="glass p-8 rounded-[40px] border-white shadow-xl text-center space-y-6">
                <div className="w-32 h-32 bg-emerald-100 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-inner">
                  <Store className="w-16 h-16 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-slate-900">{formData.shopName || 'My Nursery'}</h3>
                  <p className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest mt-1">Verified Vendor</p>
                </div>
                <div className="pt-4 flex justify-center gap-4">
                   <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer">
                      <Globe className="w-5 h-5" />
                   </div>
                   <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer">
                      <Phone className="w-5 h-5" />
                   </div>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="md:col-span-2 space-y-8">
              <div className="glass p-10 rounded-[48px] border-white shadow-sm space-y-10">
                <div className="space-y-8">
                   <h3 className="text-2xl font-display font-bold text-slate-900 border-b border-white/20 pb-4">General Information</h3>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 ml-1">Shop Name</label>
                        <div className="relative">
                          <Store className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                          <input 
                            type="text" 
                            value={formData.shopName}
                            onChange={e => setFormData({...formData, shopName: e.target.value})}
                            className="w-full pl-12 pr-6 py-4 bg-white/50 border-2 border-transparent rounded-[24px] focus:bg-white focus:border-emerald-500/30 outline-none transition-all font-medium"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 ml-1">Owner Name</label>
                        <div className="relative">
                          <UserIcon className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                          <input 
                            type="text" 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full pl-12 pr-6 py-4 bg-white/50 border-2 border-transparent rounded-[24px] focus:bg-white focus:border-emerald-500/30 outline-none transition-all font-medium"
                          />
                        </div>
                      </div>
                      <div className="col-span-full space-y-2">
                        <label className="block text-sm font-bold text-slate-700 ml-1">Business Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                          <input 
                            type="email" 
                            disabled
                            value={formData.email}
                            className="w-full pl-12 pr-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-[24px] text-slate-400 cursor-not-allowed font-medium"
                          />
                        </div>
                      </div>
                   </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/20">
                   <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                      <ShieldCheck className="w-5 h-5" />
                      Data encrypted & secure
                   </div>
                   <button 
                    type="submit" 
                    disabled={saving}
                    className="bg-slate-900 text-white px-10 py-4 rounded-[24px] font-bold flex items-center gap-3 hover:bg-emerald-600 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                   >
                     {saving ? 'Updating...' : (
                        <>
                          <Save className="w-5 h-5" /> Save Changes
                        </>
                     )}
                   </button>
                </div>
              </div>

              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50 text-emerald-700 p-6 rounded-[32px] font-bold text-center border border-emerald-100 shadow-xl"
                >
                  Profile updated successfully!
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
