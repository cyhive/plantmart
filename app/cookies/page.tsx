'use client';

import { motion } from 'motion/react';
import { 
  Cookie, 
  Settings, 
  BarChart3, 
  Target, 
  ShieldCheck, 
  Mail,
  ArrowRight,
  Leaf
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const sections = [
  {
    title: "Essential Cookies",
    content: "These cookies are strictly necessary to provide you with services available through our site, such as secure login, cart functionality, and checkout processes.",
    icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />
  },
  {
    title: "Performance & Analytics",
    content: "We use these cookies to understand how visitors interact with our site, helping us improve the user experience, fix bugs, and optimize page load speeds.",
    icon: <BarChart3 className="w-6 h-6 text-emerald-500" />
  },
  {
    title: "Personalization",
    content: "These cookies allow our website to remember choices you make (such as your preferred plant categories or language) to provide enhanced, personalized features.",
    icon: <Settings className="w-6 h-6 text-emerald-500" />
  },
  {
    title: "Targeting & Advertising",
    content: "Used to deliver advertisements more relevant to you and your botanical interests. They also limit the number of times you see an advertisement.",
    icon: <Target className="w-6 h-6 text-emerald-500" />
  }
];

export default function CookiesPage() {
  const lastUpdated = "May 25, 2026";

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden mesh-gradient">
        <div className="absolute inset-0 bg-slate-900/60 z-10" />
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1558904541-efa843a96f0f?auto=format&fit=crop&q=80&w=1600" 
            alt="Cookies Policy" 
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
            <Cookie className="w-4 h-4" />
            <span className="tracking-widest uppercase">Cookie Policy</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-display font-black text-white tracking-tighter leading-[0.9]"
          >
            Cookies & <br />
            <span className="text-emerald-400 italic font-serif">Tracking</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-emerald-50/80 text-xl max-w-2xl mx-auto font-medium"
          >
            How we use cookies to personalize your botanical shopping experience and keep our platform secure.
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
              <h2 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3">
                <Cookie className="w-8 h-8 text-emerald-500" />
                1. What are cookies?
              </h2>
              <p className="text-slate-500 leading-relaxed">
                Cookies are small text files that are placed on your computer or mobile device when you browse websites. They are widely used to make websites work, or work more efficiently, as well as to provide reporting information to website owners.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3">
                <Settings className="w-8 h-8 text-emerald-500" />
                2. How do we use cookies?
              </h2>
              <p className="text-slate-500 leading-relaxed">
                We use cookies to ensure that we give you the best experience on our website. This includes cookies from third party social media websites if you visit a page which contains embedded content from social media. Such third party cookies may track your use of Pacha Bhoomi.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-emerald-500" />
                3. Managing your preferences
              </h2>
              <p className="text-slate-500 leading-relaxed">
                You can manage your cookie preferences through your web browser settings. Most browsers allow you to block cookies, delete existing ones, or warn you before a cookie is stored on your device. Please note that restricting cookies may impact the functionality of our website.
              </p>
            </div>
          </div>

          <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Data & Privacy</p>
                <p className="font-bold text-slate-900">privacy@pachabhoomi.in</p>
              </div>
            </div>
            
            <Link href="/privacy" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
              Read Privacy Policy <ArrowRight className="w-4 h-4" />
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
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">Your Data, <span className="text-emerald-500 italic font-serif">Your Rules</span></h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            We believe in complete transparency about how we collect and use data to power your plant-shopping journey.
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
