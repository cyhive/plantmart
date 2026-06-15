'use client';

import { motion } from 'motion/react';
import { 
  PackageSearch, 
  Clock, 
  AlertCircle, 
  RefreshCcw, 
  PhoneCall, 
  Mail,
  ArrowRight,
  Leaf
} from 'lucide-react';
import Link from 'next/link';

export default function ModifyOrdersPage() {
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
            <PackageSearch className="w-10 h-10" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-display font-black text-slate-900 tracking-tight"
          >
            Modify or Cancel Orders
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg max-w-2xl mx-auto"
          >
            Need to make a change? Here is everything you need to know about updating your botanical purchase.
          </motion.p>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">The Golden Window</h3>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Because live plants require delicate prep work and prompt shipping, you only have a <strong>2-hour window</strong> after placing your order to make any modifications or cancellations. Once the nursery begins prepping your plant, changes cannot be made.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                <RefreshCcw className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Allowed Changes</h3>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Within the 2-hour window, you can typically update your shipping address, change the delivery instructions, or request a complete cancellation. You cannot add items to an existing order; please place a new order instead.
            </p>
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full" />
          <div className="relative z-10 space-y-6">
            <h3 className="text-2xl font-display font-bold">How to Request a Change</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold flex-shrink-0">1</div>
                <p className="text-slate-300 mt-1">Go to your <Link href="/profile/orders" className="text-emerald-400 font-bold hover:underline">Orders Dashboard</Link>.</p>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold flex-shrink-0">2</div>
                <p className="text-slate-300 mt-1">Select the order you wish to modify.</p>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold flex-shrink-0">3</div>
                <p className="text-slate-300 mt-1">If the order is still in the "Processing" state and within the 2-hour window, a "Modify/Cancel" button will be available.</p>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Support Contact */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-200">
          <div className="flex items-center gap-4">
            <AlertCircle className="w-8 h-8 text-amber-500" />
            <div>
              <p className="font-bold text-slate-900">Urgent Modifications?</p>
              <p className="text-slate-500 text-sm">Call us directly if you missed the window.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <a href="tel:+918012345678" className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
              <PhoneCall className="w-5 h-5" />
            </a>
            <a href="mailto:support@plantmart.in" className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
