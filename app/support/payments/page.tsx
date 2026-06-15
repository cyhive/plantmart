'use client';

import { motion } from 'motion/react';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet, 
  ShieldCheck, 
  Lock,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const methods = [
  {
    title: "UPI & Wallets",
    content: "Instant, seamless payments via Google Pay, PhonePe, Paytm, Amazon Pay, and all BHIM UPI apps.",
    icon: <Smartphone className="w-6 h-6 text-emerald-500" />
  },
  {
    title: "Credit & Debit Cards",
    content: "We accept all major Visa, Mastercard, RuPay, and American Express cards with 3D Secure authentication.",
    icon: <CreditCard className="w-6 h-6 text-emerald-500" />
  },
  {
    title: "Net Banking",
    content: "Direct bank transfers through all major Indian banks including HDFC, ICICI, SBI, Axis, and 50+ others.",
    icon: <Building2 className="w-6 h-6 text-emerald-500" />
  },
  {
    title: "Pay Later",
    content: "Buy now and pay later with options like Simpl, LazyPay, and selected credit card EMIs for larger botanical purchases.",
    icon: <Wallet className="w-6 h-6 text-emerald-500" />
  }
];

export default function PaymentMethodsPage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden mesh-gradient">
        <div className="absolute inset-0 bg-slate-900/60 z-10" />
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1600" 
            alt="Secure Payments" 
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
            <ShieldCheck className="w-4 h-4" />
            <span className="tracking-widest uppercase">100% Secure Checkout</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-display font-black text-white tracking-tighter leading-[0.9]"
          >
            Payment <br />
            <span className="text-emerald-400 italic font-serif">Methods</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-emerald-50/80 text-xl max-w-2xl mx-auto font-medium"
          >
            Flexible, fast, and completely secure. Choose how you want to pay for your new green companions.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 max-w-5xl mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-display font-bold text-slate-900">Accepted Payment Options</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">We've partnered with India's leading payment gateways to ensure your transactions are always safe and smooth.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {methods.map((method, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[40px] p-10 border border-slate-100 hover:border-emerald-200 transition-all shadow-sm group"
            >
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                {method.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{method.title}</h3>
              <p className="text-slate-500 leading-relaxed">{method.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Detailed Info Text */}
        <div className="prose prose-slate max-w-none bg-white rounded-[60px] p-16 border border-slate-100 shadow-xl shadow-emerald-900/5">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3">
                <Lock className="w-8 h-8 text-emerald-500" />
                Bank-Grade Security
              </h2>
              <p className="text-slate-500 leading-relaxed">
                All transactions on PlantMart are protected by 256-bit SSL encryption. We do not store your credit card details or UPI PINs on our servers. All payments are processed through RBI-approved, PCI-DSS compliant payment gateways like Razorpay and Stripe.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3">
                <HelpCircle className="w-8 h-8 text-emerald-500" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-6 mt-6">
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Do you offer Cash on Delivery (COD)?</h4>
                  <p className="text-slate-500 mt-2">Currently, to ensure the health of live plants and reduce return transit times, we do not offer Cash on Delivery. All orders must be prepaid.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">My payment failed but money was deducted. What should I do?</h4>
                  <p className="text-slate-500 mt-2">Don't worry! In case of a failed transaction where money has been debited, it automatically gets refunded to your original payment method within 5-7 business days.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Payment Support</p>
                <p className="font-bold text-slate-900">billing@plantmart.in</p>
              </div>
            </div>
            
            <Link href="/support" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
              Visit Help Center <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
