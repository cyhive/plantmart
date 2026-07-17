'use client';

import { motion } from 'motion/react';
import { 
  Scale, 
  BookOpen, 
  ShieldAlert, 
  RefreshCcw, 
  Store, 
  ShoppingBag, 
  Mail,
  ArrowRight,
  Leaf
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const sections = [
  {
    title: "User Agreement",
    content: "By accessing Pacha Bhoomi, you agree to abide by these terms. This includes providing accurate information during registration and respecting our community guidelines.",
    icon: <BookOpen className="w-6 h-6 text-emerald-500" />
  },
  {
    title: "Vendor Guidelines",
    content: "Nurseries and sellers must adhere to strict quality standards. Any misrepresentation of plant species, health, or size may result in account suspension.",
    icon: <Store className="w-6 h-6 text-emerald-500" />
  },
  {
    title: "Limitation of Liability",
    content: "While we ensure secure transactions and verified sellers, Pacha Bhoomi acts as a marketplace. The final responsibility for live plant care rests with the buyer upon delivery.",
    icon: <ShieldAlert className="w-6 h-6 text-emerald-500" />
  },
  {
    title: "Policy Updates",
    content: "We reserve the right to modify these terms as our platform grows. Significant changes will be communicated via email or dashboard notifications.",
    icon: <RefreshCcw className="w-6 h-6 text-emerald-500" />
  }
];

export default function TermsPage() {
  const lastUpdated = "May 20, 2026";

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden mesh-gradient">
        <div className="absolute inset-0 bg-slate-900/60 z-10" />
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?auto=format&fit=crop&q=80&w=1600" 
            alt="Terms and Conditions" 
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
            <Scale className="w-4 h-4" />
            <span className="tracking-widest uppercase">Legal Information</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-display font-black text-white tracking-tighter leading-[0.9]"
          >
            Terms & <br />
            <span className="text-emerald-400 italic font-serif">Conditions</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-emerald-50/80 text-xl max-w-2xl mx-auto font-medium"
          >
            Clear, transparent, and fair guidelines ensuring a thriving marketplace for our entire botanical community.
          </motion.p>
          
          <p className="text-emerald-100/50 text-xs font-black uppercase tracking-widest">Last Updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[40px] p-10 border border-slate-100 hover:border-emerald-200 transition-all shadow-sm"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                {section.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{section.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{section.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Detailed Terms Text */}
        <div className="prose prose-slate max-w-none bg-white rounded-[60px] p-16 border border-slate-100 shadow-xl shadow-emerald-900/5">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-emerald-500" />
                1. General Conditions
              </h2>
              <p className="text-slate-500 leading-relaxed">
                By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and contributors of content.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3">
                <Store className="w-8 h-8 text-emerald-500" />
                2. Marketplace Roles
              </h2>
              <p className="text-slate-500 leading-relaxed">
                Pacha Bhoomi operates as an online marketplace facilitating transactions between independent nurseries ("Sellers") and individual buyers ("Customers"). We do not directly own or manage the plant inventory listed by third-party sellers unless explicitly marked as "Pacha Bhoomi Direct".
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3">
                <Leaf className="w-8 h-8 text-emerald-500" />
                3. Live Plants Policy
              </h2>
              <p className="text-slate-500 leading-relaxed">
                Due to the nature of live plants, slight variations in size, color, and leaf count are expected compared to product photographs. Claims regarding severe transit damage must be reported within 24 hours of delivery, accompanied by clear photographic evidence, for review.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3">
                <ShieldAlert className="w-8 h-8 text-emerald-500" />
                4. Liability Limitations
              </h2>
              <p className="text-slate-500 leading-relaxed">
                In no case shall Pacha Bhoomi, our directors, officers, employees, affiliates, or agents be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, arising from your use of any of the service or any products procured using the service.
              </p>
            </div>
          </div>

          <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Legal Inquiries</p>
                <p className="font-bold text-slate-900">legal@pachabhoomi.in</p>
              </div>
            </div>
            
            <Link href="/contact" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
              Contact Legal Team <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Teaser */}
      <section className="py-24 bg-slate-950 text-center relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-8">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto mb-8">
            <Scale className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">Fair & <span className="text-emerald-500 italic font-serif">Transparent</span></h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Our guidelines help us maintain the highest standards of quality and service across the Pacha Bhoomi network.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/privacy" className="text-emerald-400 font-bold hover:underline underline-offset-8">Privacy Policy</Link>
            <Link href="/support" className="text-emerald-400 font-bold hover:underline underline-offset-8">Help Center</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
