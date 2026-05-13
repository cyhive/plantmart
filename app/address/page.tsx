'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { 
  MapPin, 
  Navigation, 
  Save, 
  ArrowLeft, 
  Home, 
  Building2, 
  Map as MapIcon, 
  Loader2, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Compass, 
  Briefcase,
  Star,
  ChevronRight,
  X,
  Edit3
} from 'lucide-react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { Breadcrumbs } from '@/components/Breadcrumbs';

// Dynamically import Map component
const AddressMap = dynamic(() => import('@/components/AddressMap'), { ssr: false });

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  street: string;
  building?: string;
  landmark?: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export default function AddressPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'form' | 'map'>('form');

  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    type: 'home',
    street: '',
    building: '',
    landmark: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false,
    coordinates: { lat: 20.5937, lng: 78.9629 }
  });

  useEffect(() => {
    // Mock Data Initialization
    const mockAddresses: Address[] = [
      {
        id: '1',
        type: 'home',
        street: '88 Green Avenue',
        building: 'Emerald Heights, Flat 402',
        landmark: 'Near Botanical Garden',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560001',
        isDefault: true,
        coordinates: { lat: 12.9716, lng: 77.5946 }
      },
      {
        id: '2',
        type: 'work',
        street: 'Tech Park East',
        building: 'Innovation Tower, Floor 12',
        city: 'Pune',
        state: 'Maharashtra',
        zipCode: '411001',
        isDefault: false,
        coordinates: { lat: 18.5204, lng: 73.8567 }
      }
    ];

    setTimeout(() => {
      setAddresses(mockAddresses);
      setLoading(false);
    }, 800);
  }, []);

  const handleSave = () => {
    if (editingId) {
      setAddresses(prev => prev.map(a => a.id === editingId ? { ...formData, id: editingId } : a));
    } else {
      const newAddress: Address = { ...formData, id: Math.random().toString(36).substr(2, 9) };
      if (newAddress.isDefault) {
        setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })).concat(newAddress));
      } else {
        setAddresses(prev => [...prev, newAddress]);
      }
    }
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'home',
      street: '',
      building: '',
      landmark: '',
      city: '',
      state: '',
      zipCode: '',
      isDefault: false,
      coordinates: { lat: 20.5937, lng: 78.9629 }
    });
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const setAsDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight">Delivery Hubs</h1>
          <p className="text-slate-500 font-medium italic">Manage your saved locations for lightning-fast botanical delivery.</p>
        </div>
        {!isAdding && !editingId && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-emerald-600 text-white px-8 py-4 rounded-[24px] font-black text-sm shadow-xl shadow-emerald-600/20 flex items-center gap-3 hover:bg-emerald-700 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> Add New Address
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isAdding || editingId ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[48px] border border-slate-100 shadow-2xl overflow-hidden"
          >
            <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
               <div className="flex items-center gap-4">
                  <button onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm transition-colors">
                     <X className="w-5 h-5" />
                  </button>
                  <h2 className="text-2xl font-display font-bold text-slate-900">{editingId ? 'Refine Hub' : 'Establish New Hub'}</h2>
               </div>
               <div className="flex gap-2 p-1 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  {[
                    { id: 'form', icon: <Navigation className="w-4 h-4" />, label: 'Manual' },
                    { id: 'map', icon: <MapIcon className="w-4 h-4" />, label: 'Map' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
               </div>
            </div>

            <div className="p-10">
              {activeTab === 'form' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2 space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Address Label</label>
                    <div className="flex gap-4">
                       {[
                         { id: 'home', icon: <Home className="w-4 h-4" />, label: 'Home' },
                         { id: 'work', icon: <Briefcase className="w-4 h-4" />, label: 'Work' },
                         { id: 'other', icon: <MapPin className="w-4 h-4" />, label: 'Other' }
                       ].map(type => (
                         <button
                           key={type.id}
                           onClick={() => setFormData({...formData, type: type.id as any})}
                           className={`flex items-center gap-3 px-8 py-3 rounded-2xl text-xs font-bold transition-all border ${formData.type === type.id ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200'}`}
                         >
                           {type.icon} {type.label}
                         </button>
                       ))}
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Street / Road Name</label>
                    <input 
                      type="text" 
                      value={formData.street}
                      onChange={e => setFormData({...formData, street: e.target.value})}
                      placeholder="e.g. 8th Main, Botanical Circle"
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-inner"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Building / Apt Name</label>
                    <input 
                      type="text" 
                      value={formData.building}
                      onChange={e => setFormData({...formData, building: e.target.value})}
                      placeholder="e.g. Flora Residences, Flat 10A"
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-inner"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Landmark (Optional)</label>
                    <input 
                      type="text" 
                      value={formData.landmark}
                      onChange={e => setFormData({...formData, landmark: e.target.value})}
                      placeholder="e.g. Opposite City Park"
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-inner"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:col-span-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">City</label>
                      <input 
                        type="text" 
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-inner"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Postal Code</label>
                      <input 
                        type="text" 
                        value={formData.zipCode}
                        onChange={e => setFormData({...formData, zipCode: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                     <input 
                        type="checkbox" 
                        id="default-check"
                        checked={formData.isDefault}
                        onChange={e => setFormData({...formData, isDefault: e.target.checked})}
                        className="w-5 h-5 rounded-lg border-emerald-200 text-emerald-600 focus:ring-emerald-500"
                     />
                     <label htmlFor="default-check" className="text-sm font-bold text-emerald-800 italic">Set as Primary Delivery Destination</label>
                  </div>
                </div>
              ) : (
                <div className="h-[400px] rounded-3xl overflow-hidden border border-slate-100 shadow-inner">
                   <AddressMap 
                     address={{...formData, id: 'temp'}}
                     setAddress={(addr: any) => setFormData({...formData, coordinates: addr.coordinates})}
                     setActiveTab={setActiveTab}
                     handleGetLiveLocation={() => {}}
                   />
                </div>
              )}

              <div className="mt-12 flex justify-end gap-4">
                 <button 
                   onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}
                   className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                 >
                    Discard Changes
                 </button>
                 <button 
                   onClick={handleSave}
                   className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-900/20 flex items-center gap-3 active:scale-95"
                 >
                    <Save className="w-4 h-4" /> Finalize Address
                 </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {addresses.map((addr) => (
              <motion.div
                key={addr.id}
                layout
                className={`relative bg-white rounded-[48px] border-2 p-8 transition-all group overflow-hidden ${addr.isDefault ? 'border-emerald-500 shadow-xl shadow-emerald-500/5' : 'border-slate-100 hover:border-emerald-200 hover:shadow-lg'}`}
              >
                {/* Decorative Background Icon */}
                <div className="absolute -top-6 -right-6 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                   {addr.type === 'home' ? <Home className="w-32 h-32" /> : addr.type === 'work' ? <Briefcase className="w-32 h-32" /> : <MapPin className="w-32 h-32" />}
                </div>

                <div className="flex flex-col h-full justify-between gap-8 relative z-10">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${addr.isDefault ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {addr.type === 'home' ? <Home className="w-3 h-3" /> : addr.type === 'work' ? <Briefcase className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                        {addr.type} {addr.isDefault && '• Primary'}
                      </div>
                      <div className="flex items-center gap-1">
                         <button 
                           onClick={() => { setEditingId(addr.id); setFormData(addr); }}
                           className="p-3 bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all"
                         >
                            <Edit3 className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => deleteAddress(addr.id)}
                           className="p-3 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                         >
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                       <p className="text-xl font-display font-black text-slate-900 tracking-tight leading-tight italic">{addr.street}</p>
                       {addr.building && <p className="text-sm font-bold text-slate-600 italic leading-tight">{addr.building}</p>}
                       <p className="text-xs font-medium text-slate-400">{addr.city}, {addr.state} • {addr.zipCode}</p>
                    </div>

                    {addr.landmark && (
                      <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50/50 w-fit px-3 py-1 rounded-lg">
                         <Star className="w-3 h-3 fill-emerald-600" /> Landmark: {addr.landmark}
                      </div>
                    )}
                  </div>

                  {!addr.isDefault && (
                    <button 
                      onClick={() => setAsDefault(addr.id)}
                      className="w-full py-4 rounded-2xl bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-emerald-600 hover:text-white transition-all border border-slate-100 border-dashed"
                    >
                      Set as Default
                    </button>
                  )}
                  {addr.isDefault && (
                    <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest py-4 justify-center">
                       <CheckCircle2 className="w-4 h-4" /> Primary Delivery Destination
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Ghost Card for Add New */}
            <button 
              onClick={() => setIsAdding(true)}
              className="group border-4 border-slate-100 border-dashed rounded-[48px] p-12 min-h-[300px] flex flex-col items-center justify-center gap-6 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all text-slate-300 hover:text-emerald-600"
            >
               <div className="w-16 h-16 rounded-3xl bg-slate-50 group-hover:bg-white flex items-center justify-center shadow-inner group-hover:shadow-lg transition-all">
                  <Plus className="w-8 h-8" />
               </div>
               <div className="text-center">
                  <p className="text-lg font-display font-bold">New Delivery Hub</p>
                  <p className="text-xs font-medium italic">Add another location to your account</p>
               </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info Card */}
      <div className="bg-slate-900 p-12 rounded-[60px] text-white relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full group-hover:bg-emerald-500/20 transition-colors" />
         <div className="max-w-2xl space-y-6 relative z-10">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
               <Compass className="w-7 h-7" />
            </div>
            <h3 className="text-3xl font-display font-black tracking-tight">Need help with location?</h3>
            <p className="text-slate-400 text-lg font-medium leading-relaxed italic">Our verified nurseries use precision logistics to ensure your specimens arrive in perfect health. Setting a clear landmark helps our green-couriers find you faster.</p>
            <Link href="/help/delivery" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-white transition-colors group/link">
               Read Delivery Guide <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
            </Link>
         </div>
      </div>
    </div>
  );
}
