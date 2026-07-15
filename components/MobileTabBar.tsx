'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export function MobileTabBar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isSellerPage = pathname?.startsWith('/seller');
  const isAdminPage = pathname?.startsWith('/admin');
  const isBecomeSellerPage = pathname === '/become-a-seller';

  if (isSellerPage || isAdminPage || isBecomeSellerPage) return null;

  const navItems = [
    { label: 'Home', href: '/', icon: <Home className="w-5 h-5" /> },
    { label: 'Explore', href: '/plants', icon: <Search className="w-5 h-5" /> },
    { label: 'Cart', href: '/cart', icon: <ShoppingCart className="w-5 h-5" />, badge: totalItems },
    { 
      label: user ? user.name.split(' ')[0] : 'Profile', 
      href: user ? '/profile' : '/login', 
      icon: user?.avatar ? (
        <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
      ) : (
        <User className="w-5 h-5" />
      )
    },
  ];

  return (
    <>
      <div className="h-20 md:hidden"></div> {/* Spacer for fixed bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 z-50 px-6 py-2 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-[calc(env(safe-area-inset-bottom,0)+0.5rem)]">
        <div className="flex items-center justify-between">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <Link 
                key={item.label} 
                href={item.href}
                className={`relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  isActive ? 'text-emerald-600 scale-110' : 'text-slate-400 hover:text-emerald-500'
                }`}
              >
                <div className="relative">
                  {item.icon}
                  {mounted && item.badge && item.badge > 0 ? (
                    <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  ) : null}
                </div>
                <span className={`text-[9px] ${isActive ? 'font-black' : 'font-bold'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="mobileTabActive" 
                    className="absolute -top-2 w-8 h-1 bg-emerald-600 rounded-b-full"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
