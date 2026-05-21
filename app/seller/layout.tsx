'use client';

import { usePathname } from 'next/navigation';
import { useRequireRole } from '@/lib/auth/use-auth-guard';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { SellerNavbar } from '@/components/seller/SellerNavbar';
import { SellerSidebar } from '@/components/seller/SellerSidebar';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname === '/seller/login';
  const { loading, authorized } = useRequireRole('seller', '/seller/login');

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
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
