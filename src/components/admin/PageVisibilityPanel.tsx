'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Eye,
  EyeOff,
  Save,
  Check,
  Loader2,
  ExternalLink,
  Search,
  Globe,
  Wrench,
  Layout,
  Shield,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  PAGE_VISIBILITY_ITEMS,
  defaultPageVisibility,
  normalizePageVisibility,
  type PageVisibility,
  type PageVisibilityItem,
} from '@/lib/pageVisibility';
import { invalidateClientSettings } from '@/lib/settingsClient';

const GROUP_META: Array<{
  id: PageVisibilityItem['group'];
  title: string;
  subtitle: string;
  icon: React.ElementType;
  accent: string;
}> = [
  {
    id: 'pages',
    title: 'Main Website Pages',
    subtitle: 'Hides the page (returns 404), removes it from Navbar, Footer, Homepage, and Sitemap.',
    icon: Globe,
    accent: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  },
  {
    id: 'tools',
    title: 'Tools & Client Portals',
    subtitle: 'Control public access to interactive calculators, SEO audits, project intake, and client portal.',
    icon: Wrench,
    accent: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  {
    id: 'homepage',
    title: 'Homepage Sections',
    subtitle: 'Show or hide individual sections on the landing page without deleting any data.',
    icon: Layout,
    accent: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  },
  {
    id: 'legal',
    title: 'Legal & Compliance Pages',
    subtitle: 'Toggle statutory policy pages and automatically update Footer & Sitemap links.',
    icon: Shield,
    accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
];

export default function PageVisibilityPanel() {
  const [visibility, setVisibility] = useState<PageVisibility>(defaultPageVisibility);
  const [savedSnapshot, setSavedSnapshot] = useState<PageVisibility>(defaultPageVisibility);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let ignore = false;
    fetch('/api/admin/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!ignore && json?.pageVisibility) {
          const normalized = normalizePageVisibility(json.pageVisibility);
          setVisibility(normalized);
          setSavedSnapshot(normalized);
        }
      })
      .catch((err) => console.error('Failed to load page visibility:', err))
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(visibility) !== JSON.stringify(savedSnapshot),
    [visibility, savedSnapshot]
  );

  const stats = useMemo(() => {
    const keys = Object.keys(defaultPageVisibility) as Array<keyof PageVisibility>;
    const liveCount = keys.filter((k) => visibility[k] !== false).length;
    return {
      total: keys.length,
      live: liveCount,
      hidden: keys.length - liveCount,
    };
  }, [visibility]);

  const toggleItem = (key: keyof PageVisibility) => {
    setVisibility((prev) => ({
      ...prev,
      [key]: !(prev[key] !== false),
    }));
    setError(null);
  };

  const setGroupState = (group: PageVisibilityItem['group'], value: boolean) => {
    setVisibility((prev) => {
      const next = { ...prev };
      PAGE_VISIBILITY_ITEMS.filter((i) => i.group === group).forEach((i) => {
        next[i.key] = value;
      });
      return next;
    });
    setError(null);
  };

  const showAll = () => {
    setVisibility({ ...defaultPageVisibility });
    setError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visibilityOnly: true,
          pageVisibility: visibility,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || 'Failed to save page visibility');
      }
      const nextVis = normalizePageVisibility(json?.pageVisibility || visibility);
      setVisibility(nextVis);
      setSavedSnapshot(nextVis);
      setSaved(true);
      invalidateClientSettings();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('growmybiz:settings-updated', {
            detail: { pageVisibility: nextVis },
          })
        );
      }
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err?.message || 'Error saving visibility settings.');
    } finally {
      setSaving(false);
    }
  };

  const q = search.trim().toLowerCase();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-white/40">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span className="text-sm">Loading pages &amp; visibility controls...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-[#0d111a] border border-white/[0.08] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-lg font-bold text-white">Show / Hide Website Pages</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
              {stats.live} Live
            </span>
            {stats.hidden > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                {stats.hidden} Hidden
              </span>
            )}
            {hasUnsavedChanges && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 animate-pulse">
                Unsaved changes
              </span>
            )}
          </div>
          <p className="text-xs text-white/50 mt-1">
            Toggle any page or section below. Hidden pages are removed from Navigation, Footer, and Sitemap, and return 404 to visitors.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={showAll}
            className="px-3 py-2 rounded-xl text-xs font-medium text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors cursor-pointer"
          >
            Make All Live
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 ${
              hasUnsavedChanges
                ? 'bg-[#3b82d4] hover:bg-[#2563eb] shadow-lg shadow-blue-500/25'
                : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {saving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : saved ? (
              <Check size={14} />
            ) : (
              <Save size={14} />
            )}
            <span>{saving ? 'Saving...' : saved ? 'Saved Live!' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Search */}
      <div className="relative max-w-md">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search any page (e.g. audit, legal, pricing, portal)..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0d111a] border border-white/[0.08] text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
        />
      </div>

      {/* Grouped Sections */}
      <div className="space-y-6">
        {GROUP_META.map((group) => {
          const items = PAGE_VISIBILITY_ITEMS.filter((item) => {
            if (item.group !== group.id) return false;
            if (!q) return true;
            return (
              item.label.toLowerCase().includes(q) ||
              item.path.toLowerCase().includes(q) ||
              item.description.toLowerCase().includes(q)
            );
          });

          if (items.length === 0) return null;

          const GroupIcon = group.icon;
          const allGroupVisible = items.every((i) => visibility[i.key] !== false);

          return (
            <div
              key={group.id}
              className="rounded-2xl bg-[#0d111a] border border-white/[0.07] overflow-hidden"
            >
              {/* Group Header */}
              <div className="px-5 py-4 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.015]">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${group.accent}`}>
                    <GroupIcon size={17} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{group.title}</h3>
                    <p className="text-[11px] text-white/45 mt-0.5">{group.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setGroupState(group.id, !allGroupVisible)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    {allGroupVisible ? 'Hide Group' : 'Show Group'}
                  </button>
                </div>
              </div>

              {/* Group Items Grid */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((item) => {
                  const isVisible = visibility[item.key] !== false;
                  const isRoute = item.path.startsWith('/');

                  return (
                    <div
                      key={item.key}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isVisible
                          ? 'bg-white/[0.02] border-white/[0.08] hover:border-white/[0.15]'
                          : 'bg-amber-500/[0.04] border-amber-500/20'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white">{item.label}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-white/55">
                            {item.path}
                          </span>
                          {isRoute && isVisible && (
                            <a
                              href={item.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/35 hover:text-cyan-400 transition-colors"
                              title={`Open ${item.path} in new tab`}
                            >
                              <ExternalLink size={11} />
                            </a>
                          )}
                        </div>
                        <p className="text-[11px] text-white/45 mt-1 leading-snug">
                          {item.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleItem(item.key)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                          isVisible
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
                        }`}
                      >
                        {isVisible ? (
                          <>
                            <Eye size={12} />
                            <span>Live</span>
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Save Reminder */}
      {hasUnsavedChanges && (
        <div className="sticky bottom-4 p-4 rounded-2xl bg-[#11192b]/95 backdrop-blur-md border border-[#3b82d4]/40 shadow-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-white">
            <CheckCircle2 size={16} className="text-[#3b82d4]" />
            <span>You modified page visibility settings. Save to update the live website.</span>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#3b82d4] hover:bg-[#2563eb] transition-colors cursor-pointer shrink-0"
          >
            {saving ? 'Saving...' : 'Save Now'}
          </button>
        </div>
      )}
    </div>
  );
}
