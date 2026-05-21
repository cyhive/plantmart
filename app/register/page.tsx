'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { registerAccount } from '@/lib/auth/register-client';
import { Leaf, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

function RegisterForm() {
  const searchParams = useSearchParams();
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', shopName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('role') === 'seller') {
      setRole('seller');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await registerAccount({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role,
      ...(role === 'seller' ? { shopName: formData.shopName } : {}),
    });

    if (!result.ok) {
      setError(result.error);
    } else {
      login(result.user);
      router.push(result.user.role === 'seller' ? '/seller' : '/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-20 mesh-gradient relative">
      <div className="absolute inset-0 bg-white/60 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full glass p-12 rounded-[48px] shadow-2xl relative z-10 space-y-10"
      >
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-emerald-600 rounded-[20px] flex items-center justify-center shadow-xl shadow-emerald-600/20 -rotate-3">
            <Leaf className="text-white w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 font-medium italic">Start your botanical journey today</p>
          </div>
        </div>

        <div className="flex p-1.5 bg-slate-100 rounded-3xl max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`flex-1 py-3 rounded-[20px] text-sm font-bold transition-all ${
              role === 'buyer' ? 'bg-white text-emerald-900 shadow-md' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Buyer
          </button>
          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`flex-1 py-3 rounded-[20px] text-sm font-bold transition-all ${
              role === 'seller' ? 'bg-white text-emerald-900 shadow-md' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Seller
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 text-center"
          >
            {error}
          </motion.div>
        )}

        <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
          <div className="col-span-full space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-6 py-4 bg-white/50 border-2 border-transparent rounded-[24px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium"
              placeholder="John Doe"
            />
          </div>
          <div className="md:col-span-1 space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-6 py-4 bg-white/50 border-2 border-transparent rounded-[24px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium"
              placeholder="you@example.com"
            />
          </div>
          <div className="md:col-span-1 space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-6 py-4 bg-white/50 border-2 border-transparent rounded-[24px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium"
              placeholder="At least 8 characters"
            />
          </div>

          {role === 'seller' && (
            <div className="col-span-full space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">Shop / nursery name</label>
              <input
                type="text"
                required
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                className="w-full px-6 py-4 bg-white/50 border-2 border-transparent rounded-[24px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium"
                placeholder="Green Garden Nursery"
              />
            </div>
          )}

          <div className="col-span-full pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-5 rounded-[24px] font-bold flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account…' : 'Start Growing'} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        <div className="text-center pt-4">
          <p className="text-sm font-medium text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[90vh] flex items-center justify-center text-slate-500 font-medium">
          Loading…
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
