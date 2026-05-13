'use client';

import { useState } from 'react';
import { 
  Bell, 
  ShieldCheck, 
  Users, 
  ShoppingCart, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Trash2,
  Filter,
  Search,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type NotificationType = 'seller_request' | 'product_review' | 'system_alert' | 'user_report';

interface AdminNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const mockAdminNotifications: AdminNotification[] = [
  {
    id: '1',
    type: 'seller_request',
    title: 'New Seller Verification',
    message: 'Green Valley Nursery has applied for a seller account. Documentation is ready for review.',
    time: '10 mins ago',
    isRead: false
  },
  {
    id: '2',
    type: 'product_review',
    title: 'Product Review Required',
    message: '12 new products from "Botanical Bliss" are waiting for approval in the catalog.',
    time: '1 hour ago',
    isRead: false
  },
  {
    id: '3',
    type: 'system_alert',
    title: 'High Server Latency',
    message: 'System detected unusual latency in the image processing service. Investigating.',
    time: '3 hours ago',
    isRead: true
  },
  {
    id: '4',
    type: 'user_report',
    title: 'New Content Report',
    message: 'A user reported a product description for "Inaccurate Information" in listing #4502.',
    time: '5 hours ago',
    isRead: true
  }
];

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>(mockAdminNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(n => filter === 'all' || !n.isRead);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'seller_request': return <Users className="w-5 h-5 text-blue-500" />;
      case 'product_review': return <ShoppingCart className="w-5 h-5 text-orange-500" />;
      case 'system_alert': return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case 'user_report': return <ShieldAlert className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  const getBg = (type: NotificationType) => {
    switch (type) {
      case 'seller_request': return 'bg-blue-50 border-blue-100';
      case 'product_review': return 'bg-orange-50 border-orange-100';
      case 'system_alert': return 'bg-red-50 border-red-100';
      case 'user_report': return 'bg-purple-50 border-purple-100';
      default: return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">System Notifications</h1>
          <p className="text-slate-500 font-medium italic">Manage alerts and administrative tasks requiring attention.</p>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setFilter('all')}
             className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all ${filter === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}
           >
             All Alerts
           </button>
           <button 
             onClick={() => setFilter('unread')}
             className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all relative ${filter === 'unread' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}
           >
             Unread
             {unreadCount > 0 && (
               <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
                 {unreadCount}
               </span>
             )}
           </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((n) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-6 rounded-[32px] border transition-all group relative overflow-hidden ${n.isRead ? 'bg-white border-slate-100' : 'bg-slate-50/50 border-slate-200 shadow-sm'}`}
              >
                {!n.isRead && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                )}
                
                <div className="flex gap-6 items-start">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${getBg(n.type)}`}>
                    {getIcon(n.type)}
                  </div>
                  
                  <div className="flex-grow space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-base font-bold ${n.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                        {n.title}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> {n.time}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed ${n.isRead ? 'text-slate-500' : 'text-slate-600 font-medium'}`}>
                      {n.message}
                    </p>
                    
                    <div className="flex items-center gap-4 pt-3">
                      {!n.isRead && (
                        <button 
                          onClick={() => markAsRead(n.id)}
                          className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Read
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(n.id)}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border border-dashed border-slate-200 rounded-[40px] p-20 flex flex-col items-center text-center space-y-4"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                <Bell className="w-10 h-10 text-slate-200" />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-slate-400">All caught up!</p>
                <p className="text-sm text-slate-400">No new notifications requiring your attention.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
