'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Save,
  Check,
  Loader2,
  Plus,
  Trash2,
  Eye,
  RefreshCw,
  Sparkles,
  ArrowRight,
  SplitSquareVertical,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import MediaUploadInput from './MediaUploadInput';
import type { BeforeAfterShowcase, BeforeAfterMetric } from '@/data/beforeAfterShowcase';
import { defaultBeforeAfterShowcases } from '@/data/beforeAfterShowcase';

const SERVICE_OPTIONS = [
  { slug: 'web-app-development', name: 'Web & E-Commerce Engineering', icon: '💻' },
  { slug: 'ai-automation', name: 'AI Agents & WhatsApp Automation', icon: '🤖' },
  { slug: 'design-branding', name: 'Design Systems & Brand Identity', icon: '🎨' },
  { slug: 'digital-marketing', name: 'Performance Ads & Technical SEO', icon: '📈' },
  { slug: 'mobile-app', name: 'Native Mobile App Development', icon: '📱' },
  { slug: 'video-content', name: '3D Kinetic Motion & Video Production', icon: '🎬' },
];

export default function BeforeAfterPanel() {
  const [items, setItems] = useState<BeforeAfterShowcase[]>(defaultBeforeAfterShowcases);
  const [selectedId, setSelectedId] = useState<string>(defaultBeforeAfterShowcases[0]?.id || '');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [source, setSource] = useState<'supabase' | 'default'>('default');
  const [previewSliderPos, setPreviewSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/before-after');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
          setSource(data.source || 'supabase');
          if (!data.items.find((i: BeforeAfterShowcase) => i.id === selectedId)) {
            setSelectedId(data.items[0].id);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load showcases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedItem = items.find((i) => i.id === selectedId) || items[0];

  const updateSelectedItem = (fields: Partial<BeforeAfterShowcase>) => {
    if (!selectedItem) return;
    setItems((prev) =>
      prev.map((item) => (item.id === selectedItem.id ? { ...item, ...fields } : item))
    );
  };

  const handleMetricChange = (index: number, metricFields: Partial<BeforeAfterMetric>) => {
    if (!selectedItem) return;
    const updatedMetrics = [...selectedItem.metrics];
    updatedMetrics[index] = { ...updatedMetrics[index], ...metricFields };
    updateSelectedItem({ metrics: updatedMetrics });
  };

  const handleAddMetric = () => {
    if (!selectedItem) return;
    const newMetric: BeforeAfterMetric = {
      label: 'New Conversion Metric',
      before: '1.0x',
      after: '3.5x',
      lift: '+250% Lift',
      isPositive: true,
    };
    updateSelectedItem({ metrics: [...selectedItem.metrics, newMetric] });
  };

  const handleRemoveMetric = (index: number) => {
    if (!selectedItem || selectedItem.metrics.length <= 1) return;
    const updatedMetrics = selectedItem.metrics.filter((_, idx) => idx !== index);
    updateSelectedItem({ metrics: updatedMetrics });
  };

  const handleAddNewItem = () => {
    const newId = `transformation-${Date.now()}`;
    const newItem: BeforeAfterShowcase = {
      id: newId,
      serviceSlug: 'web-app-development',
      serviceName: 'Web & E-Commerce Engineering',
      clientName: 'New Client Redesign',
      industry: 'Technology & D2C',
      tagline: 'From legacy low-conversion site to lightning modern platform',
      description:
        'Detailed breakdown of client pain points, how Growmybiz24 rebuilt the architecture, and the measurable business outcome achieved.',
      beforeImage: '/transformations/before-ecommerce.svg',
      afterImage: '/transformations/after-ecommerce.svg',
      beforeLabel: 'Previous Outdated Design',
      afterLabel: 'Growmybiz24 High-Speed Redesign',
      beforeSummary: 'Slow load • low trust • poor mobile conversion',
      afterSummary: 'Sub-second edge speed • high-converting design • 3x revenue',
      metrics: [
        { label: 'Conversion Rate', before: '1.2%', after: '4.5%', lift: '+275% Lift', isPositive: true },
        { label: 'Page Speed', before: '4.2s', after: '0.4s', lift: '-90% Faster', isPositive: true },
        { label: 'Monthly Inquiries', before: '15', after: '85', lift: '5.6x Growth', isPositive: true },
      ],
      deliverables: ['Custom Next.js Frontend', 'Cloudflare Edge Deployment', 'Lead Tracking CRM'],
      testimonial: {
        quote: 'Working with Growmybiz24 transformed our online presence and doubled our qualified leads in month one.',
        author: 'Founder Name',
        role: 'Chief Executive Officer',
        company: 'Client Company',
      },
      ctaText: 'Get a Similar Transformation',
      ctaService: 'web-app-development',
    };
    setItems((prev) => [newItem, ...prev]);
    setSelectedId(newId);
  };

  const handleDeleteItem = (idToDelete: string) => {
    if (items.length <= 1) {
      alert('You must keep at least one showcase item.');
      return;
    }
    if (!confirm('Are you sure you want to delete this before & after showcase?')) return;
    const filtered = items.filter((i) => i.id !== idToDelete);
    setItems(filtered);
    if (selectedId === idToDelete) {
      setSelectedId(filtered[0].id);
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset all before & after showcases back to the official default case studies?')) {
      setItems(defaultBeforeAfterShowcases);
      setSelectedId(defaultBeforeAfterShowcases[0].id);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/before-after', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save showcases');
      }

      setSaved(true);
      setSource('supabase');
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving showcases');
    } finally {
      setSaving(false);
    }
  };

  // Drag interaction for admin preview
  const handlePreviewMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setPreviewSliderPos((x / rect.width) * 100);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-white/50">
        <Loader2 className="w-8 h-8 animate-spin text-[#477BDB] mb-3" />
        <p className="text-sm">Loading Before & After Showcases from Supabase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#477BDB]/20 to-[#10B981]/20 border border-[#477BDB]/30 flex items-center justify-center text-[#477BDB]">
            <SplitSquareVertical className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Before & After Showcase Studio</h2>
              <span
                className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                  source === 'supabase'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {source === 'supabase' ? 'Live Supabase Sync' : 'Default Preset'}
              </span>
            </div>
            <p className="text-xs text-white/60">
              Interactive split comparison sliders showing proof across all 6 agency disciplines.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetToDefaults}
            className="px-3 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 border border-white/10 transition-colors flex items-center gap-1.5"
            title="Reset to default case studies"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            onClick={handleAddNewItem}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            Add Transformation
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#477BDB] to-[#2563EB] hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4 text-emerald-300" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Publishing...' : saved ? 'Published Live!' : 'Publish to Live'}
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Sidebar List + Editor Form + Live Interactive Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Showcase List (3 cols) */}
        <div className="lg:col-span-3 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/50 px-1 mb-2">
            Discipline Showcases ({items.length})
          </div>
          <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
            {items.map((item) => {
              const serviceOpt = SERVICE_OPTIONS.find((s) => s.slug === item.serviceSlug);
              const isSelected = item.id === selectedId;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#477BDB]/15 to-white/[0.04] border-[#477BDB]/50 shadow-md shadow-blue-900/20'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-semibold text-[#38BDF8] flex items-center gap-1">
                      <span>{serviceOpt?.icon || '⚡'}</span>
                      <span className="truncate">{item.serviceName}</span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                      className="text-white/30 hover:text-red-400 p-1 transition-colors"
                      title="Delete showcase"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-sm font-bold text-white truncate">{item.clientName}</div>
                  <div className="text-xs text-white/50 truncate mt-0.5">{item.industry}</div>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {item.metrics[0]?.lift || 'Transformation Verified'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Column: Form Editor (5 cols) */}
        {selectedItem && (
          <div className="lg:col-span-5 space-y-5 bg-white/[0.02] border border-white/10 rounded-2xl p-5 max-h-[800px] overflow-y-auto">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Edit Transformation</h3>
                <p className="text-xs text-white/50">ID: {selectedItem.id}</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-white/70 border border-white/10">
                {selectedItem.serviceName}
              </span>
            </div>

            {/* Service Category & Client */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-white/60 mb-1 block">Service Discipline</label>
                <select
                  value={selectedItem.serviceSlug}
                  onChange={(e) => {
                    const found = SERVICE_OPTIONS.find((s) => s.slug === e.target.value);
                    updateSelectedItem({
                      serviceSlug: e.target.value as any,
                      serviceName: found?.name || selectedItem.serviceName,
                    });
                  }}
                  className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 rounded-xl text-white focus:border-[#477BDB] outline-none"
                >
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt.slug} value={opt.slug} className="bg-slate-900 text-white">
                      {opt.icon} {opt.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-white/60 mb-1 block">Client Name</label>
                <input
                  type="text"
                  value={selectedItem.clientName}
                  onChange={(e) => updateSelectedItem({ clientName: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 rounded-xl text-white focus:border-[#477BDB] outline-none"
                  placeholder="e.g. Sunday Loom Luxury"
                />
              </div>
            </div>

            {/* Industry & Tagline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-white/60 mb-1 block">Industry / Niche</label>
                <input
                  type="text"
                  value={selectedItem.industry}
                  onChange={(e) => updateSelectedItem({ industry: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 rounded-xl text-white focus:border-[#477BDB] outline-none"
                  placeholder="e.g. D2C Fashion & Handcrafted Silk"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-white/60 mb-1 block">Headline / Tagline</label>
                <input
                  type="text"
                  value={selectedItem.tagline}
                  onChange={(e) => updateSelectedItem({ tagline: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 rounded-xl text-white focus:border-[#477BDB] outline-none"
                  placeholder="From 4.8s lag to sub-second edge..."
                />
              </div>
            </div>

            {/* Case Study Description */}
            <div>
              <label className="text-xs font-medium text-white/60 mb-1 block">Case Study Breakdown</label>
              <textarea
                rows={3}
                value={selectedItem.description}
                onChange={(e) => updateSelectedItem({ description: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 rounded-xl text-white focus:border-[#477BDB] outline-none leading-relaxed"
                placeholder="Explain the before situation, technical transformation, and commercial business impact..."
              />
            </div>

            {/* Visual Assets Comparison */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <SplitSquareVertical className="w-3.5 h-3.5 text-amber-400" />
                Comparison Visuals (Before &amp; After)
              </div>

              {/* Before Asset */}
              <div className="space-y-2">
                <MediaUploadInput
                  label="Before Screenshot / Asset"
                  value={selectedItem.beforeImage}
                  onChange={(url) => updateSelectedItem({ beforeImage: url })}
                  placeholder="/transformations/before-ecommerce.svg or upload"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={selectedItem.beforeLabel}
                    onChange={(e) => updateSelectedItem({ beforeLabel: e.target.value })}
                    className="px-2.5 py-1.5 text-xs bg-black/40 border border-white/15 rounded-lg text-white"
                    placeholder="Before badge label"
                  />
                  <input
                    type="text"
                    value={selectedItem.beforeSummary}
                    onChange={(e) => updateSelectedItem({ beforeSummary: e.target.value })}
                    className="px-2.5 py-1.5 text-xs bg-black/40 border border-white/15 rounded-lg text-white"
                    placeholder="Before key stats summary"
                  />
                </div>
              </div>

              {/* After Asset */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <MediaUploadInput
                  label="After Screenshot / Asset"
                  value={selectedItem.afterImage}
                  onChange={(url) => updateSelectedItem({ afterImage: url })}
                  placeholder="/transformations/after-ecommerce.svg or upload"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={selectedItem.afterLabel}
                    onChange={(e) => updateSelectedItem({ afterLabel: e.target.value })}
                    className="px-2.5 py-1.5 text-xs bg-black/40 border border-white/15 rounded-lg text-white"
                    placeholder="After badge label"
                  />
                  <input
                    type="text"
                    value={selectedItem.afterSummary}
                    onChange={(e) => updateSelectedItem({ afterSummary: e.target.value })}
                    className="px-2.5 py-1.5 text-xs bg-black/40 border border-white/15 rounded-lg text-white"
                    placeholder="After key stats summary"
                  />
                </div>
              </div>
            </div>

            {/* Metrics Section */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Measurable Business Metrics
                </span>
                <button
                  onClick={handleAddMetric}
                  className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Metric
                </button>
              </div>

              <div className="space-y-2">
                {selectedItem.metrics.map((metric, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-black/30 border border-white/10 grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={metric.label}
                        onChange={(e) => handleMetricChange(idx, { label: e.target.value })}
                        className="w-full px-2 py-1 text-[11px] bg-black/40 border border-white/10 rounded text-white"
                        placeholder="Metric label"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={metric.before}
                        onChange={(e) => handleMetricChange(idx, { before: e.target.value })}
                        className="w-full px-2 py-1 text-[11px] bg-black/40 border border-white/10 rounded text-red-400"
                        placeholder="Before"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={metric.after}
                        onChange={(e) => handleMetricChange(idx, { after: e.target.value })}
                        className="w-full px-2 py-1 text-[11px] bg-black/40 border border-white/10 rounded text-emerald-400 font-bold"
                        placeholder="After"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={metric.lift}
                        onChange={(e) => handleMetricChange(idx, { lift: e.target.value })}
                        className="w-full px-2 py-1 text-[11px] bg-black/40 border border-white/10 rounded text-blue-300"
                        placeholder="+330% Lift"
                      />
                    </div>
                    <div className="col-span-1 text-right">
                      <button
                        onClick={() => handleRemoveMetric(idx)}
                        disabled={selectedItem.metrics.length <= 1}
                        className="text-white/30 hover:text-red-400 disabled:opacity-20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
              <span className="text-xs font-bold text-white block">Client Testimonial Quote</span>
              <textarea
                rows={2}
                value={selectedItem.testimonial?.quote || ''}
                onChange={(e) =>
                  updateSelectedItem({
                    testimonial: {
                      quote: e.target.value,
                      author: selectedItem.testimonial?.author || '',
                      role: selectedItem.testimonial?.role || '',
                      company: selectedItem.testimonial?.company || '',
                    },
                  })
                }
                className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 rounded-xl text-white outline-none"
                placeholder="Client quote about the outcome..."
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={selectedItem.testimonial?.author || ''}
                  onChange={(e) =>
                    updateSelectedItem({
                      testimonial: {
                        quote: selectedItem.testimonial?.quote || '',
                        author: e.target.value,
                        role: selectedItem.testimonial?.role || '',
                        company: selectedItem.testimonial?.company || '',
                      },
                    })
                  }
                  className="px-2.5 py-1.5 text-xs bg-black/40 border border-white/15 rounded-lg text-white"
                  placeholder="Author"
                />
                <input
                  type="text"
                  value={selectedItem.testimonial?.role || ''}
                  onChange={(e) =>
                    updateSelectedItem({
                      testimonial: {
                        quote: selectedItem.testimonial?.quote || '',
                        author: selectedItem.testimonial?.author || '',
                        role: e.target.value,
                        company: selectedItem.testimonial?.company || '',
                      },
                    })
                  }
                  className="px-2.5 py-1.5 text-xs bg-black/40 border border-white/15 rounded-lg text-white"
                  placeholder="Role"
                />
                <input
                  type="text"
                  value={selectedItem.testimonial?.company || ''}
                  onChange={(e) =>
                    updateSelectedItem({
                      testimonial: {
                        quote: selectedItem.testimonial?.quote || '',
                        author: selectedItem.testimonial?.author || '',
                        role: selectedItem.testimonial?.role || '',
                        company: e.target.value,
                      },
                    })
                  }
                  className="px-2.5 py-1.5 text-xs bg-black/40 border border-white/15 rounded-lg text-white"
                  placeholder="Company"
                />
              </div>
            </div>
          </div>
        )}

        {/* Right Column: Live Interactive Slider Preview (4 cols) */}
        {selectedItem && (
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-white/50 px-1">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#38BDF8]" />
                Live Slider Preview
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                Split: {Math.round(previewSliderPos)}%
              </span>
            </div>

            {/* Split Slider Preview Box */}
            <div
              className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/20 select-none bg-slate-950 shadow-2xl cursor-ew-resize"
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handlePreviewMouseMove}
            >
              {/* After Image (Full background) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedItem.afterImage}
                alt="After Transformation"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />

              {/* Before Image (Clipped overlay) */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ width: `${previewSliderPos}%` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedItem.beforeImage}
                  alt="Before Transformation"
                  className="absolute inset-0 max-w-none w-full h-full object-cover"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>

              {/* Split Line & Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] pointer-events-none z-10"
                style={{ left: `${previewSliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center font-bold text-xs border-2 border-[#477BDB]">
                  ⇄
                </div>
              </div>

              {/* Badges */}
              <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/75 backdrop-blur-md text-[10px] font-bold text-red-400 border border-red-500/30 pointer-events-none z-20">
                BEFORE
              </div>
              <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/75 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-emerald-500/30 pointer-events-none z-20">
                AFTER
              </div>
            </div>

            {/* Preview Metrics Card */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{selectedItem.clientName}</span>
                <span className="text-[10px] text-[#38BDF8] px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                  {selectedItem.serviceName}
                </span>
              </div>
              <p className="text-xs text-white/70 italic line-clamp-2">
                &ldquo;{selectedItem.tagline}&rdquo;
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                {selectedItem.metrics.slice(0, 4).map((m, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-black/40 border border-white/5">
                    <div className="text-[10px] text-white/50 truncate">{m.label}</div>
                    <div className="text-xs font-bold text-emerald-400">{m.lift}</div>
                    <div className="text-[9px] text-white/40">
                      {m.before} → {m.after}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                Drag the slider above to preview the split-screen comparison. Click <strong>Publish to Live</strong> to push changes to the live website.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
