'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Store, 
  User, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase,
  Upload,
  Globe,
  Leaf
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { registerAccount } from '@/lib/auth/register-client';

const steps = [
  { id: 1, title: 'Identity', icon: User },
  { id: 2, title: 'Store Info', icon: Store },
  { id: 3, title: 'Business', icon: Building2 },
  { id: 4, title: 'Finish', icon: CheckCircle2 },
];

export default function BecomeSellerPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    shopDescription: '',
    shopCategory: 'Nursery',
    address: '',
    district: '',
    state: '',
    pinCode: '',
    businessType: 'Individual',
    taxId: '',
    website: '',
    shopImage: null as string | null,
    idProof: null as string | null,
    terms: false
  });

  const [districts, setDistricts] = useState<string[]>([]);

  const statesAndDistricts: Record<string, string[]> = {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Belgaum', 'Mangalore'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Trichy'],
    'Kerala': ['Kochi', 'Trivandrum', 'Kozhikode', 'Thrissur', 'Kollam'],
    'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Asansol'],
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    if (name === 'state') {
      setFormData(prev => ({ ...prev, state: value, district: '' }));
      setDistricts(statesAndDistricts[value] || []);
    } else {
      setFormData(prev => ({ ...prev, [name]: val }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'shopImage' | 'idProof') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (step < 4) {
      nextStep();
      return;
    }

    if (formData.password.length < 8) {
      setSubmitError('Password must be at least 8 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setSubmitError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const result = await registerAccount({
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      password: formData.password,
      role: 'seller',
      shopName: formData.shopName,
      phone: formData.phone,
    });
    if (!result.ok) {
      setSubmitError(result.error);
    } else {
      login(result.user);
      setIsCompleted(true);
    }
    setIsSubmitting(false);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass p-12 rounded-[40px] shadow-2xl text-center space-y-6"
        >
          <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <motion.div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Seller account created</h2>
            <p className="text-slate-500 font-medium">
              Your seller account is ready. Open the seller dashboard to add products and manage orders.
            </p>
          </motion.div>
          <button
            type="button"
            onClick={() => router.push('/seller')}
            className="inline-block w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
          >
            Go to Seller Dashboard
          </button>
          <Link
            href="/seller/login"
            className="inline-block w-full text-slate-500 font-bold hover:text-slate-700 text-sm"
          >
            Or sign in later
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-slate-50 relative overflow-hidden flex flex-col items-center">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-teal-100 rounded-full blur-[120px] opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-50/30 rounded-full blur-[160px] opacity-20" />
      </div>

      <div className="max-w-4xl w-full mx-auto relative z-10">
        {/* Logo Link for Standalone Page */}
        <div className="flex justify-center mb-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-emerald-500/20">
              <Leaf className="text-white w-6 h-6" />
            </div>
            <span className="font-display font-bold text-2xl text-emerald-900 tracking-tight">PlantMart</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest"
          >
            <Leaf className="w-4 h-4" /> Partner Program
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight"
          >
            Become a <span className="text-emerald-600">PlantMart</span> Seller
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 font-medium max-w-xl mx-auto"
          >
            Join the country's fastest growing plant marketplace and reach thousands of plant enthusiasts.
          </motion.p>
        </div>

        {/* Progress Stepper */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="flex justify-between items-center relative">
            {/* Progress Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500 ease-in-out" 
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = step >= s.id;
              const isCurrent = step === s.id;

              return (
                <div key={s.id} className="relative z-10 flex flex-col items-center">
                  <motion.div 
                    animate={{ 
                      scale: isCurrent ? 1.2 : 1,
                      backgroundColor: isActive ? '#059669' : '#fff',
                      color: isActive ? '#fff' : '#94a3b8',
                      borderColor: isActive ? '#059669' : '#e2e8f0'
                    }}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border-2 transition-colors duration-300`}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                  <span className={`absolute -bottom-8 text-xs font-bold whitespace-nowrap ${isActive ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <motion.div 
          layout
          className="glass rounded-[40px] shadow-2xl border border-white/50 p-8 md:p-12"
        >
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">First Name</label>
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          type="text" 
                          name="firstName"
                          required 
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full pl-14 pr-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium"
                          placeholder="John" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          type="text" 
                          name="lastName"
                          required 
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full pl-14 pr-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium"
                          placeholder="Doe" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="email" 
                        name="email"
                        required 
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-14 pr-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium"
                        placeholder="john@example.com" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="tel" 
                        name="phone"
                        required 
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-14 pr-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium"
                        placeholder="+91 98765 43210" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                      <input
                        type="password"
                        name="password"
                        required
                        minLength={8}
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium"
                        placeholder="At least 8 characters"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        required
                        minLength={8}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium"
                        placeholder="Repeat password"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Shop Name</label>
                    <div className="relative">
                      <Store className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        name="shopName"
                        required 
                        value={formData.shopName}
                        onChange={handleChange}
                        className="w-full pl-14 pr-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium"
                        placeholder="Green Paradise Nursery" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Shop Category</label>
                    <div className="relative">
                      <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <select 
                        name="shopCategory"
                        value={formData.shopCategory}
                        onChange={handleChange}
                        className="w-full pl-14 pr-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium appearance-none"
                      >
                        <option>Nursery</option>
                        <option>Seeds & Bulbs</option>
                        <option>Tools & Equipment</option>
                        <option>Pots & Planters</option>
                        <option>Fertilizers</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Shop Description</label>
                    <textarea 
                      name="shopDescription"
                      rows={4}
                      value={formData.shopDescription}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium"
                      placeholder="Tell us about your shop and what you sell..." 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Shop Photo / Logo</label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'shopImage')}
                        className="hidden" 
                        id="shopImage"
                      />
                      <label 
                        htmlFor="shopImage"
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-[32px] bg-slate-50/50 hover:bg-emerald-50 hover:border-emerald-500/50 transition-all cursor-pointer overflow-hidden relative"
                      >
                        {formData.shopImage ? (
                          <>
                            <img src={formData.shopImage} alt="Shop Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Upload className="w-8 h-8 text-white" />
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="w-8 h-8 text-slate-400" />
                            <span className="text-sm font-bold text-slate-500">Upload Shop Photo</span>
                            <span className="text-[10px] text-slate-400 font-medium">JPG, PNG up to 5MB</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Business Type</label>
                      <select 
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium"
                      >
                        <option>Individual</option>
                        <option>Proprietorship</option>
                        <option>Partnership</option>
                        <option>Private Limited</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Tax ID / PAN / GST</label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          type="text" 
                          name="taxId"
                          required 
                          value={formData.taxId}
                          onChange={handleChange}
                          className="w-full pl-14 pr-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium"
                          placeholder="ABCDE1234F" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Warehouse Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        name="address"
                        required 
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full pl-14 pr-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium"
                        placeholder="Street address, building, etc." 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">State</label>
                      <select 
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium appearance-none"
                      >
                        <option value="">Select State</option>
                        {Object.keys(statesAndDistricts).map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">District</label>
                      <select 
                        name="district"
                        required
                        disabled={!formData.state}
                        value={formData.district}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium appearance-none disabled:opacity-50"
                      >
                        <option value="">Select District</option>
                        {districts.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Pin Code</label>
                      <input 
                        type="text" 
                        name="pinCode"
                        required 
                        value={formData.pinCode}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all duration-300 font-medium"
                        placeholder="400001" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">ID Proof (PDF/Image)</label>
                      <div className="relative">
                        <input 
                          type="file" 
                          id="idProof"
                          onChange={(e) => handleFileUpload(e, 'idProof')}
                          className="hidden"
                        />
                        <label 
                          htmlFor="idProof"
                          className="w-full px-6 py-4 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-[20px] flex items-center justify-center gap-3 cursor-pointer hover:bg-emerald-100 transition-all text-emerald-700 font-bold text-sm"
                        >
                          <Upload className="w-5 h-5" /> {formData.idProof ? 'File Selected' : 'Upload ID Proof'}
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 space-y-4">
                    <h3 className="font-bold text-emerald-900 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5" /> Review Your Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-emerald-700/60 font-bold uppercase text-[10px] tracking-wider">Owner</p>
                        <p className="font-bold text-emerald-900">{formData.firstName} {formData.lastName}</p>
                      </div>
                      <div>
                        <p className="text-emerald-700/60 font-bold uppercase text-[10px] tracking-wider">Shop</p>
                        <p className="font-bold text-emerald-900">{formData.shopName}</p>
                      </div>
                      <div>
                        <p className="text-emerald-700/60 font-bold uppercase text-[10px] tracking-wider">Category</p>
                        <p className="font-bold text-emerald-900">{formData.shopCategory}</p>
                      </div>
                      <div>
                        <p className="text-emerald-700/60 font-bold uppercase text-[10px] tracking-wider">Location</p>
                        <p className="font-bold text-emerald-900">{formData.district}, {formData.state}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-start gap-4 cursor-pointer group">
                      <div className="relative mt-1">
                        <input 
                          type="checkbox" 
                          name="terms"
                          required
                          checked={formData.terms}
                          onChange={handleChange}
                          className="peer sr-only" 
                        />
                        <div className="w-6 h-6 border-2 border-slate-300 rounded-lg peer-checked:bg-emerald-600 peer-checked:border-emerald-600 transition-all" />
                        <CheckCircle2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                        I agree to the <Link href="#" className="text-emerald-600 font-bold underline">Seller Terms of Service</Link> and <Link href="#" className="text-emerald-600 font-bold underline">Privacy Policy</Link>. I understand that my shop will be reviewed by the PlantMart team.
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {submitError && (
              <motion.div className="mt-8 bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100">
                {submitError}
              </motion.div>
            )}

            <div className="mt-12 flex justify-between items-center pt-8 border-t border-slate-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" /> Back
                </button>
              ) : (
                <Link href="/seller/login" className="text-slate-400 font-bold hover:text-slate-600 text-sm">
                  Already have an account? Login
                </Link>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 text-white px-8 py-4 rounded-[22px] font-bold flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? (
                  'Processing...'
                ) : (
                  <>
                    {step === 4 ? 'Submit Application' : 'Continue'} 
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Support Section */}
        <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-8 text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest leading-none">Reach</p>
              <p className="text-xs font-bold text-slate-500">Pan India Delivery</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest leading-none">Trust</p>
              <p className="text-xs font-bold text-slate-500">Secure Payments</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest leading-none">Fees</p>
              <p className="text-xs font-bold text-slate-500">Transparent Commission</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
