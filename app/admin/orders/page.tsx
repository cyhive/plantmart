'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle,
  MapPin,
  Calendar,
  User,
  Store,
  ArrowUpRight,
  Filter,
  IndianRupee,
  ChevronRight
} from 'lucide-react';

interface Order {
  _id: string;
  buyer: {
    name: string;
    email: string;
  };
  items: any[];
  totalAmount: number;
  status: string;
  createdAt: string;
  address: any;
}

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const MOCK_ORDERS: Order[] = [
    {
      _id: 'ord_101',
      buyer: { name: 'Aarav Sharma', email: 'aarav@gmail.com' },
      items: [
        { name: 'Monstera', price: 1299, seller: { shopName: 'Green Garden' } },
        { name: 'Snake Plant', price: 899, seller: { shopName: 'Pure Air' } }
      ],
      totalAmount: 2198,
      status: 'delivered',
      createdAt: '2024-03-01T10:00:00Z',
      address: { city: 'Mumbai' }
    },
    {
      _id: 'ord_102',
      buyer: { name: 'Isha Patel', email: 'isha@outlook.com' },
      items: [
        { name: 'Bonsai Pine', price: 4500, seller: { shopName: 'Himalayan Greens' } }
      ],
      totalAmount: 4500,
      status: 'processing',
      createdAt: '2024-03-10T14:30:00Z',
      address: { city: 'Ahmedabad' }
    },
    {
      _id: 'ord_103',
      buyer: { name: 'Rohan Gupta', email: 'rohan@yahoo.com' },
      items: [
        { name: 'Peace Lily', price: 699, seller: { shopName: 'Green Garden' } }
      ],
      totalAmount: 699,
      status: 'pending',
      createdAt: '2024-03-11T09:15:00Z',
      address: { city: 'Delhi' }
    }
  ];

  useEffect(() => {
    setOrders(MOCK_ORDERS);
    setLoading(false);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         order.buyer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'processing': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'shipped': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Global Transactions</h1>
          <p className="text-slate-500 font-medium italic">Monitor all sales and fulfillment activity across the platform.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-600/20">
              Total Revenue: ₹{(orders.reduce((acc, o) => acc + o.totalAmount, 0) / 1000).toFixed(1)}k
           </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="relative flex-grow group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search Order ID or Buyer..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/5 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border-none rounded-xl py-3 px-6 text-sm font-bold text-slate-600 outline-none cursor-pointer flex-grow md:flex-grow-0"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Order & Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Buyer</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Vendors</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-slate-50">
                    <td colSpan={6} className="px-8 py-6"><div className="h-10 bg-slate-50 rounded-2xl w-full" /></td>
                  </tr>
                ))
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900">#{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 border border-slate-100">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{order.buyer.name}</p>
                          <p className="text-[10px] text-slate-400">{order.buyer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex -space-x-2">
                         {Array.from(new Set(order.items.map(item => item.seller?.shopName))).slice(0, 3).map((shop, i) => (
                           <div key={i} className="w-8 h-8 bg-emerald-50 rounded-lg border-2 border-white flex items-center justify-center text-[8px] font-black text-emerald-600 shadow-sm" title={shop as string}>
                             {String(shop).charAt(0)}
                           </div>
                         ))}
                         {new Set(order.items.map(item => item.seller?.shopName)).size > 3 && (
                           <div className="w-8 h-8 bg-slate-100 rounded-lg border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-400">
                             +{new Set(order.items.map(item => item.seller?.shopName)).size - 3}
                           </div>
                         )}
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <p className="font-display font-black text-emerald-900 flex items-center gap-1">
                         <IndianRupee className="w-3 h-3" /> {order.totalAmount}
                       </p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-3 bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all shadow-sm">
                           <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-10 h-10 text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-medium italic">No orders recorded in the system.</p>
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
