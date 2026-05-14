'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Heart, Share2, Info, Droplets, Sun, Activity, ShieldCheck, ArrowRight, Star, Minus, Plus, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Store, User, Calendar, MessageSquare, ThumbsUp } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  seller: { _id?: string; name: string; shopName: string };
  careTips: { sunlight: string; watering: string; difficulty: string };
  ratings: { average: number; count: number };
}

const DEFAULT_CARE_TIPS = {
  sunlight: 'Indirect light',
  watering: 'Weekly',
  difficulty: 'Beginner',
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showCheckoutPreview, setShowCheckoutPreview] = useState(false);
  const [userAddress, setUserAddress] = useState<any>(null);
  const { user } = useAuth();
  const { addItem } = useCart();

  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/catalog/products/${id}`);
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok || !data.product) {
          setProduct(null);
          return;
        }
        setProduct({
          ...data.product,
          careTips: DEFAULT_CARE_TIPS,
        });
        setActiveImage(0);

        if (user) {
          setUserAddress({
            street: '88 Green Avenue',
            city: 'Bangalore',
            state: 'Karnataka',
            zipCode: '560001',
          });
        }
      } catch {
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (typeof id === 'string') {
      loadProduct();
    } else {
      setProduct(null);
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [id, user]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      seller: product.seller
    });
    setShowCheckoutPreview(true);
  };

  const handleProceedToCheckout = () => {
    if (!product) return;
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      seller: product.seller
    });
    router.push('/cart');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Fetching botanical details...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
      <div className="text-center space-y-6 glass p-20 rounded-[60px]">
        <div className="text-6xl animate-bounce">🌵</div>
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold text-slate-900">Plant Not Found</h1>
          <p className="text-slate-500 font-medium">This botanical specimen might have moved or is out of stock.</p>
        </div>
        <Link href="/plants" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all">
          Browse All Plants <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );

  const breadcrumbs = [
    { label: 'Plants', href: '/plants' },
    { label: product.category, href: `/plants?category=${product.category}` },
    { label: product.name }
  ];

  const mockReviews = [
    { id: 1, author: 'Priya S.', rating: 5, date: 'October 12, 2025', comment: 'Absolutely beautiful plant! Arrived in perfect condition and the packaging was very secure. Highly recommend this nursery.' },
    { id: 2, author: 'Rahul K.', rating: 4, date: 'September 28, 2025', comment: 'Healthy plant, but it took a bit longer to arrive than expected. Otherwise, very happy with the purchase.' },
    { id: 3, author: 'Anita M.', rating: 5, date: 'September 15, 2025', comment: 'Thriving beautifully in my living room. The care instructions provided were very helpful for a beginner like me.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs items={breadcrumbs} />
        
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Image Gallery */}
          <div className="lg:w-1/2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="aspect-square bg-white rounded-[48px] overflow-hidden border border-slate-100 shadow-2xl relative group"
            >
              <img 
                src={product.images[activeImage] || 'https://via.placeholder.com/800x800?text=No+Image'} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
            </motion.div>
            <div className="flex gap-4 overflow-x-auto pb-4 px-2 no-scrollbar">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)} 
                  className={`w-24 h-24 rounded-[24px] overflow-hidden border-4 flex-shrink-0 transition-all duration-300 ${activeImage === i ? 'border-emerald-500 scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold rounded-full uppercase tracking-widest border border-emerald-100">{product.category}</span>
                {product.stock > 0
                  ? <span className="text-emerald-600 text-[10px] font-extrabold flex items-center gap-1.5 uppercase tracking-widest"><ShieldCheck className="w-4 h-4" /> In Stock</span>
                  : <span className="text-red-500 text-[10px] font-extrabold uppercase tracking-widest">Sold Out</span>
                }
              </div>
              
              <h1 className="text-5xl md:text-6xl font-display font-bold text-slate-900 leading-[1.1] tracking-tight">{product.name}</h1>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                  </div>
                  <span className="text-slate-400 font-bold text-sm">({product.ratings.count} reviews)</span>
                </div>
                <div className="w-px h-6 bg-slate-200" />
                <div className="text-slate-500 text-sm font-medium">Sold by <span className="text-emerald-700 font-bold hover:underline cursor-pointer">{product.seller.shopName}</span></div>
              </div>
              
              <div className="text-5xl font-display font-bold text-emerald-900">₹{product.price}</div>
            </div>

            {/* Care Tips */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { icon: <Sun className="w-6 h-6 text-amber-600" />, bg: 'bg-amber-50', label: 'Sunlight', value: product.careTips.sunlight },
                { icon: <Droplets className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-50', label: 'Watering', value: product.careTips.watering },
                { icon: <Activity className="w-6 h-6 text-emerald-600" />, bg: 'bg-emerald-50', label: 'Level', value: product.careTips.difficulty },
              ].map(tip => (
                <div key={tip.label} className="glass p-6 rounded-[32px] text-center space-y-3 hover:scale-105 transition-transform duration-300 border-white shadow-sm">
                  <div className={`w-12 h-12 ${tip.bg} rounded-2xl flex items-center justify-center mx-auto shadow-inner`}>{tip.icon}</div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em]">{tip.label}</p>
                    <p className="text-sm font-bold text-slate-700">{tip.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-display font-bold text-2xl text-slate-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Info className="w-4 h-4 text-white" />
                </div>
                Plant Story
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg italic font-medium">&quot;{product.description}&quot;</p>
            </div>

            {/* Quantity Selector and Total Price */}
            <div className="flex flex-wrap items-center gap-8 pt-4 pb-2">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] ml-1">Quantity</span>
                <div className="flex items-center bg-white rounded-3xl border-2 border-slate-100 p-1.5 shadow-sm hover:border-emerald-100 transition-colors">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 text-slate-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <div className="w-14 text-center font-display font-black text-2xl text-slate-900 select-none">
                    {quantity}
                  </div>
                  <button 
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 text-slate-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] ml-1">Total Amount</span>
                <div className="h-[76px] flex items-center">
                  <div className="text-4xl font-display font-black text-emerald-900 flex items-baseline gap-1">
                    <span className="text-xl">₹</span>
                    {product.price * quantity}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button 
                onClick={handleAddToCart}
                className="flex-grow bg-emerald-600 text-white py-5 rounded-[24px] font-bold text-xl hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-600/30 active:scale-[0.98] flex items-center justify-center gap-4"
              >
                <ShoppingCart className="w-7 h-7" /> Add to Cart
              </button>
              <button className="w-16 h-16 glass rounded-[24px] flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border-white shadow-md">
                <Heart className="w-7 h-7" />
              </button>
              <button className="w-16 h-16 glass rounded-[24px] flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all border-white shadow-md">
                <Share2 className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Info Sections */}
        <div className="mt-20 pt-16 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Reviews Section */}
          <div className="lg:col-span-2 space-y-10">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-emerald-600" />
                Customer Reviews
              </h2>
              <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors bg-emerald-50 px-6 py-3 rounded-full hover:bg-emerald-100">
                Write a Review
              </button>
            </div>
            
            <div className="flex items-center gap-6 p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm">
               <div className="text-center space-y-2 pr-8 border-r border-slate-100">
                 <div className="text-6xl font-display font-black text-slate-900">{product.ratings.average}</div>
                 <div className="flex text-amber-400 justify-center">
                   {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.ratings.average) ? 'fill-amber-400' : 'text-slate-200'}`} />)}
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Based on {product.ratings.count} reviews</p>
               </div>
               <div className="flex-grow space-y-3">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-500 w-8 flex items-center gap-1">{rating} <Star className="w-3 h-3" /></span>
                      <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-400 rounded-full" 
                          style={{ width: `${rating === 5 ? 80 : rating === 4 ? 15 : 5}%` }} 
                        />
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="space-y-6">
              {mockReviews.map(review => (
                <div key={review.id} className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-700 font-bold text-lg">
                        {review.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{review.author}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400' : 'text-slate-200'}`} />)}
                    </div>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed">"{review.comment}"</p>
                  <div className="flex items-center gap-4 pt-4 text-xs font-bold text-slate-400">
                    <button className="hover:text-emerald-600 flex items-center gap-1 transition-colors"><ThumbsUp className="w-3.5 h-3.5" /> Helpful (12)</button>
                  </div>
                </div>
              ))}
              <button className="w-full py-4 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors border-2 border-slate-100 rounded-2xl hover:border-slate-200 border-dashed">
                Load More Reviews
              </button>
            </div>
          </div>

          {/* Seller Details Section */}
          <div className="space-y-10">
             <h2 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3">
                <Store className="w-8 h-8 text-emerald-600" />
                Nursery Details
             </h2>
             
             <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-8 sticky top-28">
               <div className="flex items-center gap-5">
                 <div className="w-20 h-20 bg-emerald-100 rounded-[24px] flex items-center justify-center text-emerald-700 font-bold text-3xl shadow-inner border border-emerald-200">
                   {product.seller.shopName.charAt(0)}
                 </div>
                 <div>
                   <h3 className="font-display font-bold text-xl text-slate-900">{product.seller.shopName}</h3>
                   <p className="text-xs font-bold text-slate-500 flex items-center gap-1 mt-1">
                     <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified Partner
                   </p>
                 </div>
               </div>

               <div className="space-y-4">
                 <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Star className="w-3.5 h-3.5" /> Rating</span>
                   <span className="font-bold text-slate-900 flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.8 / 5.0</span>
                 </div>
                 <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Location</span>
                   <span className="font-bold text-slate-900">Pune, India</span>
                 </div>
                 <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Joined</span>
                   <span className="font-bold text-slate-900">Jan 2024</span>
                 </div>
               </div>

               <p className="text-sm font-medium text-slate-500 italic leading-relaxed text-center px-4">
                 "Specializing in rare and exotic indoor plants. We guarantee the health and vitality of every specimen we ship."
               </p>

               <Link href={`/plants?sellerId=${product.seller._id || '1'}`} className="w-full block text-center bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-600/20">
                 Visit Full Nursery
               </Link>
             </div>
          </div>
        </div>
      </div>

      {/* Checkout Preview Overlay */}
      <AnimatePresence>
        {showCheckoutPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckoutPreview(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-display font-bold text-slate-900">Cart Summary</h2>
                  <button 
                    onClick={() => setShowCheckoutPreview(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex gap-6 p-4 bg-slate-50 rounded-[32px] border border-slate-100">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow space-y-2">
                    <h3 className="font-bold text-slate-900 text-lg">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Qty: {quantity}</span>
                      <span className="text-emerald-700 font-bold">₹{product.price} / unit</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                    <span>Delivery Address</span>
                    <button 
                      onClick={() => router.push('/address')}
                      className="text-emerald-600 hover:underline"
                    >
                      Change
                    </button>
                  </div>
                  <div className="flex gap-4 items-start p-6 bg-emerald-50/50 rounded-[32px] border border-emerald-100/50">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-600 flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900">{user?.name || 'Guest User'}</p>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {userAddress?.street ? (
                          <>
                            {userAddress.street}, {userAddress.city},<br />
                            {userAddress.state}, {userAddress.zipCode}
                          </>
                        ) : (
                          <>
                            No address set.<br />
                            Please add your delivery details.
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium text-lg">Total Payable</span>
                    <span className="text-4xl font-display font-black text-emerald-900">₹{product.price * quantity}</span>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setShowCheckoutPreview(false)}
                      className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                    >
                      Continue Shopping
                    </button>
                    <button 
                      onClick={handleProceedToCheckout}
                      className="flex-[1.5] bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
