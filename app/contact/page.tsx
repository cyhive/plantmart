'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Facebook, 
  Twitter, 
  Instagram, 
  Github, 
  Send,
  Clock,
  ExternalLink,
  LifeBuoy
} from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-[#92B031]/20 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden mesh-gradient">
        <div className="absolute inset-0 bg-slate-900/40 z-10" />
        <div className="absolute inset-0 z-0">
          <Image src="/botanist_consultant_contact_1778929648581.png" 
            alt="Contact Us" 
            className="object-cover" fill />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-500/20 backdrop-blur-md rounded-full text-emerald-400 text-sm font-bold border border-emerald-500/30"
          >
            <LifeBuoy className="w-4 h-4" />
            <span className="tracking-widest uppercase">Reach Out</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-display font-black text-white tracking-tighter leading-[0.9]"
          >
            Connect with our <br />
            <span className="text-emerald-400 italic font-serif">Botanists</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-emerald-50/80 text-xl max-w-2xl mx-auto font-medium"
          >
            Whether you have a question about plant care, your order, or just want to talk botanical trends, we're all ears.
          </motion.p>
        </div>
      </section>

      {/* Contact Channels Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 -mt-32 relative z-30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-xl shadow-emerald-900/5 group hover:-translate-y-2 transition-all duration-500"
          >
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Mail className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Email Us</h3>
            <p className="text-slate-500 mb-6 leading-relaxed">For general inquiries, partnership proposals, and support.</p>
            <a href="mailto:hello@pachabhoomi.in" className="text-emerald-600 font-black text-sm uppercase tracking-widest flex items-center gap-2 group/link">
              hello@pachabhoomi.in <ExternalLink className="w-3 h-3 group-hover/link:translate-x-1 transition-all" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-xl shadow-emerald-900/5 group hover:-translate-y-2 transition-all duration-500"
          >
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Phone className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Call Anytime</h3>
            <p className="text-slate-500 mb-6 leading-relaxed">Talk to our experts about your plants or order status.</p>
            <a href="tel:+918012345678" className="text-emerald-600 font-black text-sm uppercase tracking-widest flex items-center gap-2 group/link">
              +91 80 1234 5678 <ExternalLink className="w-3 h-3 group-hover/link:translate-x-1 transition-all" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-xl shadow-emerald-900/5 group hover:-translate-y-2 transition-all duration-500"
          >
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Visit Us</h3>
            <p className="text-slate-500 mb-6 leading-relaxed">Experience our curation at our flagship Bangalore hub.</p>
            <span className="text-emerald-600 font-black text-sm uppercase tracking-widest">Whitefield, KA 560066</span>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Office Info */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Form */}
          <div className="bg-white rounded-[60px] p-12 border border-slate-100 shadow-2xl shadow-emerald-900/5">
            <div className="space-y-4 mb-10">
              <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Send a message</h2>
              <p className="text-slate-500 leading-relaxed">Our typical response time is within 4 botanical hours.</p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    className="w-full bg-slate-50 border-none rounded-3xl px-6 py-4 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com" 
                    className="w-full bg-slate-50 border-none rounded-3xl px-6 py-4 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Subject</label>
                <select className="w-full bg-slate-50 border-none rounded-3xl px-6 py-4 focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-500">
                  <option>Order Inquiry</option>
                  <option>Plant Care Advice</option>
                  <option>Nursery Partnership</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Message</label>
                <textarea 
                  rows={6}
                  placeholder="Tell us what's on your mind..." 
                  className="w-full bg-slate-50 border-none rounded-3xl px-6 py-4 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                ></textarea>
              </div>
              <button className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95 group">
                Send Message <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div className="space-y-12 py-10">
            <div className="space-y-8">
              <h3 className="text-3xl font-display font-bold text-slate-900">Connect on Social</h3>
              <p className="text-slate-500 text-lg">Follow our botanical journey and get daily plant care tips on our social channels.</p>
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: <Instagram className="w-5 h-5" />, name: 'Instagram', href: '#' },
                  { icon: <Twitter className="w-5 h-5" />, name: 'Twitter', href: '#' },
                  { icon: <Facebook className="w-5 h-5" />, name: 'Facebook', href: '#' },
                  { icon: <Github className="w-5 h-5" />, name: 'GitHub', href: '#' },
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.href} 
                    className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-100 font-bold hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all group"
                  >
                    {social.icon}
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="space-y-8">
              <h3 className="text-3xl font-display font-bold text-slate-900">Operating Hours</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <Clock className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h4 className="font-bold text-slate-900">Mon - Sat</h4>
                    <p className="text-slate-500 text-sm">09:00 AM - 07:00 PM</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MessageSquare className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h4 className="font-bold text-slate-900">Live Support</h4>
                    <p className="text-slate-500 text-sm">24/7 via Chat</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-emerald-500/40 transition-all" />
              <h4 className="text-xl font-bold mb-4">Are you a nursery owner?</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Join our network of heritage nurseries and bring your botanical wisdom to a global community.
              </p>
              <a href="/become-a-seller" className="inline-flex items-center gap-2 bg-emerald-500 text-emerald-950 px-8 py-3 rounded-2xl font-black hover:bg-emerald-400 transition-all active:scale-95">
                Join as a Seller
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
