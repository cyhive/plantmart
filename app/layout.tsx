import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css'; // Simplified import
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MobileTabBar } from '@/components/MobileTabBar';

export const metadata: Metadata = {
  title: 'Pacha Bhoomi – Multi-Vendor Plant Marketplace',
  description: 'Discover 1000+ varieties of hand-picked plants from verified nurseries across the country.',
  keywords: 'plants, indoor plants, outdoor plants, succulents, nursery, buy plants online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen bg-[#92B031]/20 flex flex-col font-sans">
              <Suspense fallback={<div className="h-20 bg-white border-b border-slate-100" />}>
                <Navbar/>
              </Suspense>
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
              <MobileTabBar />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
