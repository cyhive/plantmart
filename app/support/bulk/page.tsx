'use client';

import { motion } from 'motion/react';
import { 
  Building2, 
  Gift, 
  Leaf, 
  Truck, 
  BadgePercent,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function BulkOrdersPage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto text-emerald-600 shadow-inner"
          >
            <Building2 className="w-10 h-10" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-display font-black text-slate-900 tracking-tight"
          >
            Corporate & Bulk Orders
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg max-w-2xl mx-auto"
          >
            Elevate your workspace, delight your clients, or greenify your next big event with our premium botanical selections.
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 group hover:border-emerald-200 transition-colors"
          >
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
              <BadgePercent className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Volume Discounts</h3>
            <p className="text-slate-500 leading-relaxed">
              Enjoy tiered pricing on orders of 20 plants or more. Perfect for large office fit-outs or extensive corporate gifting programs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 group hover:border-emerald-200 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Custom Gifting</h3>
            <p className="text-slate-500 leading-relaxed">
              Add your company logo to planters, include personalized handwritten notes, and choose custom eco-friendly packaging.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 group hover:border-emerald-200 transition-colors"
          >
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Multi-Address Shipping</h3>
            <p className="text-slate-500 leading-relaxed">
              Sending gifts to remote employees? Send us your spreadsheet, and our logistics team will ensure safe delivery to hundreds of unique addresses.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 group hover:border-emerald-200 transition-colors"
          >
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Dedicated Account Manager</h3>
            <p className="text-slate-500 leading-relaxed">
              Get a dedicated botanical expert to help you curate the perfect selection, handle logistics, and provide post-delivery care support.
            </p>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-slate-900 rounded-[40px] p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full" />
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">Ready to green your space?</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">
              Fill out our corporate inquiry form, and our B2B team will get back to you within 24 hours with a customized proposal.
            </p>
            <Link 
              href="/contact?subject=Bulk%20Order%20Inquiry" 
              className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/30"
            >
              Get a Custom Quote <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
