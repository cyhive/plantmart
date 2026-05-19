'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Tag, 
  Plus, 
  Search, 
  Calendar, 
  Percent, 
  Trash2, 
  Edit2, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ShoppingBag,
  Info,
  DollarSign,
  Gift,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Standard mock products for selection
const MOCK_PRODUCTS = [
  { _id: '1', name: 'Monstera Deliciosa', price: 1299, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600' },
  { _id: '2', name: 'Snake Plant', price: 899, image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bbc?auto=format&fit=crop&q=80&w=600' },
  { _id: '3', name: 'Fiddle Leaf Fig', price: 2499, image: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&q=80&w=600' },
  { _id: '4', name: 'Peace Lily', price: 699, image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=600' }
];

interface PromoCode {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Inactive';
  usageCount: number;
}

interface ProductDiscount {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  originalPrice: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountedPrice: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Inactive';
}

export default function SellerPromotionsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'promocodes' | 'discounts'>('promocodes');
  
  // Promocodes state
  const [promocodes, setPromocodes] = useState<PromoCode[]>([]);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  
  // Product discounts state
  const [discounts, setDiscounts] = useState<ProductDiscount[]>([]);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<ProductDiscount | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [promoForm, setPromoForm] = useState({
    code: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    minPurchase: '0',
    startDate: '',
    endDate: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  const [discountForm, setDiscountForm] = useState({
    productId: '1',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    startDate: '',
    endDate: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  // Load from local storage
  useEffect(() => {
    // Promo codes loading
    const storedPromos = localStorage.getItem('plantmart_promotions');
    if (storedPromos) {
      try {
        setPromocodes(JSON.parse(storedPromos));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Seed initial codes
      const defaults: PromoCode[] = [
        {
          id: 'd1',
          code: 'MONSOON20',
          description: 'Get 20% off on your botanical order',
          type: 'percentage',
          value: 20,
          minPurchase: 0,
          startDate: '2026-05-01',
          endDate: '2026-08-31',
          status: 'Active',
          usageCount: 142
        },
        {
          id: 'd2',
          code: 'WELCOME100',
          description: 'Flat ₹100 discount on your first order',
          type: 'fixed',
          value: 100,
          minPurchase: 499,
          startDate: '2026-01-01',
          endDate: '2026-12-31',
          status: 'Active',
          usageCount: 389
        }
      ];
      localStorage.setItem('plantmart_promotions', JSON.stringify(defaults));
      setPromocodes(defaults);
    }

    // Product discounts loading
    const storedDiscounts = localStorage.getItem('plantmart_seller_discounts');
    if (storedDiscounts) {
      try {
        setDiscounts(JSON.parse(storedDiscounts));
      } catch (e) {
        console.error(e);
      }
    } else {
      const defaults: ProductDiscount[] = [
        {
          id: 'disc1',
          productId: '1',
          productName: 'Monstera Deliciosa',
          productImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600',
          originalPrice: 1299,
          discountType: 'percentage',
          discountValue: 15,
          discountedPrice: 1104,
          startDate: '2026-05-10',
          endDate: '2026-06-30',
          status: 'Active'
        }
      ];
      localStorage.setItem('plantmart_seller_discounts', JSON.stringify(defaults));
      setDiscounts(defaults);
    }
  }, []);

  // Save promocodes to localStorage
  const savePromocodes = (updated: PromoCode[]) => {
    setPromocodes(updated);
    localStorage.setItem('plantmart_promotions', JSON.stringify(updated));
  };

  // Save discounts to localStorage
  const saveDiscounts = (updated: ProductDiscount[]) => {
    setDiscounts(updated);
    localStorage.setItem('plantmart_seller_discounts', JSON.stringify(updated));
  };

  // Handle Promocode Submit
  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPromo) {
      const updated = promocodes.map(p => 
        p.id === editingPromo.id 
          ? { 
              ...p, 
              code: promoForm.code.toUpperCase().replace(/\s+/g, ''),
              description: promoForm.description,
              type: promoForm.type,
              value: Number(promoForm.value),
              minPurchase: Number(promoForm.minPurchase),
              startDate: promoForm.startDate,
              endDate: promoForm.endDate,
              status: promoForm.status
            } 
          : p
      );
      savePromocodes(updated);
      setEditingPromo(null);
    } else {
      const newPromo: PromoCode = {
        id: 'promo-' + Date.now(),
        code: promoForm.code.toUpperCase().replace(/\s+/g, ''),
        description: promoForm.description,
        type: promoForm.type,
        value: Number(promoForm.value),
        minPurchase: Number(promoForm.minPurchase),
        startDate: promoForm.startDate,
        endDate: promoForm.endDate,
        status: promoForm.status,
        usageCount: 0
      };
      savePromocodes([newPromo, ...promocodes]);
    }
    setIsPromoModalOpen(false);
    resetPromoForm();
  };

  // Handle Product Discount Submit
  const handleDiscountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedProd = MOCK_PRODUCTS.find(p => p._id === discountForm.productId) || MOCK_PRODUCTS[0];
    const originalPrice = selectedProd.price;
    const value = Number(discountForm.discountValue);
    
    let discountedPrice = originalPrice;
    if (discountForm.discountType === 'percentage') {
      discountedPrice = Math.round(originalPrice * (1 - value / 100));
    } else {
      discountedPrice = Math.max(0, originalPrice - value);
    }

    if (editingDiscount) {
      const updated = discounts.map(d => 
        d.id === editingDiscount.id 
          ? {
              ...d,
              productId: discountForm.productId,
              productName: selectedProd.name,
              productImage: selectedProd.image,
              originalPrice,
              discountType: discountForm.discountType,
              discountValue: value,
              discountedPrice,
              startDate: discountForm.startDate,
              endDate: discountForm.endDate,
              status: discountForm.status
            }
          : d
      );
      saveDiscounts(updated);
      setEditingDiscount(null);
    } else {
      const newDiscount: ProductDiscount = {
        id: 'disc-' + Date.now(),
        productId: discountForm.productId,
        productName: selectedProd.name,
        productImage: selectedProd.image,
        originalPrice,
        discountType: discountForm.discountType,
        discountValue: value,
        discountedPrice,
        startDate: discountForm.startDate,
        endDate: discountForm.endDate,
        status: discountForm.status
      };
      saveDiscounts([newDiscount, ...discounts]);
    }
    setIsDiscountModalOpen(false);
    resetDiscountForm();
  };

  const resetPromoForm = () => {
    setPromoForm({
      code: '',
      description: '',
      type: 'percentage',
      value: '',
      minPurchase: '0',
      startDate: '',
      endDate: '',
      status: 'Active'
    });
  };

  const resetDiscountForm = () => {
    setDiscountForm({
      productId: '1',
      discountType: 'percentage',
      discountValue: '',
      startDate: '',
      endDate: '',
      status: 'Active'
    });
  };

  const handleEditPromo = (promo: PromoCode) => {
    setEditingPromo(promo);
    setPromoForm({
      code: promo.code,
      description: promo.description,
      type: promo.type,
      value: promo.value.toString(),
      minPurchase: promo.minPurchase.toString(),
      startDate: promo.startDate,
      endDate: promo.endDate,
      status: promo.status
    });
    setIsPromoModalOpen(true);
  };

  const handleDeletePromo = (id: string) => {
    if (confirm('Are you sure you want to delete this promo code?')) {
      savePromocodes(promocodes.filter(p => p.id !== id));
    }
  };

  const togglePromoStatus = (id: string) => {
    const updated = promocodes.map(p => 
      p.id === id ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' as 'Active' | 'Inactive' } : p
    );
    savePromocodes(updated);
  };

  const handleEditDiscount = (disc: ProductDiscount) => {
    setEditingDiscount(disc);
    setDiscountForm({
      productId: disc.productId,
      discountType: disc.discountType,
      discountValue: disc.discountValue.toString(),
      startDate: disc.startDate,
      endDate: disc.endDate,
      status: disc.status
    });
    setIsDiscountModalOpen(true);
  };

  const handleDeleteDiscount = (id: string) => {
    if (confirm('Are you sure you want to delete this product discount?')) {
      saveDiscounts(discounts.filter(d => d.id !== id));
    }
  };

  const toggleDiscountStatus = (id: string) => {
    const updated = discounts.map(d => 
      d.id === id ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' as 'Active' | 'Inactive' } : d
    );
    saveDiscounts(updated);
  };

  // Filter listings based on search
  const filteredPromos = promocodes.filter(p => 
    p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDiscounts = discounts.filter(d => 
    d.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics calculation
  const totalActivePromos = promocodes.filter(p => p.status === 'Active').length;
  const totalActiveDiscounts = discounts.filter(d => d.status === 'Active').length;
  const totalRedemptions = promocodes.reduce((acc, curr) => acc + curr.usageCount, 0);
  const totalSavingsEstimated = promocodes.reduce((acc, curr) => acc + (curr.usageCount * (curr.type === 'fixed' ? curr.value : 180)), 0);

  return (
    <div className="space-y-8 pb-10">
      {/* Header and Call to Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight flex items-center gap-3">
            Promotions Hub <Sparkles className="text-amber-500 w-6 h-6 animate-pulse" />
          </h1>
          <p className="text-slate-500 font-medium italic">Create and manage exclusive coupons and specimen discounts to drive nursery sales.</p>
        </div>
        <button 
          onClick={() => {
            if (activeTab === 'promocodes') {
              setEditingPromo(null);
              resetPromoForm();
              setIsPromoModalOpen(true);
            } else {
              setEditingDiscount(null);
              resetDiscountForm();
              setIsDiscountModalOpen(true);
            }
          }}
          className="bg-emerald-600 text-white px-8 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-3 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> {activeTab === 'promocodes' ? 'Create Promo Code' : 'Add Specimen Discount'}
        </button>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Promo Codes', value: totalActivePromos, icon: <Tag />, color: 'bg-emerald-500', trend: 'Live coupons' },
          { label: 'Discounted Specimens', value: totalActiveDiscounts, icon: <ShoppingBag />, color: 'bg-blue-500', trend: 'Direct store sales' },
          { label: 'Total Redemptions', value: totalRedemptions.toLocaleString(), icon: <TrendingUp />, color: 'bg-indigo-500', trend: 'Platform usage' },
          { label: 'Total Buyer Savings', value: `₹ ${totalSavingsEstimated.toLocaleString()}`, icon: <Gift />, color: 'bg-amber-500', trend: 'Estimated value given' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all duration-500">
            <div className="space-y-1.5">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-2xl font-display font-black text-slate-900">{stat.value}</h3>
              <p className="text-[10px] text-emerald-600 font-medium italic">{stat.trend}</p>
            </div>
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation and Search Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 border-b border-slate-200 pb-4">
        {/* Toggle tabs */}
        <div className="flex gap-2">
          {[
            { id: 'promocodes', label: 'Promo Codes (Coupons)', count: promocodes.length },
            { id: 'discounts', label: 'Direct Specimen Discounts', count: discounts.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as 'promocodes' | 'discounts');
                setSearchQuery('');
              }}
              className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
          <input 
            type="text" 
            placeholder={activeTab === 'promocodes' ? 'Search codes (e.g. MONSOON)...' : 'Search plant names...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl focus:border-emerald-500/30 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-xs text-slate-900 placeholder:italic"
          />
        </div>
      </div>

      {/* Main Lists Section */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        {activeTab === 'promocodes' ? (
          /* PROMCODES LISTING TABLE */
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Coupon Details</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Discount Rate</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Min. Spend</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Duration</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredPromos.map((promo) => (
                  <tr key={promo.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100/50">
                          <Tag className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-black text-slate-900 tracking-tight text-sm flex items-center gap-2 uppercase">
                            {promo.code}
                          </p>
                          <p className="text-xs text-slate-500 font-medium italic max-w-xs truncate">{promo.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-sm">
                          {promo.type === 'percentage' ? `${promo.value}% Off` : `₹${promo.value} Off`}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{promo.usageCount} Redeemed</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-bold text-slate-700 text-xs">
                        {promo.minPurchase > 0 ? `₹${promo.minPurchase}` : 'No Minimum'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        <span>{promo.startDate}</span>
                        <span className="text-slate-300">→</span>
                        <span>{promo.endDate}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => togglePromoStatus(promo.id)}
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer ${
                          promo.status === 'Active' 
                            ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' 
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${promo.status === 'Active' ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                        {promo.status}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEditPromo(promo)}
                          className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePromo(promo.id)}
                          className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPromos.length === 0 && (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-[24px] flex items-center justify-center mx-auto border border-slate-100">
                  <AlertCircle className="w-8 h-8 text-slate-300" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-base">No promo codes found</h3>
                  <p className="text-slate-400 text-xs italic font-medium">Try search query adjustments or set up a new promo coupon.</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* PRODUCT DIRECT DISCOUNTS TABLE */
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Specimen</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Original Rate</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Discount Applied</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Promo Sale Rate</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Duration</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredDiscounts.map((disc) => (
                  <tr key={disc.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-sm border border-slate-200/50">
                          <img src={disc.productImage} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">{disc.productName}</p>
                          <p className="text-[10px] text-slate-400 font-medium italic">Direct Product Discount</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-medium text-slate-400 line-through text-xs">₹{disc.originalPrice}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-100 font-black text-[10px] uppercase">
                        {disc.discountType === 'percentage' ? `${disc.discountValue}% OFF` : `₹${disc.discountValue} OFF`}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-emerald-900 text-sm">₹{disc.discountedPrice}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        <span>{disc.startDate}</span>
                        <span className="text-slate-300">→</span>
                        <span>{disc.endDate}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => toggleDiscountStatus(disc.id)}
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer ${
                          disc.status === 'Active' 
                            ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' 
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${disc.status === 'Active' ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                        {disc.status}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEditDiscount(disc)}
                          className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteDiscount(disc.id)}
                          className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredDiscounts.length === 0 && (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-[24px] flex items-center justify-center mx-auto border border-slate-100">
                  <AlertCircle className="w-8 h-8 text-slate-300" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-base">No plant discounts found</h3>
                  <p className="text-slate-400 text-xs italic font-medium">Create a direct price cut for one of your listed nursery specimens.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 1. Add/Edit Promo Code Modal */}
      <AnimatePresence>
        {isPromoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPromoModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[40px] shadow-3xl border border-white/20 p-10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-600/20">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">
                      {editingPromo ? 'Edit Coupon Code' : 'New Promo Code'}
                    </h2>
                    <p className="text-slate-400 text-xs font-medium italic">Configure discount values and spending limits.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsPromoModalOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePromoSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Promo Code String</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. GREEN30"
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 placeholder:italic placeholder:text-slate-350 text-sm uppercase"
                    value={promoForm.code}
                    onChange={(e) => setPromoForm({...promoForm, code: e.target.value})}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Buyer Description</label>
                  <input 
                    required
                    type="text"
                    placeholder="e.g. Save 30% on all green leafy specimens..."
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 placeholder:italic placeholder:text-slate-350 text-sm"
                    value={promoForm.description}
                    onChange={(e) => setPromoForm({...promoForm, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Discount Type</label>
                    <select 
                      className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 text-sm cursor-pointer"
                      value={promoForm.type}
                      onChange={(e) => setPromoForm({...promoForm, type: e.target.value as 'percentage' | 'fixed'})}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      {promoForm.type === 'percentage' ? 'Percentage Off' : 'Fixed Savings (₹)'}
                    </label>
                    <input 
                      required
                      type="number" 
                      placeholder={promoForm.type === 'percentage' ? '30' : '200'}
                      min="1"
                      max={promoForm.type === 'percentage' ? '99' : '9999'}
                      className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 text-sm"
                      value={promoForm.value}
                      onChange={(e) => setPromoForm({...promoForm, value: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Min. Order Value (₹)</label>
                    <input 
                      required
                      type="number" 
                      placeholder="0"
                      min="0"
                      className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 text-sm"
                      value={promoForm.minPurchase}
                      onChange={(e) => setPromoForm({...promoForm, minPurchase: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Status</label>
                    <select 
                      className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 text-sm cursor-pointer"
                      value={promoForm.status}
                      onChange={(e) => setPromoForm({...promoForm, status: e.target.value as 'Active' | 'Inactive'})}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Start Date</label>
                    <input 
                      required
                      type="date" 
                      className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 text-sm cursor-pointer"
                      value={promoForm.startDate}
                      onChange={(e) => setPromoForm({...promoForm, startDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Expiration Date</label>
                    <input 
                      required
                      type="date" 
                      className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 text-sm cursor-pointer"
                      value={promoForm.endDate}
                      onChange={(e) => setPromoForm({...promoForm, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsPromoModalOpen(false)}
                    className="flex-1 py-4 rounded-[18px] font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all border border-slate-150 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 rounded-[18px] font-black text-xs uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95 cursor-pointer"
                  >
                    {editingPromo ? 'Save Changes' : 'Publish Coupon'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Add/Edit Product Discount Modal */}
      <AnimatePresence>
        {isDiscountModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDiscountModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[40px] shadow-3xl border border-white/20 p-10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">
                      {editingDiscount ? 'Edit Plant Discount' : 'Add Specimen Discount'}
                    </h2>
                    <p className="text-slate-400 text-xs font-medium italic">Apply price reductions directly to a specific nursery specimen.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsDiscountModalOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleDiscountSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Select Specimen</label>
                  <select 
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 text-sm cursor-pointer"
                    value={discountForm.productId}
                    onChange={(e) => setDiscountForm({...discountForm, productId: e.target.value})}
                    disabled={!!editingDiscount}
                  >
                    {MOCK_PRODUCTS.map(prod => (
                      <option key={prod._id} value={prod._id}>
                        {prod.name} (Original: ₹{prod.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Discount Type</label>
                    <select 
                      className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 text-sm cursor-pointer"
                      value={discountForm.discountType}
                      onChange={(e) => setDiscountForm({...discountForm, discountType: e.target.value as 'percentage' | 'fixed'})}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Cut (₹)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      {discountForm.discountType === 'percentage' ? 'Percentage Off' : 'Savings Amount (₹)'}
                    </label>
                    <input 
                      required
                      type="number" 
                      placeholder={discountForm.discountType === 'percentage' ? '15' : '150'}
                      min="1"
                      className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 text-sm"
                      value={discountForm.discountValue}
                      onChange={(e) => setDiscountForm({...discountForm, discountValue: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Start Date</label>
                    <input 
                      required
                      type="date" 
                      className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 text-sm cursor-pointer"
                      value={discountForm.startDate}
                      onChange={(e) => setDiscountForm({...discountForm, startDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Expiration Date</label>
                    <input 
                      required
                      type="date" 
                      className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 text-sm cursor-pointer"
                      value={discountForm.endDate}
                      onChange={(e) => setDiscountForm({...discountForm, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Status</label>
                  <select 
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900 text-sm cursor-pointer"
                    value={discountForm.status}
                    onChange={(e) => setDiscountForm({...discountForm, status: e.target.value as 'Active' | 'Inactive'})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsDiscountModalOpen(false)}
                    className="flex-1 py-4 rounded-[18px] font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all border border-slate-150 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 rounded-[18px] font-black text-xs uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 cursor-pointer"
                  >
                    {editingDiscount ? 'Save Changes' : 'Apply Discount'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
