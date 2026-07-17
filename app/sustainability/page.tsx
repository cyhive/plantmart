'use client';

import { motion } from 'motion/react';
import { 
  Leaf, 
  Recycle, 
  TreePine, 
  Droplets, 
  Sun,
  ArrowRight,
  Globe,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const initiatives = [
  {
    title: "Eco-Friendly Packaging",
    content: "We've eliminated single-use plastics from our supply chain. All our plants are shipped using 100% biodegradable and recyclable materials to protect both your plant and the planet.",
    icon: <Recycle className="w-6 h-6 text-emerald-500" />
  },
  {
    title: "Carbon Neutral Delivery",
    content: "For every delivery made, we invest in carbon offset programs. We partner with logistics companies committed to transitioning to electric vehicle fleets.",
    icon: <Globe className="w-6 h-6 text-emerald-500" />
  },
  {
    title: "Water Conservation",
    content: "Our partnered nurseries utilize advanced drip irrigation and rainwater harvesting systems, reducing water waste by up to 60% compared to traditional farming.",
    icon: <Droplets className="w-6 h-6 text-emerald-500" />
  },
  {
    title: "Reforestation Projects",
    content: "With every rare plant purchase, Pacha Bhoomi donates a portion of the proceeds to local reforestation initiatives across India, restoring vital ecosystems.",
    icon: <TreePine className="w-6 h-6 text-emerald-500" />
  }
];

export default function SustainabilityPage() {
  return (
    <div className="bg-[#92B031]/20 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden mesh-gradient">
        <div className="absolute inset-0 bg-slate-900/50 z-10" />
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1600" 
            alt="Sustainability and Nature" 
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-emerald-100 text-sm font-bold border border-white/20"
          >
            <Leaf className="w-4 h-4" />
            <span className="tracking-widest uppercase">Our Commitment</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-display font-black text-white tracking-tighter leading-[0.9]"
          >
            Growing a <br />
            <span className="text-emerald-400 italic font-serif">Greener Future</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-emerald-50/80 text-xl max-w-2xl mx-auto font-medium"
          >
            At Pacha Bhoomi, sustainability isn't an afterthought—it's the root of everything we do. We're dedicated to nurturing nature while delivering it to your doorstep.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 max-w-5xl mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-display font-bold text-slate-900">Our Core Initiatives</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">Discover how we are minimizing our footprint and maximizing our positive impact on the environment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {initiatives.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[40px] p-10 border border-slate-100 hover:border-emerald-200 transition-all shadow-sm group"
            >
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed">{item.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Impact Stats */}
        <div className="bg-emerald-900 rounded-[60px] p-16 text-center text-white relative overflow-hidden shadow-2xl mb-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full" />
          
          <div className="relative z-10">
            <h2 className="text-3xl font-display font-bold mb-12">Our Impact So Far</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <p className="text-5xl font-black text-emerald-400">10k+</p>
                <p className="text-emerald-100/80 font-medium uppercase tracking-widest text-xs">Trees Planted</p>
              </div>
              <div className="space-y-2">
                <p className="text-5xl font-black text-emerald-400">15</p>
                <p className="text-emerald-100/80 font-medium uppercase tracking-widest text-xs">Tons of Plastic Saved</p>
              </div>
              <div className="space-y-2">
                <p className="text-5xl font-black text-emerald-400">100%</p>
                <p className="text-emerald-100/80 font-medium uppercase tracking-widest text-xs">Renewable Energy Nurseries</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Policy Text */}
        <div className="prose prose-slate max-w-none bg-white rounded-[60px] p-16 border border-slate-100 shadow-xl shadow-emerald-900/5">
          <div className="space-y-8">
            <div className="text-center mb-12">
              <Heart className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-3xl font-display font-bold text-slate-900">A Message from Our Founders</h2>
            </div>
            
            <p className="text-slate-500 leading-relaxed text-lg">
              "When we started Pacha Bhoomi, we realized that the business of selling plants wasn't always green. The immense amount of plastic pots, styrofoam packaging, and transport emissions contradicted the very essence of what we loved: nature. We made a pledge on day one to build a marketplace that gives back more to the earth than it takes."
            </p>
            
            <p className="text-slate-500 leading-relaxed text-lg">
              We continuously audit our partnered nurseries to ensure they meet our rigorous eco-standards. By choosing Pacha Bhoomi, you are not just decorating your living room; you are actively participating in a movement towards conscious consumerism and environmental restoration.
            </p>
          </div>

          <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700">
                <Sun className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Join the movement</p>
                <p className="font-bold text-slate-900">eco@pachabhoomi.in</p>
              </div>
            </div>
            
            <Link href="/plants" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
              Shop Sustainable Plants <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
