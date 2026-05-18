'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { 
  PieChart, 
  Package, 
  ShoppingBag, 
  Settings, 
  Store, 
  LogOut, 
  Bell, 
  Search,
  Menu,
  X,
  Leaf
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { SellerNavbar } from '@/components/seller/SellerNavbar';
import { SellerSidebar } from '@/components/seller/SellerSidebar';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname === '/seller/login';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      <SellerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        <SellerNavbar />

        {/* Page Content */}
        <main className="flex-grow overflow-y-auto bg-[#F8FAFC] custom-scrollbar p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
