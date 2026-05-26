'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Store, 
  Mail, 
  ShieldCheck,
  Save, 
  Globe, 
  Phone, 
  MapPin, 
  ImageIcon, 
  FileText,
  Camera,
  RefreshCw,
  Building2,
  Briefcase,
  Upload,
  User,
  CreditCard,
  FileCheck
} from 'lucide-react';

const statesAndDistricts: Record<string, string[]> = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Belgaum', 'Mangalore'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Trichy'],
  'Kerala': ['Kochi', 'Trivandrum', 'Kozhikode', 'Thrissur', 'Kollam'],
  'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Asansol'],
};

export default function SellerSettingsPage() {
  const { user } = useAuth();
  
  // Expanded state to include all fields from registration
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || 'Alexander',
    lastName: user?.name?.split(' ')[1] || 'Garden',
    email: user?.email || 'alexander@green-garden.com',
    phone: '+91 98765 43210',
    shopName: (user as any)?.shopName || 'Green Garden Nursery',
    shopCategory: 'Nursery',
    description: 'Specializing in exotic indoor foliage and rare succulents. Our family-run nursery has been providing high-quality botanical specimens since 2012.',
    address: '123 Green Lane, Botanical District',
    district: 'Pune',
    state: 'Maharashtra',
    pinCode: '411001',
    businessType: 'Individual',
    taxId: 'ABCDE1234F',
    website: 'www.greengarden.com',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1200',
    idProof: null as string | null
  });

  const [districts, setDistricts] = useState<string[]>(
    statesAndDistricts[formData.state] || []
  );

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFormData({ ...formData, idProof: event.target?.result as string });
        };
        reader.readAsDataURL(file);
      } else {
        setFormData({ ...formData, idProof: file.name });
      }
    }
  };

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
                
                {/* Section: Identity & Contact */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                    <User className="w-6 h-6 text-emerald-600" />
                    <h3 className="text-xl font-display font-bold text-slate-900 uppercase tracking-tight">Identity & Contact</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</label>
                      <input 
                        type="text" 
                        value={formData.firstName}
                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
                      <input 
                        type="text" 
                        value={formData.lastName}
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input 
                          type="email" 
                          disabled
                          value={formData.email}
                          className="w-full pl-12 pr-6 py-4 bg-slate-100 border-none rounded-2xl cursor-not-allowed font-bold text-slate-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input 
                          type="tel" 
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                          className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Website (Optional)</label>
                      <div className="relative">
                        <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input 
                          type="text" 
                          value={formData.website}
                          onChange={e => setFormData({...formData, website: e.target.value})}
                          className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold"
                          placeholder="www.yournursery.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Store Identity */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                    <Store className="w-6 h-6 text-emerald-600" />
                    <h3 className="text-xl font-display font-bold text-slate-900 uppercase tracking-tight">Storefront Details</h3>
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
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Shop Category</label>
                      <div className="relative">
                        <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <select 
                          value={formData.shopCategory}
                          onChange={e => setFormData({...formData, shopCategory: e.target.value})}
                          className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold appearance-none"
                        >
                          <option>Nursery</option>
                          <option>Seeds & Bulbs</option>
                          <option>Tools & Equipment</option>
                          <option>Pots & Planters</option>
                          <option>Fertilizers</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Botanical Story (Description)</label>
                    <textarea 
                      rows={4}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full px-6 py-5 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-medium text-slate-600 italic leading-relaxed resize-none"
                    />
                  </div>
                </div>

                {/* Section: Business & Legal */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                    <Building2 className="w-6 h-6 text-emerald-600" />
                    <h3 className="text-xl font-display font-bold text-slate-900 uppercase tracking-tight">Business & Legal</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Business Type</label>
                      <select 
                        value={formData.businessType}
                        onChange={e => setFormData({...formData, businessType: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold appearance-none"
                      >
                        <option>Individual</option>
                        <option>Proprietorship</option>
                        <option>Partnership</option>
                        <option>Private Limited</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tax ID / PAN / GST</label>
                      <div className="relative">
                        <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input 
                          type="text" 
                          value={formData.taxId}
                          onChange={e => setFormData({...formData, taxId: e.target.value})}
                          className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Identity Proof (PDF/Image)</label>
                      <div className="relative">
                        <div className={`flex flex-col sm:flex-row items-center gap-4 p-4 rounded-[24px] border-2 border-dashed transition-all group ${
                          formData.idProof ? 'border-emerald-500/50 bg-emerald-50/20' : 'border-slate-200 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/30'
                        }`}>
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm flex-shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform">
                            {formData.idProof && formData.idProof.startsWith('data:image') ? (
                              <img src={formData.idProof} alt="ID Proof Preview" className="w-full h-full object-cover" />
                            ) : (
                              <FileCheck className="w-6 h-6" />
                            )}
                          </div>
                          
                          <div className="flex-1 text-center sm:text-left">
                            <p className="text-sm font-bold text-slate-900">
                              {formData.idProof ? (formData.idProof.startsWith('data:image') ? 'Image Uploaded successfully' : formData.idProof) : 'Upload Document'}
                            </p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                              Max size 5MB. JPG, PNG, PDF.
                            </p>
                          </div>

                          <div className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-[10px] uppercase tracking-widest text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:border-emerald-200 transition-colors pointer-events-none">
                            {formData.idProof ? 'Replace File' : 'Browse Files'}
                          </div>
                        </div>
                        
                        <input 
                          type="file" 
                          accept="image/*,application/pdf" 
                          onChange={handleIdProofChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Warehouse Address */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                    <h3 className="text-xl font-display font-bold text-slate-900 uppercase tracking-tight">Warehouse Address</h3>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Street Address</label>
                    <input 
                      type="text" 
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">State</label>
                      <select 
                        value={formData.state}
                        onChange={e => {
                          const newState = e.target.value;
                          setFormData({...formData, state: newState, district: ''});
                          setDistricts(statesAndDistricts[newState] || []);
                        }}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold appearance-none"
                      >
                        <option value="">Select State</option>
                        {Object.keys(statesAndDistricts).map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">District</label>
                      <select 
                        disabled={!formData.state}
                        value={formData.district}
                        onChange={e => setFormData({...formData, district: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold appearance-none disabled:opacity-50"
                      >
                        <option value="">Select District</option>
                        {districts.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pin Code</label>
                      <input 
                        type="text" 
                        value={formData.pinCode}
                        onChange={e => setFormData({...formData, pinCode: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold"
                      />
                    </div>
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