'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Truck, 
  RotateCcw, 
  Package, 
  CreditCard, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  ChevronRight, 
  ExternalLink,
  Leaf,
  ShieldCheck,
  LifeBuoy,
  Clock,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const helpCategories = [
  {
    title: "Shipping & Delivery",
    description: "Tracking, delivery times, and shipping costs.",
    icon: <Truck className="w-8 h-8" />,
    color: "emerald",
    links: [
      { name: "Track your order", href: "/track" },
      { name: "Shipping rates", href: "/shipping" },
      { name: "Delivery areas", href: "/shipping#areas" },
    ]
  },
  {
    title: "Returns & Refunds",
    description: "Our 7-day health guarantee and return process.",
    icon: <RotateCcw className="w-8 h-8" />,
    color: "teal",
    links: [
      { name: "Start a return", href: "/returns" },
      { name: "Return policy", href: "/returns#policy" },
      { name: "Refund status", href: "/returns#status" },
    ]
  },
  {
    title: "Orders & Payments",
    description: "Payment methods, invoices, and order changes.",
    icon: <CreditCard className="w-8 h-8" />,
    color: "green",
    links: [
      { name: "Payment methods", href: "/support/payments" },
      { name: "Modify order", href: "/support/orders" },
      { name: "Bulk orders", href: "/support/bulk" },
    ]
  },
  {
    title: "Account & Security",
    description: "Manage your profile, password, and nursery settings.",
    icon: <User className="w-8 h-8" />,
    color: "slate",
    links: [
      { name: "Password reset", href: "/profile/settings" },
      { name: "Account verification", href: "/profile/verify" },
      { name: "Data privacy", href: "/privacy" },
    ]
  },
  {
    title: "Plant Care Support",
    description: "Expert advice on keeping your plants thriving.",
    icon: <Leaf className="w-8 h-8" />,
    color: "emerald",
    links: [
      { name: "Care Journal", href: "/care-journal" },
      { name: "Consult a Botanist", href: "/contact" },
      { name: "Health Guarantee", href: "/about#guarantee" },
    ]
  },
  {
    title: "Seller Support",
    description: "Everything you need to know about selling on PlantMart.",
    icon: <ShieldCheck className="w-8 h-8" />,
    color: "teal",
    links: [
      { name: "Seller Dashboard", href: "/seller" },
      { name: "Merchant Guidelines", href: "/become-a-seller#guidelines" },
      { name: "Payout schedule", href: "/seller/payouts" },
    ]
  }
];

const faqs = [
  {
    question: "How long does shipping take?",
    answer: "Typically, plants are delivered within 3-5 business days. We use specialized botanical logistics to ensure they arrive fresh and hydrated."
  },
  {
    question: "What is the 7-Day Health Guarantee?",
    answer: "If your plant shows signs of stress within 7 days of arrival, our experts will provide recovery guidance. If it doesn't recover, we offer a full replacement."
  },
  {
    question: "Do you ship across India?",
    answer: "Yes, we currently deliver to over 25 major cities across India and are expanding rapidly."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is shipped, you'll receive a tracking link via email and SMS. You can also track it directly in your profile."
  }
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero Section with Search */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-950 z-0">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 blur-[120px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-500/20 backdrop-blur-md rounded-full text-emerald-400 text-sm font-bold border border-emerald-500/30"
          >
            <LifeBuoy className="w-4 h-4" />
            <span className="tracking-widest uppercase">Support Center</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter"
          >
            How can we <br />
            <span className="text-emerald-400 italic font-serif text-6xl md:text-8xl">help you?</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto relative group"
          >
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl group-hover:bg-emerald-500/30 transition-all rounded-3xl"></div>
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-3xl flex items-center gap-4">
              <div className="pl-6 text-emerald-400">
                <Search className="w-6 h-6" />
              </div>
              <input 
                type="text" 
                placeholder="Search for articles, tracking, returns..." 
                className="flex-grow bg-transparent border-none focus:ring-0 text-white placeholder-emerald-100/50 text-lg py-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black px-8 py-4 rounded-2xl transition-all active:scale-95">
                Search
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 text-emerald-100/70 text-sm font-medium"
          >
            <span>Popular:</span>
            <Link href="/track" className="text-emerald-400 hover:underline">Track Order</Link>
            <Link href="/returns" className="text-emerald-400 hover:underline">Return Policy</Link>
            <Link href="/shipping" className="text-emerald-400 hover:underline">Shipping Times</Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {helpCategories.map((category, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-[40px] p-10 border border-slate-100 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500"
            >
              <div className={`w-20 h-20 bg-${category.color}-500/10 rounded-3xl flex items-center justify-center text-${category.color}-600 mb-8 group-hover:scale-110 transition-transform duration-500`}>
                {category.icon}
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-4">{category.title}</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">{category.description}</p>
              
              <ul className="space-y-4">
                {category.links.map((link, j) => (
                  <li key={j}>
                    <Link 
                      href={link.href} 
                      className="flex items-center justify-between text-slate-600 hover:text-emerald-600 font-bold group/link"
                    >
                      <span>{link.name}</span>
                      <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <span className="text-emerald-500 text-xs font-black uppercase tracking-[0.3em]">Direct Contact</span>
                <h2 className="text-5xl font-display font-bold text-white tracking-tight">Can't find what you're <br /><span className="text-emerald-500 italic font-serif">looking for?</span></h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition-all">
                  <Mail className="w-8 h-8 text-emerald-500 mb-4" />
                  <h4 className="text-white font-bold text-xl mb-2">Email Us</h4>
                  <p className="text-slate-400 text-sm mb-4">Response within 24 hours</p>
                  <a href="mailto:support@plantmart.in" className="text-emerald-400 font-black text-sm uppercase tracking-widest flex items-center gap-2 group">
                    Send Mail <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
                <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition-all">
                  <Phone className="w-8 h-8 text-emerald-500 mb-4" />
                  <h4 className="text-white font-bold text-xl mb-2">Call Us</h4>
                  <p className="text-slate-400 text-sm mb-4">Mon-Sat, 9am - 6pm</p>
                  <a href="tel:+918012345678" className="text-emerald-400 font-black text-sm uppercase tracking-widest flex items-center gap-2 group">
                    Call Now <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[40px] flex items-center gap-6">
                <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-emerald-950">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xl">Live Botanical Chat</h4>
                  <p className="text-emerald-100/60 text-sm">Talk to our experts about your plants.</p>
                </div>
                <button className="ml-auto bg-emerald-500 text-emerald-950 font-black px-6 py-3 rounded-xl hover:bg-emerald-400 transition-all active:scale-95">
                  Start Chat
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-[60px] overflow-hidden border-8 border-white/10 shadow-2xl relative z-10">
                <Image src="/nursery_customer_support_1778929357327.png" 
                  alt="Customer Support" 
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" fill />
              </div>
              {/* Stats overlay */}
              <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[40px] z-20 shadow-2xl border border-slate-100 hidden md:block">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Average Wait</p>
                    <p className="text-2xl font-display font-black text-slate-900">&lt; 2 Minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Resolution Rate</p>
                    <p className="text-2xl font-display font-black text-slate-900">98.5%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured FAQs */}
      <section className="py-24 max-w-4xl mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <span className="text-emerald-600 text-xs font-black uppercase tracking-[0.3em]">Quick Answers</span>
          <h2 className="text-4xl font-display font-bold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i}
              className={`rounded-[32px] border transition-all duration-300 ${
                activeFaq === i 
                  ? 'bg-white border-emerald-200 shadow-xl shadow-emerald-500/5' 
                  : 'bg-white/50 border-slate-200 hover:border-emerald-200'
              }`}
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full px-8 py-6 flex items-center justify-between text-left"
              >
                <span className={`text-lg font-bold ${activeFaq === i ? 'text-emerald-700' : 'text-slate-900'}`}>
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  activeFaq === i ? 'bg-emerald-500 text-white rotate-180' : 'bg-slate-100 text-slate-400'
                }`}>
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </button>
              
              <AnimatePresence>
                {activeFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 pt-2">
                      <p className="text-slate-500 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Office Locations / Footer Teaser */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 mx-auto mb-6">
              <MapPin className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Experience Center</h4>
            <p className="text-slate-500">Green Avenue, Whitefield,<br />Bangalore, KA 560066</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 mx-auto mb-6">
              <Package className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Fulfillment Hub</h4>
            <p className="text-slate-500">NH-44 Highway, Hosur Road,<br />Tamil Nadu 635109</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 mx-auto mb-6">
              <LifeBuoy className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Corporate HQ</h4>
            <p className="text-slate-500">The Lush Tower, Sector 5,<br />Gurgaon, HR 122002</p>
          </div>
        </div>
      </section>
    </div>
  );
}
