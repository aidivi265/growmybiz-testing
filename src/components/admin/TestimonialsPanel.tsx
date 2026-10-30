'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Edit2, Trash2, Star, Loader2, MessageSquare, X, Check } from 'lucide-react';
import MediaUploadInput from './MediaUploadInput';
import type { Testimonial } from '@/types';

interface TestimonialFormState {
  id?: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
  featured: boolean;
}

export default function TestimonialsPanel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string>('loading');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<TestimonialFormState>({
    name: '',
    role: 'Founder & CEO',
    company: '',
    avatar: '',
    quote: '',
    rating: 5,
    featured: true,
  });

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/testimonials');
      if (res.ok) {
        const data = await res.json();
        // Normalize fields if from Supabase
        const list = (data.testimonials || []).map((t: any) => ({
          id: t.id,
          author: t.name || t.author || 'Client',
          role: t.role || '',
          company: t.company || '',
          quote: t.quote || '',
          avatar: t.avatar || '',
          rating: t.rating || 5,
          featured: t.featured ?? true,
        }));
        setTestimonials(list);
        setSource(data.source || 'supabase');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      name: '',
      role: 'Founder & CEO',
      company: '',
      avatar: '',
      quote: '',
      rating: 5,
      featured: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (t: Testimonial & { featured?: boolean }) => {
    setEditingId(t.id);
    setForm({
      id: t.id,
      name: t.author,
      role: t.role,
      company: t.company,
      avatar: t.avatar || '',
      quote: t.quote,
      rating: t.rating || 5,
      featured: t.featured ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.quote) return;

    setSaving(true);
    try {
      const payload = {
        id: editingId,
        name: form.name,
        role: form.role,
        company: form.company,
        avatar: form.avatar || form.name.slice(0, 2).toUpperCase(),
        quote: form.quote,
        rating: form.rating,
        featured: form.featured,
      };

      const res = await fetch('/api/admin/testimonials', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadTestimonials();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save review');
      }
    } catch {
      alert('Error saving review');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete review from "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        loadTestimonials();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete review');
      }
    } catch {
      alert('Error deleting review');
    }
  };

  return (
    <div className="bg-[#0d0d14] rounded-xl border border-white/[0.06] p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Client Testimonials & Feedback</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Engine ({source})
            </span>
          </div>
          <p className="text-xs text-white/40 mt-0.5">
            Manage genuine client reviews and testimonials displayed on the homepage.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#3b82d4] hover:bg-[#2563eb] transition-all shrink-0"
        >
          <Plus size={14} />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-12 flex items-center justify-center gap-2 text-white/40 text-xs">
          <Loader2 size={16} className="animate-spin text-[#3b82d4]" />
          <span>Loading client reviews...</span>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="py-12 px-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
            <Check size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">No active testimonials (Section safely hidden)</p>
            <p className="text-xs text-white/40 mt-1 max-w-md mx-auto">
              You have currently cleared all testimonials. Because you have no reviews right now, the Testimonials section is automatically hidden from your live homepage so visitors never see empty sections or placeholder data.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#3b82d4] hover:bg-[#2563eb] transition-all cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Your First Testimonial</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-white/40">
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Company</th>
                <th className="py-2.5 px-3">Rating</th>
                <th className="py-2.5 px-3">Review</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {testimonials.map((t) => (
                <tr key={t.id || t.author} className="hover:bg-white/[0.02] text-white/80">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#3b82d4]/20 text-[#3b82d4] font-bold text-xs flex items-center justify-center shrink-0">
                        {t.avatar || t.author.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{t.author}</p>
                        <p className="text-[11px] text-white/40">{t.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-white/70">{t.company}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <Star key={i} size={11} className="fill-amber-400" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-white/60 max-w-sm line-clamp-1">{t.quote}</td>
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(t)}
                        className="p-1.5 rounded-lg text-white/40 hover:text-[#3b82d4] hover:bg-white/[0.05] transition-colors"
                        title="Edit Review"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id, t.author)}
                        className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/[0.05] transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal (Protected from accidental backdrop closure) */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-[#0f0f18] rounded-2xl border border-white/15 w-full max-w-lg p-5 sm:p-6 shadow-2xl relative my-auto text-white"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white tracking-tight">
                {editingId ? 'Edit Testimonial' : 'Add Client Testimonial'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/40 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Rohan Sharma"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Position / Role</label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="e.g. Founder & CEO"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Company / Brand</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="e.g. UrbanCart India"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Rating</label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value, 10) })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3b82d4]"
                  >
                    <option value={5} className="bg-[#0f0f18]">⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4} className="bg-[#0f0f18]">⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3} className="bg-[#0f0f18]">⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
              </div>

              {/* Client Photo / Avatar Upload */}
              <MediaUploadInput
                label="Client Photo / Headshot"
                value={form.avatar}
                onChange={(url) => setForm({ ...form, avatar: url })}
                placeholder="Upload client photo or leave empty for initials"
                helperText="Upload a client photo. Storage CDN will host it automatically."
              />

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Client Quote / Feedback *</label>
                <textarea
                  rows={4}
                  required
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  placeholder="What was the client's experience and results working with Growmybiz24?"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded bg-white/10 border-white/20 text-[#3b82d4]"
                />
                <label htmlFor="featured" className="text-xs text-white/80">
                  Feature prominently on Homepage Testimonials carousel
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#3b82d4] hover:bg-[#2563eb] disabled:opacity-50"
                >
                  {saving && <Loader2 size={13} className="animate-spin" />}
                  <span>{editingId ? 'Save Changes' : 'Add Testimonial'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
