'use client';

import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { 
  Search, ShoppingCart, User, LogOut, LayoutDashboard, Leaf, 
  MapPin, ChevronRight, ShieldCheck, Home, Trees, Sprout, 
  HeartPulse, Box, Store, X, Sparkles 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showBanner, setShowBanner] = useState(true);
  
  const isSellerPage = pathname?.startsWith('/seller');
  const isAdminPage = pathname?.startsWith('/admin');
  const isBecomeSellerPage = pathname === '/become-a-seller';
  
  if (isSellerPage || isAdminPage || isBecomeSellerPage) return null;
  
  const currentCategory = searchParams.get('category') || '';

  const categories = [
    { name: 'All Plants', slug: '', icon: <Leaf className="w-3.5 h-3.5" /> },
    { name: 'Indoor Plants', slug: 'Indoor', icon: <Home className="w-3.5 h-3.5" /> },
    { name: 'Outdoor Plants', slug: 'Outdoor', icon: <Trees className="w-3.5 h-3.5" /> },
    { name: 'Succulents', slug: 'Succulents', icon: <Sprout className="w-3.5 h-3.5" /> },
    { name: 'Medicinal', slug: 'Medicinal', icon: <HeartPulse className="w-3.5 h-3.5" /> },
    { name: 'Pots & Tools', slug: 'Pots', icon: <Box className="w-3.5 h-3.5" /> },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/plants?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <>
      {/* Top Offer Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-emerald-900 text-emerald-50 overflow-hidden relative"
          >
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center min-h-[40px]">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse hidden sm:block" />
                <p className="text-center">
                  <span className="opacity-90">Limited Time Offer:</span> 
                  <span className="font-bold text-white mx-1">GET 20% OFF</span> 
                  <span className="opacity-90">on all Medicinal Plants!</span>
                  <Link href="/plants?category=Medicinal" className="ml-2 underline underline-offset-4 hover:text-white transition-colors font-bold">
                    Shop Collection
                  </Link>
                </p>
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse hidden sm:block" />
              </div>
              
              <button 
                onClick={() => setShowBanner(false)}
                className="absolute right-4 p-1 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close banner"
              >
                <X className="w-4 h-4 text-emerald-200" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="glass sticky top-0 z-50 transition-all duration-300 border-b border-slate-100">
        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 gap-4">
            {/* Logo & Address Area */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-emerald-500/20">
                  <Leaf className="text-white w-6 h-6" />
                </div>
                <span className="font-display font-bold text-2xl text-emerald-900 hidden sm:block tracking-tight">PlantMart</span>
              </Link>

              {/* Address Selector */}
              {user && (
                <Link 
                  href="/address" 
                  className="hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl hover:bg-slate-100 transition-all duration-300 group border border-transparent hover:border-slate-200"
                >
                  <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deliver to</span>
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">
                      {user.address?.city ? `${user.address.city}, ${user.address.state}` : 'Set Address'}
                    </span>
                  </div>
                </Link>
              )}
            </div>

            {/* Search Bar */}
            <div className="flex-grow max-w-xl mx-4">
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  placeholder="Search for your next plant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100/50 border-2 border-transparent rounded-2xl py-2.5 px-5 pr-12 focus:bg-white focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all duration-300 text-sm font-medium"
                />
                <button type="submit" className="absolute right-4 top-2.5 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
              {user ? (
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <button className="flex items-center gap-3 text-sm font-bold text-slate-700 hover:text-emerald-800 transition-colors">
                      <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-100 transition-colors overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-emerald-700" />
                        )}
                      </div>
                      <span className="hidden sm:inline">{user.name}</span>
                    </button>
                    
                    <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-[32px] shadow-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
                      {/* User Header */}
                      <div className="px-6 py-4 border-b border-slate-100 mb-2">
                        <p className="font-black text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 font-medium truncate mb-2">{user.email}</p>
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-100">
                          {user.role} Account
                        </span>
                      </div>

                      {/* Links */}
                      <div className="px-2 space-y-1">
                        <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors rounded-2xl font-bold group/link">
                          <User className="w-4 h-4 group-hover/link:scale-110 transition-transform" /> 
                          <span>My Profile</span>
                          <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
                        </Link>
                        
                        <Link href="/address" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors rounded-2xl font-bold group/link">
                          <MapPin className="w-4 h-4 group-hover/link:scale-110 transition-transform" /> 
                          <span>Manage Addresses</span>
                          <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
                        </Link>

                        <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors rounded-2xl font-bold group/link">
                          <LayoutDashboard className="w-4 h-4 group-hover/link:scale-110 transition-transform" /> 
                          <span>Account Settings</span>
                          <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
                        </Link>

                        <Link href="/seller" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors rounded-2xl font-bold group/link">
                          <Store className="w-4 h-4 group-hover/link:scale-110 transition-transform" /> 
                          <span>Seller Console</span>
                          <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
                        </Link>

                        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors rounded-2xl font-bold group/link">
                          <ShieldCheck className="w-4 h-4 group-hover/link:scale-110 transition-transform" /> 
                          <span>Admin Dashboard</span>
                          <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
                        </Link>
                      </div>

                      <div className="h-px bg-slate-100 my-2 mx-4" />

                      <div className="px-2">
                        <button onClick={logout} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors rounded-2xl font-bold flex items-center gap-3 group/logout">
                          <LogOut className="w-4 h-4 group-hover/logout:translate-x-1 transition-transform" /> 
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="bg-emerald-600 text-white px-8 py-2.5 rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
                  Login
                </Link>
              )}

              <Link href="/cart" className="relative text-slate-600 hover:text-emerald-600 transition-all duration-300 group">
                <div className="p-2.5 rounded-2xl bg-slate-100 group-hover:bg-emerald-50 transition-colors">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </div>
          </div>
        </div>

        {/* Category Bar */}
        <div className="bg-white/40 backdrop-blur-md border-t border-slate-200/60 shadow-sm overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-4">
              {categories.map((cat) => {
                const isActive = currentCategory === cat.slug;
                return (
                  <Link
                    key={cat.name}
                    href={cat.slug ? `/plants?category=${cat.slug}` : '/plants'}
                    className="relative group flex-shrink-0"
                  >
                    <div className={`px-6 py-2 rounded-2xl text-sm font-bold transition-all duration-500 relative z-10 flex items-center gap-2 ${isActive ? 'text-white' : 'text-slate-500 hover:text-emerald-700'}`}>
                      {cat.icon}
                      <span>{cat.name}</span>
                    </div>
                    
                    {isActive && (
                      <motion.div
                        layoutId="activeCategory"
                        className="absolute inset-0 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-600/30 z-0"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    {!isActive && (
                      <div className="absolute inset-0 bg-emerald-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 scale-90 group-hover:scale-100" />
                    )}
                  </Link>
                );
              })}
              
              <div className="h-6 w-px bg-slate-200 mx-2 flex-shrink-0" />
              
              <Link 
                href="/plants?tag=new" 
                className="flex-shrink-0 px-6 py-2 rounded-2xl text-sm font-black text-amber-600 bg-amber-50 border border-amber-100 hover:bg-amber-600 hover:text-white transition-all duration-300"
              >
                🔥 New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}