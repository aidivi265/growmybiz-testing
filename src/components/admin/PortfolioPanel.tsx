'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, Loader2, Sparkles, X } from 'lucide-react';
import MediaUploadInput from './MediaUploadInput';
import type { PortfolioItem } from '@/types';

interface PortfolioFormState {
  id?: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  thumbnail: string;
  challenge: string;
  solution: string;
  outcome: string;
  technologies_str: string;
  is_concept: boolean;
  is_featured: boolean;
}

export default function PortfolioPanel() {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string>('loading');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<PortfolioFormState>({
    slug: '',
    title: '',
    client: '',
    category: 'Web Application',
    year: '2025',
    thumbnail: '/portfolio-mockups/mobile-app.png',
    challenge: '',
    solution: '',
    outcome: '',
    technologies_str: 'Next.js, TypeScript, Tailwind CSS',
    is_concept: false,
    is_featured: true,
  });

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/portfolio');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        setSource(data.source || 'supabase');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      slug: '',
      title: '',
      client: '',
      category: 'Web Application',
      year: '2025',
      thumbnail: '/portfolio-mockups/mobile-app.png',
      challenge: '',
      solution: '',
      outcome: '',
      technologies_str: 'Next.js, TypeScript, Tailwind CSS',
      is_concept: false,
      is_featured: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: PortfolioItem) => {
    setEditingId(p.id);
    setForm({
      id: p.id,
      slug: p.slug,
      title: p.title,
      client: p.client,
      category: p.category,
      year: String(p.year || 2025),
      thumbnail: p.thumbnail,
      challenge: p.challenge,
      solution: p.approach || '',
      outcome: p.outcome,
      technologies_str: Array.isArray(p.technologies) ? p.technologies.join(', ') : '',
      is_concept: p.isConcept ?? false,
      is_featured: p.featured ?? true,
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    if (!editingId) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setForm((prev) => ({ ...prev, title: val, slug: autoSlug }));
    } else {
      setForm((prev) => ({ ...prev, title: val }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.client) return;

    setSaving(true);
    try {
      const technologies = form.technologies_str
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        id: editingId,
        slug: form.slug,
        title: form.title,
        client: form.client,
        category: form.category,
        year: form.year,
        thumbnail: form.thumbnail,
        challenge: form.challenge,
        solution: form.solution,
        outcome: form.outcome,
        technologies,
        is_concept: form.is_concept,
        is_featured: form.is_featured,
      };

      const res = await fetch('/api/admin/portfolio', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadProjects();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save project');
      }
    } catch {
      alert('Error saving project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete project "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/portfolio?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        loadProjects();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete project');
      }
    } catch {
      alert('Error deleting project');
    }
  };

  return (
    <div className="bg-[#0d0d14] rounded-xl border border-white/[0.06] p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Portfolio & Case Studies</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Engine ({source})
            </span>
          </div>
          <p className="text-xs text-white/40 mt-0.5">
            Publish client case studies, prototypes, and concept demonstrations with live outcomes.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#3b82d4] hover:bg-[#2563eb] transition-all shrink-0"
        >
          <Plus size={14} />
          <span>Add Project</span>
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-12 flex items-center justify-center gap-2 text-white/40 text-xs">
          <Loader2 size={16} className="animate-spin text-[#3b82d4]" />
          <span>Loading portfolio items...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="py-12 text-center text-white/40 text-xs">
          No projects published yet. Click &quot;Add Project&quot; to showcase your work.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-white/40">
                <th className="py-2.5 px-3">Client & Title</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Classification</th>
                <th className="py-2.5 px-3">Year</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {projects.map((p) => (
                <tr key={p.id || p.slug} className="hover:bg-white/[0.02] text-white/80">
                  <td className="py-3 px-3">
                    <div>
                      <p className="text-[11px] text-[#32A88A] font-bold uppercase tracking-wider">{p.client}</p>
                      <p className="font-semibold text-white">{p.title}</p>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-white/60">{p.category}</td>
                  <td className="py-3 px-3">
                    {p.isConcept ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                        <Sparkles size={10} /> Concept Demo
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Client Deployment
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-white/40 font-mono">{p.year}</td>
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <a
                        href={`/portfolio/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors"
                        title="View Case Study"
                      >
                        <Eye size={13} />
                      </a>
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg text-white/40 hover:text-[#3b82d4] hover:bg-white/[0.05] transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/[0.05] transition-colors"
                        title="Delete Project"
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0f0f18] rounded-2xl border border-white/10 w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
              <h3 className="text-base font-bold text-white">
                {editingId ? 'Edit Project' : 'Add Project to Portfolio'}
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
                  <label className="block text-xs font-medium text-white/60 mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. NextGen E-commerce Store"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Client / Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={form.client}
                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                    placeholder="e.g. UrbanCart India"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="ecommerce-prototype"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Web App, SaaS, Branding"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Year</label>
                  <input
                    type="text"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    placeholder="2025"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4] font-mono"
                  />
                </div>
              </div>

              {/* Thumbnail with Media Upload Input */}
              <MediaUploadInput
                label="Thumbnail / Hero Mockup"
                value={form.thumbnail}
                onChange={(url) => setForm({ ...form, thumbnail: url })}
                placeholder="Upload to Supabase Storage CDN"
              />

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">The Challenge</label>
                <textarea
                  rows={2}
                  value={form.challenge}
                  onChange={(e) => setForm({ ...form, challenge: e.target.value })}
                  placeholder="What was the problem, friction, or requirement?"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">The Solution & Approach</label>
                <textarea
                  rows={2}
                  value={form.solution}
                  onChange={(e) => setForm({ ...form, solution: e.target.value })}
                  placeholder="How did Growmybizz solve it?"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Measurable Outcome / Metric *</label>
                <input
                  type="text"
                  required
                  value={form.outcome}
                  onChange={(e) => setForm({ ...form, outcome: e.target.value })}
                  placeholder="+42% checkout conversions, 1.1s load time"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Technologies (comma separated)</label>
                <input
                  type="text"
                  value={form.technologies_str}
                  onChange={(e) => setForm({ ...form, technologies_str: e.target.value })}
                  placeholder="Next.js, TypeScript, Tailwind, Stripe"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4] font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_concept"
                    checked={form.is_concept}
                    onChange={(e) => setForm({ ...form, is_concept: e.target.checked })}
                    className="rounded bg-white/10 border-white/20 text-[#3b82d4]"
                  />
                  <label htmlFor="is_concept" className="text-xs text-amber-300 font-medium">
                    Concept Demonstration (Pitch Deck standard)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="rounded bg-white/10 border-white/20 text-[#3b82d4]"
                  />
                  <label htmlFor="is_featured" className="text-xs text-white/80">
                    Feature on Homepage
                  </label>
                </div>
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
                  <span>{editingId ? 'Save Changes' : 'Publish Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
