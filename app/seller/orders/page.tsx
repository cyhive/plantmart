'use client';

import React from 'react';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Calendar, 
  User, 
  Eye, 
  ChevronRight 
} from 'lucide-react';

// --- Types ---
interface OrderProps {
  order: {
    id: string;
    buyerName: string;
    date: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    productName: string;
    price: number;
    quantity: number;
    imageUrl: string;
    address: string;
    total: number;
  };
}

// --- Component: Empty State ---
const EmptyOrders = () => (
  <div className="bg-white p-24 md:p-32 rounded-[48px] text-center space-y-4 border border-slate-100 shadow-sm max-w-4xl mx-auto">
    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
      <ShoppingBag className="w-12 h-12 text-emerald-200" />
    </div>
    <div className="space-y-2">
      <p className="text-slate-400 text-lg font-medium italic">
        No sales recorded yet. Keep growing!
      </p>
      <p className="text-[10px] font-black text-emerald-700/50 uppercase tracking-[0.3em]">
        Awaiting First Order
      </p>
    </div>
  </div>
);

// --- Component: Order Card ---
const OrderCard = ({ order }: OrderProps) => {
  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all group max-w-5xl mx-auto mb-6">
      <div className="p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Order Meta */}
        <div className="lg:w-1/4 space-y-6">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
              Order #{order.id}
            </p>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" /> {order.buyerName}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              {order.date}
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 bg-amber-50 text-amber-600 border-amber-100">
            <Clock className="w-4 h-4" /> {order.status}
          </div>
        </div>

        {/* Product Items */}
        <div className="lg:w-2/4 border-y lg:border-y-0 lg:border-x border-slate-50 py-6 lg:py-0 lg:px-8 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Plants Ordered</p>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shadow-sm flex-shrink-0">
              <img src={order.imageUrl} className="w-full h-full object-cover" alt={order.productName} />
            </div>
            <div className="flex-grow">
              <p className="font-bold text-slate-900 text-sm">{order.productName}</p>
              <p className="text-[10px] text-slate-500 font-medium">Qty: {order.quantity} × ₹{order.price}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900">₹{order.total}</p>
            </div>
          </div>
        </div>

        {/* Shipping & Actions */}
        <div className="lg:w-1/4 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-slate-400 mt-1" />
              <div className="text-xs text-slate-500 font-medium leading-relaxed">
                {order.address}
              </div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl flex justify-between items-center">
              <p className="text-[10px] font-black uppercase text-emerald-600">Your Share</p>
              <p className="text-xl font-display font-black text-emerald-900">₹{order.total}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 bg-slate-50 text-slate-600 py-3 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
              <Eye className="w-4 h-4" /> Details
            </button>
            <button className="flex-1 bg-emerald-600 text-white py-3 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10">
              Update <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Wrapper ---
export default function SellerOrdersLayout() {
  const hasOrders = false; // Toggle this to see the card vs empty state

  const mockOrder = {
    id: '778899',
    buyerName: 'Rahul Sharma',
    date: '12 May, 2026',
    status: 'pending' as const,
    productName: 'Monstera Deliciosa',
    price: 1299,
    quantity: 1,
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800',
    address: '45 Lotus Tower, Mumbai, MH - 400001',
    total: 1299
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="space-y-1">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-slate-500 font-medium italic">Track your sales and fulfill botanical dreams.</p>
        </header>

        {hasOrders ? (
          <OrderCard order={mockOrder} />
        ) : (
          <EmptyOrders />
        )}
      </div>
    </div>
  );
}