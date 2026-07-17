'use client';

import { motion } from 'motion/react';
import { 
  RotateCcw, 
  ShieldCheck, 
  HeartPulse, 
  Clock, 
  Leaf, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const returnSteps = [
  {
    title: "Request a Return",
    description: "Go to your order history and select 'Request Return' within 7 days of delivery.",
    icon: <MessageSquare className="w-6 h-6" />
  },
  {
    title: "Quality Review",
    description: "Upload a few photos of the plant. Our botanists will review its health status.",
    icon: <HeartPulse className="w-6 h-6" />
  },
  {
    title: "Reverse Pickup",
    description: "Once approved, we'll arrange a specialized pickup from your doorstep.",
    icon: <RotateCcw className="w-6 h-6" />
  },
  {
    title: "Full Refund",
    description: "Refunds are processed back to your original payment method within 5-7 days.",
    icon: <CheckCircle2 className="w-6 h-6" />
  }
];

const policyHighlights = [
  {
    title: "7-Day Health Guarantee",
    content: "If your plant shows signs of stress or disease within 7 days, we've got you covered. We'll provide recovery tips or a full replacement.",
    icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />
  },
  {
    title: "Incorrect Item Received",
    content: "Received a Monstera instead of a Fiddle Leaf? We'll swap it out immediately at zero cost to you.",
    icon: <Leaf className="w-8 h-8 text-emerald-500" />
  },
  {
    title: "Transit Damage",
    content: "While rare, if the pot is broken or the plant is severely damaged in transit, we offer an instant refund or replacement.",
    icon: <AlertCircle className="w-8 h-8 text-emerald-500" />
  }
];

export default function ReturnsPage() {
  return (
    <div className="bg-[#92B031]/20 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden mesh-gradient">
        <div className="absolute inset-0 bg-slate-900/40 z-10" />
        <div className="absolute inset-0 z-0">
          <Image src="/plant_return_inspection_1778929618276.png" 
            alt="Plant Inspection" 
            className="object-cover" fill />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-emerald-100 text-sm font-bold border border-white/20"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="tracking-widest uppercase">7-Day Health Guarantee</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-display font-black text-white tracking-tighter leading-[0.9]"
          >
            Easy Returns & <br />
            <span className="text-emerald-400 italic font-serif">Refunds</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-emerald-50/80 text-xl max-w-2xl mx-auto font-medium"
          >
            Your satisfaction is our priority. If your plant isn't thriving, we're here to make it right.
          </motion.p>
        </div>
      </section>

      {/* Return Process Steps */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center space-y-4 mb-20">
          <span className="text-emerald-600 text-xs font-black uppercase tracking-[0.3em]">The Workflow</span>
          <h2 className="text-4xl font-display font-bold text-slate-900">How to Return</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100 -translate-y-12 hidden md:block -z-10" />
          
          {returnSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[40px] p-8 border border-slate-100 hover:border-emerald-200 transition-all text-center group"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Policy Highlights */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {policyHighlights.map((policy, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 p-10 rounded-[48px] hover:bg-white/10 transition-all"
              >
                <div className="mb-6">{policy.icon}</div>
                <h3 className="text-2xl font-display font-bold text-white mb-4 tracking-tight">{policy.title}</h3>
                <p className="text-slate-400 leading-relaxed">{policy.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exceptions Section */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="bg-red-50 rounded-[60px] p-16 border border-red-100 flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <span className="text-red-600 text-xs font-black uppercase tracking-[0.3em]">Important Exceptions</span>
              <h2 className="text-4xl font-display font-bold text-slate-900">What cannot be <br /><span className="text-red-600 italic font-serif">returned</span></h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                To ensure the safety of our botanical ecosystem and heritage nurseries, certain items are non-returnable.
              </p>
            </div>

            <ul className="space-y-4">
              {[
                "Plants reported after 7 days of delivery",
                "Items purchased during 'Final Sale' events",
                "Custom-made pots or personalized botanical sets",
                "Gift Cards (Physical or Digital)",
                "Used plant care chemicals or fertilizers"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-bold">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:w-1/2 bg-white rounded-[40px] p-10 shadow-xl shadow-red-900/5 space-y-6">
            <h4 className="text-2xl font-bold text-slate-900">Need Help?</h4>
            <p className="text-slate-500 text-sm">
              If you're unsure about your return status, our botanical support team is available 24/7 to assist you.
            </p>
            <div className="flex flex-col gap-4">
              <Link href="/contact" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-center hover:bg-emerald-600 transition-all">
                Contact Support
              </Link>
              <Link href="/support" className="text-slate-400 font-bold text-sm text-center hover:text-slate-900 transition-colors">
                Read FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Details */}
      <section className="py-24 max-w-4xl mx-auto px-4 text-center space-y-12">
        <div className="space-y-4">
          <Clock className="w-12 h-12 text-emerald-500 mx-auto" />
          <h2 className="text-4xl font-display font-bold text-slate-900">Refund Timelines</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Once your return is picked up and inspected by our nursery partners, the refund is initiated immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
            <h4 className="font-black text-emerald-600 uppercase tracking-widest text-xs mb-2">Prepaid Orders</h4>
            <p className="text-3xl font-display font-black text-slate-900 mb-2">3-5 Days</p>
            <p className="text-slate-400 text-sm">Back to your original bank account/UPI</p>
          </div>
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
            <h4 className="font-black text-emerald-600 uppercase tracking-widest text-xs mb-2">COD Orders</h4>
            <p className="text-3xl font-display font-black text-slate-900 mb-2">5-7 Days</p>
            <p className="text-slate-400 text-sm">Directly to your provided bank details</p>
          </div>
        </div>
      </section>
    </div>
  );
}
