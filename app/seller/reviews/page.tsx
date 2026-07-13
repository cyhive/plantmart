'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';

export default function SellerReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/seller/reviews')
      .then(res => res.json())
      .then(data => {
        if (data.reviews) {
          setReviews(data.reviews);
          setStats(data.stats);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching reviews:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="space-y-1">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Customer Reviews</h1>
          <p className="text-slate-500 font-medium italic">See what buyers are saying about your nursery and service.</p>
        </header>

        {/* Stats Overview */}
        {stats && stats.totalReviews > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
              <p className="text-sm font-black uppercase tracking-widest text-slate-400">Average Rating</p>
              <h2 className="text-6xl font-black text-slate-900">{stats.averageRating}</h2>
              <div className="flex gap-1 text-emerald-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-6 h-6 ${i < Math.round(Number(stats.averageRating)) ? 'fill-current' : 'text-slate-200'}`} />
                ))}
              </div>
              <p className="text-xs text-slate-400 font-medium pt-2">Based on {stats.totalReviews} reviews</p>
            </div>

            <div className="md:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900">Rating Breakdown</h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = stats.ratingBreakdown[star] || 0;
                  const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-4">
                      <div className="flex items-center gap-1 w-12 shrink-0">
                        <span className="font-bold text-sm text-slate-700">{star}</span>
                        <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                      </div>
                      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-500 w-10 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 md:p-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-emerald-600" /> {filter === 'all' ? 'All Reviews' : filter === 'store' ? 'Store Reviews' : 'Product Reviews'}
            </h3>
            
            <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto max-w-full">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('store')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${filter === 'store' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Store Reviews
              </button>
              <button 
                onClick={() => setFilter('product')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${filter === 'product' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Product Reviews
              </button>
            </div>
          </div>
          
          {reviews.filter(r => filter === 'all' || (filter === 'store' && r.reviewType === 'Seller') || (filter === 'product' && r.reviewType === 'Product')).length > 0 ? (
            <div className="space-y-8">
              {reviews.filter(r => filter === 'all' || (filter === 'store' && r.reviewType === 'Seller') || (filter === 'product' && r.reviewType === 'Product')).map((review) => (
                <div key={review._id} className="pb-8 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-slate-900">{review.author || 'Anonymous'}</h4>
                        {review.reviewType === 'Product' ? (
                          <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                            {review.productName}
                          </span>
                        ) : (
                          <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                            Store Review
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-medium mt-1">
                        {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex gap-1 text-emerald-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < (review.rating || 0) ? 'fill-current' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">No reviews yet.</p>
              <p className="text-xs text-slate-400 mt-2">When buyers review your nursery, they'll appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
