'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShoppingCart, Heart, Share2, Info, Droplets, Sun, Activity, 
  ShieldCheck, ArrowRight, Star, Minus, Plus, X, MapPin, Leaf, 
  Store, Calendar, MessageSquare, ThumbsUp, Sparkles, Wind, 
  FileText, Award, Truck, Check, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import ProductReviewForm from '@/components/plants/ProductReviewForm';
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/products/defaults';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  originalPrice?: number;
  discountText?: string;
  seller: { 
    name: string; 
    shopName: string; 
    _id?: string;
    rating?: number;
    location?: string;
    joinedDate?: string;
  };
  careTips: { 
    sunlight: string; 
    watering: string; 
    difficulty: string;
    soil?: string;
    propagation?: string;
    humidity?: string;
    fertilizer?: string;
  };
  ratings: { average: number; count: number };
  specifications?: {
    scientificName: string;
    family: string;
    origin: string;
    petFriendly: boolean;
    airPurifying: boolean;
    matureSize: string;
  };
}

type CatalogApiProduct = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  ratings: { average: number; count: number };
  seller: { _id: string; name: string; shopName: string };
};

function catalogToDetailProduct(p: CatalogApiProduct): Product {
  const images =
    p.images?.filter((url) => typeof url === 'string' && url.trim()).length > 0
      ? p.images
      : [DEFAULT_PRODUCT_IMAGE];

  return {
    _id: p._id,
    name: p.name,
    description: p.description || '',
    price: p.price,
    category: p.category,
    images,
    stock: p.stock ?? 0,
    seller: {
      name: p.seller.name,
      shopName: p.seller.shopName,
      _id: p.seller._id,
    },
    careTips: {
      sunlight: 'Moderate indirect light',
      watering: 'When topsoil feels dry',
      difficulty: 'Beginner',
      soil: 'Well-draining potting mix',
      propagation: 'Stem cuttings or division',
      humidity: 'Average room humidity',
      fertilizer: 'Balanced feed during growing season',
    },
    ratings: p.ratings ?? { average: 0, count: 0 },
    specifications: {
      scientificName: p.name,
      family: '—',
      origin: 'Nursery grown',
      petFriendly: false,
      airPurifying: false,
      matureSize: 'Varies with care',
    },
  };
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
  const [activeTab, setActiveTab] = useState<'overview' | 'care' | 'seller' | 'reviews'>('overview');
  
  // Hover zoom coordinates for primary gallery photo
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);

  const [reviews, setReviews] = useState([
    { id: 1, author: 'Priya S.', rating: 5, date: 'October 12, 2025', comment: 'Absolutely beautiful plant! Arrived in perfect condition and the packaging was very secure. Highly recommend this nursery.', helpfulCount: 12, userClickedHelpful: false },
    { id: 2, author: 'Rahul K.', rating: 4, date: 'September 28, 2025', comment: 'Healthy plant, but it took a bit longer to arrive than expected. Otherwise, very happy with the purchase.', helpfulCount: 4, userClickedHelpful: false },
    { id: 3, author: 'Anita M.', rating: 5, date: 'September 15, 2025', comment: 'Thriving beautifully in my living room. The care instructions provided were very helpful for a beginner like me.', helpfulCount: 8, userClickedHelpful: false },
  ]);

  const [userAddress, setUserAddress] = useState<any>(null);
  const { user } = useAuth();
  const { addItem } = useCart();

  useEffect(() => {
    if (!user) {
      setUserAddress(null);
      return;
    }
    setUserAddress({
      street: '88 Green Avenue',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001',
    });
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    const productId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';
    if (!productId) {
      setProduct(null);
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/catalog/products/${encodeURIComponent(productId)}`);
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok || !data.product) {
          setProduct(null);
          return;
        }
        setProduct(catalogToDetailProduct(data.product));
        setActiveImage(0);
        setQuantity(1);
      } catch {
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleHelpfulClick = (reviewId: number) => {
    setReviews(prevReviews => 
      prevReviews.map(r => {
        if (r.id === reviewId) {
          if (r.userClickedHelpful) {
            return { ...r, helpfulCount: r.helpfulCount - 1, userClickedHelpful: false };
          } else {
            return { ...r, helpfulCount: r.helpfulCount + 1, userClickedHelpful: true };
          }
        }
        return r;
      })
    );
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      seller: product.seller,
    });
    setShowCheckoutPreview(true);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      seller: product.seller,
    });
    router.push('/cart');
  };

  const handleProceedToCheckout = () => {
    if (!product) return;
    router.push('/cart');
  };
  
  const handleReviewSubmit = (newReview: any) => {
    setReviews([
      { ...newReview, helpfulCount: 0, userClickedHelpful: false }, 
      ...reviews
    ]);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-slate-50 to-emerald-50/30">
      <div className="text-center space-y-6">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <Leaf className="absolute inset-0 m-auto w-8 h-8 text-emerald-600 animate-pulse" />
        </div>
        <p className="text-slate-500 font-display font-bold uppercase tracking-widest text-[10px]">Unveiling Botanical Specimen...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
      <div className="text-center space-y-6 glass p-20 rounded-[60px] max-w-md mx-auto">
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

  const currentPrice = product.price;

  return (
    <div className="min-h-screen bg-linear-to-b from-[#fbfdfb] via-[#f7faf7] to-[#f4f7f4] pb-28 relative overflow-hidden">
      
      {/* Background Soft Blobs for Glassmorphism visual depth */}
      <div className="absolute top-20 left-[-10%] w-[35rem] h-[35rem] bg-emerald-100/30 rounded-full filter blur-3xl pointer-events-none -z-10 animate-float" />
      <div className="absolute top-[40%] right-[-10%] w-[40rem] h-[40rem] bg-amber-50/40 rounded-full filter blur-3xl pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Breadcrumbs items={breadcrumbs} />
        
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mt-8">
          
          {/* Column 1: Image Gallery (4 cols, sticky) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit space-y-6">
            
            {/* Main Interactive Zoomable Container */}
            <div 
              className="relative overflow-hidden aspect-square rounded-[36px] md:rounded-[48px] bg-white border border-slate-100/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] cursor-zoom-in group"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img 
                src={product.images[activeImage] || 'https://via.placeholder.com/800x800?text=No+Image'} 
                alt={product.name} 
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZoomed ? 'scale(1.8)' : 'scale(1)'
                }}
                className="w-full h-full object-cover transition-transform duration-200 ease-out" 
              />
              
              {/* Premium Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating Magnify Tip */}
              <div className="absolute bottom-6 right-6 px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-xl text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Premium Specimen
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 px-2 no-scrollbar scroll-smooth">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)} 
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-[20px] md:rounded-[24px] overflow-hidden border-4 flex-shrink-0 transition-all duration-300 ${activeImage === i ? 'border-emerald-500 scale-105 shadow-md shadow-emerald-500/10' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-102'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Product Information & Custom Configurations (8 cols) */}
          <div className="lg:col-span-8 space-y-8 lg:pl-4">
            
            {/* Badges & Tags */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold rounded-full uppercase tracking-widest border border-emerald-100/50 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600 animate-pulse" /> {product.category}
                </span>
                
                {product.stock > 0 ? (
                  <span className="bg-emerald-500/10 text-emerald-800 text-[10px] font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-widest border border-emerald-500/10">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    Nursery Fresh
                  </span>
                ) : (
                  <span className="bg-red-500/10 text-red-600 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest">
                    Sold Out
                  </span>
                )}
              </div>
              
              {/* Product Header Title & Meta */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-slate-900 leading-tight tracking-tight">
                {product.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <span className="text-slate-500 font-bold text-xs">({product.ratings.count} Verified Reviews)</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-slate-200" />
                <div className="text-slate-500 text-sm font-semibold flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-emerald-700" />
                  Nursery: <span className="text-emerald-700 font-bold hover:underline cursor-pointer transition-colors">{product.seller.shopName}</span>
                </div>
              </div>
            </div>

            {/* Rich Editorial Pricing Display */}
            <div className="p-6 bg-white/50 backdrop-blur-md rounded-[32px] border border-white/60 shadow-sm flex items-center justify-between flex-wrap gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block ml-1">Price</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl md:text-5xl font-display font-black text-emerald-955">₹{currentPrice}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="text-[9px] text-slate-400 font-medium italic">Inc. of all nursery packing taxes</span>
              </div>
            </div>

            {/* Quantity Selector and Total Price */}
            <div className="flex flex-wrap items-center gap-8 bg-white p-6 rounded-[32px] border border-slate-100 shadow-xs">
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

                <div className="flex flex-col gap-1 items-end pr-2">
                  <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block text-right leading-none">Subtotal</span>
                  <div className="text-3xl font-display font-black text-emerald-955 flex items-baseline gap-0.5">
                    <span className="text-sm font-bold">₹</span>
                    {currentPrice * quantity}
                  </div>
                </div>
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

            

            {/* Quick Micro Care Information Cards */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: <Sun className="w-5 h-5 text-amber-500 animate-[spin_10s_linear_infinite]" />, bg: 'bg-amber-50/60 border-amber-200/30', label: 'Sunlight', value: product.careTips.sunlight },
                { icon: <Droplets className="w-5 h-5 text-blue-500 animate-bounce" />, bg: 'bg-blue-50/60 border-blue-200/30', label: 'Watering', value: product.careTips.watering },
                { icon: <Activity className="w-5 h-5 text-emerald-500 animate-pulse" />, bg: 'bg-emerald-50/60 border-emerald-200/30', label: 'Difficulty', value: product.careTips.difficulty },
              ].map(tip => (
                <div key={tip.label} className={`border p-4 rounded-[24px] text-center space-y-2 bg-white/40 shadow-xs hover:shadow-md transition-all duration-300 ${tip.bg}`}>
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto shadow-sm">{tip.icon}</div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{tip.label}</p>
                    <p className="text-xs font-bold text-slate-800">{tip.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust and Logistics Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50/50 rounded-2xl flex items-center justify-center text-emerald-700 flex-shrink-0 border border-emerald-100/30"><Award className="w-5 h-5" /></div>
                <p className="text-[10px] font-bold text-slate-500 leading-tight">7-Day Fresh Botanical Health Guarantee</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50/50 rounded-2xl flex items-center justify-center text-emerald-700 flex-shrink-0 border border-emerald-100/30"><Leaf className="w-5 h-5" /></div>
                <p className="text-[10px] font-bold text-slate-500 leading-tight">Eco-friendly Shockproof Protective Pack</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50/50 rounded-2xl flex items-center justify-center text-emerald-700 flex-shrink-0 border border-emerald-100/30"><Truck className="w-5 h-5" /></div>
                <p className="text-[10px] font-bold text-slate-500 leading-tight">Express Carbon-Neutral Delivery Options</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Editorial Tab System Sections */}
        <div className="mt-20 pt-12 border-t border-slate-200 space-y-10">
          
          {/* Glass Tab Selector */}
          <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar gap-8">
            {([
              { id: 'overview', label: 'Botanical Overview', icon: <Info className="w-4 h-4" /> },
              { id: 'care', label: 'Deep Care Manual', icon: <Droplets className="w-4 h-4" /> },
              { id: 'seller', label: 'Meet the Nursery', icon: <Store className="w-4 h-4" /> },
              { id: 'reviews', label: `Customer Reviews (${reviews.length})`, icon: <MessageSquare className="w-4 h-4" /> }
            ] as const).map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-4 font-display font-black text-sm uppercase tracking-wider relative cursor-pointer whitespace-nowrap transition-colors duration-200 ${
                    isActive ? 'text-emerald-805 font-extrabold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel Content */}
          <div className="bg-white/40 backdrop-blur-md rounded-[40px] border border-white/50 p-6 md:p-10 shadow-xs">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                
                {/* 1. Botanical Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 space-y-6">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <Leaf className="w-5 h-5" />
                        <h3 className="font-display font-black text-lg uppercase tracking-wider">Botanical Narrative</h3>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium italic text-lg font-serif border-l-4 border-emerald-500 pl-4 py-1">
                        &quot;{product.description}&quot;
                      </p>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        This premium nursery specimen has been carefully acclimated and grown under monitored conditions. We prune and filter water supplies to ensure root structure longevity and visual appeal upon arrival.
                      </p>
                    </div>
                    
                    <div className="lg:col-span-5 bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm space-y-4">
                      <h4 className="font-display font-bold text-sm text-slate-800 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-700" /> Specimen Specifications
                      </h4>
                      <div className="space-y-3">
                        {[
                          { label: 'Scientific Name', value: product.specifications?.scientificName || 'Unresolved botanical name', isItalic: true },
                          { label: 'Botanical Family', value: product.specifications?.family || 'Araceae' },
                          { label: 'Native Origin', value: product.specifications?.origin || 'Tropical environments' },
                          { label: 'NASA Air Purifier', value: product.specifications?.airPurifying ? 'Ranked Air-Purifying (A-Grade)' : 'Standard Air Filter' },
                          { label: 'Pet Toxicity', value: product.specifications?.petFriendly ? 'Pet-Safe Plant Companion' : 'Toxic to Pets (Keep Elevated)' },
                          { label: 'Mature Height', value: product.specifications?.matureSize || 'Varies' }
                        ].map((spec, sidx) => (
                          <div key={sidx} className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0 text-xs">
                            <span className="text-slate-400 font-semibold">{spec.label}</span>
                            <span className={`text-slate-800 font-bold text-right ${spec.isItalic ? 'italic' : ''}`}>{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Deep Care Manual Tab */}
                {activeTab === 'care' && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-2 text-emerald-800 mb-2">
                      <Award className="w-5 h-5" />
                      <h3 className="font-display font-black text-lg uppercase tracking-wider">Acclimation & Care Directives</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="p-6 bg-white rounded-[24px] border border-slate-100 shadow-xs space-y-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600"><Sun className="w-5 h-5" /></div>
                        <h4 className="font-display font-bold text-sm text-slate-800">Lighting Parameters</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-semibold">Requirement: {product.careTips.sunlight}</p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Position near windows with light filtration or light curtains. Avoid severe direct mid-day sun to prevent leaf scorching.
                        </p>
                      </div>

                      <div className="p-6 bg-white rounded-[24px] border border-slate-100 shadow-xs space-y-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><Droplets className="w-5 h-5" /></div>
                        <h4 className="font-display font-bold text-sm text-slate-800">Irrigation & Moisture</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-semibold">Watering: {product.careTips.watering}</p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Humidity Preference: {product.careTips.humidity || 'Moderate'}. Wait until upper 2 inches of soil feel dry. Do not let roots drown in sitting saucer water.
                        </p>
                      </div>

                      <div className="p-6 bg-white rounded-[24px] border border-slate-100 shadow-xs space-y-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><Leaf className="w-5 h-5" /></div>
                        <h4 className="font-display font-bold text-sm text-slate-800">Growth Substrate & Food</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-semibold">Substrate: {product.careTips.soil || 'Standard Blend'}</p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Fertilization: {product.careTips.fertilizer || 'None required'}. Re-pot in spring if roots outgrow the drainage slots.
                        </p>
                      </div>
                    </div>

                    <div className="p-6 bg-emerald-50/40 rounded-[28px] border border-emerald-500/10 flex items-start gap-4">
                      <Info className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5 animate-pulse" />
                      <div className="space-y-1">
                        <h5 className="text-xs font-black text-emerald-955 uppercase tracking-wider">Nursery Pro-Tip</h5>
                        <p className="text-xs text-emerald-800/80 leading-relaxed">
                          Always let a newly arrived plant settle in its current environment for 7-14 days before repotting. Changing potting locations is stressful; stability will allow the plant to settle and grow properly.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Meet the Nursery Tab */}
                {activeTab === 'seller' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
                      <div className="w-24 h-24 bg-emerald-100/50 rounded-[32px] flex items-center justify-center text-emerald-800 font-display font-black text-4xl shadow-inner border border-emerald-200">
                        {product.seller.shopName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-display font-black text-2xl text-slate-900">{product.seller.shopName}</h3>
                        <p className="text-xs font-bold text-slate-400 flex items-center justify-center gap-1 mt-1 uppercase tracking-widest">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" /> A-Grade Partner Nursery
                        </p>
                      </div>
                    </div>

                    <div className="lg:col-span-7 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 text-center">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Nursery Rating</span>
                          <span className="font-bold text-slate-800 flex items-center justify-center gap-1 text-sm"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {product.seller.rating || '4.8'} / 5.0</span>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 text-center">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Hub Location</span>
                          <span className="font-bold text-slate-800 text-sm flex items-center justify-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-600" /> {product.seller.location || 'Pune'}</span>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 text-center">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Partner Joined</span>
                          <span className="font-bold text-slate-800 text-sm flex items-center justify-center gap-1"><Calendar className="w-3.5 h-3.5 text-emerald-600" /> {product.seller.joinedDate || 'Jan 2024'}</span>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-slate-500 italic leading-relaxed">
                        &quot;Specializing in rare and exotic indoor foliage. We maintain highly optimized greenhouse setups to guarantee clean roots and disease-free specimens.&quot;
                      </p>

                      <div className="flex gap-4">
                        <Link href={`/plants?sellerId=${product.seller._id || '1'}`} className="flex-1 text-center bg-slate-950 text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-700/10 transition-all">
                          Browse Nursery catalog
                        </Link>
                        <button 
                          onClick={() => alert("Connecting with nursery concierge...")}
                          className="flex-1 text-center bg-emerald-50 text-emerald-805 border border-emerald-100 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all cursor-pointer"
                        >
                          Converse with Seller
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Customer Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-10">
                    
                    {/* Header Summary Stats */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
                      <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
                        
                        <div className="text-center space-y-1 pr-0 sm:pr-8 border-r-0 sm:border-r border-slate-200 w-full sm:w-auto">
                          <div className="text-6xl font-display font-black text-slate-900">{product.ratings.average}</div>
                          <div className="flex text-amber-400 justify-center">
                            {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.ratings.average) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}
                          </div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Based on {product.ratings.count} ratings</p>
                        </div>

                        <div className="flex-grow space-y-2 w-full max-w-xs">
                          {[5, 4, 3, 2, 1].map(rating => (
                            <div key={rating} className="flex items-center gap-4 text-xs font-semibold">
                              <span className="text-slate-500 w-6 flex items-center gap-0.5">{rating} <Star className="w-3 h-3 text-amber-400 fill-amber-400" /></span>
                              <div className="flex-grow h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-amber-400 rounded-full" 
                                  style={{ width: `${rating === 5 ? 85 : rating === 4 ? 10 : rating === 3 ? 3 : 2}%` }} 
                                />
                              </div>
                              <span className="text-slate-400 w-8 text-right">{rating === 5 ? '85%' : rating === 4 ? '10%' : rating === 3 ? '3%' : '2%'}</span>
                            </div>
                          ))}
                        </div>
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
                  <p className="text-slate-600 font-medium leading-relaxed italic">&quot;{review.comment}&quot;</p>
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

                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Checkout Preview Overlay */}
      <AnimatePresence>
        {showCheckoutPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckoutPreview(false)}
              className="absolute inset-0 bg-slate-955/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-white shadow-2xl z-10 flex flex-col justify-between border-l border-slate-100"
            >
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-display font-black text-slate-900">Cart Summary</h2>
                  <p className="text-[10px] font-black uppercase tracking-wider text-emerald-800">Fresh Botanicals Reserved</p>
                </div>
                <button 
                  onClick={() => setShowCheckoutPreview(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer border border-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                
                {/* Item Card */}
                <div className="flex gap-4 p-4 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-100 flex-shrink-0">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow space-y-1.5">
                    <h3 className="font-bold text-slate-900 text-sm">{product.name}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] text-slate-500 font-semibold">Qty: {quantity}</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1">
                      <span className="text-xs text-slate-400">Unit: ₹{currentPrice}</span>
                      <span className="text-sm font-display font-black text-emerald-950">₹{currentPrice * quantity}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Logistics Box */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-slate-400 font-black uppercase tracking-widest text-[9px] px-1">
                    <span>Delivery Credentials</span>
                    <button 
                      onClick={() => router.push('/address')}
                      className="text-emerald-700 hover:underline cursor-pointer font-bold"
                    >
                      Alter Address
                    </button>
                  </div>
                  
                  <div className="flex gap-3 items-start p-5 bg-emerald-50/20 rounded-3xl border border-emerald-100/50">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xs text-emerald-700 flex-shrink-0 border border-emerald-100/50">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 text-xs">
                      <p className="font-black text-slate-900 uppercase tracking-wide">{user?.name || 'Guest Companion'}</p>
                      <p className="text-slate-500 font-medium leading-relaxed">
                        {userAddress?.street ? (
                          <>
                            {userAddress.street}, {userAddress.city},<br />
                            {userAddress.state} - {userAddress.zipCode}
                          </>
                        ) : (
                          <>No address set. Select to add shipping details.</>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dispatch Timer Alert */}
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/20 flex items-start gap-3">
                  <Truck className="w-5 h-5 text-amber-600 flex-shrink-0 animate-bounce mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-wider text-amber-900">Same-Day Nursery Dispatch</p>
                    <p className="text-[10px] text-amber-800/80 leading-relaxed font-semibold">
                      Order within 2 hours 14 mins to ensure fresh custom pick up tomorrow morning!
                    </p>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Price Summary */}
              <div className="p-6 border-t border-slate-100 space-y-4 bg-slate-50/50">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-semibold text-slate-500">
                    <span>Subtotal</span>
                    <span className="text-slate-800">₹{currentPrice * quantity}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-500">
                    <span>Nursery Vitality Packing</span>
                    <span className="text-emerald-700 font-bold uppercase tracking-wider text-[10px]">FREE</span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-500">
                    <span>Carbon-Neutral Shipping</span>
                    <span className="text-emerald-700 font-bold uppercase tracking-wider text-[10px]">FREE</span>
                  </div>
                  <div className="border-b border-slate-200/60 my-2" />
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-slate-800">Total Payable</span>
                    <span className="text-3xl font-display font-black text-emerald-955">₹{currentPrice * quantity}</span>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setShowCheckoutPreview(false)}
                    className="flex-1 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Hold Shop
                  </button>
                  <button 
                    onClick={handleProceedToCheckout}
                    className="flex-[2] bg-emerald-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-800 transition-all shadow-md shadow-emerald-700/20 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Proceed to checkout <ArrowRight className="w-4 h-4 text-emerald-300" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Submission Modal overlay */}
      <AnimatePresence>
        {showReviewForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReviewForm(false)}
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-3xl z-10"
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

      {/* Desktop Floating Action Bar (Right Side) */}
      <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-4">
        <motion.button 
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className="w-14 h-14 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-2xl shadow-lg flex items-center justify-center group cursor-pointer relative"
        >
          <ShoppingCart className="w-6 h-6 text-emerald-700" />
          <div className="absolute right-full mr-4 bg-slate-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Add to Cart
          </div>
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBuyNow}
          className="w-14 h-14 bg-emerald-700 text-white hover:bg-emerald-800 rounded-2xl shadow-lg shadow-emerald-700/20 flex items-center justify-center group cursor-pointer relative"
        >
          <ArrowRight className="w-6 h-6 text-emerald-300" />
          <div className="absolute right-full mr-4 bg-slate-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Buy Now
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setWishlisted(!wishlisted)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border shadow-lg group cursor-pointer relative ${
            wishlisted 
              ? 'bg-red-50 text-red-500 border-red-100' 
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Heart className={`w-6 h-6 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
          <div className="absolute right-full mr-4 bg-slate-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            {wishlisted ? 'Remove Favorite' : 'Add Favorite'}
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
          }}
          className="w-14 h-14 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 shadow-lg flex items-center justify-center group cursor-pointer relative"
        >
          <Share2 className="w-6 h-6 text-slate-400" />
          <div className="absolute right-full mr-4 bg-slate-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Share Plant
          </div>
        </motion.button>
      </div>

      {/* Mobile Sticky Quick-Purchase Bar (Always displayed at bottom when page is open) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/90 backdrop-blur-xl border-t border-slate-100 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-5 py-4 pb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-12 h-12 rounded-xl object-cover border border-slate-100 flex-shrink-0"
          />
          <div className="min-w-0 leading-tight">
            <h4 className="font-bold text-slate-900 truncate text-sm">{product.name}</h4>
            <p className="text-emerald-800 font-extrabold text-base">₹{product.price}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button 
            onClick={handleAddToCart}
            className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100/70 border border-emerald-200/50 px-5 py-3.5 rounded-2xl font-black uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer text-xs"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-700" /> <span className="hidden sm:inline">Add to Cart</span>
          </button>
          
          <motion.button 
            whileHover={{ scale: 1.03 }} 
            whileTap={{ scale: 0.97 }} 
            onClick={handleBuyNow}
            className="bg-emerald-700 text-white hover:bg-emerald-800 px-6 py-3.5 rounded-2xl font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-emerald-700/20 cursor-pointer text-xs"
          >
            Buy Now <ArrowRight className="w-4 h-4 text-emerald-300 animate-pulse" />
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setWishlisted(!wishlisted)}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all border flex-shrink-0 cursor-pointer ${
              wishlisted 
                ? 'bg-red-50 text-red-500 border-red-100 shadow-inner' 
                : 'bg-white border-slate-200 hover:bg-slate-50 shadow-xs'
            }`}
          >
            <Heart className={`w-4.5 h-4.5 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Botanical link copied to clipboard!");
            }}
            className="w-11 h-11 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 shadow-xs flex items-center justify-center flex-shrink-0 cursor-pointer"
          >
            <Share2 className="w-4.5 h-4.5 text-slate-400" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
