'use client';

import { useState, useEffect, Fragment } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
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
  ChevronRight,
  ChevronDown,
  Package
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
  shippingAddress: any;
  subtotal?: number;
}

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/orders')
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         order.buyer?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'awaiting_approval': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'pending': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'processing': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'shipped': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
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
            <option value="awaiting_approval">Awaiting Approval</option>
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
              <tr className="border-b border-slate-100 bg-slate-50/30">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Order & Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Buyer</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-slate-50">
                    <td colSpan={5} className="px-8 py-6"><div className="h-10 bg-slate-50 rounded-2xl w-full" /></td>
                  </tr>
                ))
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <Fragment key={order._id}>
                    <tr 
                      className={`group border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer ${expandedOrderId === order._id ? 'bg-slate-50/50' : ''}`}
                      onClick={() => toggleExpand(order._id)}
                    >
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
                            <p className="text-xs font-bold text-slate-900">{order.buyer?.name || 'Unknown'}</p>
                            <p className="text-[10px] text-slate-400">{order.buyer?.email || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <p className="font-display font-black text-emerald-900 flex items-center gap-1">
                           <IndianRupee className="w-3 h-3" /> {order.totalAmount}
                         </p>
                         <p className="text-[10px] text-slate-400">{order.items?.length || 0} items</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            className={`p-3 rounded-xl transition-all shadow-sm ${
                              expandedOrderId === order._id 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
                            }`}
                          >
                             {expandedOrderId === order._id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Details Row */}
                    <AnimatePresence>
                      {expandedOrderId === order._id && (
                        <tr className="bg-slate-50/50">
                          <td colSpan={5} className="p-0 border-b border-slate-100">
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-8">
                                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-8">
                                  {/* Items List */}
                                  <div className="flex-grow space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                      <Package className="w-4 h-4" /> Order Items
                                    </h4>
                                    <div className="space-y-3">
                                      {order.items?.map((item: any, i: number) => (
                                        <div key={i} className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                          <img src={item.productImage || ''} alt={item.productName} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                                          <div className="flex-grow">
                                            <p className="text-sm font-bold text-slate-900">{item.productName}</p>
                                            <p className="text-[10px] font-medium text-slate-500">Qty: {item.quantity} × ₹{item.price}</p>
                                          </div>
                                          <p className="font-bold text-emerald-900">₹{item.price * item.quantity}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Shipping Info */}
                                  <div className="lg:w-1/3 space-y-6 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                                    <div>
                                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> Shipping Address
                                      </h4>
                                      {order.shippingAddress ? (
                                        <div className="bg-slate-50 p-4 rounded-2xl text-xs text-slate-600 font-medium leading-relaxed border border-slate-100">
                                          <p>{order.shippingAddress.building}</p>
                                          <p>{order.shippingAddress.street}</p>
                                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                          {order.shippingAddress.phone && <p className="mt-2 text-slate-500">Phone: {order.shippingAddress.phone}</p>}
                                        </div>
                                      ) : (
                                        <p className="text-sm text-slate-400 italic">No address provided</p>
                                      )}
                                    </div>
                                    
                                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                                       <div className="flex justify-between items-center mb-1">
                                         <span className="text-xs font-bold text-slate-600">Subtotal</span>
                                         <span className="text-sm font-bold text-slate-900">₹{order.subtotal || order.totalAmount}</span>
                                       </div>
                                       <div className="flex justify-between items-center border-t border-emerald-200/50 pt-2 mt-2">
                                         <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Total Charged</span>
                                         <span className="text-lg font-black text-emerald-900">₹{order.totalAmount}</span>
                                       </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
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
