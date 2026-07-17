'use client';

import { motion } from 'motion/react';
import { 
  Sprout, 
  Users, 
  Globe, 
  Heart, 
  Rocket, 
  Briefcase, 
  MapPin, 
  ArrowRight,
  Star,
  Zap,
  Leaf
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const jobs = [
  {
    title: "Senior Product Designer",
    department: "Design",
    location: "Bangalore / Remote",
    type: "Full-time"
  },
  {
    title: "Lead Botanist",
    department: "Operations",
    location: "Bangalore Hub",
    type: "Full-time"
  },
  {
    title: "Growth Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time"
  },
  {
    title: "Full Stack Engineer (React/Next.js)",
    department: "Engineering",
    location: "Bangalore / Remote",
    type: "Full-time"
  },
  {
    title: "Category Manager - Exotic Plants",
    department: "Operations",
    location: "Bangalore",
    type: "Full-time"
  }
];

const perks = [
  {
    title: "Work with Nature",
    description: "Our offices are literal urban jungles. We believe greenery boosts creativity and well-being.",
    icon: <Sprout className="w-8 h-8 text-emerald-500" />
  },
  {
    title: "Stock Options",
    description: "We want every team member to own a piece of the green revolution we're building.",
    icon: <Zap className="w-8 h-8 text-emerald-500" />
  },
  {
    title: "Health & Wellness",
    description: "Comprehensive health insurance and a monthly wellness stipend for all employees.",
    icon: <Heart className="w-8 h-8 text-emerald-500" />
  },
  {
    title: "Learning Budget",
    description: "An annual budget for books, courses, and conferences to help you grow your skills.",
    icon: <Rocket className="w-8 h-8 text-emerald-500" />
  }
];

export default function CareersPage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden mesh-gradient">
        <div className="absolute inset-0 bg-slate-900/40 z-10" />
        <div className="absolute inset-0 z-0">
          <Image src="/pachabhoomi_team_office_1778929897558.png" 
            alt="Pacha Bhoomi Team" 
            className="object-cover" fill />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-500/20 backdrop-blur-md rounded-full text-emerald-400 text-sm font-bold border border-emerald-500/30"
          >
            <Star className="w-4 h-4" />
            <span className="tracking-widest uppercase">Careers at Pacha Bhoomi</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-display font-black text-white tracking-tighter leading-[0.9]"
          >
            Grow Your <br />
            <span className="text-emerald-400 italic font-serif">Future</span> With Us
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-emerald-50/80 text-xl max-w-2xl mx-auto font-medium"
          >
            We're building India's first tech-enabled botanical ecosystem. Join a team of nature lovers and tech enthusiasts on a mission to greenify every home.
          </motion.p>
        </div>
      </section>

      {/* Stats/Mission Section */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <Users className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-4xl font-display font-black text-slate-900">50+</h3>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Team Members</p>
          </div>
          <div className="space-y-4">
            <Globe className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-4xl font-display font-black text-slate-900">25+</h3>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Cities Covered</p>
          </div>
          <div className="space-y-4">
            <Leaf className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-4xl font-display font-black text-slate-900">100%</h3>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Passion for Plants</p>
          </div>
        </div>
      </section>

      {/* Culture/Perks Section */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#10b98110_0%,transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center space-y-6 mb-24">
            <span className="text-emerald-400 text-xs font-black uppercase tracking-[0.3em]">Our Culture</span>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tighter">Why You'll Love <br /><span className="text-emerald-500 italic font-serif">Working Here</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {perks.map((perk, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 p-10 rounded-[48px] hover:bg-white/10 transition-all group"
              >
                <div className="mb-8 group-hover:scale-110 transition-transform duration-500">
                  {perk.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{perk.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{perk.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Board Section */}
      <section className="py-24 max-w-5xl mx-auto px-4">
        <div className="text-center space-y-4 mb-20">
          <span className="text-emerald-600 text-xs font-black uppercase tracking-[0.3em]">Join the Jungle</span>
          <h2 className="text-5xl font-display font-bold text-slate-900 tracking-tight">Open Positions</h2>
        </div>

        <div className="space-y-6">
          {jobs.map((job, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-[32px] p-8 border border-slate-100 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{job.title}</h3>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                    {job.type}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{job.department}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                </div>
              </div>
              
              <Link href="#" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-emerald-600 transition-all shadow-xl active:scale-95 text-center flex items-center justify-center gap-2 group/btn">
                Apply Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 bg-emerald-50 rounded-[48px] p-12 text-center border border-emerald-100">
          <h4 className="text-2xl font-display font-bold text-slate-900 mb-4">Don't see the right role?</h4>
          <p className="text-slate-500 mb-8 max-w-xl mx-auto">
            We're always looking for talented people who are passionate about nature and technology. Send us your resume anyway!
          </p>
          <a href="mailto:careers@pachabhoomi.in" className="text-emerald-600 font-black text-sm uppercase tracking-widest hover:underline underline-offset-8 decoration-2">
            Send spontaneous application
          </a>
        </div>
      </section>

      {/* Footer Teaser */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="glass-dark rounded-[60px] p-20 relative overflow-hidden bg-emerald-950 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 blur-[120px] rounded-full -mr-48 -mt-48" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter">Ready to branch <br /><span className="text-emerald-400 italic font-serif">out?</span></h2>
              <p className="text-emerald-50/70 text-xl max-w-2xl mx-auto font-medium">
                Our mission is to bring greenery to every home. Help us build the future of botanical commerce.
              </p>
              <Link href="/" className="inline-block bg-white text-emerald-950 px-12 py-5 rounded-2xl font-black hover:bg-emerald-400 hover:text-emerald-950 transition-all shadow-2xl">
                Explore Pacha Bhoomi
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
