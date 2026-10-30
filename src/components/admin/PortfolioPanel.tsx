'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Edit2, Trash2, Eye, Loader2, Sparkles, X, FolderOpen, AlertCircle, CheckCircle2, Globe, ExternalLink } from 'lucide-react';
import MediaUploadInput from './MediaUploadInput';
import type { PortfolioItem } from '@/types';

interface PortfolioFormState {
  id?: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  industry: string;
  serviceSlug: string;
  liveUrl: string;
  year: string;
  thumbnail: string;
  challenge: string;
  solution: string;
  outcome: string;
  technologies_str: string;
  is_concept: boolean;
  is_featured: boolean;
}

const DEFAULT_FORM: PortfolioFormState = {
  slug: '',
  title: '',
  client: '',
  category: 'Web & App Development',
  industry: 'E-Commerce & D2C Brands',
  serviceSlug: 'web-app-development',
  liveUrl: '',
  year: '2025',
  thumbnail: '/portfolio/ecommerce-ux.svg',
  challenge: '',
  solution: '',
  outcome: '',
  technologies_str: 'Next.js, TypeScript, Tailwind CSS',
  is_concept: false,
  is_featured: true,
};

export default function PortfolioPanel() {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string>('loading');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [showCustomUpload, setShowCustomUpload] = useState(false);

  const [form, setForm] = useState<PortfolioFormState>(DEFAULT_FORM);

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
      console.error('Failed to load portfolio items:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormError(null);
    setShowCustomUpload(false);
    setForm({
      ...DEFAULT_FORM,
      year: String(new Date().getFullYear()),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: PortfolioItem) => {
    setEditingId(p.id);
    setFormError(null);
    setShowCustomUpload(false);
    const metricsArr = Array.isArray(p.metrics) ? p.metrics : [];
    const ind = p.industry || metricsArr.find((m: any) => m.label === '_industry')?.value || '';
    const sSlug = p.serviceSlug || metricsArr.find((m: any) => m.label === '_serviceSlug')?.value || 'web-app-development';
    const liveUrl = p.liveUrl || (p as any).live_url || metricsArr.find((m: any) => m.label === '_liveUrl')?.value || '';

    setForm({
      id: p.id,
      slug: p.slug,
      title: p.title,
      client: p.client,
      category: p.category || 'Web & App Development',
      industry: ind,
      serviceSlug: sSlug,
      liveUrl,
      year: String(p.year || 2025),
      thumbnail: p.thumbnail || '/portfolio/ecommerce-ux.svg',
      challenge: p.challenge || '',
      solution: p.solution || p.approach || '',
      outcome: p.outcome || '',
      technologies_str: Array.isArray(p.technologies) ? p.technologies.join(', ') : '',
      is_concept: (p as any).is_concept ?? p.isConcept ?? false,
      is_featured: (p as any).is_featured ?? p.featured ?? true,
    });
    setIsModalOpen(true);
  };

  const handleLiveUrlChange = (val: string) => {
    let cleanUrl = val.trim();
    if (cleanUrl && !/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }

    // High-resolution automated screenshot endpoint
    const screenshotUrl = cleanUrl
      ? `https://s0.wp.com/mshots/v1/${encodeURIComponent(cleanUrl)}?w=1280&h=800`
      : '';

    setForm((prev) => ({
      ...prev,
      liveUrl: val,
      // If user provided a live URL, use the real-time screenshot as the primary cover photo
      thumbnail: screenshotUrl || prev.thumbnail || '/portfolio/ecommerce-ux.svg',
    }));
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
    setFormError(null);

    if (!form.title.trim()) {
      setFormError('Please enter a project title.');
      return;
    }
    if (!form.client.trim()) {
      setFormError('Please enter a client or brand name.');
      return;
    }
    if (!form.slug.trim()) {
      setFormError('Please enter a unique URL slug.');
      return;
    }

    setSaving(true);
    try {
      const technologies = form.technologies_str
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const metrics = [
        { label: '_industry', value: form.industry },
        { label: '_serviceSlug', value: form.serviceSlug },
      ];

      const cleanLiveUrl = form.liveUrl.trim();
      if (cleanLiveUrl) {
        const formattedLiveUrl = /^https?:\/\//i.test(cleanLiveUrl) ? cleanLiveUrl : `https://${cleanLiveUrl}`;
        metrics.push({ label: '_liveUrl', value: formattedLiveUrl });
      }

      const cleanSlug = form.slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const payload = {
        id: editingId,
        slug: cleanSlug,
        title: form.title.trim(),
        client: form.client.trim(),
        category: form.category.trim(),
        liveUrl: cleanLiveUrl ? (/^https?:\/\//i.test(cleanLiveUrl) ? cleanLiveUrl : `https://${cleanLiveUrl}`) : '',
        metrics,
        year: form.year.trim() || '2025',
        thumbnail: form.thumbnail.trim() || '/portfolio/ecommerce-ux.svg',
        challenge: form.challenge.trim(),
        solution: form.solution.trim(),
        outcome: form.outcome.trim(),
        technologies,
        is_concept: form.is_concept,
        is_featured: form.is_featured,
      };

      const res = await fetch('/api/admin/portfolio', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || 'Failed to save project. Please check the fields and try again.');
        setSaving(false);
        return;
      }

      // Success
      setIsModalOpen(false);
      setSuccessToast(editingId ? 'Project updated successfully!' : 'Project published to portfolio successfully!');
      setTimeout(() => setSuccessToast(null), 4000);
      await loadProjects();
    } catch (err: any) {
      setFormError(err?.message || 'Error connecting to server. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete project "${title}"?`)) return;

    try {
      setProjects((prev) => prev.filter((p) => p.id !== id && p.slug !== id));

      const res = await fetch(`/api/admin/portfolio?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSuccessToast(`Deleted "${title}"`);
        setTimeout(() => setSuccessToast(null), 3000);
        loadProjects();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete project');
        loadProjects();
      }
    } catch {
      alert('Error deleting project');
      loadProjects();
    }
  };

  return (
    <div className="bg-[#0d0d14] rounded-xl border border-white/[0.06] p-5">
      {/* Toast Alert */}
      {successToast && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 size={15} />
          <span>{successToast}</span>
        </div>
      )}

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
            Add, update, or remove portfolio projects, case studies, and prototypes with live metrics.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#3b82d4] hover:bg-[#2563eb] transition-all shrink-0 cursor-pointer shadow-lg shadow-blue-500/10"
        >
          <Plus size={15} />
          <span>Add Project</span>
        </button>
      </div>

      {/* Table / Empty State */}
      {loading ? (
        <div className="py-16 flex items-center justify-center gap-2 text-white/40 text-xs">
          <Loader2 size={16} className="animate-spin text-[#3b82d4]" />
          <span>Loading portfolio items...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="py-16 text-center text-white/50 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 mx-auto flex items-center justify-center text-white/40">
            <FolderOpen size={26} className="text-[#3b82d4]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">No Projects Added Yet</h3>
            <p className="text-xs text-white/40 mt-1 max-w-sm mx-auto">
              Your portfolio is ready for your custom work. Click the button below to add your first case study or client prototype.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#3b82d4] hover:bg-[#2563eb] transition-all cursor-pointer shadow-md shadow-blue-500/20"
            >
              <Plus size={15} />
              <span>Add First Project</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-white/40">
                <th className="py-2.5 px-3">Client & Title</th>
                <th className="py-2.5 px-3">Category & Industry</th>
                <th className="py-2.5 px-3">Classification</th>
                <th className="py-2.5 px-3">Year</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {projects.map((p) => {
                const metricsArr = Array.isArray(p.metrics) ? p.metrics : [];
                const ind = p.industry || metricsArr.find((m: any) => m.label === '_industry')?.value;
                const liveUrl = p.liveUrl || (p as any).live_url || metricsArr.find((m: any) => m.label === '_liveUrl')?.value;
                const isConcept = (p as any).is_concept ?? p.isConcept ?? false;

                return (
                  <tr key={p.id || p.slug} className="hover:bg-white/[0.02] text-white/80">
                    <td className="py-3 px-3">
                      <div>
                        <p className="text-[11px] text-[#32A88A] font-bold uppercase tracking-wider">{p.client}</p>
                        <p className="font-semibold text-white">{p.title}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-[10px] text-white/30 font-mono">/portfolio/{p.slug}</span>
                          {liveUrl && (
                            <a
                              href={liveUrl.startsWith('http') ? liveUrl : `https://${liveUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
                              title={`Visit: ${liveUrl}`}
                            >
                              <Globe size={10} />
                              <span>Live Site</span>
                              <ExternalLink size={9} />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <p className="text-white/70 font-medium">{p.category}</p>
                      {ind && (
                        <span className="inline-block mt-0.5 text-[10px] text-cyan-300 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded-md font-mono">
                          {ind}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {isConcept ? (
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
                          title="View Live Page"
                        >
                          <Eye size={14} />
                        </a>
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-white/40 hover:text-[#3b82d4] hover:bg-white/[0.05] transition-colors cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/[0.05] transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Protected Create / Edit Modal (Sticky Header & Sticky Footer) ── */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Container */}
          <div
            className="bg-[#0f0f18] rounded-2xl border border-white/15 w-full max-w-2xl shadow-2xl flex flex-col max-h-[92vh] text-white overflow-hidden"
          >
            {/* Sticky Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#12121d] shrink-0">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {editingId ? 'Edit Portfolio Project' : 'Add Project to Portfolio'}
                </h3>
                <p className="text-xs text-white/40 mt-0.5">
                  {editingId ? 'Update project deliverables and live metrics' : 'Enter project details to publish to your live website'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="portfolio-form" onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Form Error Banner */}
              {formError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-2.5">
                  <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-200">Unable to Save</p>
                    <p className="mt-0.5">{formError}</p>
                  </div>
                </div>
              )}

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. NextGen E-commerce Store"
                    className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4] focus:ring-1 focus:ring-[#3b82d4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">Client / Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={form.client}
                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                    placeholder="e.g. UrbanCart India"
                    className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4] focus:ring-1 focus:ring-[#3b82d4]"
                  />
                </div>
              </div>

              {/* Slug, Category, Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="ecommerce-store"
                    className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4] font-mono"
                  />
                  <p className="text-[10px] text-white/30 mt-1 truncate">/portfolio/{form.slug || 'slug'}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Web & App Development"
                    className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">Year</label>
                  <input
                    type="text"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    placeholder="2025"
                    className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4] font-mono"
                  />
                </div>
              </div>

              {/* Smart Niche & Linked Service */}
              <div className="p-4 rounded-xl bg-blue-500/[0.04] border border-blue-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-400">Target Industry & Linked Service</span>
                  <span className="text-[10px] text-white/40">Connects with service pages</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-white/70 mb-1">Target Industry / Niche</label>
                    <input
                      type="text"
                      value={form.industry}
                      onChange={(e) => setForm({ ...form, industry: e.target.value })}
                      placeholder="e.g. E-Commerce & D2C Brands"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-white/70 mb-1">Linked Service Page</label>
                    <select
                      value={form.serviceSlug}
                      onChange={(e) => setForm({ ...form, serviceSlug: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3b82d4]"
                    >
                      <option value="web-app-development" className="bg-[#0f172a] text-white">Web & App Development</option>
                      <option value="design-branding" className="bg-[#0f172a] text-white">Design & Branding</option>
                      <option value="digital-marketing" className="bg-[#0f172a] text-white">Digital Marketing & Paid Ads</option>
                      <option value="video-content" className="bg-[#0f172a] text-white">Video & Content</option>
                      <option value="ai-automation" className="bg-[#0f172a] text-white">AI & Business Automation</option>
                      <option value="other-digital-services" className="bg-[#0f172a] text-white">Other Digital Services</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'E-Commerce & D2C Brands',
                    'B2B SaaS & Tech Startups',
                    'Cafes & Hospitality',
                    'Healthcare & Clinics',
                    'Real Estate & Builders',
                    'Fitness & Wellness',
                  ].map((sug) => (
                    <button
                      type="button"
                      key={sug}
                      onClick={() => setForm({ ...form, industry: sug })}
                      className={`text-[10px] px-2 py-0.5 rounded transition-colors cursor-pointer ${
                        form.industry === sug
                          ? 'bg-blue-600 text-white font-medium'
                          : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Live Website URL & Automated Screenshot Engine ── */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/[0.07] via-[#151c28] to-[#0f172a] border border-emerald-500/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe size={15} className="text-emerald-400" />
                    <span className="text-xs font-bold text-white tracking-wide">Live Website / Project URL</span>
                    <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      Auto Screenshot
                    </span>
                  </div>
                  {form.liveUrl && (
                    <a
                      href={form.liveUrl.startsWith('http') ? form.liveUrl : `https://${form.liveUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 hover:underline"
                    >
                      <span>Visit Live Link</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    value={form.liveUrl}
                    onChange={(e) => handleLiveUrlChange(e.target.value)}
                    placeholder="e.g. https://urbancart.in or https://clientbrand.com"
                    className="w-full bg-white/[0.06] border border-emerald-500/30 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono"
                  />
                  <p className="text-[11px] text-white/50 mt-1.5 leading-relaxed">
                    💡 <strong className="text-white/80">Website Photo &amp; Live Link:</strong> Enter the project&apos;s website URL. Our system captures a real-time live screenshot to use as the project photo across the website, and adds a clickable &quot;Visit Live Website&quot; link for all visitors.
                  </p>
                </div>

                {/* Screenshot Live Preview */}
                {form.thumbnail && (
                  <div className="rounded-xl overflow-hidden border border-white/10 bg-black/50 p-2.5 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-white/70 font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Website Photo Preview
                      </span>
                      {form.thumbnail.includes('mshots') ? (
                        <span className="text-[10px] text-emerald-400/90 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">
                          Live Automated Screenshot
                        </span>
                      ) : (
                        <span className="text-[10px] text-blue-400/90 font-mono bg-blue-500/10 px-2 py-0.5 rounded">
                          Custom Cover Uploaded
                        </span>
                      )}
                    </div>
                    <div className="relative w-full h-36 rounded-lg overflow-hidden border border-white/10 bg-[#0d1117] flex items-center justify-center">
                      <img
                        src={form.thumbnail}
                        alt="Project Preview"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>
                )}

                {/* Optional Custom Graphic Upload Accordion */}
                <div className="pt-2 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setShowCustomUpload(!showCustomUpload)}
                    className="text-[11px] text-white/50 hover:text-white/90 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>{showCustomUpload ? '▲ Hide custom image upload' : '▼ Want to upload a custom mockup or logo instead? (Optional)'}</span>
                  </button>

                  {showCustomUpload && (
                    <div className="mt-3 pt-2">
                      <MediaUploadInput
                        label="Custom Cover Mockup (Upload to Supabase Storage)"
                        value={form.thumbnail}
                        onChange={(url) => setForm({ ...form, thumbnail: url })}
                        placeholder="Upload photo or enter URL"
                        helperText="Upload custom design mockup or photo. It will override the automated screenshot."
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Challenge */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">The Challenge / Problem</label>
                <textarea
                  rows={2}
                  value={form.challenge}
                  onChange={(e) => setForm({ ...form, challenge: e.target.value })}
                  placeholder="What was the client's problem or initial challenge?"
                  className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                />
              </div>

              {/* Solution */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">The Solution & Approach</label>
                <textarea
                  rows={2}
                  value={form.solution}
                  onChange={(e) => setForm({ ...form, solution: e.target.value })}
                  placeholder="How did you solve it and what was delivered?"
                  className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                />
              </div>

              {/* Outcome */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Measurable Outcome / Result</label>
                <input
                  type="text"
                  value={form.outcome}
                  onChange={(e) => setForm({ ...form, outcome: e.target.value })}
                  placeholder="e.g. +42% checkout conversion, 1.1s load time"
                  className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                />
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Technologies Used (comma separated)</label>
                <input
                  type="text"
                  value={form.technologies_str}
                  onChange={(e) => setForm({ ...form, technologies_str: e.target.value })}
                  placeholder="Next.js, TypeScript, Tailwind CSS, Supabase"
                  className="w-full bg-white/[0.04] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4] font-mono text-[11px]"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap items-center gap-6 pt-2 pb-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.is_concept}
                    onChange={(e) => setForm({ ...form, is_concept: e.target.checked })}
                    className="w-4 h-4 rounded bg-white/10 border-white/20 text-[#3b82d4] focus:ring-0"
                  />
                  <span className="text-xs text-amber-300 font-medium">Concept / Prototype Demo</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded bg-white/10 border-white/20 text-[#3b82d4] focus:ring-0"
                  />
                  <span className="text-xs text-white/80 font-medium">Feature on Homepage</span>
                </label>
              </div>
            </form>

            {/* Sticky Footer (Buttons ALWAYS visible, NEVER hidden) */}
            <div className="px-6 py-4 border-t border-white/[0.08] bg-[#12121d] shrink-0 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="portfolio-form"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#3b82d4] hover:bg-[#2563eb] disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-blue-500/20"
              >
                {saving && <Loader2 size={13} className="animate-spin" />}
                <span>{saving ? 'Saving...' : editingId ? 'Save Changes' : 'Publish Project'}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
