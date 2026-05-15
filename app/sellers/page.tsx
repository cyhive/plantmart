'use client';

import { motion } from 'motion/react';
import { 
  Store, 
  MapPin, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  Filter,
  Leaf,
  Phone,
  Globe,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Mock data for nurseries - expanded version of the home page data
const allNurseries = [
  { 
    id: '1', 
    name: 'Green Garden Nursery', 
    location: 'Bangalore, Karnataka', 
    rating: 4.9, 
    plants: 450, 
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600',
    description: 'Specializing in exotic indoor foliage and rare succulents. Our family-run nursery has been providing high-quality botanical specimens since 2012.',
    category: 'Premium',
    verified: true,
    tags: ['Indoor', 'Rare', 'Succulents']
  },
  { 
    id: '2', 
    name: 'Pure Air Botanicals', 
    location: 'Pune, Maharashtra', 
    rating: 4.8, 
    plants: 320, 
    image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=600',
    description: 'Breathe easy with our curated collection of air-purifying plants. We focus on health, vitality, and sustainable growing practices.',
    category: 'Eco-friendly',
    verified: true,
    tags: ['Air Purifying', 'Organic']
  },
  { 
    id: '3', 
    name: 'Tropical Haven', 
    location: 'Kochi, Kerala', 
    rating: 4.7, 
    plants: 280, 
    image: 'https://images.unsplash.com/photo-1599591037488-8a306485987a?auto=format&fit=crop&q=80&w=600',
    description: 'Bringing the lush beauty of the tropics to your doorstep. Large scale outdoor plants and landscape design experts.',
    category: 'Outdoor',
    verified: true,
    tags: ['Outdoor', 'Lush', 'Palm Trees']
  },
  { 
    id: '4', 
    name: 'Desert Bloom', 
    location: 'Jaipur, Rajasthan', 
    rating: 4.6, 
    plants: 150, 
    image: 'https://images.unsplash.com/photo-1520302630591-fd1c66ed11ef?auto=format&fit=crop&q=80&w=600',
    description: 'Cactus and succulent specialists. Unique drought-resistant plants that thrive in any climate.',
    category: 'Cactus',
    verified: false,
    tags: ['Cactus', 'Succulents']
  },
  { 
    id: '5', 
    name: 'Floral Fantasy', 
    location: 'Chandigarh, Punjab', 
    rating: 4.9, 
    plants: 600, 
    image: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&q=80&w=600',
    description: 'A riot of colors for your garden. Extensive collection of flowering annuals and perennials.',
    category: 'Flowering',
    verified: true,
    tags: ['Flowers', 'Garden']
  },
  { 
    id: '6', 
    name: 'The Herb Corner', 
    location: 'Chennai, Tamil Nadu', 
    rating: 4.5, 
    plants: 200, 
    image: 'https://images.unsplash.com/photo-1592150621344-c792307f0a21?auto=format&fit=crop&q=80&w=600',
    description: 'Fresh culinary and medicinal herbs. Grow your own kitchen garden with our organic starts.',
    category: 'Herbs',
    verified: true,
    tags: ['Organic', 'Herbs', 'Medicinal']
  }
];

export default function SellersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Premium', 'Eco-friendly', 'Outdoor', 'Cactus', 'Flowering', 'Herbs'];

  const filteredNurseries = allNurseries.filter(nursery => {
    const matchesSearch = nursery.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         nursery.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || nursery.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-32">
      {/* Immersive Header */}
      <section className="relative py-24 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#065f46_0%,transparent_50%)] opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,#047857_0%,transparent_50%)] opacity-30" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-white transition-colors font-bold text-sm group"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-emerald-600 transition-all">
                <ArrowRight className="w-4 h-4 rotate-180" />
              </div>
              Back to Home
            </Link>
          </motion.div>

          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 backdrop-blur-md rounded-full text-emerald-400 text-xs font-black uppercase tracking-widest border border-emerald-500/20"
            >
              <Store className="w-4 h-4" /> Verified Nurseries
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-black text-white tracking-tight leading-none"
            >
              Meet our <span className="text-emerald-500 italic">Botanical</span> Partners
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-lg font-medium"
            >
              We partner with the finest nurseries across the country to bring you healthy, 
              acclimatized plants delivered with expert care.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="glass p-8 rounded-[40px] shadow-2xl border border-white/40 flex flex-col lg:flex-row items-center gap-8">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by nursery name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-900"
            />
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full lg:w-auto pb-2 lg:pb-0">
            <Filter className="w-5 h-5 text-slate-400 hidden lg:block mr-2" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                    : 'bg-white text-slate-500 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sellers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filteredNurseries.length > 0 ? (
            filteredNurseries.map((nursery, i) => (
              <motion.div
                key={nursery.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-[48px] border border-slate-100 overflow-hidden hover:shadow-3xl transition-all duration-700 flex flex-col h-full"
              >
                {/* Visual Header */}
                <div className="relative h-64 overflow-hidden">
                  <img src={nursery.image} alt={nursery.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                  
                  {/* Category Tag */}
                  <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                    {nursery.category}
                  </div>

                  {/* Rating Bubble */}
                  <div className="absolute top-6 right-6 w-14 h-14 bg-white rounded-2xl flex flex-col items-center justify-center shadow-xl border border-slate-100">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-slate-900 font-black text-sm">{nursery.rating}</span>
                  </div>

                  <div className="absolute bottom-6 left-8 right-8">
                    <div className="flex items-center gap-2 mb-2">
                      {nursery.verified && (
                        <span className="bg-emerald-500 p-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </span>
                      )}
                      <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">
                        {nursery.verified ? 'Verified Expert' : 'Community Partner'}
                      </p>
                    </div>
                    <h3 className="text-2xl font-display font-black text-white tracking-tight">{nursery.name}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-grow space-y-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <p className="text-slate-500 font-bold">{nursery.location}</p>
                  </div>

                  <p className="text-slate-400 text-sm font-medium leading-relaxed italic line-clamp-3">
                    "{nursery.description}"
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {nursery.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold border border-slate-100">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-6 mt-auto border-t border-slate-50 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Catalog</p>
                      <p className="text-xl font-display font-black text-slate-900">{nursery.plants}+ Plants</p>
                    </div>
                    <Link 
                      href={`/sellers/${nursery.id}`}
                      className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-90"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center space-y-6">
              <div className="w-24 h-24 bg-slate-100 rounded-[40px] flex items-center justify-center mx-auto">
                <Leaf className="w-10 h-10 text-slate-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">No nurseries found</h3>
                <p className="text-slate-500 font-medium">Try adjusting your search or category filters.</p>
              </div>
              <button 
                onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
                className="text-emerald-600 font-black text-xs uppercase tracking-widest hover:underline"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Support Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <div className="bg-emerald-900 rounded-[60px] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-800 rounded-full blur-[120px] -mr-48 -mt-48 opacity-50" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="space-y-6 text-center lg:text-left max-w-xl">
              <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight leading-none">Want to sell on <br /><span className="text-emerald-500">PlantMart?</span></h2>
              <p className="text-emerald-100/60 text-lg font-medium">Join our network of verified nurseries and reach thousands of plant enthusiasts nationwide.</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Link href="/become-a-seller" className="bg-white text-emerald-950 px-10 py-5 rounded-[24px] font-black hover:bg-emerald-400 transition-all shadow-2xl active:scale-95">
                  Register Now
                </Link>
                <Link href="#" className="glass text-white px-10 py-5 rounded-[24px] font-bold border-white/20 hover:bg-white/10 transition-all">
                  How it Works
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 w-full lg:w-auto">
              {[
                { icon: <Phone />, title: '24/7 Support', desc: 'Expert help' },
                { icon: <Globe />, title: 'Pan India', desc: 'Wide reach' },
                { icon: <Clock />, title: 'Quick Payouts', desc: 'Secure bank transfers' },
                { icon: <Leaf />, title: 'Health First', desc: 'Quality guidelines' }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md p-6 rounded-[32px] border border-white/10 space-y-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{item.title}</h4>
                    <p className="text-emerald-100/40 text-[10px] font-black uppercase tracking-widest">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
