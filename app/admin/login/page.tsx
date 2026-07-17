'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { loginAsAdmin } from '@/lib/auth/login-client';
import { useRedirectIfRole } from '@/lib/auth/use-auth-guard';
import { ShieldCheck, ArrowRight, Mail, Key, Fingerprint, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  useRedirectIfRole('admin', '/admin');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginAsAdmin(email, password);

    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }

    login(result.user);
    router.push('/admin');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-slate-950 relative overflow-hidden">
      {/* Abstract Security Pattern Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,#020617_100%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-slate-900/50 backdrop-blur-2xl p-10 md:p-12 rounded-[48px] shadow-2xl relative z-10 border border-slate-800 shadow-emerald-500/5"
      >
        <div className="text-center space-y-4 mb-10">
          <div className="mx-auto w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center border border-slate-700 shadow-inner group">
            <Fingerprint className="text-emerald-500 w-10 h-10 transition-all duration-500 group-hover:scale-110 group-hover:text-emerald-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-display font-bold text-white tracking-tight">Admin Terminal</h2>
            <p className="text-slate-400 font-medium text-sm">Pacha Bhoomi Management System</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6 bg-red-950/30 text-red-400 p-4 rounded-2xl text-xs font-bold border border-red-900/50 text-center flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Secure ID / Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white focus:bg-slate-950 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 font-medium placeholder:text-slate-700"
                  placeholder="admin@pachabhoomi.com" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Access Key</label>
              </div>
              <div className="relative group">
                <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white focus:bg-slate-950 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 font-medium placeholder:text-slate-700"
                  placeholder="••••••••••••" 
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800/50 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <p className="text-[10px] font-bold text-slate-400 leading-tight uppercase tracking-wider">
              Encryption active. IP Address logged for security audits.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/10 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Decrypting Access...' : 'Authenticate'} <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-10 text-center">
          <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-emerald-500 transition-colors flex items-center justify-center gap-2">
             Cancel Authorization
          </Link>
        </div>
      </motion.div>
      
      {/* Decorative corners */}
      <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-slate-800 rounded-tl-3xl opacity-50" />
      <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-slate-800 rounded-br-3xl opacity-50" />
    </div>
  );
}
