'use client';

import { useState } from 'react';
import { Star, Send, X, CheckCircle2, Camera, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductReviewFormProps {
  productId: string;
  productName: string;
  userName?: string;
  onClose?: () => void;
  onSubmitSuccess?: (review: any) => void;
}

export default function ProductReviewForm({ productId, productName, userName, onClose, onSubmitSuccess }: ProductReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment, author: userName || 'You' })
      });
      
      if (!res.ok) throw new Error('Failed to submit review');
      const data = await res.json();
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      if (onSubmitSuccess) {
        onSubmitSuccess(data.review);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      return;
    }

    // Auto close after 2 seconds if requested
    if (onClose) {
      setTimeout(onClose, 2000);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-emerald-50 border border-emerald-100 p-10 rounded-[48px] text-center space-y-6"
      >
        <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto text-white shadow-xl shadow-emerald-500/30 rotate-3">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-display font-black text-emerald-900">Review Received!</h3>
          <p className="text-emerald-700/70 text-sm font-medium italic">Your feedback helps the community grow. Thank you for sharing your experience with {productName}.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white p-8 md:p-12 rounded-[60px] border border-slate-100 shadow-2xl space-y-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500/10" />
      
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-emerald-600">
           <Camera className="w-5 h-5" />
           <span className="text-[10px] font-black uppercase tracking-[0.3em]">Botanical Review</span>
        </div>
        <h3 className="text-4xl font-display font-black text-slate-900 tracking-tight leading-tight">
          How's your <span className="text-emerald-600">New Companion?</span>
        </h3>
        <p className="text-slate-500 text-sm font-medium italic">Share your experience with the {productName}.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Star Rating */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Rating</label>
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform active:scale-90"
              >
                <Star 
                  className={`w-12 h-12 transition-all duration-300 ${
                    (hover || rating) >= star 
                      ? 'fill-amber-400 text-amber-400 scale-110' 
                      : 'text-slate-100'
                  }`} 
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Comment Box */}
          <div className="space-y-4">
            <label htmlFor="comment" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Story</label>
            <textarea
              id="comment"
              required
              placeholder="Tell us about the plant's health, packaging, and how it fits in your space..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              className="w-full bg-slate-50 border border-slate-100 rounded-[32px] p-8 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all text-sm font-medium leading-relaxed resize-none"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Photo (Optional)</label>
            <div 
              className={`relative h-full min-h-[200px] rounded-[32px] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 overflow-hidden group ${
                selectedImage ? 'border-emerald-500/50 bg-emerald-50/10' : 'border-slate-200 bg-slate-50/50 hover:border-emerald-400 hover:bg-emerald-50/30'
              }`}
            >
              {selectedImage ? (
                <>
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button" 
                      onClick={() => setSelectedImage(null)}
                      className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/40 transition-all"
                    >
                      Change Photo
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm group-hover:text-emerald-500 group-hover:scale-110 transition-all duration-500">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Snap a Photo</p>
                    <p className="text-[9px] text-slate-400 font-bold mt-1">Show us your green space!</p>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className={`w-full group relative flex items-center justify-center gap-4 py-6 rounded-[32px] text-xs font-black uppercase tracking-widest transition-all overflow-hidden ${
            rating > 0 
              ? 'bg-slate-900 text-white hover:bg-emerald-600 hover:shadow-2xl hover:shadow-emerald-600/30 active:scale-[0.98]' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Post Botanical Review
              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </>
          )}
          
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
        </button>
      </form>

      {/* Trust Badge */}
      <div className="flex items-center justify-center gap-2 py-4 bg-slate-50/50 rounded-3xl text-slate-400 italic">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Trust-Verified Review System</span>
      </div>
    </div>
  );
}
