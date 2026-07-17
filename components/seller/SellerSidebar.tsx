'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  PieChart, 
  Package, 
  ShoppingBag, 
  Settings, 
  Store, 
  LogOut, 
  Leaf,
  X,
  Bell,
  Tag,
  ShieldCheck,
  IndianRupee,
  Star
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';

interface SellerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SellerSidebar({ isOpen, onClose }: SellerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/seller/login');
  };

  const menuItems = [
    { href: '/seller', icon: <PieChart className="w-5 h-5" />, label: 'Overview' },
    { href: '/seller/products', icon: <Package className="w-5 h-5" />, label: 'Inventory' },
    { href: '/seller/orders', icon: <ShoppingBag className="w-5 h-5" />, label: 'Sales' },
    { href: '/seller/reviews', icon: <Star className="w-5 h-5" />, label: 'Reviews' },
    { href: '/seller/promotions', icon: <Tag className="w-5 h-5" />, label: 'Promotions' },
    { href: '/seller/payouts', icon: <IndianRupee className="w-5 h-5" />, label: 'Payouts' },
    { href: '/seller/notifications', icon: <Bell className="w-5 h-5" />, label: 'Notifications' },
    { href: '/seller/kyc', icon: <ShieldCheck className="w-5 h-5" />, label: 'KYC Verification' },
    { href: '/seller/settings', icon: <Settings className="w-5 h-5" />, label: 'Shop Settings' },
  ];

  return (
    <motion.aside 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:block ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-8 flex items-center justify-between">
          <Link href="/seller" className="flex items-center gap-3">
            <img src="/logo.png" alt="Pacha Bhoomi" className="h-16 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mt-1">Seller Hub</span>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-grow px-6 space-y-1 mt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-4">Main Menu</p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.label}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all group ${isActive ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'}`}
              >
                <div className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'}`}>
                  {item.icon}
                </div>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 rounded-3xl p-6 space-y-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                <Store className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">Buyer Mode</span>
                <span className="text-[10px] text-slate-400 font-medium italic tracking-tight">Browse marketplace</span>
              </div>
            </div>
            <Link 
              href="/"
              className="w-full bg-white text-slate-600 border border-slate-200 py-3 rounded-xl font-bold text-xs hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              Go to Store
            </Link>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl font-bold text-sm transition-all"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
