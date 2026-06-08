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
  Package,
  Plus,
  Star,
  Leaf,
  ArrowRight,
  Tag,
  Gift,
  Sparkles,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

const offerStyles = [
  { color: 'emerald', icon: <Tag className="w-10 h-10" />, badge: 'Limited Time' },
  { color: 'blue', icon: <Gift className="w-10 h-10" />, badge: 'Special' },
  { color: 'amber', icon: <Sparkles className="w-10 h-10" />, badge: 'Top Deal' }
];

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'wishlist'>('info');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      fetch('/api/addresses')
        .then(res => res.json())
        .then(data => {
          if (data.addresses) setAddresses(data.addresses);
        })
        .catch(console.error);

      fetch('/api/favorites')
        .then(res => res.json())
        .then(data => {
          if (data.favorites) setFavorites(data.favorites);
        })
        .catch(console.error);

      fetch('/api/offers')
        .then(res => res.json())
        .then(data => {
          if (data.promotions) setPromotions(data.promotions.slice(0, 3));
        })
        .catch(console.error);

      fetch('/api/profile/orders')
        .then(res => res.json())
        .then(data => {
          if (data.orders) setOrders(data.orders);
        })
        .catch(console.error);
    }
  }, [user]);

  const handleSetDefaultAddress = async (id: string) => {
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true })
      });
      if (res.ok) {
        setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: addr.id === id })));
      }
    } catch (err) {
      console.error(err);
    }
  };



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

  const handleSave = async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        })
      });
      
      if (!res.ok) throw new Error('Failed to update profile');
      const data = await res.json();
      
      if (data.user) {
        login(data.user);
      }
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      // On failure, we could show a toast here, but simply reverting edit mode or keeping it open works.
    }
  };


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
                    <p className="text-xl font-display font-black text-slate-900">{orders.length}</p>
                 </div>
                 <div className="bg-slate-50 px-6 py-2 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wishlist</p>
                    <p className="text-xl font-display font-black text-slate-900">{favorites.length}</p>
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

                   <div className="space-y-6 relative z-10 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-display font-bold text-slate-900">Saved Addresses</h3>
                        <Link
                          href="/address"
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add New Address
                        </Link>
                      </div>

                      {addresses.length === 0 ? (
                        <p className="text-slate-500 italic text-sm">No saved addresses found.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {addresses.map((addr) => (
                            <div key={addr.id} className={`p-5 rounded-2xl border ${addr.isDefault ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 bg-slate-50'} flex flex-col justify-between space-y-4`}>
                              <div className="space-y-1 text-sm font-medium text-slate-700">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-100 px-2 py-1 rounded-md">{addr.type || 'Home'}</span>
                                  {addr.isDefault && (
                                    <span className="text-[10px] font-black text-white bg-emerald-500 uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1"><MapPin className="w-3 h-3"/> Default</span>
                                  )}
                                </div>
                                <p className="font-bold text-slate-900 line-clamp-1">{addr.street}</p>
                                <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                                <p className="text-slate-500 text-xs mt-1">{addr.country}</p>
                              </div>
                              {!addr.isDefault && (
                                <button
                                  type="button"
                                  onClick={() => handleSetDefaultAddress(addr.id)}
                                  className="w-full py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 hover:text-emerald-700 transition-colors"
                                >
                                  Set as Default
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
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
              {orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-[40px] border border-slate-100 shadow-sm">
                  <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">You haven't placed any orders yet.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col group overflow-hidden">
                    <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner group-hover:rotate-6 transition-transform shrink-0">
                             <Package className="w-8 h-8" />
                          </div>
                          <div className="space-y-1 text-center md:text-left">
                             <h3 className="text-xl font-display font-black text-slate-900 tracking-tight line-clamp-1">
                               {order.items?.[0]?.productName || 'Plant Order'}
                               {(order.items?.length || 0) > 1 && <span className="text-sm text-slate-400 font-bold ml-2 tracking-normal">+ {(order.items?.length || 0) - 1} more</span>}
                             </h3>
                             <div className="flex flex-col md:flex-row items-center md:justify-start gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Order ID: #{order._id}</span>
                                <span className="hidden md:block w-1 h-1 bg-slate-200 rounded-full" />
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                <span className="hidden md:block w-1 h-1 bg-slate-200 rounded-full" />
                                <span>{order.items?.length || 0} Items</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex-grow flex items-center justify-center md:justify-start gap-2 overflow-x-auto px-4 py-2 scrollbar-none">
                         {order.items?.slice(0, 4).map((item: any) => (
                           <div key={item.productId} className="flex-shrink-0 w-12 h-12 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 relative group/item">
                             <img src={item.productImage || ''} alt={item.productName} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-bold text-white">
                               x{item.quantity}
                             </div>
                           </div>
                         ))}
                         {(order.items?.length || 0) > 4 && (
                           <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200">
                             +{(order.items?.length || 0) - 4}
                           </div>
                         )}
                       </div>
                       
                       <div className="flex flex-col md:flex-row items-center gap-8 shrink-0">
                          <div className="text-center md:text-right flex flex-col items-center md:items-end gap-2">
                             <p className="text-2xl font-display font-black text-emerald-900 leading-none">₹{order.totalAmount}</p>
                             <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border italic ${
                               order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                               order.status === 'processing' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                               order.status === 'pending' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                               order.status === 'awaiting_approval' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                               order.status === 'shipped' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                               order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                               'bg-slate-50 text-slate-700 border-slate-100'
                             }`}>
                                {order.status}
                             </span>
                             <div className="flex items-center gap-2 mt-2">
                               <button 
                                 onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                 className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-emerald-600 px-4 py-2 rounded-xl transition-colors border border-slate-100 hover:border-emerald-200 bg-white"
                               >
                                 {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                               </button>
                               <Link 
                                 href={`/track?orderId=${order._id}`} 
                                 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:bg-emerald-600 hover:text-white bg-emerald-50 px-4 py-2 rounded-xl transition-colors border border-emerald-100"
                               >
                                 Track Order
                               </Link>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Expandable Order Details */}
                    <AnimatePresence>
                      {expandedOrder === order._id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-slate-100 bg-slate-50/50"
                        >
                          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                              <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                <Leaf className="w-4 h-4 text-emerald-500" /> Items Ordered
                              </h4>
                              <div className="space-y-4">
                                {order.items?.map((item: any) => (
                                  <div key={item.productId} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                    <img src={item.productImage || ''} alt={item.productName} className="w-16 h-16 rounded-xl object-cover bg-slate-50" />
                                    <div className="flex-grow">
                                      <p className="font-bold text-slate-900">{item.productName}</p>
                                      <p className="text-xs text-slate-500 font-medium">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-black text-emerald-900">₹{item.price * item.quantity}</p>
                                      <p className="text-[10px] text-slate-400 font-bold">₹{item.price} each</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="space-y-8">
                              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Delivery Information</h4>
                                <div className="space-y-1">
                                  <p className="font-bold text-slate-900">{order.shippingAddress?.street}</p>
                                  <p className="text-sm text-slate-600">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-2">
                                    <Phone className="w-3 h-3" /> {order.shippingAddress?.phone || formData.phone}
                                  </p>
                                </div>
                              </div>

                              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Order Summary</h4>
                                <div className="flex justify-between text-sm font-medium text-slate-600">
                                  <span>Subtotal</span>
                                  <span>₹{order.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-slate-600">
                                  <span>Delivery Fee</span>
                                  <span>{order.deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${order.deliveryFee}`}</span>
                                </div>
                                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                                  <span className="font-bold text-slate-900">Total Paid</span>
                                  <span className="text-xl font-display font-black text-emerald-600">₹{order.totalAmount}</span>
                                </div>
                                <div className="mt-2 text-[10px] text-slate-400 uppercase tracking-widest text-right">
                                  via {order.paymentMethod === 'card' ? 'Credit Card' : order.paymentMethod}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              )}
              
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
              className="space-y-6"
            >
              {favorites.length === 0 ? (
                <div className="bg-white p-12 rounded-[48px] border border-slate-100 text-center space-y-6">
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
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((fav) => {
                    const product = fav.product;
                    if (!product) return null;
                    return (
                      <div key={fav.id} className="group relative bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col">
                        <div className="relative aspect-[4/3] overflow-hidden bg-slate-50 m-2 rounded-[24px]">
                          <img 
                            src={product.images?.[0] || '/images/default-plant.png'} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1416879598056-0c8227656910?w=800&auto=format&fit=crop&q=80'; }}
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                          
                          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            {product.category && (
                              <div className="glass px-3 py-1 rounded-full text-[9px] font-black text-emerald-950 uppercase tracking-widest shadow-sm backdrop-blur-md border border-white/50">
                                {product.category}
                              </div>
                            )}
                          </div>

                          <button 
                            onClick={async (e) => {
                              e.preventDefault();
                              await fetch(`/api/favorites/${product._id}`, { method: 'DELETE' });
                              setFavorites(prev => prev.filter(f => f.id !== fav.id));
                            }}
                            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-md border border-slate-100 rounded-full flex items-center justify-center text-rose-500 hover:scale-110 hover:bg-rose-50 transition-all shadow-md z-10 cursor-pointer"
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </button>
                        </div>

                        <div className="p-5 pt-3 flex flex-col flex-grow justify-between gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-display font-black text-lg text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors leading-tight">{product.name}</h4>
                              <span className="flex items-center gap-1 text-[10px] font-black text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                                {product.ratings?.average || '4.8'}
                              </span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                              <Leaf className="w-3 h-3 text-emerald-500" /> {product.seller?.shopName || 'Premium Nursery'}
                            </p>
                          </div>

                          <div className="flex items-end justify-between pt-4 border-t border-slate-100/60">
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Price</p>
                              <p className="text-2xl font-display font-black text-emerald-955 leading-none">
                                <span className="text-xs font-bold mr-0.5">₹</span>{product.price}
                              </p>
                            </div>
                            <Link href={`/plants/${product._id}`} className="bg-slate-900 text-white px-5 h-10 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors cursor-pointer shadow-lg text-[10px] font-black uppercase tracking-widest">
                              View <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exclusive Offers Section */}
        <section className="mt-16 space-y-8 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Exclusive Offers</h2>
              <p className="text-slate-500 text-base font-medium">Just for you. Grab these deals before they vanish!</p>
            </div>
            <Link href="/offers" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
              View All Offers & Discounts <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promotions.length === 0 ? (
              <div className="col-span-3 text-center py-10 text-slate-400">No exclusive offers at the moment.</div>
            ) : (
              promotions.map((promo, i) => {
                const style = offerStyles[i % offerStyles.length];
                return (
                <motion.div
                  key={promo.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 bg-white overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-${style.color}-500/5 rounded-full blur-[60px] -mr-16 -mt-16 group-hover:bg-${style.color}-500/10 transition-colors`} />
                  
                  <div className="relative z-10 space-y-5">
                    <div className="flex items-start justify-between">
                      <div className={`w-14 h-14 bg-${style.color}-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-${style.color}-600/20 group-hover:scale-105 transition-all duration-500`}>
                        {style.icon}
                      </div>
                      <div className={`px-3 py-1 bg-${style.color}-50 rounded-full text-${style.color}-700 text-[9px] font-black uppercase tracking-widest border border-${style.color}-100`}>
                        {style.badge}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-display font-black text-slate-900 leading-tight">
                        {promo.title} <br />
                        <span className={`text-${style.color}-600`}>{promo.discountPercentage}% OFF</span>
                      </h3>
                      <p className="text-slate-500 text-xs font-medium leading-relaxed italic line-clamp-2">{promo.description}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-50">
                      <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white transition-all">
                        <div className="px-3">
                          <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest block">Code</span>
                          <span className="text-base font-display font-black text-slate-900 tracking-wider">{promo.code}</span>
                        </div>
                        <button 
                          onClick={() => handleCopyCode(promo.code)}
                          className={`relative px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                            copiedCode === promo.code 
                              ? 'bg-emerald-500 text-white' 
                              : `bg-slate-900 text-white hover:bg-${style.color}-600`
                          }`}
                        >
                          <AnimatePresence mode="wait">
                            {copiedCode === promo.code ? (
                              <motion.span key="copied" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Copied
                              </motion.span>
                            ) : (
                              <motion.span key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                Copy
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
                )
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
