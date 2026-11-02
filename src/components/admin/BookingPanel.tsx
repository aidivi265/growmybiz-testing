'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Save,
  Check,
  Loader2,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Sliders,
  CheckCircle2,
  HelpCircle,
  Eye,
  MessageSquare,
  Phone,
  Shield,
  Layers,
} from 'lucide-react';
import type { BookingConfig } from '@/data/bookingConfig';
import { defaultBookingConfig, getBookingEmbedUrl } from '@/data/bookingConfig';

export default function BookingPanel() {
  const [config, setConfig] = useState<BookingConfig>(defaultBookingConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [source, setSource] = useState<'supabase' | 'default'>('default');
  const [previewTab, setPreviewTab] = useState<'calendar' | 'callback'>('calendar');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/booking');
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          setConfig(data.config);
          setSource(data.source || 'supabase');
          setPreviewTab(data.config.defaultView || 'calendar');
        }
      }
    } catch (err) {
      console.error('Failed to load booking config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save configuration');
      }

      setSaved(true);
      setSource('supabase');
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving calendar booking config');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset calendar booking configuration back to default settings?')) {
      setConfig(defaultBookingConfig);
      setPreviewTab('calendar');
    }
  };

  const embedUrl = getBookingEmbedUrl(config);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-white/50">
        <Loader2 className="w-8 h-8 animate-spin text-[#477BDB] mb-3" />
        <p className="text-sm">Loading Live Calendar Booking settings from Supabase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#477BDB]/20 to-[#10B981]/20 border border-[#477BDB]/30 flex items-center justify-center text-[#477BDB]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Live Calendar Booking CMS</h2>
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
              Integrate Cal.com, Calendly, or Google Calendar directly into the modal for 1-click strategy call bookings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 border border-white/10 transition-colors flex items-center gap-1.5"
            title="Reset to default settings"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Defaults
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

      {/* Grid: Editor Left (7 Cols) + Live Preview Right (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Editor */}
        <div className="lg:col-span-7 space-y-5 bg-white/[0.02] border border-white/10 rounded-2xl p-5">
          {/* Master Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Enable Live Calendar Embed</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    config.enabled
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {config.enabled ? 'Active' : 'Disabled'}
                </span>
              </div>
              <p className="text-xs text-white/50 mt-0.5">
                When enabled, visitors will see your live interactive calendar widget in Schedule Call modals.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setConfig({ ...config, enabled: !config.enabled })}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                config.enabled ? 'bg-[#477BDB]' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  config.enabled ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Provider Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-white block uppercase tracking-wider">
              Calendar Integration Provider
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'cal',
                  name: 'Cal.com',
                  desc: 'Modern, fast, dark mode native',
                  badge: 'Recommended',
                  icon: '⚡',
                },
                {
                  id: 'calendly',
                  name: 'Calendly',
                  desc: 'Popular booking engine',
                  badge: 'Standard',
                  icon: '📅',
                },
                {
                  id: 'custom',
                  name: 'Google / Custom',
                  desc: 'Custom scheduler URL or iframe',
                  badge: 'Flexible',
                  icon: '🔗',
                },
              ].map((p) => {
                const isSelected = config.provider === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setConfig({ ...config, provider: p.id as any })}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#477BDB]/20 to-white/[0.04] border-[#477BDB] shadow-md shadow-blue-900/20'
                        : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-lg">{p.icon}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-[#38BDF8] border border-blue-500/30">
                        {p.badge}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white">{p.name}</div>
                    <div className="text-[11px] text-white/50 mt-0.5 leading-snug">{p.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Provider-Specific URL Inputs */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>Connection Parameters</span>
              {embedUrl && (
                <a
                  href={embedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#38BDF8] hover:underline flex items-center gap-1 font-semibold"
                >
                  <ExternalLink className="w-3 h-3" /> Test Link in New Tab
                </a>
              )}
            </div>

            {config.provider === 'cal' && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/70 block">
                  Cal.com Username &amp; Event Slug
                </label>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-xs text-white/40 font-mono select-none">
                    cal.com/
                  </span>
                  <input
                    type="text"
                    value={config.calLink.replace(/^https?:\/\/(www\.)?cal\.com\//i, '')}
                    onChange={(e) => setConfig({ ...config, calLink: e.target.value.trim() })}
                    placeholder="growmybiz24/15min"
                    className="flex-1 px-3 py-2 text-xs bg-black/40 border border-white/15 rounded-xl text-white font-mono focus:border-[#477BDB] outline-none"
                  />
                </div>
                <p className="text-[11px] text-white/40">
                  Example: <code className="text-emerald-400">growmybiz24/15min</code> or your organization URL.
                </p>
              </div>
            )}

            {config.provider === 'calendly' && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/70 block">Calendly Event Link</label>
                <input
                  type="text"
                  value={config.calendlyUrl}
                  onChange={(e) => setConfig({ ...config, calendlyUrl: e.target.value.trim() })}
                  placeholder="https://calendly.com/growmybiz24/15min"
                  className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 rounded-xl text-white font-mono focus:border-[#477BDB] outline-none"
                />
                <p className="text-[11px] text-white/40">
                  Example: <code className="text-emerald-400">https://calendly.com/growmybiz24/15min</code>
                </p>
              </div>
            )}

            {config.provider === 'custom' && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/70 block">Custom Booking / Google Calendar URL</label>
                <input
                  type="text"
                  value={config.customBookingUrl}
                  onChange={(e) => setConfig({ ...config, customBookingUrl: e.target.value.trim() })}
                  placeholder="https://calendar.google.com/calendar/appointments/schedules/..."
                  className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 rounded-xl text-white font-mono focus:border-[#477BDB] outline-none"
                />
                <p className="text-[11px] text-white/40">
                  Supports Google Calendar appointment schedules, Zoho Bookings, or SavvyCal embed links.
                </p>
              </div>
            )}
          </div>

          {/* Modal Copy & Duration */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
            <span className="text-xs font-bold text-white block">Modal Presentation &amp; Messaging</span>

            <div>
              <label className="text-xs font-medium text-white/60 mb-1 block">Modal Heading</label>
              <input
                type="text"
                value={config.modalTitle}
                onChange={(e) => setConfig({ ...config, modalTitle: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 rounded-xl text-white focus:border-[#477BDB] outline-none"
                placeholder="Schedule a 15-Min Strategy Call"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-white/60 mb-1 block">Modal Subtitle / Value Promise</label>
              <textarea
                rows={2}
                value={config.modalSubtitle}
                onChange={(e) => setConfig({ ...config, modalSubtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 rounded-xl text-white focus:border-[#477BDB] outline-none leading-relaxed"
                placeholder="Pick a live slot directly on our calendar. Automated Google Meet invite sent instantly..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="text-xs font-medium text-white/60 mb-1 block">Meeting Duration</label>
                <select
                  value={config.meetingDurationMinutes}
                  onChange={(e) => setConfig({ ...config, meetingDurationMinutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 rounded-xl text-white outline-none focus:border-[#477BDB]"
                >
                  <option value={15} className="bg-slate-900">15 Minutes</option>
                  <option value={30} className="bg-slate-900">30 Minutes</option>
                  <option value={45} className="bg-slate-900">45 Minutes</option>
                  <option value={60} className="bg-slate-900">60 Minutes</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-white/60 mb-1 block">Default Initial View</label>
                <select
                  value={config.defaultView}
                  onChange={(e) => setConfig({ ...config, defaultView: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 rounded-xl text-white outline-none focus:border-[#477BDB]"
                >
                  <option value="calendar" className="bg-slate-900">Live Calendar Embed</option>
                  <option value="callback" className="bg-slate-900">Callback Form</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-white/60 mb-1 block">Widget Theme</label>
                <select
                  value={config.theme}
                  onChange={(e) => setConfig({ ...config, theme: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 rounded-xl text-white outline-none focus:border-[#477BDB]"
                >
                  <option value="dark" className="bg-slate-900">Dark (Matches Site)</option>
                  <option value="light" className="bg-slate-900">Light</option>
                </select>
              </div>
            </div>
          </div>

          {/* Fallback Channels Toggle */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
            <span className="text-xs font-bold text-white block">Multi-Channel Fallbacks</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-black/30 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.allowCallbackFallback}
                  onChange={(e) => setConfig({ ...config, allowCallbackFallback: e.target.checked })}
                  className="rounded text-[#477BDB] focus:ring-0"
                />
                <div>
                  <div className="text-xs font-semibold text-white">Enable Callback Form Tab</div>
                  <div className="text-[10px] text-white/40">Lets users who dislike calendar scheduling request a callback</div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-black/30 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.allowWhatsAppDirect}
                  onChange={(e) => setConfig({ ...config, allowWhatsAppDirect: e.target.checked })}
                  className="rounded text-[#25D366] focus:ring-0"
                />
                <div>
                  <div className="text-xs font-semibold text-white">Direct WhatsApp Banner</div>
                  <div className="text-[10px] text-white/40">Shows 1-click WhatsApp quick chat action at top of modal</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Live Modal Simulation Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-white/50 px-1">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#38BDF8]" />
              Live In-Studio Modal Simulation
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">
              Provider: {config.provider.toUpperCase()}
            </span>
          </div>

          {/* Modal Container Mockup */}
          <div className="rounded-2xl border-2 border-white/15 bg-[#0E1726] p-4 sm:p-5 shadow-2xl relative overflow-hidden">
            {/* Modal header mockup */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#477BDB]/25 border border-[#477BDB]/50 flex items-center justify-center text-[#7AA2FF]">
                  <Calendar size={12} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7AA2FF]">
                  Direct Strategy Call
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                {config.meetingDurationMinutes} min slot
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-1">{config.modalTitle}</h3>
            <p className="text-xs text-white/60 mb-3 line-clamp-2 leading-relaxed">
              {config.modalSubtitle}
            </p>

            {/* Direct WhatsApp Pill if enabled */}
            {config.allowWhatsAppDirect && (
              <div className="mb-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <MessageSquare size={13} />
                  <span>Instant WhatsApp Connect</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#25D366] text-white">
                  Chat Now
                </span>
              </div>
            )}

            {/* View switcher tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/50 border border-white/10 mb-3">
              <button
                type="button"
                onClick={() => setPreviewTab('calendar')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  previewTab === 'calendar'
                    ? 'bg-[#477BDB] text-white shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Calendar size={12} />
                Live Calendar
              </button>
              {config.allowCallbackFallback && (
                <button
                  type="button"
                  onClick={() => setPreviewTab('callback')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    previewTab === 'callback'
                      ? 'bg-[#477BDB] text-white shadow-sm'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Phone size={12} />
                  Request Callback
                </button>
              )}
            </div>

            {/* Simulated Frame */}
            {previewTab === 'calendar' ? (
              <div className="relative w-full h-[420px] rounded-xl overflow-hidden bg-slate-950 border border-white/10 flex flex-col items-center justify-center text-center p-4">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title="Calendar Booking Simulation"
                    className="w-full h-full border-0 rounded-xl"
                    loading="lazy"
                  />
                ) : (
                  <div className="space-y-2 text-white/50">
                    <Calendar className="w-8 h-8 text-white/30 mx-auto" />
                    <p className="text-xs">Enter your Cal.com or Calendly link to load live interactive preview.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2.5 p-3 rounded-xl bg-black/40 border border-white/5 text-xs">
                <input
                  type="text"
                  disabled
                  placeholder="Your Full Name"
                  className="w-full px-2.5 py-1.5 rounded bg-white/5 border border-white/10 text-white/40"
                />
                <input
                  type="email"
                  disabled
                  placeholder="name@company.com"
                  className="w-full px-2.5 py-1.5 rounded bg-white/5 border border-white/10 text-white/40"
                />
                <input
                  type="tel"
                  disabled
                  placeholder="+91 98765 43210"
                  className="w-full px-2.5 py-1.5 rounded bg-white/5 border border-white/10 text-white/40"
                />
                <button
                  type="button"
                  disabled
                  className="w-full py-2 rounded bg-gradient-to-r from-[#477BDB] to-[#6477C8] text-white font-semibold text-xs opacity-75"
                >
                  Confirm Call Request
                </button>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              Prospects who click <strong>&quot;Book Strategy Call&quot;</strong> or <strong>&quot;Schedule 15-Min Call&quot;</strong> anywhere on your website will book directly into your Google Calendar via this live embed.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
