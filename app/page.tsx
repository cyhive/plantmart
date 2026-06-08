'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, ArrowRight, Truck, ShieldCheck, Zap, Star, Quote, Mail, ShoppingBag, Store, MapPin, CheckCircle2, Droplets, Sun, Wind, Home, Trees, Sprout, HeartPulse, Box, Heart, Tag, Gift, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { CatalogProductsSection } from '@/components/home/CatalogProductsSection';

// Hero Slides data
const heroSlides = [
  {
    tag: 'New Season Sale: 20% OFF',
    title: 'Breathable',
    highlight: 'Living Spaces',
    desc: 'Curating the finest greenery from verified nurseries. Elevate your home with plants that tell a story.',
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=800',
    color: 'emerald'
  },
  {
    tag: 'Flash Sale: 50% OFF',
    title: 'Indoor',
    highlight: 'Sanctuary',
    desc: 'Transform your bedroom into a tropical paradise with our hard-to-kill indoor collection.',
    image: 'https://images.unsplash.com/photo-1512428813824-f7139c82b346?auto=format&fit=crop&q=80&w=800',
    color: 'teal'
  },
  {
    tag: 'Rare Arrivals',
    title: 'Exotic',
    highlight: 'Botanicals',
    desc: 'Limited edition variegated plants for the serious collector. Hand-delivered with extreme care.',
    image: 'https://images.unsplash.com/photo-1597055181300-e3633a207519?auto=format&fit=crop&q=80&w=800',
    color: 'lime'
  },
  {
    tag: 'Free Shipping',
    title: 'Garden',
    highlight: 'To Door',
    desc: 'Get free express shipping on all orders over â‚¹2000. Fresh plants, delivered straight to your doorstep.',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    color: 'green'
  }
];

// nurseries state will be fetched dynamically

const careTips = [
  { icon: <Droplets className="w-6 h-6" />, title: "Watering Wisdom", desc: "Most plants prefer to dry out slightly between waterings. Use the finger test!" },
  { icon: <Sun className="w-6 h-6" />, title: "Light Lessons", desc: "Bright indirect light is the gold standard for most indoor tropicals." },
  { icon: <Wind className="w-6 h-6" />, title: "Air & Humidity", desc: "Group plants together to create a natural microclimate with higher humidity." },
];

const categories = [
  { name: 'Indoor Plants', slug: 'Indoor', icon: <Home className="w-14 h-14" />, count: 120, color: 'bg-emerald-500/10 text-emerald-600' },
  { name: 'Outdoor Plants', slug: 'Outdoor', icon: <Trees className="w-14 h-14" />, count: 85, color: 'bg-green-500/10 text-green-600' },
  { name: 'Succulents', slug: 'Succulents', icon: <Sprout className="w-14 h-14" />, count: 45, color: 'bg-teal-500/10 text-teal-600' },
  { name: 'Medicinal', slug: 'Medicinal', icon: <HeartPulse className="w-14 h-14" />, count: 30, color: 'bg-rose-500/10 text-rose-600' },
  { name: 'Pots & Tools', slug: 'Pots', icon: <Box className="w-14 h-14" />, count: 60, color: 'bg-amber-500/10 text-amber-600' },
];

const testimonials = [
  { name: 'Sarah J.', role: 'Plant Enthusiast', text: 'The quality of the plants I received was exceptional. They were packaged so carefully!', stars: 5 },
  { name: 'Michael R.', role: 'Interior Designer', text: 'PlantMart has become my go-to for all my client projects. The variety is unmatched.', stars: 5 },
  { name: 'Elena D.', role: 'New Hobbyist', text: 'Great customer support and very healthy plants. Highly recommend for beginners!', stars: 4 },
];

const offerStyles = [
  { color: 'emerald', icon: <Tag className="w-10 h-10" />, badge: 'Limited Time' },
  { color: 'blue', icon: <Gift className="w-10 h-10" />, badge: 'Special' },
  { color: 'amber', icon: <Sparkles className="w-10 h-10" />, badge: 'Top Deal' }
];

export default function HomePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [topNurseries, setTopNurseries] = useState<any[]>([]);
  const { addItem } = useCart();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  useEffect(() => {
    fetch('/api/offers').then(res => res.json()).then(data => {
      if (data.promotions) {
        setPromotions(data.promotions.slice(0, 3));
      }
    }).catch(console.error);

    fetch('/api/sellers').then(res => res.json()).then(data => {
      if (data.sellers) {
        setTopNurseries(data.sellers);
      }
    }).catch(console.error);
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative min-h-[700px] flex items-center overflow-hidden mesh-gradient">
        <div className="absolute inset-0 bg-slate-900/40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative pt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col lg:flex-row items-center justify-between gap-16"
            >
              <div className="text-center lg:text-left space-y-10 lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-bold border border-white/20 shadow-xl"
                >
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="tracking-wider uppercase">{slide.tag}</span>
                </motion.div>

                <div className="space-y-4">
                  <motion.h1
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-7xl md:text-9xl font-display font-black text-white leading-[0.85] tracking-tighter"
                  >
                    {slide.title} <br />
                    <span className={`text-${slide.color}-400 italic font-serif`}>{slide.highlight}</span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-emerald-50/70 text-xl max-w-lg font-medium leading-relaxed"
                  >
                    {slide.desc}
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-5 justify-center lg:justify-start pt-4"
                >
                  <Link href="/plants" className="bg-emerald-500 text-white px-10 py-5 rounded-[24px] font-bold flex items-center gap-2 hover:bg-emerald-400 hover:text-emerald-950 transition-all shadow-2xl shadow-emerald-500/40 hover:-translate-y-1 group">
                    Shop Collection <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                  {/* <Link href="/about" className="glass text-white px-10 py-5 rounded-[24px] font-bold hover:bg-white/20 transition-all text-center">
                    Our Story
                  </Link> */}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="lg:w-1/2 relative flex justify-center"
              >
                <div className="relative group">
                  <div className={`absolute inset-0 bg-${slide.color}-500/20 blur-[120px] rounded-full group-hover:bg-${slide.color}-400/30 transition-colors duration-1000`} />
                  <div className="relative z-10 p-4 bg-white/5 rounded-[96px] backdrop-blur-sm border border-white/10 shadow-2xl">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-[280px] h-[350px] md:w-[400px] md:h-[500px] object-cover rounded-[70px] shadow-2xl border-4 border-white/20 transform group-hover:scale-[1.02] transition-transform duration-700"
                    />
                  </div>

                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-10 -left-10 glass p-8 rounded-[32px] z-20 hidden md:block border border-white/20 shadow-2xl"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <Leaf className="text-white w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-emerald-950 font-black text-lg">100% Organic</p>
                        <p className="text-emerald-800/60 text-xs font-black tracking-widest uppercase">Nursery Fresh</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -top-10 -right-10 glass p-6 rounded-[28px] z-20 hidden md:block border border-white/20 shadow-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                          </div>
                        ))}
                      </div>
                      <div className="text-xs font-bold text-slate-800">
                        Joined by <span className="text-emerald-600">50k+</span> parents
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 transition-all duration-500 rounded-full ${currentSlide === i ? 'w-12 bg-emerald-400' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promotions & Offers Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div className="space-y-2">
      <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Exclusive Offers</h2>
      <p className="text-slate-500 text-base font-medium">Grab these botanical deals before they vanish!</p>
    </div>
    <Link href="/offers" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
      View All Offers & Discounts <ArrowRight className="w-5 h-5" />
    </Link>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {promotions.length === 0 ? (
      <div className="col-span-3 text-center py-10 text-slate-400">No exclusive offers at the moment.</div>
    ) : promotions.map((promo, i) => {
      const style = offerStyles[i % offerStyles.length];
      return (
      <motion.div
        key={promo.id}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        className="group relative p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 bg-white overflow-hidden"
      >
        {/* Background Accent - Scaled down */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${style.color}-500/5 rounded-full blur-[60px] -mr-16 -mt-16 group-hover:bg-${style.color}-500/10 transition-colors`} />
        
        <div className="relative z-10 space-y-5">
          <div className="flex items-start justify-between">
            {/* Icon - Scaled from 20 to 14 */}
            <div className={`w-14 h-14 bg-${style.color}-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-${style.color}-600/20 group-hover:scale-105 transition-all duration-500`}>
              {style.icon}
            </div>
            <div className={`px-3 py-1 bg-${style.color}-50 rounded-full text-${style.color}-700 text-[9px] font-black uppercase tracking-widest border border-${style.color}-100`}>
              {style.badge}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-display font-black text-slate-900 leading-tight">
              {promo.title} <br />
              <span className={`text-${style.color}-600`}>{promo.discountPercentage}% OFF</span>
            </h3>
            <p className="text-slate-500 text-xs font-medium leading-relaxed italic line-clamp-2">{promo.description}</p>
          </div>

          <div className="pt-4 border-t border-slate-50">
            <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white transition-all">
              <div className="px-3">
                <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest block">Code</span>
                <span className="text-base font-display font-black text-slate-900 tracking-wider">{promo.code}</span>
              </div>
              <button 
                onClick={() => handleCopyCode(promo.code)}
                className={`relative px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  copiedCode === promo.code 
                    ? 'bg-emerald-500 text-white' 
                    : `bg-slate-900 text-white hover:bg-${style.color}-600`
                }`}
              >
                <AnimatePresence mode="wait">
                  {copiedCode === promo.code ? (
                    <motion.span key="copied" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Copied
                    </motion.span>
                  ) : (
                    <motion.span key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      Copy
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )})}
  </div>
</section>
      <CatalogProductsSection />

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Truck />, title: "Safe Delivery", desc: "Eco-friendly packaging" },
            { icon: <ShieldCheck />, title: "Verified Sellers", desc: "Hand-picked nurseries" },
            { icon: <Leaf />, title: "Healthy Plants", desc: "7-day health guarantee" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group p-10 bg-white rounded-[48px] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-emerald-100 transition-all duration-500"
            >
              <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 mb-8 shadow-inner">
                <div className="text-emerald-600 w-10 h-10">{feature.icon}</div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 text-lg font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <h2 className="text-5xl font-display font-bold text-slate-900 tracking-tight">Explore Categories</h2>
            <p className="text-slate-500 text-xl font-medium">Find the perfect match for your space</p>
          </div>
          <Link href="/plants" className="inline-flex items-center gap-3 text-emerald-600 font-bold hover:gap-5 transition-all text-lg">
            Browse All Collection <ArrowRight className="w-6 h-6" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {categories.map((cat, i) => (
            <Link href={`/plants?category=${cat.slug}`} key={cat.name} className="block group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="glass p-10 rounded-[48px] text-center cursor-pointer transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_32px_64px_-16px_rgba(16,185,129,0.1)] border-white/40 relative z-10 overflow-hidden">
                  {/* Accent Glow */}
                  <div className={`absolute -top-10 -right-10 w-32 h-32 ${cat.color} opacity-20 blur-[40px] group-hover:opacity-40 transition-opacity duration-500`} />

                  <div className="relative z-20 space-y-6">
                    <div className={`w-24 h-24 mx-auto ${cat.color} rounded-3xl flex items-center justify-center text-5xl shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      {cat.icon}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-slate-900 text-xl tracking-tight">{cat.name}</h4>
                      <p className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em] mt-2 opacity-60 group-hover:opacity-100 transition-opacity">{cat.count}+ Varieties</p>
                    </div>
                  </div>
                </div>

                {/* Shadow/Glow effect behind the card */}
                <div className="absolute inset-x-8 -bottom-2 h-10 bg-emerald-500/5 blur-2xl -z-10 group-hover:bg-emerald-500/10 transition-colors" />
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Meet Top Nurseries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h2 className="text-5xl font-display font-bold text-slate-900 tracking-tight">Top Rated Nurseries</h2>
            <p className="text-slate-500 text-lg font-medium max-w-xl">Buying from local experts ensures you get plants adapted to your climate.</p>
          </div>
          <Link href="/sellers" className="text-emerald-600 font-bold hover:underline flex items-center gap-2 group">
            View All Sellers 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topNurseries.map((nursery, i) => (
            <Link key={nursery.name} href={`/sellers/${nursery.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-[48px] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 h-full"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={nursery.image} alt={nursery.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-8 right-8 text-white space-y-1">
                    <h3 className="text-2xl font-bold">{nursery.name}</h3>
                    <div className="flex items-center gap-4 text-xs font-bold text-emerald-300">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {nursery.location}</span>
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Verified</span>
                    </div>
                  </div>
                </div>
                <div className="p-8 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Inventory</p>
                    <p className="text-xl font-display font-black text-slate-900">{nursery.plants}+ Plants</p>
                  </div>
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex flex-col items-center justify-center border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 group-hover:text-white group-hover:fill-white" />
                    <span className="text-emerald-700 font-black text-sm group-hover:text-white">{nursery.rating}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Plant Care Section */}
      <section className="relative py-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,#10b981_0%,transparent_50%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <span className="text-emerald-400 text-xs font-black uppercase tracking-[0.3em]">Botanical Basics</span>
              <h2 className="text-5xl md:text-7xl font-display font-black text-white leading-tight tracking-tighter">Your Guide to <br /><span className="text-emerald-500">Plant Mastery</span></h2>
              <p className="text-slate-400 text-xl font-medium leading-relaxed">Don't just buy a plant, grow a companion. Our experts share everything you need to know.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {careTips.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 p-8 rounded-[32px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-default"
                >
                  <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-inner">
                    {tip.icon}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-white">{tip.title}</h4>
                    <p className="text-slate-400 font-medium">{tip.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link href="/care-journal" className="bg-white text-slate-900 px-10 py-5 rounded-[24px] font-black hover:bg-emerald-500 hover:text-white transition-all inline-block">Read Care Journal</Link>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-[80px] overflow-hidden border-8 border-white/10 relative z-10 group">
              <img src="https://images.unsplash.com/photo-1512428813824-f7139c82b346?auto=format&fit=crop&q=80&w=800" alt="Plant Care" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-12 left-12 right-12">
                <div className="glass p-8 rounded-[32px] border-white/20">
                  <p className="text-white text-lg font-bold italic">"Plants don't just grow, they flourish when they feel loved."</p>
                  <p className="text-emerald-400 text-xs font-black uppercase tracking-widest mt-4">â€” Dr. Greenleaf</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-display font-bold text-slate-900">What Our Gardeners Say</h2>
          <p className="text-slate-500 text-lg font-medium">Join 50,000+ happy plant parents</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="glass p-10 rounded-[40px] space-y-6 border border-white relative shadow-sm hover:shadow-2xl transition-all"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-emerald-100 -z-10" />
              <div className="flex gap-1">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className={`w-4 h-4 ${idx < t.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                ))}
              </div>
              <p className="text-slate-700 text-lg font-medium leading-relaxed italic">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center font-black text-emerald-700">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>


      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mesh-gradient rounded-[60px] p-12 md:p-24 relative overflow-hidden text-center space-y-10 border-4 border-white/10 shadow-2xl">
          <div className="absolute inset-0 bg-emerald-900/60 pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} className="w-20 h-20 bg-emerald-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/40 rotate-12">
              <Mail className="text-white w-10 h-10" />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight">Keep the Green Growing</h2>
            <p className="text-emerald-100/70 text-xl max-w-2xl mx-auto font-medium">Join our newsletter for weekly plant care tips, exclusive discounts, and new arrival alerts.</p>
          </div>

          <form className="relative z-10 max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-grow px-8 py-5 rounded-[24px] bg-white/10 backdrop-blur-md border-2 border-white/10 text-white placeholder:text-emerald-200/50 focus:bg-white focus:text-slate-900 focus:border-white transition-all outline-none font-bold"
            />
            <button className="bg-white text-emerald-900 px-10 py-5 rounded-[24px] font-extrabold hover:bg-emerald-400 hover:text-emerald-950 transition-all shadow-xl active:scale-95">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
