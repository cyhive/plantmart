'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Store, 
  Clock, 
  AlertCircle,
  Eye,
  ArrowUpRight,
  TrendingUp,
  Box,
  ChevronRight,
  IndianRupee
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  isApproved: boolean;
  seller: {
    name: string;
    shopName: string;
  };
  createdAt: string;
}

export default function AdminProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const MOCK_PRODUCTS: Product[] = [
    {
      _id: '1',
      name: 'Monstera Deliciosa',
      description: 'Premium split-leaf philodendron.',
      price: 1299,
      category: 'Indoor',
      stock: 12,
      images: ['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600'],
      isApproved: true,
      seller: { name: 'Nandan K.', shopName: 'Green Garden Nursery' },
      createdAt: '2023-11-01T10:00:00Z'
    },
    {
      _id: '2',
      name: 'Snake Plant',
      description: 'Air purifying tall snake plant.',
      price: 899,
      category: 'Indoor',
      stock: 45,
      images: ['https://images.unsplash.com/photo-1593482892290-f54927ae1bbc?auto=format&fit=crop&q=80&w=600'],
      isApproved: false,
      seller: { name: 'Arjun S.', shopName: 'Pure Air Botanicals' },
      createdAt: '2024-01-15T14:30:00Z'
    },
    {
      _id: '3',
      name: 'Bonsai Pine',
      description: 'Artistically pruned miniature pine.',
      price: 4500,
      category: 'Outdoor',
      stock: 3,
      images: ['https://images.unsplash.com/photo-1512428813824-f7139c82b346?auto=format&fit=crop&q=80&w=600'],
      isApproved: true,
      seller: { name: 'Rahul V.', shopName: 'Himalayan Greens' },
      createdAt: '2023-12-10T09:15:00Z'
    }
  ];

  useEffect(() => {
    setProducts(MOCK_PRODUCTS);
    setLoading(false);
  }, []);

  const handleApproval = (id: string, isApproved: boolean) => {
    setProducts(prev => prev.map(p => p._id === id ? { ...p, isApproved } : p));
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to remove this specimen?')) return;
    setProducts(prev => prev.filter(p => p._id !== id));
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.seller.shopName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'pending' && !p.isApproved) || 
                         (filter === 'approved' && p.isApproved);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-10">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Global Catalog</h1>
          <p className="text-slate-500 font-medium italic">Monitor and approve specimens from all nurseries.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-600/20">
              {products.length} Total Specimens
           </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Live Catalog', value: products.filter(p => p.isApproved).length, icon: <CheckCircle2 className="text-emerald-600" /> },
          { label: 'Awaiting Approval', value: products.filter(p => !p.isApproved).length, icon: <Clock className="text-amber-600" /> },
          { label: 'Total Inventory', value: products.reduce((acc, p) => acc + p.stock, 0), icon: <Box className="text-blue-600" /> },
          { label: 'Market Value', value: `₹${(products.reduce((acc, p) => acc + (p.price * p.stock), 0) / 1000).toFixed(1)}k`, icon: <TrendingUp className="text-purple-600" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-slate-900">{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Table */}
      <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
            {['all', 'pending', 'approved'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="relative flex-grow max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by Product or Nursery..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Specimen</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Nursery</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Rate/Stock</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-slate-50">
                    <td colSpan={5} className="px-8 py-6"><div className="h-12 bg-slate-50 rounded-2xl w-full" /></td>
                  </tr>
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                          <img src={product.images[0]} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{product.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                          <Store className="w-3.5 h-3.5 text-emerald-600" /> {product.seller.shopName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium italic">by {product.seller.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="space-y-1">
                          <p className="font-display font-black text-emerald-900 flex items-center gap-1">
                            <IndianRupee className="w-3 h-3" /> {product.price}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{product.stock} in stock</p>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      {product.isApproved ? (
                        <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3" /> Live
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-600 text-[10px] font-black uppercase tracking-widest bg-amber-50 w-fit px-3 py-1 rounded-full border border-amber-100">
                          <Clock className="w-3 h-3" /> Pending
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2">
                        {product.isApproved ? (
                          <button 
                            onClick={() => handleApproval(product._id, false)}
                            className="p-3 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-xl transition-all shadow-sm active:scale-90"
                            title="Unapprove"
                          >
                             <XCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleApproval(product._id, true)}
                            className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all shadow-sm active:scale-90"
                            title="Approve"
                          >
                             <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-3 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 rounded-xl transition-all shadow-sm active:scale-90"
                          title="Delete"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-xl transition-all shadow-sm active:scale-90">
                           <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-10 h-10 text-emerald-200" />
                    </div>
                    <p className="text-slate-400 font-medium italic">No specimens found in this category.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
