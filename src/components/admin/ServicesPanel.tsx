'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, Loader2, Check, X, Briefcase, Sparkles, Layers, ShieldCheck, AlertCircle, Save } from 'lucide-react';
import type { Service, PortfolioItem } from '@/types';
import { defaultServiceCategories } from '@/data/serviceCategories';

interface ServiceFormState {
  id?: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  icon_name: string;
  color: string;
  featured: boolean;
  is_published: boolean;
  deliverables_text: string;
}

export default function ServicesPanel() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'niches'>('catalog');
  const [services, setServices] = useState<Service[]>([]);
  const [categoriesMap, setCategoriesMap] = useState<Record<string, string[]>>(defaultServiceCategories);
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string>('loading');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [categoriesSaving, setCategoriesSaving] = useState(false);
  const [categoriesSaved, setCategoriesSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Niche tab state
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string>('web-app-development');
  const [newCategoryInput, setNewCategoryInput] = useState('');

  const [form, setForm] = useState<ServiceFormState>({
    slug: '',
    title: '',
    short_description: '',
    description: '',
    icon_name: 'Code2',
    color: '#477BDB',
    featured: true,
    is_published: true,
    deliverables_text: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [servicesRes, portfolioRes] = await Promise.all([
        fetch('/api/admin/services'),
        fetch('/api/admin/portfolio'),
      ]);

      if (servicesRes.ok) {
        const data = await servicesRes.json();
        setServices(data.services || []);
        if (data.categories && typeof data.categories === 'object') {
          setCategoriesMap(data.categories);
        }
        setSource(data.source || 'supabase');
      }

      if (portfolioRes.ok) {
        const pData = await portfolioRes.json();
        setProjects(pData.projects || []);
      }
    } catch (e) {
      console.error('Failed to load services data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const toggleServiceVisibility = async (s: any) => {
    const currentStatus = s.is_published !== false;
    const nextStatus = !currentStatus;
    setTogglingId(s.id || s.slug);
    try {
      const res = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: s.id,
          is_published: nextStatus,
        }),
      });
      if (res.ok) {
        setServices((prev) =>
          prev.map((item) =>
            item.id === s.id || item.slug === s.slug
              ? ({ ...item, is_published: nextStatus } as any)
              : item
          )
        );
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update visibility');
      }
    } catch {
      alert('Error updating service visibility');
    } finally {
      setTogglingId(null);
    }
  };

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
      is_published: true,
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
      is_published: (s as any).is_published !== false,
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
        is_published: form.is_published,
        offerings,
      };

      const res = await fetch('/api/admin/services', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadData();
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
        loadData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete service');
      }
    } catch {
      alert('Error deleting service');
    }
  };

  // ── Niche Categories Handlers ───────────────────────────────────────────────
  const currentCategories = categoriesMap[selectedServiceSlug] || [];

  const handleAddCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    if (currentCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      alert('This category already exists for this service.');
      return;
    }
    const updated = {
      ...categoriesMap,
      [selectedServiceSlug]: [...currentCategories, trimmed],
    };
    setCategoriesMap(updated);
    setNewCategoryInput('');
  };

  const handleRemoveCategory = (catToRemove: string) => {
    const updated = {
      ...categoriesMap,
      [selectedServiceSlug]: currentCategories.filter((c) => c !== catToRemove),
    };
    setCategoriesMap(updated);
  };

  const handleSaveCategories = async () => {
    setCategoriesSaving(true);
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_categories',
          categories_map: categoriesMap,
        }),
      });
      if (res.ok) {
        setCategoriesSaved(true);
        setTimeout(() => setCategoriesSaved(false), 2500);
      } else {
        alert('Failed to save categories.');
      }
    } catch {
      alert('Network error while saving categories.');
    } finally {
      setCategoriesSaving(false);
    }
  };

  const countProjectsForCategory = (cat: string) => {
    const norm = cat.toLowerCase();
    const keywords = norm.split(/[,/&]+/).map((k) => k.trim()).filter((k) => k.length > 2);
    return projects.filter((p) => {
      if (!p.published) return false;
      const pInd = (p.industry || '').toLowerCase();
      const pCat = (p.category || '').toLowerCase();
      const pTags = (p.tags || []).map((t) => t.toLowerCase());
      const pTitle = (p.title || '').toLowerCase();
      return (
        pInd.includes(norm) ||
        norm.includes(pInd) ||
        pCat.includes(norm) ||
        norm.includes(pCat) ||
        keywords.some((k) => pInd.includes(k) || pCat.includes(k) || pTags.some((t) => t.includes(k) || k.includes(t)) || pTitle.includes(k))
      );
    }).length;
  };

  return (
    <div className="bg-[#0d0d14] rounded-xl border border-white/[0.06] p-5 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Services &amp; Industry Categories</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Engine ({source})
            </span>
          </div>
          <p className="text-xs text-white/40 mt-0.5">
            Manage your service catalog and industry verticals (e.g. Cafes, Hospitals, Real Estate, E-Commerce).
          </p>
        </div>

        {activeTab === 'catalog' ? (
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#3b82d4] hover:bg-[#2563eb] transition-all shrink-0 cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Service</span>
          </button>
        ) : (
          <button
            onClick={handleSaveCategories}
            disabled={categoriesSaving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shrink-0 cursor-pointer disabled:opacity-50"
          >
            {categoriesSaving ? (
              <Loader2 size={13} className="animate-spin" />
            ) : categoriesSaved ? (
              <Check size={13} />
            ) : (
              <Save size={13} />
            )}
            <span>{categoriesSaved ? 'Categories Saved!' : categoriesSaving ? 'Saving...' : 'Save Categories'}</span>
          </button>
        )}
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-[#3b82d4] text-white'
              : 'bg-white/[0.03] text-white/60 hover:text-white'
          }`}
        >
          <Briefcase size={13} />
          <span>Services Catalog ({services.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('niches')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'niches'
              ? 'bg-[#3b82d4] text-white'
              : 'bg-white/[0.03] text-white/60 hover:text-white'
          }`}
        >
          <Layers size={13} />
          <span>Industry &amp; Niche Verticals</span>
        </button>
      </div>

      {/* ── TAB 1: Services Catalog ── */}
      {activeTab === 'catalog' && (
        <>
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
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Offerings</th>
                    <th className="py-2.5 px-3">Active Verticals</th>
                    <th className="py-2.5 px-3">Featured</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {services.map((s) => {
                    const verticalsCount = (categoriesMap[s.slug] || []).length;
                    return (
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
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            onClick={() => toggleServiceVisibility(s)}
                            disabled={togglingId === (s.id || s.slug)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all cursor-pointer ${
                              (s as any).is_published !== false
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                            }`}
                            title="Click to toggle Show/Hide on website"
                          >
                            {(s as any).is_published !== false ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Live &amp; Visible</span>
                              </>
                            ) : (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                <span>Hidden (Draft)</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-white/70">
                          {Array.isArray(s.offerings) ? `${s.offerings.length} deliverables` : '–'}
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-white/70 font-mono">
                            {verticalsCount} niches
                          </span>
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
                              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                              title="Preview on Live Site"
                            >
                              <Eye size={13} />
                            </a>
                            <button
                              onClick={() => openEditModal(s)}
                              className="p-1.5 rounded-lg text-white/40 hover:text-blue-400 hover:bg-white/5 transition-colors cursor-pointer"
                              title="Edit service details"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(s.id, s.title)}
                              className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                              title="Delete service"
                            >
                              <Trash2 size={13} />
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
        </>
      )}

      {/* ── TAB 2: Industry & Niche Verticals Management ── */}
      {activeTab === 'niches' && (
        <div className="space-y-6">
          {/* Service Selector & Rule Banner */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3 text-xs text-blue-200">
            <ShieldCheck size={16} className="text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-white">Smart Website Visibility Rule Active:</p>
              <p className="text-blue-200/80 leading-relaxed">
                Categories like <strong>Cafes, Hospitals, Real Estate, E-Commerce</strong> will <strong>ONLY</strong> be displayed on the live website once you have published at least 1 project in that category. If a category has 0 projects, it remains safely hidden so your site never displays empty sections.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">
                Select Service to Manage Categories:
              </label>
              <select
                value={selectedServiceSlug}
                onChange={(e) => setSelectedServiceSlug(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs outline-none focus:border-[#3b82d4]"
              >
                {services.map((s) => (
                  <option key={s.slug} value={s.slug} className="bg-[#0f172a] text-white">
                    {s.title} ({s.slug})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-end">
              <input
                type="text"
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
                placeholder="e.g. Dental Clinics, Luxury Villas..."
                className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-[#3b82d4] w-64"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-3.5 py-2 rounded-xl bg-[#3b82d4] hover:bg-[#2563eb] text-white text-xs font-semibold cursor-pointer shrink-0 transition-colors"
              >
                + Add Niche
              </button>
            </div>
          </div>

          {/* Categories Grid with Live Website Presence Badges */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Configured Verticals for &quot;{selectedServiceSlug}&quot; ({currentCategories.length})
              </h3>
              <p className="text-[11px] text-white/40">
                Click &quot;Save Categories&quot; above after making changes.
              </p>
            </div>

            {currentCategories.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-white/10 text-center text-xs text-white/40">
                No industry categories configured for this service yet. Add one above.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentCategories.map((cat) => {
                  const projectCount = countProjectsForCategory(cat);
                  const isVisibleOnLiveSite = projectCount > 0;

                  return (
                    <div
                      key={cat}
                      className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between gap-3 hover:border-white/10 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-white truncate">{cat}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {isVisibleOnLiveSite ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              <Check size={9} /> Live ({projectCount} {projectCount === 1 ? 'project' : 'projects'})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                              <AlertCircle size={9} /> Hidden (0 projects)
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(cat)}
                        className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                        title="Remove category"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Edit/Create Service Modal ── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#0e0e18] border border-white/15 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 text-white shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h3 className="text-base font-bold text-white tracking-tight">
                {editingId ? 'Edit Service' : 'Create New Service'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/40 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Web & App Development"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#3b82d4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Slug (URL Path) *</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="e.g. web-app-development"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono outline-none focus:border-[#3b82d4]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Short Description</label>
                <input
                  type="text"
                  value={form.short_description}
                  onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                  placeholder="One-line summary for cards"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#3b82d4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Comprehensive service description"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#3b82d4]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Icon Name</label>
                  <input
                    type="text"
                    value={form.icon_name}
                    onChange={(e) => setForm({ ...form, icon_name: e.target.value })}
                    placeholder="Code2, Palette, TrendingUp"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.color}
                      onChange={(e) => setForm({ ...form, color: e.target.value })}
                      className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={form.color}
                      onChange={(e) => setForm({ ...form, color: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Featured</label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs text-white/70">Show on Home</span>
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Visibility</label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_published}
                      onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs text-emerald-400 font-medium">Live &amp; Visible</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  Deliverables &amp; Offerings (one per line)
                </label>
                <textarea
                  rows={4}
                  value={form.deliverables_text}
                  onChange={(e) => setForm({ ...form, deliverables_text: e.target.value })}
                  placeholder="Business Websites&#10;Landing Pages&#10;E-commerce Stores&#10;Web Applications"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono outline-none focus:border-[#3b82d4]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#3b82d4] hover:bg-[#2563eb] transition-all disabled:opacity-50"
                >
                  {saving && <Loader2 size={13} className="animate-spin" />}
                  <span>{editingId ? 'Update Service' : 'Create Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
