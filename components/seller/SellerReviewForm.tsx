'use client';

import { useState } from 'react';
import { Star, Send, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SellerReviewFormProps {
  sellerName: string;
  onClose?: () => void;
  onSubmitSuccess?: (review: any) => void;
}

export default function SellerReviewForm({ sellerName, onClose, onSubmitSuccess }: SellerReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newReview = {
      id: Date.now(),
      author: 'You', // In a real app, this would be the logged-in user
      rating,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      comment
    };

    setIsSubmitting(false);
    setIsSubmitted(true);
    
    if (onSubmitSuccess) {
      onSubmitSuccess(newReview);
    }

    // Auto close after 2 seconds if requested
    if (onClose) {
      setTimeout(onClose, 2000);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-emerald-50 border border-emerald-100 p-8 rounded-[32px] text-center space-y-4"
      >
        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-emerald-900">Review Submitted!</h3>
          <p className="text-emerald-700/70 text-sm font-medium italic">Thank you for sharing your experience with {sellerName}.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white p-8 md:p-10 rounded-[48px] border border-slate-100 shadow-2xl space-y-8 relative overflow-hidden">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="space-y-2">
        <h3 className="text-3xl font-display font-black text-slate-900 tracking-tight leading-tight">
          Share Your <span className="text-emerald-600">Experience</span>
        </h3>
        <p className="text-slate-500 text-sm font-medium italic">How was your interaction with {sellerName}?</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Star Rating */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Rating</label>
          <div className="flex gap-2">
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
                  className={`w-10 h-10 transition-all duration-300 ${
                    (hover || rating) >= star 
                      ? 'fill-amber-400 text-amber-400 scale-110' 
                      : 'text-slate-200'
                  }`} 
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
             <p className="text-xs font-bold text-emerald-600 italic">
                {rating === 5 ? 'Exceptional!' : rating === 4 ? 'Great Service' : rating === 3 ? 'Good' : rating === 2 ? 'Could be better' : 'Disappointing'}
             </p>
          )}
        </div>

        {/* Comment Box */}
        <div className="space-y-3">
          <label htmlFor="comment" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Detailed Review</label>
          <textarea
            id="comment"
            required
            placeholder="Tell us about the plant quality, delivery, and overall service..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full bg-slate-50 border border-slate-100 rounded-[24px] p-6 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all text-sm font-medium leading-relaxed"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className={`w-full group relative flex items-center justify-center gap-3 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all overflow-hidden ${
            rating > 0 
              ? 'bg-slate-900 text-white hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-600/20 active:scale-[0.98]' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Submit Review
              <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </>
          )}
          
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
        </button>
      </form>

      {/* Trust Badge */}
      <div className="pt-6 border-t border-slate-50 flex items-center gap-2 text-slate-400 italic">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        <span className="text-[10px] font-bold">Verified Purchase Review</span>
      </div>
    </div>
  );
}
