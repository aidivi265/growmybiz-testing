'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, Loader2, Check, X, Briefcase } from 'lucide-react';
import type { Service } from '@/types';

interface ServiceFormState {
  id?: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  icon_name: string;
  color: string;
  featured: boolean;
  deliverables_text: string;
}

export default function ServicesPanel() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string>('loading');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<ServiceFormState>({
    slug: '',
    title: '',
    short_description: '',
    description: '',
    icon_name: 'Code2',
    color: '#477BDB',
    featured: true,
    deliverables_text: '',
  });

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/services');
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
        setSource(data.source || 'supabase');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      slug: '',
      title: '',
      short_description: '',
      description: '',
      icon_name: 'Code2',
      color: '#477BDB',
      featured: true,
      deliverables_text: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (s: Service) => {
    setEditingId(s.id);
    const deliverables = Array.isArray(s.offerings)
      ? s.offerings.map((o) => o.title).join('\n')
      : '';
    setForm({
      id: s.id,
      slug: s.slug,
      title: s.title,
      short_description: s.shortDescription,
      description: s.description,
      icon_name: s.icon || 'Code2',
      color: s.color || '#477BDB',
      featured: s.featured ?? true,
      deliverables_text: deliverables,
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
    if (!form.title || !form.slug) return;

    setSaving(true);
    try {
      const offerings = form.deliverables_text
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((title, idx) => ({
          id: `item-${idx + 1}`,
          title,
          description: '',
        }));

      const payload = {
        id: editingId,
        slug: form.slug,
        title: form.title,
        short_description: form.short_description,
        description: form.description,
        icon_name: form.icon_name,
        color: form.color,
        featured: form.featured,
        offerings,
      };

      const res = await fetch('/api/admin/services', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadServices();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save service');
      }
    } catch {
      alert('Error saving service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete service "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/services?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        loadServices();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete service');
      }
    } catch {
      alert('Error deleting service');
    }
  };

  return (
    <div className="bg-[#0d0d14] rounded-xl border border-white/[0.06] p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Services Management</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Engine ({source})
            </span>
          </div>
          <p className="text-xs text-white/40 mt-0.5">
            Create, edit, and organize client services. Changes instantly update the live website.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#3b82d4] hover:bg-[#2563eb] transition-all shrink-0"
        >
          <Plus size={14} />
          <span>Add Service</span>
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-12 flex items-center justify-center gap-2 text-white/40 text-xs">
          <Loader2 size={16} className="animate-spin text-[#3b82d4]" />
          <span>Loading services from database...</span>
        </div>
      ) : services.length === 0 ? (
        <div className="py-12 text-center text-white/40 text-xs">
          No services created yet. Click &quot;Add Service&quot; to publish your first offering.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-white/40">
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Slug</th>
                <th className="py-2.5 px-3">Offerings</th>
                <th className="py-2.5 px-3">Featured</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {services.map((s) => (
                <tr key={s.id || s.slug} className="hover:bg-white/[0.02] text-white/80">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${s.color || '#477BDB'}20`, color: s.color || '#477BDB' }}
                      >
                        <Briefcase size={14} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{s.title}</p>
                        <p className="text-[11px] text-white/40 line-clamp-1">{s.shortDescription}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-white/50">{s.slug}</td>
                  <td className="py-3 px-3 text-white/70">
                    {Array.isArray(s.offerings) ? `${s.offerings.length} deliverables` : '–'}
                  </td>
                  <td className="py-3 px-3">
                    {s.featured ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <Check size={10} /> Yes
                      </span>
                    ) : (
                      <span className="text-[10px] text-white/40">No</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <a
                        href={`/services/${s.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors"
                        title="View Live Page"
                      >
                        <Eye size={13} />
                      </a>
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-1.5 rounded-lg text-white/40 hover:text-[#3b82d4] hover:bg-white/[0.05] transition-colors"
                        title="Edit Service"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id, s.title)}
                        className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/[0.05] transition-colors"
                        title="Delete Service"
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
          <div className="bg-[#0f0f18] rounded-2xl border border-white/10 w-full max-w-xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
              <h3 className="text-base font-bold text-white">
                {editingId ? 'Edit Service' : 'Create New Service'}
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
                  <label className="block text-xs font-medium text-white/60 mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. AI Automation & Agents"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="ai-automation-agents"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  value={form.short_description}
                  onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                  placeholder="Summary for cards and previews (1-2 sentences)"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Full Detailed Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Complete scope overview displayed on the dedicated service detail page."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Icon Name</label>
                  <input
                    type="text"
                    value={form.icon_name}
                    onChange={(e) => setForm({ ...form, icon_name: e.target.value })}
                    placeholder="Code2, Palette, Zap, Globe"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Accent Color</label>
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    placeholder="#477BDB"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">
                  Deliverables & Offerings (1 per line)
                </label>
                <textarea
                  rows={3}
                  value={form.deliverables_text}
                  onChange={(e) => setForm({ ...form, deliverables_text: e.target.value })}
                  placeholder="Custom Web App&#10;E-commerce Setup&#10;Lead Funnel Optimization"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4] font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded bg-white/10 border-white/20 text-[#3b82d4]"
                />
                <label htmlFor="featured" className="text-xs text-white/80">
                  Feature on Homepage Overview
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
                  <span>{editingId ? 'Save Changes' : 'Create Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
