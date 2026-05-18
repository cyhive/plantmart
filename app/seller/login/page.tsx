'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { loginWithRole } from '@/lib/auth/login-client';
import { Store, ArrowRight, Mail, Lock, ShieldCheck, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SellerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginWithRole(
      email,
      password,
      'seller',
      'This account is not registered as a seller. Apply at Become a Seller or use buyer login.',
    );

    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }

    login(result.user);
    router.push('/seller');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100 rounded-full blur-[120px] opacity-40" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-100 rounded-full blur-[120px] opacity-40" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass p-10 md:p-12 rounded-[40px] shadow-2xl relative z-10 border border-white/50"
      >
        <div className="text-center space-y-4 mb-10">
          <div className="mx-auto w-16 h-16 bg-emerald-600 rounded-[22px] flex items-center justify-center shadow-xl shadow-emerald-600/20 -rotate-3 transition-transform hover:rotate-0">
            <Store className="text-white w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Seller Portal</h2>
            <p className="text-slate-500 font-medium italic">Manage your shop & reach more customers</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium"
                  placeholder="vendor@plantmart.com" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                <Link href="#" className="text-xs font-bold text-emerald-600 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium"
                  placeholder="••••••••" 
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <p className="text-[11px] font-bold text-emerald-800 leading-tight">
              Secure Seller Authentication. Authorized access only.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-5 rounded-[22px] font-bold flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'} <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
          <p className="text-sm font-medium text-slate-500">
            Want to start selling?{' '}
            <Link href="/become-a-seller" className="text-emerald-600 font-bold hover:underline">Apply here</Link>
          </p>
          <Link href="/login" className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5" /> Not a seller? Back to User Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
