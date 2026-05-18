'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  ShoppingBag, 
  Heart, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'wishlist'>('info');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || ''
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
            <User className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900">Please sign in to view your profile</h2>
          <Link href="/login" className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // In a real app, this would be an API call
    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: {
        ...user.address,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      }
    };
    login(updatedUser);
    setIsEditing(false);
  };

  const mockOrders = [
    { id: 'ORD-8821', date: '2024-03-01', items: 3, total: 2450, status: 'Delivered' },
    { id: 'ORD-7742', date: '2024-03-12', items: 1, total: 899, status: 'Processing' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Profile Header Card */}
      <div className="relative mb-12">
        <div className="h-48 rounded-[40px] bg-linear-to-r from-emerald-600 to-teal-700 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,#fff_0%,transparent_50%)]" />
          <div className="absolute top-8 right-8 flex gap-3">
             <div className="glass px-6 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md border border-white/20">
               {user.role} Member
             </div>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto px-8 -mt-24 relative z-10">
          <div className="glass bg-white/90 p-8 rounded-[48px] border border-white shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center gap-8">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="w-40 h-40 rounded-[40px] bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center relative">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-slate-300" />
                )}
                {isEditing && (
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center border-4 border-white text-white shadow-lg">
                 <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            {/* Profile Brief */}
            <div className="flex-grow text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight">{user.name}</h1>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="w-fit mx-auto md:mx-0 flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                )}
              </div>
              <p className="text-slate-500 font-medium italic flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4 text-emerald-600" /> {user.email}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                 <div className="bg-slate-50 px-6 py-2 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Orders</p>
                    <p className="text-xl font-display font-black text-slate-900">12</p>
                 </div>
                 <div className="bg-slate-50 px-6 py-2 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wishlist</p>
                    <p className="text-xl font-display font-black text-slate-900">45</p>
                 </div>
                 <div className="bg-slate-50 px-6 py-2 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Points</p>
                    <p className="text-xl font-display font-black text-emerald-600">850</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex bg-slate-50 p-2 rounded-3xl border border-slate-100 w-fit mx-auto">
          {[
            { id: 'info', label: 'Personal Info', icon: <User className="w-4 h-4" /> },
            { id: 'orders', label: 'My Orders', icon: <ShoppingBag className="w-4 h-4" /> },
            { id: 'wishlist', label: 'Favorites', icon: <Heart className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                ? 'bg-white text-emerald-600 shadow-xl border border-slate-100' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'info' && (
            <motion.div 
              key="info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Profile Details Form */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-10 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5">
                      <User className="w-40 h-40 text-slate-900" />
                   </div>
                   
                   <div className="space-y-8 relative z-10">
                      <h3 className="text-2xl font-display font-bold text-slate-900">Account Particulars</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                           <input 
                             type="text" 
                             disabled={!isEditing}
                             value={formData.name}
                             onChange={(e) => setFormData({...formData, name: e.target.value})}
                             className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/5 disabled:opacity-70 transition-all shadow-inner"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
                           <input 
                             type="email" 
                             disabled={!isEditing}
                             value={formData.email}
                             onChange={(e) => setFormData({...formData, email: e.target.value})}
                             className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/5 disabled:opacity-70 transition-all shadow-inner"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Mobile Number</label>
                           <input 
                             type="text" 
                             disabled={!isEditing}
                             value={formData.phone}
                             onChange={(e) => setFormData({...formData, phone: e.target.value})}
                             className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/5 disabled:opacity-70 transition-all shadow-inner"
                           />
                        </div>
                      </div>
                   </div>

                   <div className="space-y-8 relative z-10 pt-4">
                      <h3 className="text-2xl font-display font-bold text-slate-900">Default Delivery Hub</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2 space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Street / Apartment</label>
                           <input 
                             type="text" 
                             disabled={!isEditing}
                             value={formData.street}
                             onChange={(e) => setFormData({...formData, street: e.target.value})}
                             className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/5 disabled:opacity-70 transition-all shadow-inner"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">City</label>
                           <input 
                             type="text" 
                             disabled={!isEditing}
                             value={formData.city}
                             onChange={(e) => setFormData({...formData, city: e.target.value})}
                             className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/5 disabled:opacity-70 transition-all shadow-inner"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Postal Code</label>
                           <input 
                             type="text" 
                             disabled={!isEditing}
                             value={formData.zipCode}
                             onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                             className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/5 disabled:opacity-70 transition-all shadow-inner"
                           />
                        </div>
                      </div>
                   </div>

                   {isEditing && (
                     <div className="flex justify-end gap-4 pt-8">
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                        >
                           Cancel Changes
                        </button>
                        <button 
                          onClick={handleSave}
                          className="bg-emerald-600 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 flex items-center gap-3 transition-all active:scale-95"
                        >
                           <Save className="w-4 h-4" /> Synchronize Profile
                        </button>
                     </div>
                   )}
                </div>
              </div>

              {/* Sidebar Quick Actions */}
              <div className="space-y-8">
                <div className="bg-slate-900 p-10 rounded-[48px] text-white space-y-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full group-hover:bg-emerald-500/20 transition-colors" />
                  <div className="space-y-2 relative z-10">
                     <ShieldCheck className="w-10 h-10 text-emerald-400 mb-4" />
                     <h3 className="text-2xl font-display font-bold">Privacy Center</h3>
                     <p className="text-slate-400 text-sm font-medium leading-relaxed italic">Manage your digital footprint and verification status.</p>
                  </div>
                  <button className="w-full bg-white/10 hover:bg-white hover:text-slate-900 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">Security Dashboard</button>
                </div>

                <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-6">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Botanical Support</h4>
                   <div className="space-y-4">
                      {[
                        { label: 'Track Order', href: '/track' },
                        { label: 'Help Center', href: '/support' },
                        { label: 'Live Chat', href: '#' },
                        { label: 'Platform Terms', href: '/terms' }
                      ].map((item, i) => (
                        <Link key={i} href={item.href} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                           <span className="text-sm font-bold text-slate-700">{item.label}</span>
                           <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                        </Link>
                      ))}
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {mockOrders.map((order) => (
                <div key={order.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-center justify-between gap-8 group">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner group-hover:rotate-6 transition-transform">
                         <Package className="w-8 h-8" />
                      </div>
                      <div className="space-y-1 text-center md:text-left">
                         <p className="text-xl font-display font-black text-slate-900 tracking-tight italic">#{order.id}</p>
                         <div className="flex items-center justify-center md:justify-start gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {order.date}</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span>{order.items} Items</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="text-center md:text-right">
                         <p className="text-2xl font-display font-black text-emerald-900">₹{order.total}</p>
                         <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-100 italic">
                            {order.status}
                         </span>
                      </div>
                      <button className="bg-slate-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10">
                         <ChevronRight className="w-6 h-6" />
                      </button>
                   </div>
                </div>
              ))}
              
              <div className="text-center py-12">
                 <button className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] hover:underline">View Archived Transactions</button>
              </div>
            </motion.div>
          )}

          {activeTab === 'wishlist' && (
            <motion.div 
              key="wishlist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white p-12 rounded-[48px] border border-slate-100 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto text-pink-500">
                 <Heart className="w-10 h-10 fill-current" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-2xl font-display font-bold text-slate-900">Your Botanical Wishlist</h3>
                 <p className="text-slate-400 font-medium max-w-sm mx-auto italic">Start curating your dream garden by liking your favorite specimens in the catalog.</p>
              </div>
              <Link href="/plants" className="inline-block bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl">
                 Explore Catalog
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
