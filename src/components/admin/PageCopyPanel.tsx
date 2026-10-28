'use client';

import React, { useState, useEffect } from 'react';
import { Save, Check, Loader2, Sparkles, Plus, Trash2, Award, Zap, FileText } from 'lucide-react';
import type { ValueProp, StatItem } from '@/types';

export default function PageCopyPanel() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [source, setSource] = useState<string>('loading');

  const [activeTab, setActiveTab] = useState<'value_props' | 'stats' | 'about' | 'cta'>('value_props');

  const [valueProps, setValueProps] = useState<ValueProp[]>([]);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [aboutContent, setAboutContent] = useState({
    story_heading: '',
    story_body: '',
    mission: '',
  });
  const [ctaContent, setCtaContent] = useState({
    heading: '',
    subheading: '',
    primary_cta_label: '',
    primary_cta_href: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/copy');
      if (res.ok) {
        const json = await res.json();
        setValueProps(json.value_props || []);
        setStats(json.stats || []);
        setAboutContent(json.about_content || {});
        setCtaContent(json.cta_content || {});
        setSource(json.source || 'supabase');
      }
    } catch (e) {
      console.error('Failed to load page copy:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveActive = async () => {
    setSaving(true);
    try {
      let payload = {};
      if (activeTab === 'value_props') {
        payload = { section_id: 'value_props', data: valueProps };
      } else if (activeTab === 'stats') {
        payload = { section_id: 'stats', data: stats };
      } else if (activeTab === 'about') {
        payload = { section_id: 'about_content', data: aboutContent };
      } else if (activeTab === 'cta') {
        payload = { section_id: 'cta_content', data: ctaContent };
      }

      const res = await fetch('/api/admin/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaved(true);
        setSource('supabase');
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      console.error('Failed to save page copy:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-white/40">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading Website Content & Copy...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <div>
          <h2 className="text-lg font-semibold text-white">Global Website Copy & Blocks</h2>
          <p className="text-xs text-white/50">
            Edit value propositions, impact counters, mission statements, and CTA banners across all pages.
            Data source: <span className="font-mono text-[#477BDB]">{source}</span>
          </p>
        </div>
        <button
          onClick={handleSaveActive}
          disabled={saving}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#477BDB] hover:bg-[#3b82d4] transition-colors disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          {saving ? (
            <Loader2 size={13} className="animate-spin" />
          ) : saved ? (
            <Check size={13} />
          ) : (
            <Save size={13} />
          )}
          <span>{saved ? 'Saved Section!' : saving ? 'Saving...' : 'Save Current Section'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
        {[
          { id: 'value_props', label: 'Why Growmybizz (Pillars)', icon: Zap },
          { id: 'stats', label: 'Impact Counters (Stats)', icon: Award },
          { id: 'about', label: 'About Story & Mission', icon: FileText },
          { id: 'cta', label: 'Global CTA Banner', icon: Sparkles },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === t.id
                  ? 'bg-[#477BDB] text-white'
                  : 'bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Icon size={13} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 1. Value Props Tab ── */}
      {activeTab === 'value_props' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {valueProps.map((vp, idx) => (
              <div key={vp.id || idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#477BDB] font-semibold">Pillar {idx + 1}</span>
                  <input
                    type="text"
                    value={vp.icon}
                    onChange={(e) => {
                      const updated = [...valueProps];
                      updated[idx] = { ...updated[idx], icon: e.target.value };
                      setValueProps(updated);
                    }}
                    placeholder="Icon name"
                    className="w-24 px-2 py-1 rounded bg-black/40 border border-white/10 text-white text-[11px] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-white/50 mb-1">Pillar Title</label>
                  <input
                    type="text"
                    value={vp.title}
                    onChange={(e) => {
                      const updated = [...valueProps];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setValueProps(updated);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-white/50 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={vp.description}
                    onChange={(e) => {
                      const updated = [...valueProps];
                      updated[idx] = { ...updated[idx], description: e.target.value };
                      setValueProps(updated);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 2. Stats Tab ── */}
      {activeTab === 'stats' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((st, idx) => (
              <div key={st.id || idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="text-[11px] font-mono text-emerald-400 font-semibold">Stat Counter {idx + 1}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-white/50 mb-1">Value</label>
                    <input
                      type="text"
                      value={st.value}
                      onChange={(e) => {
                        const updated = [...stats];
                        updated[idx] = { ...updated[idx], value: e.target.value };
                        setStats(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/50 mb-1">Suffix (+, x, %)</label>
                    <input
                      type="text"
                      value={st.suffix || ''}
                      onChange={(e) => {
                        const updated = [...stats];
                        updated[idx] = { ...updated[idx], suffix: e.target.value };
                        setStats(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-white/50 mb-1">Metric Label</label>
                  <input
                    type="text"
                    value={st.label}
                    onChange={(e) => {
                      const updated = [...stats];
                      updated[idx] = { ...updated[idx], label: e.target.value };
                      setStats(updated);
                    }}
                    className="w-full px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-white/50 mb-1">Subtext Description</label>
                  <textarea
                    rows={2}
                    value={st.description || ''}
                    onChange={(e) => {
                      const updated = [...stats];
                      updated[idx] = { ...updated[idx], description: e.target.value };
                      setStats(updated);
                    }}
                    className="w-full px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. About Page Tab ── */}
      {activeTab === 'about' && (
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 max-w-2xl">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Main Story Headline (/about page)
            </label>
            <input
              type="text"
              value={aboutContent.story_heading}
              onChange={(e) => setAboutContent({ ...aboutContent, story_heading: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Founding Story & Perspective
            </label>
            <textarea
              rows={4}
              value={aboutContent.story_body}
              onChange={(e) => setAboutContent({ ...aboutContent, story_body: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Core Agency Mission
            </label>
            <textarea
              rows={3}
              value={aboutContent.mission}
              onChange={(e) => setAboutContent({ ...aboutContent, mission: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
            />
          </div>
        </div>
      )}

      {/* ── 4. CTA Banner Tab ── */}
      {activeTab === 'cta' && (
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 max-w-2xl">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              CTA Banner Main Heading
            </label>
            <input
              type="text"
              value={ctaContent.heading}
              onChange={(e) => setCtaContent({ ...ctaContent, heading: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              CTA Supporting Subheading
            </label>
            <textarea
              rows={2}
              value={ctaContent.subheading}
              onChange={(e) => setCtaContent({ ...ctaContent, subheading: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Primary Button Label
              </label>
              <input
                type="text"
                value={ctaContent.primary_cta_label}
                onChange={(e) => setCtaContent({ ...ctaContent, primary_cta_label: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Target Action URL
              </label>
              <input
                type="text"
                value={ctaContent.primary_cta_href}
                onChange={(e) => setCtaContent({ ...ctaContent, primary_cta_href: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
