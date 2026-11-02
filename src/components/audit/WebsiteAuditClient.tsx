'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Zap,
  Globe,
  Shield,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  MessageCircle,
  Calendar,
  Calculator,
  RefreshCw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
  Lock,
} from 'lucide-react';
import PhoneInput from '@/components/ui/PhoneInput';
import TurnstileWidget from '@/components/TurnstileWidget';
import { ScheduleCallModal } from '@/components/ScheduleCallModal';
import { trackGAEvent } from '@/components/GoogleAnalytics';
import type { AuditResult, AuditIssue } from '@/app/api/audit/route';

const SCAN_STEPS = [
  'Establishing secure connection and checking SSL encryption...',
  'Measuring Server Response Time (TTFB) and network latency...',
  'Simulating mobile smartphone viewport & Core Web Vitals...',
  'Extracting technical SEO tags, headings, and OpenGraph schemas...',
  'Compiling Growmybiz24 technical scorecard and fix roadmap...',
];

export default function WebsiteAuditClient() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');

  const [loading, setLoading] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [auditReport, setAuditReport] = useState<AuditResult | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const [filterType, setFilterType] = useState<'all' | 'critical' | 'warning' | 'good'>('all');
  const [copied, setCopied] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);

  // Stepped scanning simulation
  useEffect(() => {
    let interval: any;
    if (loading) {
      setScanStepIndex(0);
      interval = setInterval(() => {
        setScanStepIndex((prev) => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!url.trim()) {
      setErrorMessage('Please enter your website address or domain name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid work email address to receive your report.');
      return;
    }

    setLoading(true);
    setAuditReport(null);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          email: email.trim(),
          phone: phone.trim(),
          name: name.trim(),
          turnstileToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete website audit.');
      }

      setAuditReport(data.report);
      setWhatsappUrl(data.whatsappUrl);

      trackGAEvent('generate_lead', {
        event_category: 'Website Audit Tool',
        event_label: data.report.domain,
        value: data.report.overallScore,
      });
    } catch (err: any) {
      console.error('Audit submission error:', err);
      setErrorMessage(err.message || 'Audit failed. Please check the domain and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!auditReport) return;
    const summary = `Website Audit for ${auditReport.domain}: Overall Score ${auditReport.overallScore}/100 (${auditReport.grade}). Speed: ${auditReport.speedScore}/100, SEO: ${auditReport.seoScore}/100. Audited via Growmybiz24.`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredIssues = auditReport?.issues.filter((issue) => {
    if (filterType === 'all') return true;
    return issue.type === filterType;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  return (
    <div className="min-h-screen bg-[#070D18] text-white pt-24 pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-1/3 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap size={14} className="text-emerald-400" />
            <span>Instant Technical SEO & Speed Audit</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-syne text-white tracking-tight mb-4 leading-tight">
            How Fast & Healthy Is Your Website?
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Test your website across Google Core Web Vitals, technical SEO architecture, mobile responsiveness, and security headers. Uncover hidden bottlenecks capping your revenue.
          </p>
        </div>

        {/* ── Input Audit Form Card ── */}
        {!auditReport && !loading && (
          <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-white/[0.05] to-black/60 border border-white/10 shadow-2xl max-w-3xl mx-auto">
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 mb-6">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleRunAudit} className="space-y-4">
              {/* URL / Domain Input */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  Website Address / URL <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <Globe size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="e.g. yourcompany.com or https://store.com"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Work Email */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Your Work Email <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>

                {/* Optional Phone with Country Code */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    WhatsApp / Phone (Optional for instant report)
                  </label>
                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                    placeholder="Phone / WhatsApp"
                  />
                </div>
              </div>

              {/* Cloudflare Turnstile */}
              <div className="pt-2">
                <TurnstileWidget onVerify={setTurnstileToken} theme="dark" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-emerald-400 to-teal-500 hover:opacity-95 active:scale-[0.99] transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <Search size={16} />
                <span>Audit My Website Now (100% Free)</span>
              </button>

              <div className="flex items-center justify-center gap-6 pt-3 text-[11px] text-white/40">
                <span className="flex items-center gap-1.5">
                  <Check size={12} className="text-emerald-400" />
                  Instant Live Analysis
                </span>
                <span className="flex items-center gap-1.5">
                  <Check size={12} className="text-emerald-400" />
                  Google Core Web Vitals
                </span>
                <span className="flex items-center gap-1.5">
                  <Check size={12} className="text-emerald-400" />
                  Zero Credit Card Required
                </span>
              </div>
            </form>
          </div>
        )}

        {/* ── Scanning Radar Sequence Simulation ── */}
        {loading && (
          <div className="p-8 sm:p-14 rounded-3xl bg-black/60 border border-white/10 shadow-2xl max-w-xl mx-auto text-center space-y-6">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-400/40 animate-spin" style={{ animationDuration: '6s' }} />
              <div className="absolute inset-2 rounded-full border border-blue-500/30 animate-pulse" />
              <Search size={32} className="text-emerald-400 animate-bounce" />
            </div>

            <div>
              <div className="text-xs uppercase font-mono tracking-wider text-emerald-400 mb-1">
                Auditing: {url}
              </div>
              <h3 className="text-lg font-bold font-syne text-white">
                Running Full Technical Diagnostics
              </h3>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-white/80 transition-all duration-300">
              {SCAN_STEPS[scanStepIndex]}
            </div>

            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${((scanStepIndex + 1) / SCAN_STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Results Dashboard ── */}
        {auditReport && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Bar with Audited Site & Actions */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                  {auditReport.domain.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-white">{auditReport.domain}</h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/60">
                      Live Snapshot
                    </span>
                  </div>
                  <div className="text-[11px] text-white/40 truncate max-w-md">{auditReport.url}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleCopyReport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuditReport(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>Audit Another Site</span>
                </button>
              </div>
            </div>

            {/* Scorecard Hero: Big Score Gauge + 4 Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Overall Score Card */}
              <div className="md:col-span-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.05] to-black/80 border border-white/10 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl">
                <div className="text-xs uppercase font-mono tracking-wider text-white/40 mb-3">
                  Overall Health Score
                </div>

                {/* Score Number with Circular Gauge */}
                <div className="relative w-36 h-36 flex items-center justify-center my-2">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-white/10 fill-none"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className={`fill-none transition-all duration-1000 ${
                        auditReport.overallScore >= 80
                          ? 'stroke-emerald-400'
                          : auditReport.overallScore >= 60
                          ? 'stroke-amber-400'
                          : 'stroke-rose-400'
                      }`}
                      strokeWidth="8"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * auditReport.overallScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold font-mono text-white">
                      {auditReport.overallScore}
                    </span>
                    <span className="text-[11px] font-mono text-white/40">/ 100</span>
                  </div>
                </div>

                {/* Grade Badge */}
                <div className="mt-2 inline-flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${getScoreColor(
                      auditReport.overallScore
                    )}`}
                  >
                    Grade {auditReport.grade}
                  </span>
                </div>

                <p className="text-xs text-white/50 mt-3">
                  {auditReport.overallScore >= 80
                    ? 'Solid digital foundation with conversion lift upside.'
                    : auditReport.overallScore >= 60
                    ? 'Moderate performance with notable SEO and speed bottlenecks.'
                    : 'Critical performance gaps capping search visibility and conversions.'}
                </p>
              </div>

              {/* 4 Core Pillars Grid */}
              <div className="md:col-span-8 grid grid-cols-2 gap-4">
                {/* Pillar 1: Speed */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Zap size={16} className="text-blue-400" />
                        <span className="text-xs font-bold text-white">Speed & Vitals</span>
                      </div>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${getScoreColor(auditReport.speedScore)}`}>
                        {auditReport.speedScore}/100
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50">Initial server response & payload weight.</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-white/40">TTFB:</span>
                    <span className="font-bold text-white">{auditReport.metrics.ttfbMs}ms</span>
                  </div>
                </div>

                {/* Pillar 2: Technical SEO */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Search size={16} className="text-emerald-400" />
                        <span className="text-xs font-bold text-white">Technical SEO</span>
                      </div>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${getScoreColor(auditReport.seoScore)}`}>
                        {auditReport.seoScore}/100
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50">Meta tags, H1 structure & indexing readiness.</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-white/40">H1 Elements:</span>
                    <span className="font-bold text-white">{auditReport.metrics.h1Count}</span>
                  </div>
                </div>

                {/* Pillar 3: Mobile UX */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Smartphone size={16} className="text-purple-400" />
                        <span className="text-xs font-bold text-white">Mobile Viewport</span>
                      </div>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${getScoreColor(auditReport.mobileScore)}`}>
                        {auditReport.mobileScore}/100
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50">Smartphone layout scaling & accessibility.</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-white/40">Viewport Tag:</span>
                    <span className={`font-bold ${auditReport.metrics.hasViewport ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {auditReport.metrics.hasViewport ? 'Configured' : 'Missing'}
                    </span>
                  </div>
                </div>

                {/* Pillar 4: Security */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Shield size={16} className="text-amber-400" />
                        <span className="text-xs font-bold text-white">Security & SSL</span>
                      </div>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${getScoreColor(auditReport.securityScore)}`}>
                        {auditReport.securityScore}/100
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50">HTTPS certificate & HTTP security headers.</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-white/40">SSL / HTTPS:</span>
                    <span className={`font-bold ${auditReport.metrics.hasHttps ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {auditReport.metrics.hasHttps ? 'Active' : 'Insecure'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── The High-Converting Value Pitch Card ── */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-purple-950/30 to-black/80 border border-blue-500/30 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-semibold">
                  <Sparkles size={13} />
                  <span>Strategic Agency Diagnosis</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-syne text-white leading-snug max-w-3xl">
                  {auditReport.agencyPitch}
                </h3>

                <p className="text-xs text-white/60 max-w-2xl leading-relaxed">
                  Growmybiz24 specializes in rebuilding sluggish websites into lightning-fast, high-converting digital flagships with sub-second page loads, flawless mobile ergonomics, and advanced schema SEO.
                </p>

                {/* Conversion CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
                  {/* WhatsApp CTA */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#25D366] to-[#1FB855] hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-emerald-950/40"
                  >
                    <MessageCircle size={15} className="fill-white/20" />
                    <span>Discuss This Audit on WhatsApp</span>
                  </a>

                  {/* Schedule Call */}
                  <button
                    type="button"
                    onClick={() => setScheduleModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#477BDB] to-[#6477C8] hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-blue-950/40 cursor-pointer"
                  >
                    <Calendar size={15} />
                    <span>Book Strategy Call with Lead Architect</span>
                  </button>

                  {/* Estimate Rebuild Cost */}
                  <Link
                    href="/estimator"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
                  >
                    <Calculator size={14} className="text-emerald-400" />
                    <span>Estimate Rebuild Cost</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Itemized Diagnostic Findings ── */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-lg font-bold font-syne text-white">
                  Technical Checklist & Fix Roadmap ({auditReport.issues.length})
                </h3>

                {/* Filter Tabs */}
                <div className="flex gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      filterType === 'all' ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    All ({auditReport.issues.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType('critical')}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                      filterType === 'critical' ? 'bg-rose-500/20 text-rose-300' : 'text-rose-400/60 hover:text-rose-300'
                    }`}
                  >
                    <XCircle size={11} /> Critical ({auditReport.issues.filter((i) => i.type === 'critical').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType('warning')}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                      filterType === 'warning' ? 'bg-amber-500/20 text-amber-300' : 'text-amber-400/60 hover:text-amber-300'
                    }`}
                  >
                    <AlertTriangle size={11} /> Warnings ({auditReport.issues.filter((i) => i.type === 'warning').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType('good')}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                      filterType === 'good' ? 'bg-emerald-500/20 text-emerald-300' : 'text-emerald-400/60 hover:text-emerald-300'
                    }`}
                  >
                    <CheckCircle2 size={11} /> Passed ({auditReport.issues.filter((i) => i.type === 'good').length})
                  </button>
                </div>
              </div>

              {/* Issues Accordion Cards */}
              <div className="space-y-3">
                {filteredIssues?.map((issue, idx) => {
                  const isExpanded = expandedIssue === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedIssue(isExpanded ? null : idx)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.03] transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-4">
                          {issue.type === 'critical' && <XCircle size={18} className="text-rose-400 shrink-0" />}
                          {issue.type === 'warning' && <AlertTriangle size={18} className="text-amber-400 shrink-0" />}
                          {issue.type === 'good' && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
                          <div className="min-w-0">
                            <span className="text-xs sm:text-sm font-semibold text-white block truncate">
                              {issue.title}
                            </span>
                            <span className="text-[10px] uppercase font-mono text-white/40">{issue.pillar}</span>
                          </div>
                        </div>

                        {isExpanded ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
                      </button>

                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 text-xs space-y-3 border-t border-white/5 bg-black/20">
                          <p className="text-white/70 leading-relaxed">{issue.description}</p>
                          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300">
                            <strong>Recommended Fix:</strong> {issue.recommendation}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Discovery Strategy Call Modal */}
      <ScheduleCallModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
      />
    </div>
  );
}
