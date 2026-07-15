'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Droplets, 
  Sun, 
  Wind, 
  Sprout, 
  Search, 
  ArrowRight, 
  Clock, 
  User, 
  Bookmark,
  Share2,
  ChevronRight,
  Leaf,
  Bug,
  ThermometerSun,
  Hammer
} from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Link from 'next/link';
import Image from 'next/image';

const journalCategories = [
  { id: 'all', name: 'All Guides', icon: <Leaf className="w-5 h-5" /> },
  { id: 'watering', name: 'Watering', icon: <Droplets className="w-5 h-5" /> },
  { id: 'sunlight', name: 'Sunlight', icon: <Sun className="w-5 h-5" /> },
  { id: 'pest-control', name: 'Pest Control', icon: <Bug className="w-5 h-5" /> },
  { id: 'propagation', name: 'Propagation', icon: <Sprout className="w-5 h-5" /> },
  { id: 'repotting', name: 'Repotting', icon: <Hammer className="w-5 h-5" /> },
];

export default function CareJournalPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/care-journals')
      .then(res => res.json())
      .then(data => {
        if (data.journals) {
          setArticles(data.journals);
        }
      })
      .catch(console.error);
  }, []);

  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = articles.find(a => a.featured);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <Breadcrumbs items={[{ label: 'Care Journal', href: '/care-journal' }]} />

      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] rounded-[60px] overflow-hidden group">
        {featuredArticle?.image && (
          <Image src={featuredArticle.image} 
            alt={featuredArticle?.title || 'Featured'} 
            className="object-cover transition-transform duration-1000 group-hover:scale-105" fill />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <span className="px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Featured Article</span>
            <span className="text-white/60 text-xs font-bold">{featuredArticle?.createdAt ? new Date(featuredArticle.createdAt).toLocaleDateString() : ''}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-display font-black text-white tracking-tighter max-w-4xl leading-tight"
          >
            {featuredArticle?.title}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-8 pt-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold">{featuredArticle?.author}</span>
            </div>
            <div className="flex items-center gap-3 text-white/60">
              <Clock className="w-5 h-5" />
              <span className="font-bold">{featuredArticle?.readTime}</span>
            </div>
            <Link href={`/care-journal/${featuredArticle?.id}`} className="ml-auto bg-white text-slate-900 px-8 py-4 rounded-[24px] font-black hover:bg-emerald-500 hover:text-white transition-all shadow-2xl flex items-center gap-2 group/btn">
              Read Article <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="relative group max-w-md w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search guides, tips, and hacks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent rounded-[32px] py-4 pl-16 pr-6 focus:bg-white focus:border-emerald-500/20 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all font-medium text-lg"
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
            {journalCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' 
                    : 'bg-white border border-slate-100 text-slate-500 hover:border-emerald-200 hover:text-emerald-600'
                }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredArticles.map((article, i) => (
            <motion.article
              key={article.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white rounded-[48px] border border-slate-100 overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <Image src={article.image} 
                  alt={article.title} 
                  className="object-cover group-hover:scale-110 transition-transform duration-1000" fill />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 glass rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-900 border-white/40">
                    {article.category}
                  </span>
                </div>
                <button className="absolute top-6 right-6 w-10 h-10 glass rounded-full flex items-center justify-center hover:scale-110 transition-all text-slate-700 border-white/40">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>

              <div className="p-10 flex-grow flex flex-col space-y-6">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> {article.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> {article.readTime}
                  </div>
                </div>

                <Link href={`/care-journal/${article.id}`}>
                  <h3 className="text-2xl font-display font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">
                    {article.title}
                  </h3>
                </Link>

                <p className="text-slate-500 font-medium line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>

                <div className="pt-6 border-t border-slate-50 mt-auto flex items-center justify-between">
                  <Link 
                    href={`/care-journal/${article.id}`}
                    className="text-emerald-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 group/link"
                  >
                    Read More <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                  <button className="text-slate-400 hover:text-emerald-600 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </section>

      {/* Newsletter / CTA */}
      <section className="pt-16">
        <div className="mesh-gradient rounded-[60px] p-12 md:p-24 relative overflow-hidden text-center space-y-8 border-4 border-white/10 shadow-2xl">
          <div className="absolute inset-0 bg-emerald-900/40 pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight">Never Miss a Leafy Update</h2>
            <p className="text-emerald-50/70 text-xl max-w-2xl mx-auto font-medium">Join 20,000+ plant parents who receive our best care tips directly in their inbox every Sunday.</p>
          </div>
          
          <div className="relative z-10 max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Your botanical email..." 
              className="flex-grow px-8 py-5 rounded-[24px] bg-white/10 backdrop-blur-md border-2 border-white/10 text-white placeholder:text-emerald-100/50 focus:bg-white focus:text-slate-900 focus:border-white transition-all outline-none font-bold"
            />
            <button className="bg-white text-emerald-900 px-10 py-5 rounded-[24px] font-extrabold hover:bg-emerald-400 hover:text-emerald-950 transition-all shadow-xl active:scale-95">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
