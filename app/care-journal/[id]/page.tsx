'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft,
  Clock, 
  User, 
  Share2,
  Bookmark,
  Calendar,
  Twitter,
  Facebook,
  Link2,
  ChevronLeft,
  Check
} from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function JournalEntryPage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article?.title || '')}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Reading progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    fetch(`/api/care-journals/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.journal) {
          setArticle(data.journal);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-display font-black text-slate-900 mb-4">Article Not Found</h1>
          <p className="text-slate-500 mb-8">The botanical guide you're looking for was not found.</p>
          <Link href="/care-journal" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700">
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-stone-50 pb-32 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-600 origin-left z-50 rounded-r-full"
        style={{ scaleX }}
      />

      {/* Modern Split-ish Header / Floating Image */}
      <header className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Back Button */}
        <div className="absolute top-6 left-4 sm:top-8 sm:left-6 lg:left-8">
          <Link href="/care-journal" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50 transition-all text-sm font-bold shadow-sm">
            <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back to Journal</span><span className="sm:hidden">Back</span>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl w-full z-10 mt-4 sm:mt-0"
        >
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <span className="text-emerald-700 font-bold tracking-widest uppercase text-xs">
              {article.category}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
            <span className="text-stone-500 font-medium text-sm flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black text-stone-900 tracking-tight leading-[1.1] mb-8 break-words">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-y-4 gap-x-6 mt-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] sm:text-xs text-stone-400 font-bold uppercase">Written by</p>
                <p className="text-stone-900 font-bold text-sm sm:text-base line-clamp-1">{article.author}</p>
              </div>
            </div>
            <div className="w-px h-8 bg-stone-300 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] sm:text-xs text-stone-400 font-bold uppercase">Read Time</p>
                <p className="text-stone-900 font-bold text-sm sm:text-base whitespace-nowrap">{article.readTime}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Featured Image - Offset & Floating */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 lg:-mt-16 relative z-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative aspect-video w-full rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl border-8 border-white bg-stone-100"
        >
          <Image 
            src={article.image} 
            alt={article.title} 
            fill 
            className="object-cover hover:scale-105 transition-transform duration-1000"
            priority
          />
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24 flex flex-col md:flex-row gap-12 relative">
        
        {/* Floating Social Actions (Desktop) */}
        <div className="hidden md:block w-16 flex-shrink-0">
          <div className="sticky top-32 flex flex-col items-center gap-4">
            <div className="w-px h-8 bg-stone-300" />
            <button onClick={handleShareTwitter} className="w-10 h-10 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-500 hover:text-blue-500 hover:border-blue-200 hover:shadow-md transition-all">
              <Twitter className="w-4 h-4" />
            </button>
            <button onClick={handleShareFacebook} className="w-10 h-10 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-500 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all">
              <Facebook className="w-4 h-4" />
            </button>
            <button onClick={handleCopyLink} className="w-10 h-10 rounded-full border border-stone-200 bg-white flex items-center justify-center text-stone-500 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-md transition-all" title="Copy Link">
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Link2 className="w-4 h-4" />}
            </button>
            <div className="w-px h-8 bg-stone-300" />
          </div>
        </div>

        {/* Article Body */}
        <div className="flex-grow">
          <div className="max-w-none">
            {article.content.split('\n\n').map((paragraph: string, idx: number) => {
              const text = paragraph.trim();
              
              // Headings
              if (text.startsWith('# ')) {
                return <h1 key={idx} className="text-3xl md:text-4xl font-display font-black text-stone-900 tracking-tight mt-16 mb-6 leading-tight">{text.replace('# ', '')}</h1>;
              }
              if (text.startsWith('## ')) {
                return <h2 key={idx} className="text-2xl md:text-3xl font-display font-bold text-stone-900 tracking-tight mt-12 mb-6 leading-tight">{text.replace('## ', '')}</h2>;
              }
              if (text.startsWith('### ')) {
                return <h3 key={idx} className="text-xl font-display font-bold text-stone-900 mt-10 mb-4">{text.replace('### ', '')}</h3>;
              }

              // Blockquotes (Minimalist Design)
              if (text.startsWith('>')) {
                return (
                  <blockquote key={idx} className="relative my-10 pl-8 border-l-4 border-emerald-500 py-2">
                    <div className="text-xl md:text-2xl font-serif italic text-stone-700 leading-relaxed">
                      "{text.replace('>', '').trim()}"
                    </div>
                  </blockquote>
                );
              }

              // Callouts (Tips/Notes)
              if (text.toUpperCase().startsWith('[TIP]') || text.toUpperCase().startsWith('TIP:')) {
                return (
                  <div key={idx} className="my-10 p-8 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex gap-4 items-start shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bookmark className="w-4 h-4" />
                    </div>
                    <div className="text-stone-700 text-lg leading-relaxed">
                      <strong className="block font-bold text-emerald-800 text-sm mb-1">PRO TIP</strong>
                      {text.replace(/\[TIP\]|TIP:/i, '').trim()}
                    </div>
                  </div>
                );
              }

              // Standard paragraph with first-line uppercase styling for first paragraph
              if (idx === 0 || (idx === 1 && article.content.split('\n\n')[0].startsWith('#'))) {
                return (
                  <p key={idx} className="text-lg md:text-xl text-stone-600 leading-loose mb-8">
                    <span className="font-display font-bold text-stone-900 uppercase tracking-widest text-sm mr-2">{text.split(' ')[0]}</span>
                    {text.substring(text.split(' ')[0].length)}
                  </p>
                );
              }

              // Standard paragraph
              return (
                <p key={idx} className="text-lg md:text-xl text-stone-600 leading-loose mb-8">
                  {text}
                </p>
              );
            })}
          </div>

          {/* Author Card Footer */}
          <div className="mt-20 pt-10 border-t border-stone-200 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-stone-200 flex-shrink-0 flex items-center justify-center text-stone-500 border-4 border-white shadow-md">
              <User className="w-8 h-8" />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-xl font-display font-bold text-stone-900 mb-2">Written by {article.author}</h4>
              <p className="text-stone-500 text-base leading-relaxed">
                Plant enthusiast and expert curator at PlantMart. Bringing you the best tips for maintaining a thriving indoor jungle, one leaf at a time.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Action Bar (Mobile) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-lg border border-stone-200 shadow-xl rounded-full px-6 py-3 flex items-center gap-6">
        <button onClick={handleShareTwitter} className="text-stone-500 hover:text-blue-500"><Twitter className="w-5 h-5" /></button>
        <button onClick={handleShareFacebook} className="text-stone-500 hover:text-blue-600"><Facebook className="w-5 h-5" /></button>
        <button onClick={handleCopyLink} className="text-stone-500 hover:text-emerald-600">
          {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Link2 className="w-5 h-5" />}
        </button>
      </div>

    </article>
  );
}
