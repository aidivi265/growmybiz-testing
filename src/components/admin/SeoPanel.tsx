'use client';

import React, { useState, useEffect } from 'react';
import { Save, Check, Loader2, Globe, Search, Share2, Sparkles, Plus } from 'lucide-react';
import MediaUploadInput from './MediaUploadInput';

interface SeoRouteRecord {
  route_path: string;
  meta_title: string;
  meta_description: string;
  og_image: string;
  keywords: string[];
}

export default function SeoPanel() {
  const [routes, setRoutes] = useState<SeoRouteRecord[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [source, setSource] = useState<string>('loading');
  const [keywordInput, setKeywordInput] = useState('');

  const loadSeoData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo');
      if (res.ok) {
        const data = await res.json();
        setRoutes(data.routes || []);
        setSource(data.source || 'supabase');
      }
    } catch (e) {
      console.error('Failed to load SEO data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeoData();
  }, []);

  const currentRoute = routes[selectedRouteIndex] || routes[0];

  const handleFieldChange = (field: keyof SeoRouteRecord, value: any) => {
    const updated = [...routes];
    updated[selectedRouteIndex] = { ...updated[selectedRouteIndex], [field]: value };
    setRoutes(updated);
  };

  const addKeyword = () => {
    if (!keywordInput.trim() || !currentRoute) return;
    const existing = currentRoute.keywords || [];
    if (!existing.includes(keywordInput.trim())) {
      handleFieldChange('keywords', [...existing, keywordInput.trim()]);
    }
    setKeywordInput('');
  };

  const removeKeyword = (kw: string) => {
    if (!currentRoute) return;
    handleFieldChange(
      'keywords',
      (currentRoute.keywords || []).filter((k) => k !== kw)
    );
  };

  const handleSave = async () => {
    if (!currentRoute) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentRoute),
      });
      if (res.ok) {
        setSaved(true);
        setSource('supabase');
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      console.error('Failed to save SEO metadata:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-white/40">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading SEO Studio...</span>
      </div>
    );
  }

  const titleLength = currentRoute?.meta_title?.length || 0;
  const descLength = currentRoute?.meta_description?.length || 0;

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <div>
          <h2 className="text-lg font-semibold text-white">SEO & Social Share Studio</h2>
          <p className="text-xs text-white/50">
            Control Google Search snippets, OpenGraph social previews, and index keywords for all public routes.
            Data source: <span className="font-mono text-[#477BDB]">{source}</span>
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !currentRoute}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#477BDB] hover:bg-[#3b82d4] transition-colors disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          {saving ? (
            <Loader2 size={13} className="animate-spin" />
          ) : saved ? (
            <Check size={13} />
          ) : (
            <Save size={13} />
          )}
          <span>{saved ? 'Updated Live on Route!' : saving ? 'Publishing...' : 'Save Page SEO'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Route Selector Navigation */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-medium text-white/40 uppercase tracking-wider px-1 mb-2">
            Configured Routes ({routes.length})
          </div>
          {routes.map((r, idx) => (
            <button
              key={r.route_path}
              onClick={() => setSelectedRouteIndex(idx)}
              className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                selectedRouteIndex === idx
                  ? 'bg-[#477BDB]/10 border-[#477BDB]/40 text-white'
                  : 'bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/[0.04]'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Globe size={13} className={selectedRouteIndex === idx ? 'text-[#477BDB]' : 'text-white/40'} />
                  <span className="font-mono text-xs font-medium text-white truncate">
                    {r.route_path}
                  </span>
                </div>
                <div className="text-[11px] text-white/40 truncate mt-1">
                  {r.meta_title}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Editor & Live Snippet Previews */}
        <div className="lg:col-span-8 space-y-6">
          {currentRoute && (
            <>
              {/* Form Input Card */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="text-sm font-semibold text-white">
                    SEO Metadata for <span className="font-mono text-[#477BDB]">{currentRoute.route_path}</span>
                  </div>
                  <span className="text-[11px] font-mono text-white/40">Canonical URL</span>
                </div>

                {/* Title */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-white/70">
                      Page Meta Title Tag
                    </label>
                    <span
                      className={`text-[10px] font-mono ${
                        titleLength >= 50 && titleLength <= 60
                          ? 'text-emerald-400'
                          : titleLength > 60
                          ? 'text-amber-400'
                          : 'text-white/40'
                      }`}
                    >
                      {titleLength} / 60 chars recommended
                    </span>
                  </div>
                  <input
                    type="text"
                    value={currentRoute.meta_title}
                    onChange={(e) => handleFieldChange('meta_title', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:border-[#477BDB] outline-none"
                    placeholder="Page Title | Growmybizz"
                  />
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-white/70">
                      Meta Description Tag
                    </label>
                    <span
                      className={`text-[10px] font-mono ${
                        descLength >= 140 && descLength <= 160
                          ? 'text-emerald-400'
                          : descLength > 160
                          ? 'text-amber-400'
                          : 'text-white/40'
                      }`}
                    >
                      {descLength} / 160 chars recommended
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={currentRoute.meta_description}
                    onChange={(e) => handleFieldChange('meta_description', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:border-[#477BDB] outline-none"
                    placeholder="Search snippet summary..."
                  />
                </div>

                {/* OpenGraph Image */}
                <div>
                  <MediaUploadInput
                    label="Social Share Image (OpenGraph / Twitter Card 1200x630)"
                    value={currentRoute.og_image || '/og-image.jpg'}
                    onChange={(url) => handleFieldChange('og_image', url)}
                    helperText="Recommended dimension: 1200x630px. PNG, JPG or WebP."
                  />
                </div>

                {/* Keywords Tag Input */}
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">
                    Search Keywords & Target Indexing Terms
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                      placeholder="Add keyword tag (press Enter)..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={addKeyword}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(currentRoute.keywords || []).map((k) => (
                      <span
                        key={k}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/80 text-[11px]"
                      >
                        {k}
                        <button
                          type="button"
                          onClick={() => removeKeyword(k)}
                          className="text-white/40 hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Real-time Google Search Result Simulator */}
              <div className="p-5 rounded-2xl bg-[#202124] border border-[#3c4043] space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-mono text-white/50 mb-1">
                  <Search size={12} className="text-[#8ab4f8]" /> Google Search Result Simulation
                </div>
                <div className="text-[12px] text-[#bdc1c6] flex items-center gap-1 font-sans">
                  <span>https://growmybizz.vercel.app</span>
                  <span>›</span>
                  <span className="text-[#9aa0a6]">{currentRoute.route_path.replace(/^\//, '') || 'home'}</span>
                </div>
                <div className="text-[18px] text-[#8ab4f8] font-medium leading-snug cursor-pointer hover:underline truncate">
                  {currentRoute.meta_title || 'Growmybizz | Digital Solutions'}
                </div>
                <div className="text-[13px] text-[#bdc1c6] leading-relaxed line-clamp-2">
                  {currentRoute.meta_description || 'Growmybizz is a premier digital agency...'}
                </div>
              </div>

              {/* Real-time OpenGraph Social Card Simulator */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-mono text-white/50">
                  <Share2 size={12} className="text-[#477BDB]" /> WhatsApp / LinkedIn / Twitter Card Preview
                </div>
                <div className="rounded-xl overflow-hidden border border-white/10 bg-black/60 max-w-md">
                  <div className="h-36 bg-gradient-to-br from-neutral-800 to-neutral-900 relative overflow-hidden flex items-center justify-center">
                    {currentRoute.og_image ? (
                      <img
                        src={currentRoute.og_image}
                        alt="OG Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Sparkles className="text-white/20 w-8 h-8" />
                    )}
                  </div>
                  <div className="p-3 space-y-1">
                    <div className="text-[10px] uppercase tracking-wider text-white/40 font-mono">
                      growmybizz.vercel.app
                    </div>
                    <div className="text-xs font-semibold text-white truncate">
                      {currentRoute.meta_title}
                    </div>
                    <div className="text-[11px] text-white/60 line-clamp-2 leading-relaxed">
                      {currentRoute.meta_description}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
