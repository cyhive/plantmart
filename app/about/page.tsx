'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Sprout, ShieldCheck, HeartPulse, Globe, Users, ArrowRight, Star, Quote, ChevronDown, Sparkles, Trophy } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Verified Nurseries', value: '150+', icon: <ShieldCheck className="w-6 h-6" /> },
  { label: 'Happy Gardeners', value: '50k+', icon: <Users className="w-6 h-6" /> },
  { label: 'Plants Delivered', value: '200k+', icon: <Leaf className="w-6 h-6" /> },
  { label: 'Cities Covered', value: '25+', icon: <Globe className="w-6 h-6" /> },
];

const values = [
  {
    title: "Verified Roots",
    description: "Every nursery on our platform undergoes a rigorous 50-point quality check. We don't just sell plants; we vouch for their health and heritage.",
    icon: <ShieldCheck className="w-12 h-12" />,
    color: "emerald"
  },
  {
    title: "Sustainable Growth",
    description: "From plastic-free packaging to supporting local ecosystems, our mission is to leave the world greener than we found it.",
    icon: <Sprout className="w-12 h-12" />,
    color: "teal"
  },
  {
    title: "Plant-First Care",
    description: "Our relationship doesn't end at delivery. We provide lifetime care support and a 7-day health guarantee for every botanical companion.",
    icon: <HeartPulse className="w-12 h-12" />,
    color: "green"
  }
];

const milestones = [
  {
    year: "2023",
    title: "The Seed is Sown",
    description: "PlantMart was founded in a small balcony in Bangalore with a simple mission: to make premium greenery accessible to everyone."
  },
  {
    year: "2024",
    title: "Branching Out",
    description: "We partnered with our first 10 heritage nurseries, bringing generational botanical wisdom to the digital age."
  },
  {
    year: "2025",
    title: "Lush Community",
    description: "Reached 50,000 active plant parents and launched our revolutionary 'Verified Nursery' standard."
  },
  {
    year: "2026",
    title: "Green Future",
    description: "Expanding to 25+ cities and pioneering sustainable botanical logistics across India."
  }
];

const heroAccordions = [
  {
    id: 1,
    title: "Verified Heritage",
    content: "We partner exclusively with nurseries that have 20+ years of botanical expertise, ensuring every plant has a proven lineage.",
    icon: <Trophy className="w-4 h-4" />
  },
  {
    id: 2,
    title: "Eco-Conscious Ethics",
    content: "Our logistics are 100% plastic-neutral. We use biodegradable pots and recycled materials for all our botanical deliveries.",
    icon: <Leaf className="w-4 h-4" />
  },
  {
    id: 3,
    title: "Expert Support",
    content: "Every purchase includes a 30-day consultation period with our in-house botanists to ensure your new companion thrives.",
    icon: <Sparkles className="w-4 h-4" />
  }
];

const faqs = [
  {
    question: "How do you verify your nurseries?",
    answer: "Every nursery undergoes a rigorous 50-point quality check including soil testing, pest management practices, and lineage verification. We only partner with growers who meet our high standards for botanical excellence."
  },
  {
    question: "What is the '7-Day Health Guarantee'?",
    answer: "We stand by the health of our plants. If your botanical companion shows signs of stress within 7 days of arrival, our experts will provide recovery guidance. If it doesn't recover, we offer a full replacement."
  },
  {
    question: "Is your packaging truly plastic-free?",
    answer: "Yes! We use biodegradable pots, recycled cardboard, and compostable cushioning. We are committed to a 100% plastic-neutral supply chain."
  },
  {
    question: "Do you offer post-purchase support?",
    answer: "Absolutely. Every purchase includes lifetime access to our plant care journal and 30 days of direct consultation with our in-house botanists."
  }
];

export default function AboutPage() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden mesh-gradient">
        <div className="absolute inset-0 bg-slate-900/60 z-10" />
        
        {/* Animated Background Image */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="/botanical_story_hero_1778924083538.png" 
            alt="Lush Garden" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center space-y-12 pt-20">
          {/* Top Accordion Area */}
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="flex flex-wrap justify-center gap-3">
              {heroAccordions.map((item) => (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => setActiveAccordion(activeAccordion === item.id ? null : item.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${
                      activeAccordion === item.id 
                        ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/30' 
                        : 'bg-white/10 backdrop-blur-md text-emerald-50 border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {item.icon}
                    {item.title}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeAccordion === item.id ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {activeAccordion === item.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 p-6 glass-dark rounded-[32px] z-50 text-left border border-white/10 shadow-2xl"
                      >
                        <p className="text-emerald-50/80 text-sm leading-relaxed font-medium">
                          {item.content}
                        </p>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-4 h-4 bg-slate-900 rotate-45 border-l border-t border-white/10" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-500/20 backdrop-blur-md rounded-full text-emerald-400 text-sm font-bold border border-emerald-500/30"
            >
              <Leaf className="w-4 h-4" />
              <span className="tracking-widest uppercase">Our Journey</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-8xl lg:text-9xl font-display font-black text-white leading-[0.9] tracking-tighter"
            >
              Rooted in <br />
              <span className="text-emerald-400 italic font-serif">Community</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-emerald-50/70 text-xl md:text-2xl max-w-2xl mx-auto font-medium"
            >
              We're building India's most trusted marketplace for nature lovers, connecting you directly with the country's finest heritage nurseries.
            </motion.p>
          </div>
        </div>

        {/* Floating Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-emerald-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Origin Story Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[60px] overflow-hidden border-8 border-white shadow-2xl relative z-10">
              <img 
                src="/nursery_owner_handshake_1778924104492.png" 
                alt="The Seed" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 glass p-10 rounded-[40px] z-20 max-w-xs border border-emerald-100 hidden md:block">
              <Quote className="w-10 h-10 text-emerald-500 mb-4 opacity-20" />
              <p className="text-slate-800 font-serif italic text-lg leading-relaxed">
                "We didn't just want to sell plants; we wanted to preserve the wisdom of those who grow them."
              </p>
              <p className="text-emerald-600 font-black text-xs uppercase tracking-widest mt-6">— Founders, PlantMart</p>
            </div>
            {/* Decorative background circle */}
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -z-10" />
          </motion.div>

          <div className="space-y-10">
            <div className="space-y-4">
              <span className="text-emerald-600 text-xs font-black uppercase tracking-[0.3em]">The Origin</span>
              <h2 className="text-5xl md:text-6xl font-display font-bold text-slate-900 leading-tight">It started with a <br /><span className="text-emerald-600">single sprout.</span></h2>
            </div>
            
            <div className="space-y-6 text-slate-500 text-lg leading-relaxed">
              <p>
                PlantMart was born from a frustrating weekend spent searching for healthy plants in Bangalore. We realized that while India has thousands of incredible nurseries, the gap between these heritage growers and modern homes was vast.
              </p>
              <p>
                We set out to bridge that gap. By creating a platform that empowers local nurseries and provides buyers with verified, high-quality botanical companions, we've transformed how India buys plants.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-6">
              {stats.map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600">
                    {stat.icon}
                    <span className="text-3xl font-display font-black text-slate-900">{stat.value}</span>
                  </div>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#10b98110_0%,transparent_70%)]" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center space-y-6 mb-24">
            <span className="text-emerald-400 text-xs font-black uppercase tracking-[0.3em]">Our Standards</span>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tighter">The Roots of our <br /><span className="text-emerald-500 italic font-serif">Integrity</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group p-12 rounded-[56px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`w-24 h-24 bg-${value.color}-500/20 rounded-[32px] flex items-center justify-center text-${value.color}-400 mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner`}>
                  {value.icon}
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-6 tracking-tight">{value.title}</h3>
                <p className="text-slate-400 text-lg leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-24">
            <span className="text-emerald-600 text-xs font-black uppercase tracking-[0.3em]">Milestones</span>
            <h2 className="text-5xl font-display font-bold text-slate-900 tracking-tight">Our Growth Story</h2>
          </div>

          <div className="space-y-20 relative">
            {/* Vertical Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-slate-100 -translate-x-1/2 hidden md:block" />

            {milestones.map((milestone, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative flex flex-col md:flex-row items-center gap-12 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-emerald-500 rounded-full -translate-x-1/2 z-10 border-4 border-white shadow-[0_0_0_10px_rgba(16,185,129,0.05)] hidden md:block" />

                <div className="md:w-1/2 space-y-4 text-center md:text-left">
                  <span className="text-4xl font-display font-black text-emerald-100">{milestone.year}</span>
                  <h3 className="text-2xl font-bold text-slate-900">{milestone.title}</h3>
                  <p className="text-slate-500 text-lg leading-relaxed">{milestone.description}</p>
                </div>
                <div className="md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-32 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <span className="text-emerald-600 text-xs font-black uppercase tracking-[0.3em]">Common Curiosities</span>
            <h2 className="text-5xl font-display font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i}
                id={faq.question.includes('7-Day Health Guarantee') ? 'guarantee' : undefined}
                className={`group rounded-[32px] border transition-all duration-500 overflow-hidden ${
                  openFaq === i 
                    ? 'bg-white border-emerald-200 shadow-xl shadow-emerald-500/5' 
                    : 'bg-white/50 border-slate-200 hover:border-emerald-200'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-8 flex items-center justify-between text-left"
                >
                  <span className={`text-xl font-bold transition-colors duration-300 ${openFaq === i ? 'text-emerald-700' : 'text-slate-900'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    openFaq === i ? 'bg-emerald-500 text-white rotate-180' : 'bg-slate-100 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500'
                  }`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
                
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-8 pb-8">
                        <div className="w-full h-px bg-slate-100 mb-8" />
                        <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Founders Teaser */}
      <section className="py-32 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mesh-gradient rounded-[80px] p-20 relative overflow-hidden border-4 border-white shadow-2xl">
            <div className="absolute inset-0 bg-emerald-900/40 z-0" />
            <div className="relative z-10 space-y-10">
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tighter">Ready to join our <br /><span className="text-emerald-400 italic font-serif">growing community?</span></h2>
              <p className="text-emerald-50/70 text-xl max-w-2xl mx-auto font-medium">
                Whether you're a seasoned gardener or just starting your journey, we're here to help you grow.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link href="/plants" className="bg-white text-emerald-900 px-10 py-5 rounded-[24px] font-black hover:bg-emerald-400 hover:text-emerald-950 transition-all shadow-2xl active:scale-95">
                  Shop the Collection
                </Link>
                <Link href="/become-a-seller" className="glass text-white px-10 py-5 rounded-[24px] font-black hover:bg-white/20 transition-all border-white/20">
                  Join as a Seller
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
