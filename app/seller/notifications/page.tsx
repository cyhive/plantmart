'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  ShoppingBag, 
  AlertTriangle, 
  Star, 
  Info,
  CheckCircle2,
  Trash2
} from 'lucide-react';

// --- Types ---
type NotificationType = 'order' | 'inventory' | 'review' | 'system';

interface NotificationProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const mockNotifications: NotificationProps[] = [
  {
    id: 'n1',
    type: 'order',
    title: 'New Order Received!',
    message: 'Rahul Sharma just placed an order for Monstera Deliciosa (Order #778899).',
    time: '2 hours ago',
    isRead: false,
  },
  {
    id: 'n2',
    type: 'inventory',
    title: 'Low Stock Alert',
    message: 'Your inventory for "Snake Plant (Sansevieria)" is dropping low (Only 3 left).',
    time: '5 hours ago',
    isRead: false,
  },
  {
    id: 'n3',
    type: 'review',
    title: 'New 5-Star Review',
    message: 'Anjali Desai left a 5-star review on your "Peace Lily".',
    time: '1 day ago',
    isRead: true,
  },
  {
    id: 'n4',
    type: 'system',
    title: 'System Update',
    message: 'PlantMart seller dashboard will be undergoing scheduled maintenance on Sunday.',
    time: '2 days ago',
    isRead: true,
  }
];

// --- Helper Functions ---
const getIconForType = (type: NotificationType) => {
  switch (type) {
    case 'order': return <ShoppingBag className="w-5 h-5 text-emerald-600" />;
    case 'inventory': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    case 'review': return <Star className="w-5 h-5 text-blue-500" />;
    case 'system': return <Info className="w-5 h-5 text-purple-500" />;
  }
};

const getBgForType = (type: NotificationType) => {
  switch (type) {
    case 'order': return 'bg-emerald-50 border-emerald-100';
    case 'inventory': return 'bg-amber-50 border-amber-100';
    case 'review': return 'bg-blue-50 border-blue-100';
    case 'system': return 'bg-purple-50 border-purple-100';
  }
};

// --- Component: Empty State ---
const EmptyNotifications = () => (
  <div className="bg-white p-24 md:p-32 rounded-[48px] text-center space-y-4 border border-slate-100 shadow-sm max-w-4xl mx-auto">
    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
      <Bell className="w-12 h-12 text-slate-300" />
    </div>
    <div className="space-y-2">
      <p className="text-slate-400 text-lg font-medium italic">
        You're all caught up!
      </p>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
        No New Notifications
      </p>
    </div>
  </div>
);

// --- Component: Notification Item ---
const NotificationItem = ({ 
  notification, 
  onMarkRead, 
  onDelete 
}: { 
  notification: NotificationProps, 
  onMarkRead: (id: string) => void,
  onDelete: (id: string) => void
}) => {
  return (
    <div className={`p-6 rounded-[24px] border transition-all group relative overflow-hidden ${notification.isRead ? 'bg-white border-slate-100' : 'bg-slate-50/50 border-slate-200'}`}>
      
      {/* Unread Indicator */}
      {!notification.isRead && (
        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 rounded-l-full"></div>
      )}

      <div className="flex items-start gap-5">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${getBgForType(notification.type)}`}>
          {getIconForType(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-grow space-y-1">
          <div className="flex justify-between items-start">
            <h3 className={`text-base font-bold ${notification.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
              {notification.title}
            </h3>
            <span className="text-xs font-medium text-slate-400 whitespace-nowrap ml-4">
              {notification.time}
            </span>
          </div>
          <p className={`text-sm leading-relaxed ${notification.isRead ? 'text-slate-500' : 'text-slate-600 font-medium'}`}>
            {notification.message}
          </p>
        </div>

        {/* Actions (visible on hover) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 flex-shrink-0">
          {!notification.isRead && (
            <button 
              onClick={() => onMarkRead(notification.id)}
              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
              title="Mark as read"
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={() => onDelete(notification.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            title="Delete notification"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Wrapper ---
export default function SellerNotificationsLayout() {
  const [notifications, setNotifications] = useState<NotificationProps[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(n => filter === 'all' || !n.isRead);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              Notifications
              {unreadCount > 0 && (
                <span className="bg-emerald-500 text-white text-sm font-bold px-3 py-1 rounded-full align-middle">
                  {unreadCount} New
                </span>
              )}
            </h1>
            <p className="text-slate-500 font-medium italic">Stay updated with your nursery operations.</p>
          </div>

          <div className="flex items-center gap-4">
             {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Mark all as read
              </button>
             )}
          </div>
        </header>

        {/* Filters */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
              filter === 'all' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            All Notifications
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
              filter === 'unread' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className={`w-2 h-2 rounded-full ${filter === 'unread' ? 'bg-emerald-400' : 'bg-emerald-500'}`}></span>
            )}
          </button>
        </div>

        {/* Notification List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map(notification => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onMarkRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <EmptyNotifications />
        )}

      </div>
    </div>
  );
}
