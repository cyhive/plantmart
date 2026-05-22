'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  UploadCloud, 
  Building2, 
  CreditCard, 
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Save,
  RefreshCw
} from 'lucide-react';

export default function SellerKYCPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [kycStatus, setKycStatus] = useState<'pending' | 'submitted' | 'verified' | 'rejected'>('pending');
  const [formData, setFormData] = useState({
    documentType: 'Aadhar',
    documentNumber: '',
    bankName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    documentUrls: [] as string[]
  });

  useEffect(() => {
    // Mock loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.accountNumber !== formData.confirmAccountNumber) {
      setError('Account numbers do not match');
      return;
    }
    
    setSaving(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setKycStatus('submitted');
    } catch (err: any) {
      setError(err.message || 'Failed to submit KYC');
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newUrls = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        documentUrls: [...prev.documentUrls, ...newUrls]
      }));
      e.target.value = '';
    }
  };

  const triggerFileInput = () => {
    document.getElementById('docUpload')?.click();
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isReadOnly = kycStatus === 'verified' || kycStatus === 'submitted';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight flex items-center gap-3">
          <ShieldCheck className="w-10 h-10 text-emerald-600" /> Merchant KYC
        </h1>
        <p className="text-slate-500 font-medium">Verify your identity to unlock unrestricted marketplace access.</p>
      </div>

      {/* Status Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-[32px] border ${
          kycStatus === 'verified' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
          kycStatus === 'submitted' ? 'bg-amber-50 border-amber-100 text-amber-800' :
          kycStatus === 'rejected' ? 'bg-rose-50 border-rose-100 text-rose-800' :
          'bg-white border-slate-200 text-slate-800 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-2xl shadow-sm">
            {kycStatus === 'verified' ? <CheckCircle2 className="w-8 h-8 text-emerald-500" /> :
             kycStatus === 'submitted' ? <Clock className="w-8 h-8 text-amber-500" /> :
             kycStatus === 'rejected' ? <AlertCircle className="w-8 h-8 text-rose-500" /> :
             <ShieldCheck className="w-8 h-8 text-slate-400" />}
          </div>
          <div>
            <h3 className="text-xl font-display font-bold">
              {kycStatus === 'verified' ? 'Identity Verified' :
               kycStatus === 'submitted' ? 'Under Review' :
               kycStatus === 'rejected' ? 'Verification Failed' :
               'Verification Required'}
            </h3>
            <p className="opacity-80 text-sm mt-1 font-medium">
              {kycStatus === 'verified' ? 'Your account is fully verified. You can withdraw funds and list unlimited plants.' :
               kycStatus === 'submitted' ? 'Our team is reviewing your documents. This usually takes 24-48 hours.' :
               kycStatus === 'rejected' ? 'There was an issue with your documents. Please review and resubmit.' :
               'Submit your legal and banking details to comply with marketplace regulations.'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* KYC Form */}
      <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-12 rounded-[48px] border border-slate-100 shadow-sm space-y-12">
        
        {error && (
          <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm font-bold border border-rose-100">
            {error}
          </div>
        )}

        {/* Identity Details */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
            <FileCheck className="w-6 h-6 text-emerald-600" />
            <h3 className="text-xl font-display font-bold text-slate-900 uppercase tracking-tight">Identity Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Document Type</label>
              <select 
                disabled={isReadOnly}
                value={formData.documentType}
                onChange={e => setFormData({...formData, documentType: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold appearance-none disabled:opacity-60"
              >
                <option value="Aadhar">Aadhar Card</option>
                <option value="PAN">PAN Card</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Document Number</label>
              <input 
                required
                type="text" 
                disabled={isReadOnly}
                value={formData.documentNumber}
                onChange={e => setFormData({...formData, documentNumber: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold disabled:opacity-60 text-slate-900"
                placeholder="Enter exact ID number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Document Uploads</label>
            <input 
              type="file" 
              id="docUpload" 
              multiple 
              accept="image/*,application/pdf" 
              className="hidden" 
              onChange={handleFileSelect} 
              disabled={isReadOnly}
            />
            <div className={`w-full p-8 border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center text-center transition-all ${
              formData.documentUrls.length > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
            }`}>
              {formData.documentUrls.length > 0 ? (
                <div className="w-full">
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    <p className="font-bold text-emerald-800">{formData.documentUrls.length} Document(s) Uploaded</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {formData.documentUrls.map((url, idx) => (
                      <div key={idx} className="relative aspect-video rounded-xl overflow-hidden shadow-sm border border-emerald-200">
                        <img src={url} alt={`Doc ${idx}`} className="w-full h-full object-cover" />
                        {!isReadOnly && (
                          <button 
                            type="button" 
                            onClick={() => setFormData(prev => ({...prev, documentUrls: prev.documentUrls.filter((_, i) => i !== idx)}))}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors font-bold text-sm"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {!isReadOnly && (
                    <button 
                      type="button" 
                      onClick={triggerFileInput}
                      className="px-6 py-3 bg-white text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-200 hover:bg-emerald-100 transition-colors"
                    >
                      + Add Another Page
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <UploadCloud className="w-12 h-12 text-slate-300 mb-4" />
                  <p className="font-bold text-slate-600">Drag & drop your document images here</p>
                  <p className="text-xs text-slate-400 mt-1">Upload front and back (JPEG, PNG, PDF up to 5MB)</p>
                  {!isReadOnly && (
                    <button 
                      type="button" 
                      onClick={triggerFileInput}
                      className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors"
                    >
                      Browse Files
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="space-y-8 pt-6">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
            <Building2 className="w-6 h-6 text-emerald-600" />
            <h3 className="text-xl font-display font-bold text-slate-900 uppercase tracking-tight">Banking Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Bank Name</label>
              <div className="relative">
                <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <select 
                  required
                  disabled={isReadOnly}
                  value={formData.bankName}
                  onChange={e => setFormData({...formData, bankName: e.target.value})}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold disabled:opacity-60 appearance-none text-slate-900"
                >
                  <option value="" disabled>Select your bank</option>
                  <option value="State Bank of India">State Bank of India</option>
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  <option value="Punjab National Bank">Punjab National Bank</option>
                  <option value="Bank of Baroda">Bank of Baroda</option>
                  <option value="Union Bank of India">Union Bank of India</option>
                  <option value="Canara Bank">Canara Bank</option>
                  <option value="Other">Other Bank</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Account Number</label>
              <div className="relative">
                <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  required
                  type="password" 
                  disabled={isReadOnly}
                  value={formData.accountNumber}
                  onChange={e => setFormData({...formData, accountNumber: e.target.value})}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold disabled:opacity-60"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Account Number</label>
              <div className="relative">
                <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  required
                  type="text" 
                  disabled={isReadOnly}
                  value={formData.confirmAccountNumber}
                  onChange={e => setFormData({...formData, confirmAccountNumber: e.target.value})}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold disabled:opacity-60"
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">IFSC Code</label>
              <input 
                required
                type="text" 
                disabled={isReadOnly}
                value={formData.ifscCode}
                onChange={e => setFormData({...formData, ifscCode: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold uppercase disabled:opacity-60"
                placeholder="e.g. HDFC0001234"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        {!isReadOnly && (
          <div className="pt-8 border-t border-slate-50 flex justify-end">
            <button 
              type="submit" 
              disabled={saving || formData.documentUrls.length === 0}
              className="w-full sm:w-auto bg-emerald-600 text-white px-12 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Submitting...' : 'Submit for Verification'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
