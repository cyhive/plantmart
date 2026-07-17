'use client';

import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Eye, 
  Lock, 
  Database, 
  UserCheck, 
  Bell, 
  FileText,
  Mail,
  ArrowRight,
  Leaf
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const sections = [
  {
    title: "Data Collection",
    content: "We collect information you provide directly to us when you create an account, make a purchase, or communicate with us. This includes your name, email, shipping address, and payment information.",
    icon: <Database className="w-6 h-6 text-emerald-500" />
  },
  {
    title: "Information Usage",
    content: "Your data is used to process orders, improve our botanical recommendations, and communicate important updates about your 'plant companions' and our services.",
    icon: <Eye className="w-6 h-6 text-emerald-500" />
  },
  {
    title: "Security Standards",
    content: "We implement industry-standard encryption and security protocols to protect your personal information. Our payment processing is handled via secure, PCI-compliant partners.",
    icon: <Lock className="w-6 h-6 text-emerald-500" />
  },
  {
    title: "Third-Party Sharing",
    content: "We do not sell your personal data. We only share information with verified nursery partners and logistics providers necessary to fulfill your botanical orders.",
    icon: <UserCheck className="w-6 h-6 text-emerald-500" />
  }
];

export default function PrivacyPage() {
  const lastUpdated = "May 16, 2026";

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden mesh-gradient">
        <div className="absolute inset-0 bg-slate-900/40 z-10" />
        <div className="absolute inset-0 z-0">
          <Image src="/botanical_security_privacy_1778930003593.png" 
            alt="Privacy Security" 
            className="object-cover" fill />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-emerald-100 text-sm font-bold border border-white/20"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="tracking-widest uppercase">Data Protection</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-display font-black text-white tracking-tighter leading-[0.9]"
          >
            Privacy & <br />
            <span className="text-emerald-400 italic font-serif">Data Policy</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-emerald-50/80 text-xl max-w-2xl mx-auto font-medium"
          >
            Your trust is our most valuable asset. We are committed to protecting your personal information with the same care we give our plants.
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

        {/* Detailed Policy Text */}
        <div className="prose prose-slate max-w-none bg-white rounded-[60px] p-16 border border-slate-100 shadow-xl shadow-emerald-900/5">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-display font-bold text-slate-900">1. Introduction</h2>
              <p className="text-slate-500 leading-relaxed">
                Welcome to Pacha Bhoomi. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from Pacha Bhoomi.in (the "Site"). We take your privacy seriously and are committed to transparency in our data practices.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-display font-bold text-slate-900">2. Cookies & Tracking</h2>
              <p className="text-slate-500 leading-relaxed">
                We use "Cookies" to enhance your browsing experience and analyze site traffic. Cookies are small data files placed on your device. You can choose to disable cookies through your browser settings, though some features of the Site may not function properly as a result.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-display font-bold text-slate-900">3. Marketing Communications</h2>
              <p className="text-slate-500 leading-relaxed">
                If you opt-in, we may send you newsletters about new botanical arrivals, care tips, and exclusive offers. You can unsubscribe at any time by clicking the link at the bottom of our emails or contacting our support team.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-display font-bold text-slate-900">4. Your Rights</h2>
              <p className="text-slate-500 leading-relaxed">
                You have the right to access the personal information we hold about you, to ask for it to be corrected, or to request its deletion. To exercise these rights, please contact us through the information provided below.
              </p>
            </div>
          </div>

          <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Privacy Inquiries</p>
                <p className="font-bold text-slate-900">privacy@pachabhoomi.in</p>
              </div>
            </div>
            
            <Link href="/contact" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
              Contact Privacy Team <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Teaser */}
      <section className="py-24 bg-slate-950 text-center relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-8">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto mb-8">
            <Leaf className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">Rooted in <span className="text-emerald-500 italic font-serif">Trust</span></h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Our privacy practices are designed to provide a secure and lush shopping experience for every nature lover.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/terms" className="text-emerald-400 font-bold hover:underline underline-offset-8">Terms of Service</Link>
            <Link href="/support" className="text-emerald-400 font-bold hover:underline underline-offset-8">Help Center</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
