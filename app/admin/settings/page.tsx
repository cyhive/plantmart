'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings as SettingsIcon, 
  Save, 
  ShieldCheck, 
  Globe, 
  Bell, 
  CreditCard, 
  AlertTriangle,
  Mail,
  RefreshCw,
  Eye,
  Lock,
  ChevronRight
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('General');
  const [settings, setSettings] = useState({
    siteName: 'Pacha Bhoomi',
    platformFeePercent: 5,
    maintenanceMode: false,
    contactEmail: 'support@pachabhoomi.com',
    currency: 'INR',
    enable2FA: false,
    emailNotifications: true,
    browserNotifications: true,
    sessionTimeout: 60
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchSettings = () => {
    // Mock Settings Data
    const mockData = {
      siteName: 'Pacha Bhoomi',
      platformFeePercent: 5,
      maintenanceMode: false,
      contactEmail: 'support@pachabhoomi.com',
      currency: 'INR',
      enable2FA: false,
      emailNotifications: true,
      browserNotifications: true,
      sessionTimeout: 60
    };
    setSettings(mockData);
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    // Mock Save Logic
    setTimeout(() => {
      setMessage('Settings updated successfully (Mock)!');
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }, 1200);
  };

  const tabs = [
    { label: 'General', icon: <Globe className="w-4 h-4" /> },
    { label: 'Security', icon: <Lock className="w-4 h-4" /> },
    { label: 'Economics', icon: <CreditCard className="w-4 h-4" /> },
    { label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Platform Configuration</h1>
          <p className="text-slate-500 font-medium italic">Adjust global parameters and system behavior.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 space-y-4">
           {tabs.map((item) => (
             <button
               key={item.label}
               onClick={() => setActiveTab(item.label)}
               className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item.label ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' : 'text-slate-400 hover:bg-white hover:text-slate-600'}`}
             >
               <div className="flex items-center gap-3">
                 {item.icon} {item.label}
               </div>
               <ChevronRight className={`w-4 h-4 ${activeTab === item.label ? 'opacity-100' : 'opacity-0'}`} />
             </button>
           ))}
        </aside>

        {/* Main Settings Form */}
        <div className="lg:col-span-3 space-y-10">
          <form onSubmit={handleSave} className="space-y-10">
            <AnimatePresence mode="wait">
              {activeTab === 'General' && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <section className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
                    <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-3">
                        <SettingsIcon className="w-5 h-5 text-emerald-600" /> General Settings
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Platform Name</label>
                        <input 
                          type="text" 
                          value={settings.siteName}
                          onChange={e => setSettings({...settings, siteName: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Support Email</label>
                        <div className="relative">
                          <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="email" 
                            value={settings.contactEmail}
                            onChange={e => setSettings({...settings, contactEmail: e.target.value})}
                            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
                    <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" /> System Integrity
                    </h3>
                    
                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900">Maintenance Mode</p>
                        <p className="text-xs text-slate-500 font-medium">Temporarily disable front-end access for users.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={settings.maintenanceMode}
                            onChange={e => setSettings({...settings, maintenanceMode: e.target.checked})}
                            className="sr-only peer" 
                          />
                          <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    {settings.maintenanceMode && (
                      <div className="flex items-center gap-4 p-4 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-xs font-bold">WARNING: Buyers will see a maintenance page until this is disabled.</p>
                      </div>
                    )}
                  </section>
                </motion.div>
              )}

              {activeTab === 'Security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <section className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
                    <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-3">
                        <Lock className="w-5 h-5 text-emerald-600" /> Access Security
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px]">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-900">Two-Factor Authentication</p>
                          <p className="text-xs text-slate-500 font-medium">Require a code for admin logins.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={settings.enable2FA}
                              onChange={e => setSettings({...settings, enable2FA: e.target.checked})}
                              className="sr-only peer" 
                            />
                            <div className="w-14 h-8 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all"></div>
                        </label>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Session Timeout (Minutes)</label>
                        <input 
                          type="number" 
                          value={settings.sessionTimeout}
                          onChange={e => setSettings({...settings, sessionTimeout: Number(e.target.value)})}
                          className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold outline-none"
                        />
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}

              {activeTab === 'Economics' && (
                <motion.div
                  key="economics"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <section className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
                    <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-emerald-600" /> Economics
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Platform Commission (%)</label>
                        <input 
                          type="number" 
                          value={settings.platformFeePercent}
                          onChange={e => setSettings({...settings, platformFeePercent: Number(e.target.value)})}
                          className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Default Currency</label>
                        <select 
                          value={settings.currency}
                          onChange={e => setSettings({...settings, currency: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold outline-none"
                        >
                          <option value="INR">Indian Rupee (₹)</option>
                          <option value="USD">US Dollar ($)</option>
                          <option value="EUR">Euro (€)</option>
                        </select>
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}

              {activeTab === 'Notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <section className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
                    <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-3">
                        <Bell className="w-5 h-5 text-emerald-600" /> Notifications
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px]">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-900">Email Alerts</p>
                          <p className="text-xs text-slate-500 font-medium">Send email for new seller registrations.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={settings.emailNotifications}
                              onChange={e => setSettings({...settings, emailNotifications: e.target.checked})}
                              className="sr-only peer" 
                            />
                            <div className="w-14 h-8 bg-slate-200 rounded-full peer peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px]">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-900">Browser Notifications</p>
                          <p className="text-xs text-slate-500 font-medium">Show real-time alerts in the browser.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={settings.browserNotifications}
                              onChange={e => setSettings({...settings, browserNotifications: e.target.checked})}
                              className="sr-only peer" 
                            />
                            <div className="w-14 h-8 bg-slate-200 rounded-full peer peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sticky Actions */}
            <div className="flex items-center justify-between gap-6 pt-6">
               <div className="flex items-center gap-4 text-emerald-600">
                  <AnimatePresence>
                    {message && (
                      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm font-bold italic">
                         {message}
                      </motion.p>
                    )}
                  </AnimatePresence>
               </div>
               <button 
                 type="submit" 
                 disabled={saving}
                 className="bg-emerald-600 text-white px-10 py-5 rounded-[24px] font-bold flex items-center gap-3 hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
               >
                 {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                 {saving ? 'Synchronizing...' : 'Save Configuration'}
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
