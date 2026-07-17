'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  RefreshCcw,
  Smartphone
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AccountVerificationPage() {
  const router = useRouter();
  const [emailVerified, setEmailVerified] = useState(true); // Assuming email is verified
  const [phoneVerified, setPhoneVerified] = useState(false);
  
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [phone, setPhone] = useState('+91 98765 43210');

  const handleSendOtp = () => {
    setIsVerifyingPhone(true);
    // Simulate sending OTP
    setTimeout(() => {
      setOtpSent(true);
      setIsVerifyingPhone(false);
    }, 1500);
  };

  const handleVerifyOtp = () => {
    setIsVerifyingPhone(true);
    // Simulate verifying OTP
    setTimeout(() => {
      setPhoneVerified(true);
      setOtpSent(false);
      setIsVerifyingPhone(false);
    }, 1500);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-display font-black text-slate-900">Account Verification</h1>
            <p className="text-slate-500 mt-1">Verify your identity to unlock seller features and secure checkout</p>
          </div>
        </div>

        {/* Email Verification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 relative overflow-hidden"
        >
          {emailVerified && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mt-10 -mr-10" />
          )}
          
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${emailVerified ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'}`}>
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Email Address</h3>
                <p className="text-slate-500 text-sm mt-1">user@example.com</p>
              </div>
            </div>
            
            {emailVerified ? (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Verified
              </div>
            ) : (
              <button className="bg-emerald-100 text-emerald-700 font-bold px-6 py-2 rounded-full hover:bg-emerald-200 transition-colors text-sm">
                Verify Now
              </button>
            )}
          </div>
        </motion.div>

        {/* Phone Verification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`bg-white rounded-[32px] p-8 shadow-sm border ${phoneVerified ? 'border-emerald-200' : 'border-amber-200'} relative overflow-hidden`}
        >
          {!phoneVerified && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mt-10 -mr-10" />
          )}

          <div className="flex flex-col md:flex-row md:items-start justify-between relative z-10 gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${phoneVerified ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Phone Number</h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-slate-600 font-medium">{phone}</p>
                </div>
              </div>
            </div>
            
            {phoneVerified ? (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full font-bold text-sm h-fit">
                <CheckCircle2 className="w-4 h-4" />
                Verified
              </div>
            ) : (
              <div className="w-full md:w-auto">
                {!otpSent ? (
                  <button 
                    onClick={handleSendOtp}
                    disabled={isVerifyingPhone}
                    className="w-full md:w-auto bg-amber-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isVerifyingPhone ? (
                      <RefreshCcw className="w-4 h-4 animate-spin" />
                    ) : (
                      'Send OTP'
                    )}
                  </button>
                ) : (
                  <div className="space-y-4 w-full md:w-72">
                    <p className="text-sm font-bold text-slate-700">Enter 6-digit OTP</p>
                    <div className="flex justify-between gap-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength={1}
                          className="w-10 h-12 text-center text-xl font-black bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                          value={digit}
                          onChange={(e) => {
                            const newOtp = [...otp];
                            newOtp[index] = e.target.value;
                            setOtp(newOtp);
                            // Auto focus next input logic would go here
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleVerifyOtp}
                        disabled={isVerifyingPhone || otp.join('').length < 6}
                        className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm disabled:opacity-50"
                      >
                        {isVerifyingPhone ? 'Verifying...' : 'Verify'}
                      </button>
                      <button 
                        onClick={() => setOtpSent(false)}
                        className="px-4 bg-slate-100 text-slate-600 font-bold py-2 rounded-lg hover:bg-slate-200 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {!phoneVerified && !otpSent && (
            <div className="mt-6 flex items-start gap-3 bg-amber-50/50 p-4 rounded-xl border border-amber-100">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Verifying your phone number is required to place cash-on-delivery orders and to register as a seller on Pacha Bhoomi.
              </p>
            </div>
          )}
        </motion.div>

        {/* KYC Document (Teaser for sellers) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900 rounded-[32px] p-8 shadow-xl text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-emerald-950 flex-shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Identity Verification (KYC)</h3>
                <p className="text-slate-400 text-sm mt-1">Required only if you want to become a verified nursery seller.</p>
              </div>
            </div>
            
            <button 
              onClick={() => router.push('/seller/kyc')}
              className="w-full md:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl transition-colors border border-white/10"
            >
              Start KYC
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
