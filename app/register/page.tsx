'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Leaf, ArrowRight, User } from 'lucide-react';
import { motion } from 'motion/react';

export default function RegisterPage() {
  const role = 'buyer';
  const [formData, setFormData] = useState({ name: '', email: '', password: '', shopName: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Mock Registration Logic
    setTimeout(() => {
      if (formData.name && formData.email && formData.password) {
        const mockUser = {
          id: 'u' + Math.random().toString(36).substr(2, 4),
          name: formData.name,
          email: formData.email,
          role: role
        };
        login(mockUser as any);
        router.push('/');
      } else {
        setError('Please fill in all required fields');
      }
    }, 1000);
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
              onChange={e => setFormData({ ...formData, name: e.target.value })}
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
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-6 py-4 bg-white/50 border-2 border-transparent rounded-[24px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium" 
              placeholder="you@example.com" 
            />
          </div>
          <div className="md:col-span-1 space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">Password</label>
            <input 
              type="password" 
              required 
              value={formData.password} 
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-6 py-4 bg-white/50 border-2 border-transparent rounded-[24px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium" 
              placeholder="••••••••" 
            />
          </div>
          
          <div className="col-span-full pt-4">
            <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-[24px] font-bold flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.97]">
              Start Growing <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        <div className="text-center pt-4">
          <p className="text-sm font-medium text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-600 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
