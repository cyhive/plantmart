import type { Metadata } from 'next';
import './globals.css'; // Simplified import
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'PlantMart – Multi-Vendor Plant Marketplace',
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
            <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
              <Navbar/>
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}