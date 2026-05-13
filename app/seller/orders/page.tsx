'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle,
  Eye,
  MapPin,
  Calendar,
  User,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    images: string[];
  };
  quantity: number;
  priceAtPurchase: number;
}

interface Order {
  _id: string;
  buyer: {
    name: string;
    email: string;
    address: any;
  };
  items: OrderItem[];
  sellerTotal: number;
  status: string;
  createdAt: string;
  address: any;
}

export default function SellerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = () => {
    setLoading(true);
    // Mock Orders Logic
    setTimeout(() => {
      const mockOrders: Order[] = [
        {
          _id: 'ord_778899',
          buyer: { name: 'Rahul Sharma', email: 'rahul@example.com', address: {} },
          items: [
            { product: { _id: '1', name: 'Monstera Deliciosa', images: ['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800'] }, quantity: 1, priceAtPurchase: 1299 }
          ],
          sellerTotal: 1299,
          status: 'pending',
          createdAt: new Date().toISOString(),
          address: { street: '45 Lotus Tower', city: 'Mumbai', state: 'Maharashtra', zipCode: '400001' }
        },
        {
          _id: 'ord_112233',
          buyer: { name: 'Anita Desai', email: 'anita@example.com', address: {} },
          items: [
            { product: { _id: '2', name: 'Snake Plant', images: ['https://images.unsplash.com/photo-1593482892290-f54927ae1bbc?auto=format&fit=crop&q=80&w=800'] }, quantity: 2, priceAtPurchase: 899 }
          ],
          sellerTotal: 1798,
          status: 'shipped',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          address: { street: 'Green Valley Residency', city: 'Pune', state: 'Maharashtra', zipCode: '411001' }
        }
      ];
      setOrders(mockOrders);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    // In a real app, this would be a PATCH to /api/seller/orders/[id]
    // For now, let's just mock it locally
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    
    // Show success message or something
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <ExternalLink className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle2 className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-slate-500 font-medium italic">Track your sales and fulfill botanical dreams.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="glass px-6 py-3 rounded-2xl flex items-center gap-4 border border-white">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-slate-900">{orders.length}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Sales</p>
              </div>
           </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="relative flex-grow group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by Order ID or Buyer Name..." 
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

      {/* Orders List */}
      <div className="space-y-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white h-48 rounded-[40px] animate-pulse" />
          ))
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all group"
            >
              <div className="p-8 flex flex-col lg:flex-row gap-8">
                {/* Order Meta */}
                <div className="lg:w-1/4 space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" /> {order.buyer.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 ${getStatusStyle(order.status)}`}>
                    {getStatusIcon(order.status)} {order.status}
                  </div>
                </div>

                {/* Items */}
                <div className="lg:w-2/4 border-y lg:border-y-0 lg:border-x border-slate-50 py-6 lg:py-0 lg:px-8 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Plants Ordered</p>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shadow-sm">
                        <img src={item.product.images[0]} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-slate-900 text-sm">{item.product.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">Qty: {item.quantity} × ₹{item.priceAtPurchase}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">₹{item.quantity * item.priceAtPurchase}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping & Actions */}
                <div className="lg:w-1/4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-slate-400 mt-1" />
                      <div className="text-xs text-slate-500 font-medium leading-relaxed">
                        {order.address.street}, {order.address.city}<br/>
                        {order.address.state} - {order.address.zipCode}
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-2xl flex justify-between items-center">
                      <p className="text-[10px] font-black uppercase text-emerald-600">Your Share</p>
                      <p className="text-xl font-display font-black text-emerald-900">₹{order.sellerTotal}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <button className="flex-1 bg-slate-50 text-slate-600 py-3 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                       <Eye className="w-4 h-4" /> Details
                    </button>
                    <div className="relative group/actions flex-1">
                      <button className="w-full bg-emerald-600 text-white py-3 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10">
                         Update <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-full right-0 mb-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 opacity-0 invisible group-hover/actions:opacity-100 group-hover/actions:visible transition-all z-50">
                        {['processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                          <button 
                            key={s} 
                            onClick={() => updateOrderStatus(order._id, s)}
                            className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 capitalize"
                          >
                            Mark as {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-white p-32 rounded-[48px] text-center space-y-4 border border-slate-100">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <ShoppingBag className="w-10 h-10 text-emerald-200" />
            </div>
            <p className="text-slate-400 font-medium italic">No sales recorded yet. Keep growing!</p>
            <p className="text-xs font-bold text-emerald-700/50 uppercase tracking-widest">Awaiting First Order</p>
          </div>
        )}
      </div>
    </div>
  );
}
