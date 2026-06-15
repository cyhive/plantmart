'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, Leaf, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending email
    setTimeout(() => {
      setLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-20 mesh-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-white/60 pointer-events-none" />
      
      {/* Decorative Blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100 rounded-full blur-[120px] opacity-50" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-200 rounded-full blur-[120px] opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-10 md:p-12 rounded-[56px] shadow-2xl relative z-10 space-y-10 border border-white"
      >
        <Link 
          href="/login" 
          className="w-10 h-10 bg-white/50 border border-white rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-emerald-600 rounded-[20px] flex items-center justify-center shadow-xl shadow-emerald-600/20 rotate-3">
            <Leaf className="text-white w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Reset Password</h2>
            <p className="text-slate-500 font-medium text-sm px-4">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
        </div>

        {!isSent ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-16 pr-6 py-4 bg-white/50 border-2 border-transparent rounded-[24px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium"
                  placeholder="hello@plantmart.com" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !email}
              className="w-full bg-emerald-600 text-white py-5 rounded-[24px] font-bold flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending Link...
                </>
              ) : (
                <>Send Reset Link <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 bg-emerald-50 border border-emerald-100 p-8 rounded-[32px]"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-xl">Check your inbox</h3>
              <p className="text-slate-500 text-sm">
                If an account exists for <span className="font-bold text-slate-900">{email}</span>, we have sent a secure password reset link.
              </p>
            </div>
            <button 
              onClick={() => setIsSent(false)}
              className="text-emerald-600 font-bold text-sm hover:underline"
            >
              Didn't receive it? Try again
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
