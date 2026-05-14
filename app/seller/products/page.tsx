'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X,
  Image as ImageIcon,
  ChevronRight,
  TrendingUp,
  Box,
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
}

export default function SellerProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Indoor',
    stock: '',
    images: [''],
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    // Mock Upload Logic
    setTimeout(() => {
      setFormData(prev => ({ ...prev, images: ['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800'] }));
      setUploading(false);
    }, 1500);
  };

  const [uploading, setUploading] = useState(false);

  const buildPayload = () => {
    const images = formData.images.map((url) => url.trim()).filter(Boolean);
    return {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      category: formData.category,
      stock: Number(formData.stock),
      images,
    };
  };

  const fetchProducts = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/products', { credentials: 'include' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Failed to load products');
        setProducts([]);
        return;
      }
      setProducts(data.products ?? []);
    } catch {
      setError('Network error while loading products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = buildPayload();
    if (payload.images.length === 0) {
      setError('Add at least one product image URL');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(
        editingProduct ? `/api/products/${editingProduct._id}` : '/api/products',
        {
          method: editingProduct ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof data.error === 'string'
            ? data.error
            : data.details && typeof data.details === 'object'
              ? Object.values(data.details as Record<string, string[]>).flat().join(' ')
              : 'Failed to save product';
        setError(msg || 'Failed to save product');
        return;
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', category: 'Indoor', stock: '', images: [''] });
      await fetchProducts();
    } catch {
      setError('Network error while saving product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      images: product.images.length > 0 ? product.images : [''],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this specimen?')) return;
    setError('');
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Failed to delete product');
        return;
      }
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      setError('Network error while deleting product');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Inventory Management</h1>
          <p className="text-slate-500 font-medium italic">Manage your botanical collection and stock levels.</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setError(''); setIsModalOpen(true); }}
          className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
        >
          <Plus className="w-5 h-5" /> Add New Specimen
        </button>
      </div>

      {error && !isModalOpen && (
        <motion.div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100">
          {error}
        </motion.div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Items', value: products.length, icon: <Box className="text-blue-600" /> },
          { label: 'In Stock', value: products.reduce((acc, p) => acc + p.stock, 0), icon: <Package className="text-emerald-600" /> },
          { label: 'Pending Approval', value: products.filter(p => !p.isApproved).length, icon: <Clock className="text-amber-600" /> },
          { label: 'Inventory Value', value: `₹ ${products.reduce((acc, p) => acc + (p.price * p.stock), 0)}`, icon: <TrendingUp className="text-purple-600" /> },
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
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50">
          <div className="relative flex-grow max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Filter by name or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
             <span className="text-xs font-bold text-slate-400 mr-2">Sort by:</span>
             <select className="bg-white border-none rounded-xl py-2 px-4 text-xs font-bold text-slate-600 shadow-sm outline-none cursor-pointer">
               <option>Latest Added</option>
               <option>Price: High to Low</option>
               <option>Price: Low to High</option>
               <option>Stock: Low to High</option>
             </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Specimen</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Rate (Price)</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Stock</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-slate-50">
                    <td colSpan={6} className="px-8 py-6"><div className="h-10 bg-slate-50 rounded-2xl w-full" /></td>
                  </tr>
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                          <img src={product.images[0] || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{product.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium italic truncate max-w-[150px]">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1 font-display font-black text-emerald-900 text-lg">
                        <IndianRupee className="w-3 h-3" />
                        {product.price}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`flex items-center gap-2 font-bold ${product.stock < 5 ? 'text-red-500' : 'text-slate-700'}`}>
                        {product.stock}
                        {product.stock < 5 && <AlertCircle className="w-4 h-4 animate-bounce" />}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {product.isApproved ? (
                        <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                          <CheckCircle2 className="w-4 h-4" /> Live
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-600 text-[10px] font-black uppercase tracking-widest">
                          <Clock className="w-4 h-4" /> Pending
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="p-3 bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all active:scale-90"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-3 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all active:scale-90"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Box className="w-10 h-10 text-emerald-200" />
                    </div>
                    <p className="text-slate-400 font-medium italic">No specimens found matching your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[48px] shadow-2xl overflow-y-auto max-h-[90vh] border border-white/20 custom-scrollbar"
            >
              <div className="p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">{editingProduct ? 'Update Specimen' : 'Add New Specimen'}</h2>
                    <p className="text-slate-400 text-sm font-medium mt-1">Fill in the botanical and commercial details.</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Plant Name</label>
                      <input 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 transition-all"
                        placeholder="e.g. Variegated Monstera"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Rate (Price in ₹)</label>
                      <input 
                        required
                        type="number"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 transition-all"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Initial Stock</label>
                      <input 
                        required
                        type="number"
                        value={formData.stock}
                        onChange={e => setFormData({...formData, stock: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 transition-all"
                        placeholder="Quantity"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                      <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 transition-all"
                      >
                        <option>Indoor</option>
                        <option>Outdoor</option>
                        <option>Succulents</option>
                        <option>Medicinal</option>
                        <option>Pots</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Plant Image</label>
                      <div className="relative group/upload">
                        <div className={`w-full h-40 border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center transition-all ${formData.images[0] ? 'border-emerald-500/50 bg-emerald-50/30' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-emerald-300'}`}>
                          {formData.images[0] ? (
                            <div className="relative w-full h-full p-2">
                              <img src={formData.images[0]} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                              <button 
                                type="button"
                                onClick={() => setFormData({...formData, images: ['']})}
                                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all opacity-0 group-hover/upload:opacity-100"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="text-center space-y-2">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm text-slate-400 group-hover/upload:text-emerald-500 group-hover/upload:scale-110 transition-all">
                                {uploading ? <Clock className="w-6 h-6 animate-spin" /> : <ImageIcon className="w-6 h-6" />}
                              </div>
                              <p className="text-xs font-bold text-slate-500">
                                {uploading ? 'Uploading specimen...' : 'Drop plant photo or click to browse'}
                              </p>
                              <p className="text-[10px] text-slate-400 font-medium italic">JPG, PNG up to 5MB</p>
                            </div>
                          )}
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-wait"
                            disabled={uploading}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                      <textarea 
                        required
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        rows={3}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 transition-all resize-none"
                        placeholder="Tell us about this plant..."
                      />
                    </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-[2] bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Saving…' : editingProduct ? 'Save Changes' : 'List Specimen'} <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
