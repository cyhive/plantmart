'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Store, 
  MapPin, 
  CheckCircle2, 
  Star, 
  Leaf, 
  MessageSquare, 
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft,
  Calendar,
  Package,
  Award,
  Clock,
  ThumbsUp,
  Heart,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import SellerReviewForm from '@/components/seller/SellerReviewForm';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface Nursery {
  id: string;
  name: string;
  shopName: string;
  image: string;
  location: string;
  rating: number;
  plants: number;
  description: string;
  joinedDate: string;
  verified: boolean;
}

export default function NurseryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'plants' | 'reviews' | 'about'>('plants');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [openAboutAccordion, setOpenAboutAccordion] = useState<number | null>(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(3);
  
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  const [nursery, setNursery] = useState<Nursery | null>(null);
  const [plants, setPlants] = useState<any[]>([]);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const [sellerRes, plantsRes, reviewsRes] = await Promise.all([
          fetch(`/api/sellers/${id}`),
          fetch(`/api/catalog/products?sellerId=${id}`),
          fetch(`/api/sellers/${id}/reviews`)
        ]);

        if (sellerRes.ok) {
          const sellerData = await sellerRes.json();
          setNursery(sellerData.seller);
        }
        
        if (plantsRes.ok) {
          const plantsData = await plantsRes.json();
          setPlants(plantsData.products || []);
        }

        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(
            (reviewsData.reviews || []).map((r: any) => ({
              id: r._id,
              author: r.author,
              rating: r.rating,
              date: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              comment: r.comment
            }))
          );
        }
      } catch (err) {
        console.error('Failed to fetch seller details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSellerData();
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      fetch('/api/favorites')
        .then(res => res.json())
        .then(data => {
          if (data.favorites) {
            setFavorites(data.favorites.map((f: any) => f.productId));
          }
        })
        .catch(console.error);
    } else {
      setFavorites([]);
    }
  }, [user]);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!nursery) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-bold text-slate-800">Seller Not Found</h2>
      <Link href="/sellers" className="text-emerald-600 hover:underline">Return to Sellers</Link>
    </div>
  );

  const toggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    const isFavorite = favorites.includes(id);
    // Optimistic update
    setFavorites(prev => 
      isFavorite ? prev.filter(fId => fId !== id) : [...prev, id]
    );

    try {
      if (isFavorite) {
        await fetch(`/api/favorites/${id}`, { method: 'DELETE' });
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: id })
        });
      }
    } catch (err) {
      console.error('Failed to toggle favorite', err);
      // Revert on error
      setFavorites(prev => 
        isFavorite ? [...prev, id] : prev.filter(fId => fId !== id)
      );
    }
  };

  const handleReviewSubmit = (newReview: any) => {
    const formattedReview = {
      id: newReview._id || Date.now(),
      author: newReview.author,
      rating: newReview.rating,
      date: new Date(newReview.createdAt || new Date()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      comment: newReview.comment
    };
    setReviews([formattedReview, ...reviews]);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Immersive Header */}
      <div className="relative h-[45vh] overflow-hidden">
        <img src={nursery.image} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/40 to-transparent" />
        
        <div className="absolute inset-x-0 bottom-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-6">
               <button 
                onClick={() => router.back()}
                className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all mb-4"
               >
                 <ArrowLeft className="w-5 h-5" />
               </button>
               
               <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center text-emerald-700 text-4xl font-black shadow-2xl border border-white/20 overflow-hidden">
                     {nursery.shopName.charAt(0)}
                  </div>
                  <div className="space-y-2">
                     <div className="flex items-center gap-3">
                        <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight">{nursery.shopName}</h1>
                        <ShieldCheck className="w-8 h-8 text-emerald-400 fill-emerald-400/20" />
                     </div>
                     <div className="flex items-center gap-6 text-white/70 text-sm font-bold">
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-400" /> {nursery.location}</span>
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-emerald-400" /> Member since {nursery.joinedDate}</span>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="flex gap-4">
               <div className="glass px-8 py-4 rounded-[32px] text-center border-white/20">
                  <div className="flex items-center justify-center gap-1 text-amber-400">
                     <Star className="w-5 h-5 fill-amber-400" />
                     <span className="text-2xl font-black text-white">{averageRating}</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mt-1">Average Rating</p>
               </div>
               <div className="glass px-8 py-4 rounded-[32px] text-center border-white/20">
                  <div className="flex items-center justify-center gap-1 text-emerald-400">
                     <Leaf className="w-5 h-5" />
                     <span className="text-2xl font-black text-white">{nursery.plants}+</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mt-1">Varieties Sold</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Navigation Tabs */}
        <div className="flex bg-white p-2 rounded-[32px] border border-slate-100 w-fit mx-auto shadow-sm">
          {[
             { id: 'about', label: 'Our Story', icon: <Store className="w-4 h-4" /> },
            { id: 'plants', label: 'Catalog', icon: <Package className="w-4 h-4" /> },
            { id: 'reviews', label: 'Customer Voice', icon: <MessageSquare className="w-4 h-4" /> }
           
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-10 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'plants' && (
            <motion.div 
              key="plants"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
               <div className="flex items-end justify-between border-b-2 border-slate-100 pb-8">
                  <div className="space-y-2">
                     <h2 className="text-4xl font-display font-black text-slate-900 italic">Botanical Inventory</h2>
                     <p className="text-slate-500 font-medium italic">Hand-picked specimens currently in stock at {nursery.shopName}.</p>
                  </div>
                  <Link href="/plants" className="text-emerald-600 font-bold hover:underline flex items-center gap-2">Explore All <ChevronRight className="w-4 h-4" /></Link>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {plants.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-400 font-medium">This seller has no plants currently listed.</div>
                  ) : plants.map((plant) => (
                    <Link key={plant._id} href={`/plants/${plant._id}`}>
                      <motion.div 
                        whileHover={{ y: -6 }}
                        className="group bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 p-3 flex flex-col h-full"
                      >
                         <div className="relative aspect-square overflow-hidden rounded-[18px] bg-slate-50 mb-3 flex-shrink-0">
                            <img src={plant.images?.[0] || 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800'} alt={plant.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-emerald-900 border border-white">
                               {plant.category || 'Indoor'}
                            </div>
                            <button 
                               onClick={(e) => {
                                 e.preventDefault();
                                 e.stopPropagation();
                                 toggleFavorite(plant._id, e);
                               }}
                               className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all backdrop-blur-md shadow-md cursor-pointer border ${
                                 favorites?.includes(plant._id) 
                                   ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' 
                                   : 'bg-white/80 border-white/40 text-slate-400 hover:text-rose-500 hover:bg-white'
                               }`}
                            >
                              <Heart className={`w-3.5 h-3.5 ${favorites?.includes(plant._id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                            </button>
                         </div>
                         <div className="px-1.5 pb-2 space-y-2 flex flex-col justify-between flex-grow">
                            <div className="flex justify-between items-center gap-2">
                               <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">{plant.name}</h3>
                               <div className="text-lg font-display font-black text-emerald-900 flex-shrink-0">₹{plant.price}</div>
                            </div>
                            <div className="flex items-center gap-0.5 text-amber-400">
                               {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                            </div>
                         </div>
                         <div className="px-1.5 pt-3 mt-auto border-t border-slate-100 flex items-center gap-2">
                           <button 
                             onClick={(e) => {
                               e.preventDefault();
                               e.stopPropagation();
                               if (!user) { router.push('/login'); return; }
                               addItem({
                                 id: plant._id,
                                 name: plant.name,
                                 price: plant.price,
                                 image: plant.images?.[0] || '',
                                 quantity: 1,
                                 seller: { name: nursery.name, shopName: nursery.shopName }
                               });
                             }}
                             className="flex-1 bg-emerald-50 text-emerald-700 py-2 rounded-xl text-[10px] sm:text-xs font-bold hover:bg-emerald-100 hover:text-emerald-800 transition-colors flex items-center justify-center gap-1 border border-emerald-500/10 cursor-pointer"
                           >
                             <ShoppingBag className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Add to Cart</span><span className="sm:hidden">Add</span>
                           </button>
                           <button 
                             onClick={(e) => {
                               e.preventDefault();
                               e.stopPropagation();
                               if (!user) { router.push('/login'); return; }
                               addItem({
                                 id: plant._id,
                                 name: plant.name,
                                 price: plant.price,
                                 image: plant.images?.[0] || '',
                                 quantity: 1,
                                 seller: { name: nursery.name, shopName: nursery.shopName }
                               });
                               router.push('/cart');
                             }}
                             className="flex-1 bg-slate-900 text-white py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1 shadow-md cursor-pointer"
                           >
                             Buy <span className="hidden sm:inline">Now</span>
                           </button>
                         </div>
                      </motion.div>
                    </Link>
                  ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div 
              key="reviews"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
               <div className="lg:col-span-2 space-y-8">
                  {reviews.slice(0, visibleReviewsCount).map((review) => (
                    <div key={review.id} className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-6">
                       <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                             <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-700 font-bold text-xl shadow-inner">
                                {review.author.charAt(0)}
                             </div>
                             <div>
                                <p className="text-lg font-bold text-slate-900">{review.author}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{review.date}</p>
                             </div>
                          </div>
                          <div className="flex text-amber-400">
                             {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400' : 'text-slate-200'}`} />)}
                          </div>
                       </div>
                       <p className="text-slate-600 text-lg leading-relaxed font-medium italic">"{review.comment}"</p>
                       <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                          <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors">
                             <ThumbsUp className="w-4 h-4" /> Helpful (12)
                          </button>
                       </div>
                    </div>
                  ))}
                  {visibleReviewsCount < reviews.length && (
                     <button 
                       onClick={() => setVisibleReviewsCount(prev => prev + 3)}
                       className="w-full py-4 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors border-2 border-slate-100 rounded-2xl hover:border-slate-200 border-dashed cursor-pointer"
                     >
                       Load More Reviews
                     </button>
                   )}
               </div>

               <div className="space-y-8">
                  <div className="bg-slate-900 p-10 rounded-[48px] text-white space-y-8 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full group-hover:bg-emerald-500/20 transition-colors" />
                     <div className="space-y-4 relative z-10">
                        <Award className="w-12 h-12 text-emerald-400" />
                        <h3 className="text-3xl font-display font-bold">Trusted Expert</h3>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed italic">This nursery has maintained a {averageRating} rating from our community.</p>
                     </div>
                     <button 
                        onClick={() => {
                          if (!user) {
                            router.push('/login');
                            return;
                          }
                          setShowReviewForm(true);
                        }}
                        className="w-full bg-white text-slate-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-lg hover:shadow-emerald-500/30"
                     >
                        Write a Review
                     </button>
                  </div>
                  
                  <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-6">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Service Excellence</h4>
                     <div className="space-y-6">
                        {[
                          { label: 'Response Time', value: '< 2 hours', icon: <Clock className="w-4 h-4" /> },
                          { label: 'Plant Quality', value: '4.9 / 5.0', icon: <Leaf className="w-4 h-4" /> },
                          { label: 'Packaging', value: 'Excellent', icon: <Package className="w-4 h-4" /> }
                        ].map((stat, i) => (
                          <div key={i} className="flex items-center justify-between">
                             <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                                {stat.icon} {stat.label}
                             </div>
                             <span className="text-sm font-black text-slate-900">{stat.value}</span>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div 
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
            >
               <div className="space-y-10">
                  <div className="space-y-6">
                     <span className="text-emerald-600 text-xs font-black uppercase tracking-[0.4em]">Establishment Details</span>
                     <h2 className="text-5xl font-display font-black text-slate-900 tracking-tight leading-tight italic">Rooted in <br/><span className="text-emerald-600">Excellence</span></h2>
                     <p className="text-slate-600 text-xl font-medium leading-relaxed italic">"{nursery.description}"</p>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      {
                        title: "Our Botanical Heritage",
                        content: "Founded over a decade ago, our nursery has been a pioneer in sustainable tropical cultivation. We specialize in rare indoor species and high-health foliage, ensuring every plant that leaves our care is ready to thrive in your home.",
                        icon: <Award className="w-5 h-5" />
                      },
                      {
                        title: "Eco-Conscious Practices",
                        content: "We use 100% organic fertilizers and integrated pest management systems. Our watering protocols utilize recycled rainwater, reducing our environmental footprint while producing stronger, more resilient plants.",
                        icon: <Leaf className="w-5 h-5" />
                      },
                      {
                        title: "Delivery & Guarantee",
                        content: "Every plant is secured in our custom eco-packaging and includes a 7-day health guarantee. We provide direct consultation for the first 30 days to ensure your new botanical companion settles in perfectly.",
                        icon: <ShieldCheck className="w-5 h-5" />
                      }
                    ].map((item, i) => (
                      <div 
                        key={i}
                        className={`group rounded-[32px] border transition-all duration-500 overflow-hidden ${
                          openAboutAccordion === i 
                            ? 'bg-white border-emerald-200 shadow-xl shadow-emerald-500/5' 
                            : 'bg-white/50 border-slate-100 hover:border-emerald-200'
                        }`}
                      >
                        <button
                          onClick={() => setOpenAboutAccordion(openAboutAccordion === i ? null : i)}
                          className="w-full px-8 py-6 flex items-center justify-between text-left"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                              openAboutAccordion === i ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                              {item.icon}
                            </div>
                            <span className={`text-lg font-bold transition-colors duration-300 ${openAboutAccordion === i ? 'text-emerald-700' : 'text-slate-900'}`}>
                              {item.title}
                            </span>
                          </div>
                          <ChevronRight className={`w-5 h-5 transition-all duration-500 ${
                            openAboutAccordion === i ? 'rotate-90 text-emerald-500' : 'text-slate-300 group-hover:text-emerald-400'
                          }`} />
                        </button>
                        
                        <AnimatePresence>
                          {openAboutAccordion === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                              <div className="px-8 pb-8 pl-22">
                                <p className="text-slate-500 text-lg leading-relaxed italic">
                                  {item.content}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
               
               <div className="relative">
                  <div className="aspect-square rounded-[80px] overflow-hidden border-8 border-white shadow-2xl relative z-10 group">
                     <img src={nursery.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                     <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
                  </div>
                  <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full" />
                  <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full" />
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

       {/* Review Modal */}
       <AnimatePresence>
          {showReviewForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowReviewForm(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl z-10"
              >
                <SellerReviewForm 
                  sellerId={nursery.id}
                  sellerName={nursery.shopName} 
                  userName={user?.name || user?.shopName || 'You'}
                  onClose={() => setShowReviewForm(false)}
                  onSubmitSuccess={handleReviewSubmit}
                />
              </motion.div>
            </div>
          )}
       </AnimatePresence>
    </div>
  );
}
