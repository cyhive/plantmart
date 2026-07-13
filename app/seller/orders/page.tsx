'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Calendar, 
  User, 
  Eye, 
  ChevronRight,
  CheckCircle2,
  Edit3
} from 'lucide-react';

// --- Types ---
interface OrderProps {
  order: any; 
  onApprove: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: string) => void;
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
const OrderCard = ({ order, onApprove, onUpdateStatus }: OrderProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [isExpanded, setIsExpanded] = useState(false);

  const address = order.shippingAddress 
    ? `${order.shippingAddress.street || ''}, ${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''} - ${order.shippingAddress.zipCode || ''}`
    : 'No address provided';

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    onUpdateStatus(order._id, newStatus);
    setIsUpdating(false);
  };

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all group max-w-5xl mx-auto mb-6">
      <div className="p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Order Meta */}
        <div className="lg:w-1/4 space-y-6">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
              Order #{order._id.slice(-6).toUpperCase()}
            </p>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" /> {order.buyerName}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 bg-amber-50 text-amber-600 border-amber-100">
            <Clock className="w-4 h-4" /> {order.status}
          </div>
        </div>

        {/* Product Items Summary */}
        <div className="lg:w-2/4 border-y lg:border-y-0 lg:border-x border-slate-50 py-6 lg:py-0 lg:px-8 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Plants Ordered</p>
          <div className="space-y-4">
            {order.items?.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shadow-sm flex-shrink-0">
                  <Image src={item.productImage || ''} className="object-cover" alt={item.productName} fill />
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-slate-900 text-sm">{item.productName}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Qty: {item.quantity} × ₹{item.price}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Actions */}
        <div className="lg:w-1/4 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
              <div className="text-xs text-slate-500 font-medium leading-relaxed">
                {address}
              </div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl flex justify-between items-center">
              <p className="text-[10px] font-black uppercase text-emerald-600">Your Share</p>
              <p className="text-xl font-display font-black text-emerald-900">₹{order.subtotal}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full bg-slate-50 text-slate-600 border border-slate-200 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
            >
              <Eye className="w-4 h-4" /> {isExpanded ? 'Hide Details' : 'View Details'}
            </button>
            {order.status === 'awaiting_approval' ? (
              <button 
                onClick={() => onApprove(order._id)}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10"
              >
                Approve & Process
              </button>
            ) : (
              <div className="space-y-2 mt-2">
                {!isUpdating ? (
                  <button 
                    onClick={() => setIsUpdating(true)}
                    className="w-full bg-emerald-50 text-emerald-700 border border-emerald-200 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 transition-all"
                  >
                    <Edit3 className="w-4 h-4" /> Update Status
                  </button>
                ) : (
                  <select 
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    onBlur={() => setIsUpdating(false)}
                    className="w-full bg-white border-2 border-emerald-500 rounded-xl py-3 px-4 text-xs font-bold text-slate-700 outline-none cursor-pointer shadow-lg shadow-emerald-500/10"
                    autoFocus
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-100 p-8 bg-slate-50 flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Buyer Information</h4>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-2">
              <p className="text-sm font-bold text-slate-900">{order.buyerName}</p>
              {order.shippingAddress?.phone && <p className="text-xs text-slate-500 font-medium">Phone: {order.shippingAddress.phone}</p>}
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Full Delivery Address</h4>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 text-sm font-medium text-slate-600 leading-relaxed">
              <p>{order.shippingAddress?.building}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
              <p>{order.shippingAddress?.zipCode}</p>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Financial Summary</h4>
            <div className="bg-emerald-600 text-white p-5 rounded-2xl shadow-lg shadow-emerald-600/20 space-y-3">
              <div className="flex justify-between text-xs font-medium text-emerald-100">
                <span>Items Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-emerald-100">
                <span>Platform Fees</span>
                <span>₹0</span>
              </div>
              <div className="border-t border-emerald-500 pt-3 flex justify-between font-bold">
                <span>Net Earnings</span>
                <span className="text-xl font-display">₹{order.subtotal}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Page Wrapper ---
export default function SellerOrdersLayout() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/seller/orders')
      .then(res => res.json())
      .then(data => {
        if (data.orders) setOrders(data.orders);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleApprove = async (orderId: string) => {
    try {
      const res = await fetch(`/api/seller/orders/${orderId}/approve`, { method: 'POST' });
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'pending' } : o));
      } else {
        const err = await res.json();
        alert(`Failed to approve order: ${err.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Approval failed:', err);
      alert('An error occurred while approving the order.');
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/seller/orders/${orderId}/status`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      } else {
        const err = await res.json();
        alert(`Failed to update status: ${err.error || 'Unknown error'}`);
        // Re-fetch to reset state on error
        const fetchRes = await fetch('/api/seller/orders');
        const data = await fetchRes.json();
        if (data.orders) setOrders(data.orders);
      }
    } catch (err) {
      console.error('Status update failed:', err);
      alert('An error occurred while updating the status.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="space-y-1">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-slate-500 font-medium italic">Track your sales and fulfill botanical dreams.</p>
        </header>

        {loading ? (
          <div className="text-center py-20 text-slate-400 animate-pulse">Loading orders...</div>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard 
              key={order._id} 
              order={order} 
              onApprove={handleApprove} 
              onUpdateStatus={handleUpdateStatus} 
            />
          ))
        ) : (
          <EmptyOrders />
        )}
      </div>
    </div>
  );
}