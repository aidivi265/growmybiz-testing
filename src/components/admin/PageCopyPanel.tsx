'use client';

import React, { useState, useEffect } from 'react';
import { Save, Check, Loader2, Sparkles, Plus, Trash2, Award, Zap, FileText, Orbit } from 'lucide-react';
import type { ValueProp, StatItem, OrbitConfig, OrbitNodeConfig } from '@/types';

export default function PageCopyPanel() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [source, setSource] = useState<string>('loading');

  const [activeTab, setActiveTab] = useState<'value_props' | 'stats' | 'about' | 'cta' | 'orbit'>('value_props');

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
  const [orbitConfig, setOrbitConfig] = useState<OrbitConfig>({
    centerLabel: 'Growmybiz24',
    centerSubtitle: 'Digital Agency OS',
    nodes: [],
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
        if (json.orbit_config) {
          setOrbitConfig(json.orbit_config);
        }
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
      } else if (activeTab === 'orbit') {
        payload = { section_id: 'orbit_config', data: orbitConfig };
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
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-3">
        {[
          { id: 'value_props', label: 'Why Growmybiz24 (Pillars)', icon: Zap },
          { id: 'stats', label: 'Impact Counters (Stats)', icon: Award },
          { id: 'about', label: 'About Story & Mission', icon: FileText },
          { id: 'cta', label: 'Global CTA Banner', icon: Sparkles },
          { id: 'orbit', label: 'Interactive 3D Orbit (Home)', icon: Orbit },
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

      {/* ── 5. Homepage 3D Orbit Customizer Tab ── */}
      {activeTab === 'orbit' && (
        <div className="space-y-6">
          {/* Center Core Sphere Controls */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Orbit className="w-4 h-4 text-[#477BDB]" />
              <span>Center Core Sphere Branding</span>
            </div>
            <p className="text-xs text-white/50">
              Customize the focal nucleus of the 3D rotating kinetic visual that appears in the homepage hero.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">
                  Center Main Title
                </label>
                <input
                  type="text"
                  value={orbitConfig.centerLabel || 'Growmybiz24'}
                  onChange={(e) =>
                    setOrbitConfig({ ...orbitConfig, centerLabel: e.target.value })
                  }
                  placeholder="Growmybiz24"
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">
                  Center Subtitle / Badge
                </label>
                <input
                  type="text"
                  value={orbitConfig.centerSubtitle || 'Digital Agency OS'}
                  onChange={(e) =>
                    setOrbitConfig({ ...orbitConfig, centerSubtitle: e.target.value })
                  }
                  placeholder="Digital Agency OS"
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
                />
              </div>
            </div>
          </div>

          {/* Orbital Nodes List */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">Orbital Nodes & Service Satellites ({orbitConfig.nodes?.length || 0})</h3>
                <p className="text-xs text-white/50">
                  Each satellite node orbits around the center core with live hover physics, glowing badges, and custom icons.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newNode: OrbitNodeConfig = {
                    id: `node-${Date.now()}`,
                    label: 'New Capability',
                    sub: 'Fast Execution',
                    icon: 'Sparkles',
                    color: '#60a5fa',
                    size: 'md',
                  };
                  setOrbitConfig({
                    ...orbitConfig,
                    nodes: [...(orbitConfig.nodes || []), newNode],
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors self-start sm:self-auto cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Orbital Node</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(orbitConfig.nodes || []).map((node, idx) => (
                <div
                  key={node.id || idx}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-white/40">Node #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (orbitConfig.nodes || []).filter((_, i) => i !== idx);
                        setOrbitConfig({ ...orbitConfig, nodes: updated });
                      }}
                      className="text-white/30 hover:text-rose-400 p-1 transition-colors"
                      title="Remove node"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Live Visual Preview Chip */}
                  <div className="p-3 rounded-lg bg-black/50 border border-white/5 flex items-center gap-2.5">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: node.color, boxShadow: `0 0 10px ${node.color}` }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{node.label || 'Node Title'}</p>
                      <p className="text-[10px] text-white/50 truncate">{node.sub || 'Node Subtext'}</p>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div>
                    <label className="block text-[10px] text-white/50 mb-1">Headline Label</label>
                    <input
                      type="text"
                      value={node.label}
                      onChange={(e) => {
                        const updated = [...(orbitConfig.nodes || [])];
                        updated[idx] = { ...updated[idx], label: e.target.value };
                        setOrbitConfig({ ...orbitConfig, nodes: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/50 mb-1">Subtitle / Metric</label>
                    <input
                      type="text"
                      value={node.sub}
                      onChange={(e) => {
                        const updated = [...(orbitConfig.nodes || [])];
                        updated[idx] = { ...updated[idx], sub: e.target.value };
                        setOrbitConfig({ ...orbitConfig, nodes: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-white/50 mb-1">Icon</label>
                      <select
                        value={node.icon || 'Sparkles'}
                        onChange={(e) => {
                          const updated = [...(orbitConfig.nodes || [])];
                          updated[idx] = { ...updated[idx], icon: e.target.value };
                          setOrbitConfig({ ...orbitConfig, nodes: updated });
                        }}
                        className="w-full px-2 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none"
                      >
                        <option value="Code2" className="bg-[#0f172a]">Code2</option>
                        <option value="Bot" className="bg-[#0f172a]">Bot</option>
                        <option value="TrendingUp" className="bg-[#0f172a]">TrendingUp</option>
                        <option value="Palette" className="bg-[#0f172a]">Palette</option>
                        <option value="Zap" className="bg-[#0f172a]">Zap</option>
                        <option value="Shield" className="bg-[#0f172a]">Shield</option>
                        <option value="Sparkles" className="bg-[#0f172a]">Sparkles</option>
                        <option value="Rocket" className="bg-[#0f172a]">Rocket</option>
                        <option value="Globe" className="bg-[#0f172a]">Globe</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-white/50 mb-1">Scale Size</label>
                      <select
                        value={node.size || 'md'}
                        onChange={(e) => {
                          const updated = [...(orbitConfig.nodes || [])];
                          updated[idx] = { ...updated[idx], size: e.target.value as any };
                          setOrbitConfig({ ...orbitConfig, nodes: updated });
                        }}
                        className="w-full px-2 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none"
                      >
                        <option value="sm" className="bg-[#0f172a]">Compact (sm)</option>
                        <option value="md" className="bg-[#0f172a]">Standard (md)</option>
                        <option value="lg" className="bg-[#0f172a]">Hero Prominent (lg)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/50 mb-1">Accent Color & Glow</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={node.color || '#60a5fa'}
                        onChange={(e) => {
                          const updated = [...(orbitConfig.nodes || [])];
                          updated[idx] = { ...updated[idx], color: e.target.value };
                          setOrbitConfig({ ...orbitConfig, nodes: updated });
                        }}
                        className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={node.color}
                        onChange={(e) => {
                          const updated = [...(orbitConfig.nodes || [])];
                          updated[idx] = { ...updated[idx], color: e.target.value };
                          setOrbitConfig({ ...orbitConfig, nodes: updated });
                        }}
                        className="flex-1 px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs font-mono outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
