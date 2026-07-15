'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, ImageIcon, Clock } from 'lucide-react';
import Image from 'next/image';

export default function NewCareJournalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'watering',
    excerpt: '',
    content: '',
    image: '',
    author: 'Admin',
    readTime: '5 min read',
    featured: false
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be 5MB or smaller.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    setError('');
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/products/upload', {
        method: 'POST',
        credentials: 'include',
        body,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Failed to upload image');
        return;
      }
      if (typeof data.url !== 'string' || !data.url) {
        setError('Upload succeeded but no image URL was returned');
        return;
      }
      setFormData((prev) => ({ ...prev, image: data.url }));
    } catch {
      setError('Failed to upload image.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/care-journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        router.push('/admin/care-journals');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/care-journals" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Create Care Journal</h1>
          <p className="text-slate-500 font-medium">Add a new plant care guide or article.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Title</label>
              <input 
                type="text" 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Category</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="watering">Watering</option>
                <option value="sunlight">Sunlight</option>
                <option value="pest-control">Pest Control</option>
                <option value="propagation">Propagation</option>
                <option value="repotting">Repotting</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Excerpt (Short description)</label>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium h-24"
              value={formData.excerpt}
              onChange={e => setFormData({...formData, excerpt: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Full Content</label>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium h-48"
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700">Cover Image</label>
              {formData.image ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 group">
                  <Image src={formData.image} alt="Cover Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, image: ''})}
                      className="px-4 py-2 bg-red-500 text-white font-bold rounded-xl text-sm shadow-xl hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative group/upload">
                  <div className="w-full aspect-video border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center gap-2 group-hover/upload:border-emerald-500 group-hover/upload:bg-emerald-50/50 transition-all">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm text-slate-400 group-hover/upload:text-emerald-500 group-hover/upload:scale-110 transition-all">
                      {uploading ? <Clock className="w-6 h-6 animate-spin" /> : <ImageIcon className="w-6 h-6" />}
                    </div>
                    <span className="text-sm font-bold text-slate-500 group-hover/upload:text-emerald-600 transition-colors">
                      {uploading ? 'Uploading...' : 'Drop photo or browse'}
                    </span>
                    <input 
                      type="file" 
                      accept="image/jpeg, image/png, image/webp, image/gif"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Author</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                value={formData.author}
                onChange={e => setFormData({...formData, author: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Read Time</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                value={formData.readTime}
                onChange={e => setFormData({...formData, readTime: e.target.value})}
                placeholder="e.g. 5 min read"
              />
            </div>
            
            <div className="flex items-center h-full pt-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                  checked={formData.featured}
                  onChange={e => setFormData({...formData, featured: e.target.checked})}
                />
                <span className="font-bold text-slate-700">Feature on Homepage</span>
              </label>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-4">
            <Link 
              href="/admin/care-journals"
              className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Create Journal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
