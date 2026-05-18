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
  ThumbsUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import SellerReviewForm from '@/components/seller/SellerReviewForm';

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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'plants' | 'reviews' | 'about'>('plants');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [openAboutAccordion, setOpenAboutAccordion] = useState<number | null>(0);
  const [reviews, setReviews] = useState([
    { id: 1, author: 'Priya S.', rating: 5, date: 'October 12, 2025', comment: 'Absolutely beautiful plant! Arrived in perfect condition and the packaging was very secure. Highly recommend this nursery.' },
    { id: 2, author: 'Rahul K.', rating: 4, date: 'September 28, 2025', comment: 'Healthy plant, but it took a bit longer to arrive than expected. Otherwise, very happy with the purchase.' },
    { id: 3, author: 'Anita M.', rating: 5, date: 'September 15, 2025', comment: 'Thriving beautifully in my living room. The care instructions provided were very helpful for a beginner like me.' },
  ]);
  const mockNurseries: Record<string, Nursery> = {
    '1': { 
      id: '1', 
      name: 'Green Garden', 
      shopName: 'Green Garden Nursery', 
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1200',
      location: 'Pune, Maharashtra',
      rating: 4.8,
      plants: 1200,
      description: 'Specializing in exotic indoor foliage and rare succulents. Our family-run nursery has been providing high-quality botanical specimens since 2012. We pride ourselves on our sustainable growing practices and healthy plant guarantees.',
      joinedDate: 'Jan 2024',
      verified: true
    },
    '2': { 
      id: '2', 
      name: 'Air Purifiers', 
      shopName: 'Pure Air Nursery', 
      image: 'https://images.unsplash.com/photo-1592150621344-82d439ec42f2?auto=format&fit=crop&q=80&w=1200',
      location: 'Bangalore, KA',
      rating: 4.9,
      plants: 850,
      description: 'Dedicated to helping city dwellers breathe better. We curate the best NASA-approved air-purifying plants for urban homes. Every plant comes with a specialized care guide tailored for the Indian climate.',
      joinedDate: 'Mar 2024',
      verified: true
    },
    '3': { 
      id: '3', 
      name: 'Tree Experts', 
      shopName: 'Expert Tree Farm', 
      image: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&q=80&w=1200',
      location: 'Delhi, NCR',
      rating: 4.7,
      plants: 2400,
      description: 'The largest collection of fruit trees and ornamental outdoor plants in the NCR region. We provide professional landscaping consultations and high-yield grafts for garden enthusiasts.',
      joinedDate: 'Feb 2024',
      verified: true
    }
  };

  const nursery = mockNurseries[id as string] || mockNurseries['1'];

  const mockPlants = [
    { id: '1', name: 'Monstera Deliciosa', price: 1299, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800', category: 'Indoor' },
    { id: '2', name: 'Snake Plant', price: 899, image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bbc?auto=format&fit=crop&q=80&w=800', category: 'Indoor' },
    { id: '4', name: 'Peace Lily', price: 699, image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&q=80&w=800', category: 'Indoor' }
  ];

  const handleReviewSubmit = (newReview: any) => {
    setReviews([newReview, ...reviews]);
    // Close form after a short delay (handled in component or here)
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

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
                     <span className="text-2xl font-black text-white">{nursery.rating}</span>
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
                  {mockPlants.map((plant) => (
                    <Link key={plant.id} href={`/plants/${plant.id}`}>
                      <motion.div 
                        whileHover={{ y: -6 }}
                        className="group bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 p-3 flex flex-col h-full"
                      >
                         <div className="relative aspect-square overflow-hidden rounded-[18px] bg-slate-50 mb-3 flex-shrink-0">
                            <img src={plant.image} alt={plant.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-emerald-900 border border-white">
                               {plant.category}
                            </div>
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
                  {reviews.map((review) => (
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
               </div>

               <div className="space-y-8">
                  <div className="bg-slate-900 p-10 rounded-[48px] text-white space-y-8 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full group-hover:bg-emerald-500/20 transition-colors" />
                     <div className="space-y-4 relative z-10">
                        <Award className="w-12 h-12 text-emerald-400" />
                        <h3 className="text-3xl font-display font-bold">Trusted Expert</h3>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed italic">This nursery has maintained a 4.5+ rating for over 12 consecutive months.</p>
                     </div>
                     <button 
                        onClick={() => setShowReviewForm(true)}
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
                  sellerName={nursery.shopName} 
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
