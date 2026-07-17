'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Settings, 
  Shield, 
  Bell, 
  Lock, 
  Eye, 
  Trash2, 
  ChevronRight,
  Monitor,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<'security' | 'notifications' | 'privacy'>('security');
  const [successMessage, setSuccessMessage] = useState('');

  if (!user) return null;

  const handleUpdate = (section: string) => {
    setSuccessMessage(`${section} updated successfully!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const menuItems = [
    { id: 'security', label: 'Security & Login', icon: <Shield className="w-4 h-4" />, desc: 'Password, 2FA, Devices' },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" />, desc: 'Email, SMS, Browser' },
    { id: 'privacy', label: 'Privacy & Data', icon: <Eye className="w-4 h-4" />, desc: 'Visibility, Data Export' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2 mb-12">
        <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-slate-500 font-medium italic">Configure your security and communication preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-80 space-y-4">
          <div className="glass p-6 rounded-[40px] border border-white shadow-sm space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`w-full text-left p-4 rounded-3xl transition-all flex items-center gap-4 group ${
                  activeSection === item.id 
                  ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                  activeSection === item.id ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-600'
                }`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-bold">{item.label}</p>
                  <p className={`text-[10px] font-medium opacity-60 ${activeSection === item.id ? 'text-white' : 'text-slate-400'}`}>
                    {item.desc}
                  </p>
                </div>
                <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${activeSection === item.id ? 'rotate-90' : ''}`} />
              </button>
            ))}
          </div>

          <div className="bg-red-50 p-8 rounded-[40px] border border-red-100 space-y-4">
             <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
                <Trash2 className="w-5 h-5" />
             </div>
             <div className="space-y-1">
                <p className="text-sm font-black text-red-900 uppercase tracking-tight">Danger Zone</p>
                <p className="text-xs text-red-600/70 font-medium leading-relaxed">Permanently deactivate your account and erase all botanical data.</p>
             </div>
             <button className="w-full py-3 text-red-600 text-xs font-black uppercase tracking-widest hover:underline">Delete Account</button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-grow">
          <AnimatePresence mode="wait">
            {activeSection === 'security' && (
              <motion.div 
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-10">
                   <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                         <Lock className="w-6 h-6 text-emerald-600" /> Password Management
                      </h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last changed: 3 months ago</span>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Current Password</label>
                         <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 outline-none" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">New Password</label>
                         <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 outline-none" />
                      </div>
                   </div>

                   <button 
                     onClick={() => handleUpdate('Password')}
                     className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95"
                   >
                     Update Password
                   </button>
                </div>

                {/* 2FA Section */}
                <div className="bg-emerald-50 p-10 rounded-[48px] border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-emerald-600 shadow-sm">
                         <Smartphone className="w-8 h-8" />
                      </div>
                      <div className="space-y-1 text-center md:text-left">
                         <h4 className="text-xl font-bold text-emerald-900">Two-Factor Authentication</h4>
                         <p className="text-emerald-700/60 text-sm font-medium">Add an extra layer of security to your account.</p>
                      </div>
                   </div>
                   <button className="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
                      Enable 2FA
                   </button>
                </div>

                {/* Active Sessions */}
                <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
                   <h3 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                      <Monitor className="w-6 h-6 text-emerald-600" /> Active Sessions
                   </h3>
                   <div className="space-y-4">
                      {[
                        { device: 'MacBook Pro 16"', location: 'Mumbai, India', status: 'Current Session', icon: <Monitor className="w-5 h-5" /> },
                        { device: 'iPhone 15 Pro', location: 'Delhi, India', status: '2 hours ago', icon: <Smartphone className="w-5 h-5" /> }
                      ].map((session, i) => (
                        <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors shadow-sm">
                                 {session.icon}
                              </div>
                              <div>
                                 <p className="font-bold text-slate-900">{session.device}</p>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{session.location}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className={`text-[10px] font-black uppercase tracking-widest ${session.status === 'Current Session' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                 {session.status}
                              </p>
                              {session.status !== 'Current Session' && (
                                <button className="text-[10px] font-black text-red-500 uppercase hover:underline mt-1">Revoke</button>
                              )}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'notifications' && (
              <motion.div 
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-10"
              >
                <div className="space-y-2">
                   <h3 className="text-2xl font-display font-bold text-slate-900">Communication Preferences</h3>
                   <p className="text-slate-400 font-medium italic">Control how we interact with you across different channels.</p>
                </div>

                <div className="space-y-4">
                   {[
                     { title: 'New Arrival Alerts', desc: 'Get notified when rare specimens matching your wishlist are back in stock.', type: 'Email' },
                     { title: 'Order Updates', desc: 'Real-time tracking and delivery updates for your purchases.', type: 'Push & SMS' },
                     { title: 'Marketplace Offers', desc: 'Exclusive discounts and seasonal sale announcements.', type: 'Email' },
                     { title: 'Nursery Messages', desc: 'Direct communications from verified nursery owners.', type: 'Push' }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-8 rounded-[32px] bg-slate-50 border border-slate-100 group hover:border-emerald-200 transition-all">
                        <div className="space-y-1 max-w-md">
                           <p className="font-bold text-slate-900">{item.title}</p>
                           <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                           <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase tracking-widest rounded-md mt-2">{item.type}</span>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" defaultChecked className="sr-only peer" />
                           <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600 shadow-inner"></div>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="pt-6">
                   <button 
                     onClick={() => handleUpdate('Notifications')}
                     className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95"
                   >
                     Save Preferences
                   </button>
                </div>
              </motion.div>
            )}

            {activeSection === 'privacy' && (
              <motion.div 
                key="privacy"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-10">
                   <div className="space-y-2">
                      <h3 className="text-2xl font-display font-bold text-slate-900">Data & Privacy Control</h3>
                      <p className="text-slate-400 font-medium italic">We value your privacy. Manage how your data is handled on the platform.</p>
                   </div>

                   <div className="space-y-6">
                      <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 space-y-4">
                         <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-900">Data Portability</h4>
                            <History className="w-5 h-5 text-slate-400" />
                         </div>
                         <p className="text-xs text-slate-500 leading-relaxed font-medium">Download a complete archive of your account data, including order history, profile details, and wishlist specimens.</p>
                         <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline flex items-center gap-2">
                            Request Data Export <ChevronRight className="w-3 h-3" />
                         </button>
                      </div>

                      <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 space-y-4">
                         <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-900">Search Visibility</h4>
                            <div className="relative inline-flex items-center cursor-pointer">
                               <input type="checkbox" defaultChecked className="sr-only peer" />
                               <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 shadow-inner"></div>
                            </div>
                         </div>
                         <p className="text-xs text-slate-500 leading-relaxed font-medium">Allow your profile and wishlist to be indexed by search engines to help other gardeners find your curation.</p>
                      </div>
                   </div>
                </div>

                <div className="bg-amber-50 p-10 rounded-[48px] border border-amber-100 space-y-6">
                   <div className="flex items-center gap-4 text-amber-900">
                      <AlertTriangle className="w-6 h-6" />
                      <h4 className="text-xl font-bold">Privacy Consent</h4>
                   </div>
                   <p className="text-amber-800/70 text-sm font-medium leading-relaxed">By using Pacha Bhoomi, you agree to our <Link href="/privacy" className="font-black underline">Privacy Policy</Link> and how we use cookies to personalize your experience.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Success Message Toast */}
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-12 right-12 bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/10 z-50 backdrop-blur-xl"
          >
            <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
               <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm">{successMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
