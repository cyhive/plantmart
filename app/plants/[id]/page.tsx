'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Heart, Share2, Info, Droplets, Sun, Activity, ShieldCheck, ArrowRight, Star, Minus, Plus, X, MapPin, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Store, User, Calendar, MessageSquare, ThumbsUp } from 'lucide-react';
import ProductReviewForm from '@/components/plants/ProductReviewForm';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  seller: { name: string; shopName: string; _id?: string };
  careTips: { sunlight: string; watering: string; difficulty: string };
  ratings: { average: number; count: number };
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showCheckoutPreview, setShowCheckoutPreview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedSize, setSelectedSize] = useState<'Small' | 'Medium' | 'Large'>('Medium');
  const sizeAdjustments = {
    'Small': 0,
    'Medium': 300,
    'Large': 600
  };
  const [reviews, setReviews] = useState([
    { id: 1, author: 'Priya S.', rating: 5, date: 'October 12, 2025', comment: 'Absolutely beautiful plant! Arrived in perfect condition and the packaging was very secure. Highly recommend this nursery.' },
    { id: 2, author: 'Rahul K.', rating: 4, date: 'September 28, 2025', comment: 'Healthy plant, but it took a bit longer to arrive than expected. Otherwise, very happy with the purchase.' },
    { id: 3, author: 'Anita M.', rating: 5, date: 'September 15, 2025', comment: 'Thriving beautifully in my living room. The care instructions provided were very helpful for a beginner like me.' },
  ]);
  const [userAddress, setUserAddress] = useState<any>(null);
  const { user } = useAuth();
  const { addItem } = useCart();

  useEffect(() => {
    // Simulate API Fetch with Mock Data
    const mockProducts: Record<string, Product> = {
      '1': { _id: '1', name: 'Monstera Deliciosa', description: 'The Swiss Cheese plant is a classic favorite for its large, iconic leaves.', price: 1299, category: 'Indoor', images: ['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800'], stock: 10, seller: { name: 'Green Garden', shopName: 'Green Garden Nursery', _id: '1' }, careTips: { sunlight: 'Partial Shade', watering: 'Weekly', difficulty: 'Beginner' }, ratings: { average: 4.9, count: 128 } },
      '2': { _id: '2', name: 'Snake Plant', description: 'Perfect for beginners, this hardy plant can survive in low light and irregular watering.', price: 899, category: 'Indoor', images: ['https://images.unsplash.com/photo-1593482892290-f54927ae1bbc?auto=format&fit=crop&q=80&w=800'], stock: 15, seller: { name: 'Air Purifiers', shopName: 'Pure Air Nursery', _id: '2' }, careTips: { sunlight: 'Low Light', watering: 'Bi-weekly', difficulty: 'Beginner' }, ratings: { average: 4.8, count: 95 } },
      '3': { _id: '3', name: 'Fiddle Leaf Fig', description: 'An elegant statement piece with large, waxy leaves that love bright, indirect light.', price: 2499, category: 'Outdoor', images: ['https://images.unsplash.com/photo-1597055181300-e3633a207519?auto=format&fit=crop&q=80&w=800'], stock: 5, seller: { name: 'Tree Experts', shopName: 'Expert Tree Farm', _id: '3' }, careTips: { sunlight: 'Bright Indirect', watering: 'Weekly', difficulty: 'Intermediate' }, ratings: { average: 4.7, count: 64 } },
      '4': { _id: '4', name: 'Peace Lily', description: 'Known for its beautiful white blooms and air-purifying qualities.', price: 699, category: 'Indoor', images: ['https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&q=80&w=800'], stock: 20, seller: { name: 'Bloom Valley', shopName: 'Bloom Valley Florals', _id: '4' }, careTips: { sunlight: 'Partial Shade', watering: 'Twice Weekly', difficulty: 'Beginner' }, ratings: { average: 4.9, count: 82 } }
    };

    setTimeout(() => {
      const foundProduct = mockProducts[id as string] || mockProducts['1']; // Fallback to first mock product
      setProduct(foundProduct);
      setLoading(false);

      if (user) {
        setUserAddress({
          street: '88 Green Avenue',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560001'
        });
      }
    }, 600);
  }, [id, user]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: `${product._id}-${selectedSize}`,
      name: product.name,
      price: product.price + sizeAdjustments[selectedSize],
      image: product.images[0],
      quantity: quantity,
      seller: product.seller,
      size: selectedSize
    });
    setShowCheckoutPreview(true);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem({
      id: `${product._id}-${selectedSize}`,
      name: product.name,
      price: product.price + sizeAdjustments[selectedSize],
      image: product.images[0],
      quantity: quantity,
      seller: product.seller,
      size: selectedSize
    });
    router.push('/cart');
  };

  const handleProceedToCheckout = () => {
    if (!product) return;
    router.push('/cart');
  };
  
  const handleReviewSubmit = (newReview: any) => {
    setReviews([newReview, ...reviews]);
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

  const currentPrice = product.price + sizeAdjustments[selectedSize];
  const currentOriginalPrice = Math.round(currentPrice * 1.25);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-28 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Breadcrumbs items={breadcrumbs} />
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mt-6">
          {/* Image Gallery - Sticky on large screens */}
          <div className="lg:w-[40%] lg:sticky lg:top-28 h-fit space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="aspect-square max-h-[480px] w-full mx-auto bg-white rounded-[36px] md:rounded-[48px] overflow-hidden border border-slate-100 shadow-2xl relative group"
            >
              <img 
                src={product.images[activeImage] || 'https://via.placeholder.com/800x800?text=No+Image'} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
              
              {/* Floating Magnify Tip */}
              <div className="absolute bottom-6 right-6 px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-xl text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Premium Specimen
              </div>
            </motion.div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 px-2 no-scrollbar scroll-smooth">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)} 
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-[20px] md:rounded-[24px] p-1 flex-shrink-0 transition-all duration-300 cursor-pointer ${
                    activeImage === i 
                      ? 'bg-emerald-500 scale-105 shadow-lg shadow-emerald-500/20' 
                      : 'bg-slate-200/50 opacity-60 hover:opacity-100 hover:scale-102'
                  }`}
                >
                  <div className="w-full h-full rounded-[16px] md:rounded-[20px] overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-[60%] space-y-8 md:space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold rounded-full uppercase tracking-widest border border-emerald-100">{product.category}</span>
                {product.stock > 0 ? (
                  <span className="bg-emerald-500/10 text-emerald-700 text-[10px] font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-widest relative overflow-hidden">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    In Stock
                  </span>
                ) : (
                  <span className="bg-red-500/10 text-red-500 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest">
                    Sold Out
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 leading-[1.1] tracking-tight">{product.name}</h1>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <span className="text-slate-400 font-bold text-sm">({product.ratings.count} Verified Reviews)</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-slate-200" />
                <div className="text-slate-500 text-sm font-semibold">
                  Nursery: <span className="text-emerald-700 font-bold hover:underline cursor-pointer">{product.seller.shopName}</span>
                </div>
              </div>
              
              <div className="flex items-baseline gap-4">
                <span className="text-4xl md:text-5xl font-display font-black text-emerald-900">₹{currentPrice}</span>
                <span className="text-lg text-slate-400 font-medium line-through">₹{currentOriginalPrice}</span>
                <span className="text-xs bg-emerald-500 text-white font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider">Save 25%</span>
              </div>
            </div>

            {/* Size Selector, Quantity Selector, and Aggregate Price */}
            <div className="flex flex-wrap items-center justify-between gap-6 bg-white p-6 rounded-[32px] border border-slate-100 shadow-xs w-full">
              {/* Pot Size Selector */}
              <div className="flex flex-col gap-2">
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest ml-1">Pot Size</span>
                <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-200/50 gap-1">
                  {(['Small', 'Medium', 'Large'] as const).map(sz => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex flex-col gap-2">
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest ml-1">Quantity Selector</span>
                <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-200/50">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-slate-100 text-slate-600 disabled:opacity-20 disabled:cursor-not-allowed shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-12 text-center font-display font-black text-xl text-slate-900 select-none">
                    {quantity}
                  </div>
                  <button 
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-slate-100 text-slate-600 disabled:opacity-20 disabled:cursor-not-allowed shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Aggregate Price */}
              <div className="flex flex-col gap-1 pr-4">
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest ml-1">Aggregate Price</span>
                <div className="text-3xl font-display font-black text-emerald-900 flex items-baseline gap-1">
                  <span className="text-base font-bold">₹</span>
                  {currentPrice * quantity}
                </div>
              </div>
            </div>

            {/* Subtle Trust Label */}
            <div className="pt-4 pb-2 border-b border-slate-100 flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> 7-Day Nursery Fresh Guarantee • Express Doorstep Delivery
            </div>
            {/* Care Grid */}
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              {[
                { icon: <Sun className="w-5 h-5 text-amber-600 animate-spin-slow" />, bg: 'bg-amber-50', label: 'Sunlight', value: product.careTips.sunlight },
                { icon: <Droplets className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50', label: 'Watering', value: product.careTips.watering },
                { icon: <Activity className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50', label: 'Difficulty', value: product.careTips.difficulty },
              ].map(tip => (
                <div key={tip.label} className="glass p-5 md:p-6 rounded-[28px] text-center space-y-3 border-white/50 shadow-xs hover:shadow-md transition-shadow">
                  <div className={`w-11 h-11 ${tip.bg} rounded-xl flex items-center justify-center mx-auto shadow-inner`}>{tip.icon}</div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{tip.label}</p>
                    <p className="text-xs md:text-sm font-bold text-slate-800">{tip.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Plant Story Card */}
            <div className="bg-emerald-50/30 p-6 md:p-8 rounded-[32px] border border-emerald-500/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-emerald-500/10 transition-colors" />
              <h3 className="font-display font-black text-lg text-slate-900 flex items-center gap-2 mb-4">
                <Leaf className="w-4 h-4 text-emerald-600" />
                Botanical Narrative
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base italic font-medium">&quot;{product.description}&quot;</p>
            </div>

           

            {/* Trust and Logistics Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><ShieldCheck className="w-4 h-4" /></div>
                <p className="text-[10px] font-bold text-slate-500 leading-tight">7-Day Botanical Vitality Guarantee</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><Leaf className="w-4 h-4" /></div>
                <p className="text-[10px] font-bold text-slate-500 leading-tight">Eco-friendly Secure Packaging</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><MapPin className="w-4 h-4" /></div>
                <p className="text-[10px] font-bold text-slate-500 leading-tight">Express Carbon-Neutral Delivery</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info Sections */}
        <div className="mt-24 pt-16 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Reviews Section */}
          <div className="lg:col-span-2 space-y-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-emerald-600" />
                Customer Reviews
              </h2>
              <button 
                onClick={() => setShowReviewForm(true)}
                className="text-sm font-bold text-emerald-600 hover:text-white transition-all bg-emerald-50 px-8 py-3.5 rounded-2xl hover:bg-emerald-600 shadow-sm hover:shadow-emerald-600/20 cursor-pointer"
              >
                Write a Review
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 p-8 bg-white rounded-[40px] border border-slate-100 shadow-xs">
               <div className="text-center space-y-2 pr-0 sm:pr-8 border-r-0 sm:border-r border-slate-100 w-full sm:w-auto">
                 <div className="text-6xl font-display font-black text-slate-900">{product.ratings.average}</div>
                 <div className="flex text-amber-400 justify-center">
                   {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.ratings.average) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}
                 </div>
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Based on {product.ratings.count} reviews</p>
               </div>
               <div className="flex-grow space-y-3 w-full">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-500 w-8 flex items-center gap-1">{rating} <Star className="w-3 h-3 text-amber-400" /></span>
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
              {reviews.map(review => (
                <div key={review.id} className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-xs space-y-4">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-700 font-bold text-lg">
                        {review.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{review.author}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}
                    </div>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed italic">"{review.comment}"</p>
                  <div className="flex items-center gap-4 pt-4 text-xs font-bold text-slate-400">
                    <button className="hover:text-emerald-600 flex items-center gap-1 transition-colors cursor-pointer"><ThumbsUp className="w-3.5 h-3.5" /> Helpful (12)</button>
                  </div>
                </div>
              ))}
              <button className="w-full py-4 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors border-2 border-slate-100 rounded-2xl hover:border-slate-200 border-dashed cursor-pointer">
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
             
             <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-xs space-y-8 lg:sticky lg:top-28">
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
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white/20 z-10"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-display font-bold text-slate-900">Cart Summary</h2>
                  <button 
                    onClick={() => setShowCheckoutPreview(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
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
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-wider rounded-lg border border-emerald-100">
                        Size: {selectedSize}
                      </span>
                      <span className="text-emerald-700 font-bold">₹{currentPrice} / unit</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-slate-500 font-bold uppercase tracking-widest text-[9px]">
                    <span>Delivery Address</span>
                    <button 
                      onClick={() => router.push('/address')}
                      className="text-emerald-600 hover:underline cursor-pointer font-bold"
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
                    <span className="text-4xl font-display font-black text-emerald-900">₹{currentPrice * quantity}</span>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setShowCheckoutPreview(false)}
                      className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all cursor-pointer"
                    >
                      Continue Shopping
                    </button>
                    <button 
                      onClick={handleProceedToCheckout}
                      className="flex-[1.5] bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 cursor-pointer"
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

       {/* Review Form Modal */}
       <AnimatePresence>
          {showReviewForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowReviewForm(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl z-10"
              >
                <ProductReviewForm 
                  productName={product.name} 
                  onClose={() => setShowReviewForm(false)}
                  onSubmitSuccess={handleReviewSubmit}
                />
              </motion.div>
            </div>
          )}
       </AnimatePresence>

      {/* Universal Floating Quick-Action Bar */}
      <motion.div 
        initial={{ y: 100, opacity: 0, x: '-50%' }}
        animate={{ y: 0, opacity: 1, x: '-50%' }}
        className="fixed bottom-0 left-1/2 z-40 w-fit bg-white/90 backdrop-blur-xl border border-slate-100/80 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.12)] rounded-[24px] p-3 flex items-center gap-6 border-slate-200/50"
      >
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }} 
          onClick={handleAddToCart}
          className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-xl font-black uppercase tracking-wider hover:bg-emerald-100 hover:text-emerald-800 transition-colors flex items-center justify-center gap-2 border border-emerald-500/20 shadow-xs cursor-pointer text-xs"
        >
          <ShoppingCart className="w-4 h-4" /> Add to Cart
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }} 
          onClick={handleBuyNow}
          className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase tracking-wider hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 cursor-pointer text-xs"
        >
          Buy Now <ArrowRight className="w-4 h-4 text-emerald-400" />
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setWishlisted(!wishlisted)}
          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all border flex-shrink-0 cursor-pointer ${
            wishlisted 
              ? 'bg-red-50 text-red-500 border-red-100 shadow-inner' 
              : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200 shadow-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Botanical link copied to clipboard!");
          }}
          className="w-11 h-11 rounded-xl bg-white border border-slate-100 hover:bg-slate-50 hover:border-slate-200 shadow-xs flex items-center justify-center flex-shrink-0 cursor-pointer transition-all active:scale-95"
        >
          <Share2 className="w-4 h-4 text-slate-400" />
        </motion.button>
      </motion.div>
    </div>
  );
}
