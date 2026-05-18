'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { loginWithRole } from '@/lib/auth/login-client';
import { Leaf, ArrowRight, Mail, Phone, ShieldCheck, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LoginPage() {
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'send' | 'verify'>('send');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginWithRole(
      email,
      password,
      'buyer',
      'Use the seller or admin login page for that account type.',
    );

    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }

    login(result.user);
    router.push('/');
    setLoading(false);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Mock OTP Send
    setTimeout(() => {
      if (phone.length >= 10) {
        setStep('verify');
      } else {
        setError('Invalid phone number');
      }
      setLoading(false);
    }, 800);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Mock OTP Verify
    setTimeout(() => {
      if (otp === '123456' || otp === '000000') {
        const mockUser = {
          id: 'u2',
          name: 'Phone User',
          email: 'phone@example.com',
          role: 'buyer'
        };
        login(mockUser as any);
        router.push('/');
      } else {
        setError('Invalid OTP. Use 123456 or 000000 for testing.');
      }
      setLoading(false);
    }, 1000);
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
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-emerald-600 rounded-[20px] flex items-center justify-center shadow-xl shadow-emerald-600/20 rotate-3">
            <Leaf className="text-white w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 font-medium italic">Grow your garden, one plant at a time</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1.5 bg-slate-100 rounded-3xl">
          <button
            onClick={() => { setLoginType('email'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[20px] text-sm font-bold transition-all ${loginType === 'email' ? 'bg-white text-emerald-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Mail className="w-4 h-4" /> Email
          </button>
          <button
            onClick={() => { setLoginType('phone'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[20px] text-sm font-bold transition-all ${loginType === 'phone' ? 'bg-white text-emerald-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Phone className="w-4 h-4" /> Phone
          </button>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="min-h-[280px]">
          {loginType === 'email' ? (
            <form className="space-y-6" onSubmit={handleEmailLogin}>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-6 py-4 bg-white/50 border-2 border-transparent rounded-[24px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium"
                    placeholder="hello@plantmart.com" 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                    <Link href="#" className="text-xs font-bold text-emerald-600 hover:underline">Forgot?</Link>
                  </div>
                  <input 
                    type="password" 
                    required 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-6 py-4 bg-white/50 border-2 border-transparent rounded-[24px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium"
                    placeholder="••••••••" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-5 rounded-[24px] font-bold flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'} <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {step === 'send' ? (
                <form className="space-y-6" onSubmit={handleSendOtp}>
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="tel" 
                        required 
                        value={phone} 
                        onChange={e => setPhone(e.target.value)}
                        className="w-full pl-16 pr-6 py-4 bg-white/50 border-2 border-transparent rounded-[24px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium"
                        placeholder="+91 98765 43210" 
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading || !phone}
                    className="w-full bg-emerald-600 text-white py-5 rounded-[24px] font-bold flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.97] disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send OTP'} <ArrowRight className="w-5 h-5" />
                  </button>
                  <p className="text-[10px] text-center text-slate-400 px-4 font-medium italic">
                    By clicking send, you'll receive a mock 6-digit code for testing purposes.
                  </p>
                </form>
              ) : (
                <form className="space-y-6" onSubmit={handleVerifyOtp}>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-slate-500">OTP sent to <span className="font-bold text-slate-900">{phone}</span></p>
                      <button onClick={() => setStep('send')} className="text-xs font-bold text-emerald-600 hover:underline mt-1">Change Number</button>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">6-Digit Code</label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          type="text" 
                          required 
                          maxLength={6}
                          value={otp} 
                          onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                          className="w-full pl-16 pr-6 py-4 bg-white/50 border-2 border-transparent rounded-[24px] tracking-[0.5em] text-center focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-black text-xl"
                          placeholder="000000" 
                        />
                      </div>
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-emerald-600 text-white py-5 rounded-[24px] font-bold flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.97] disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify & Login'} <ArrowRight className="w-5 h-5" />
                  </button>
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
                    <Timer className="w-3.5 h-3.5" /> Code expires in 10:00
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        <div className="text-center pt-8 border-t border-slate-100 space-y-4">
          <p className="text-sm font-medium text-slate-500">
            Don't have an account?{' '}
            <Link href="/register" className="text-emerald-600 font-bold hover:underline">Create one here</Link>
          </p>
          <div className="pt-2">
            <Link 
              href="/become-a-seller" 
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-6 py-3 rounded-full hover:bg-emerald-100 transition-all border border-emerald-100"
            >
              <Leaf className="w-3.5 h-3.5" /> Become a Seller
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
