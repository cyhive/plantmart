'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  ShieldCheck, 
  LogOut, 
  Leaf,
  X,
  Settings,
  Bell,
  Tag
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    { id: 'overview', href: '/admin', icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics' },
    { id: 'sellers', href: '/admin/sellers', icon: <Users className="w-5 h-5" />, label: 'Sellers' },
    { id: 'products', href: '/admin/products', icon: <ShoppingCart className="w-5 h-5" />, label: 'Products' },
    { id: 'promotions', href: '/admin/promotions', icon: <Tag className="w-5 h-5" />, label: 'Promotions' },
    { id: 'notifications', href: '/admin/notifications', icon: <Bell className="w-5 h-5" />, label: 'Notifications' },
    { id: 'settings', href: '/admin/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
  ];

  return (
    <motion.aside 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:block ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-8 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl text-white leading-none">PlantMart</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mt-1">Admin Console</span>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-grow px-6 space-y-1 mt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 ml-4">Management</p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.label}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all group ${isActive ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <div className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400'}`}>
                  {item.icon}
                </div>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-800/50 rounded-3xl p-6 space-y-4 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-white/10">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Buyer View</span>
                <span className="text-[10px] text-slate-400 font-medium italic tracking-tight">Return to Store</span>
              </div>
            </div>
            <Link 
              href="/"
              className="w-full bg-slate-800 text-white border border-white/10 py-3 rounded-xl font-bold text-xs hover:bg-emerald-600 hover:border-emerald-600 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              Exit Admin
            </Link>
          </div>

          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-2xl font-bold text-sm transition-all"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
