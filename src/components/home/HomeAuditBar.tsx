'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, ArrowRight, Zap, Shield, Smartphone, Search, Loader2 } from 'lucide-react';

export default function HomeAuditBar() {
  const router = useRouter();
  const [domainInput, setDomainInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let clean = domainInput.trim().toLowerCase();
    // Strip trailing slashes, spaces, and leading protocols for validation
    clean = clean.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

    if (!clean || clean.length < 3 || !clean.includes('.')) {
      setError('Please enter a valid domain name (e.g., yourcompany.com)');
      return;
    }

    setLoading(true);
    // Redirect to the dedicated audit tool with pre-filled domain
    router.push(`/audit?url=${encodeURIComponent(`https://${clean}`)}`);
  };

  return (
    <section className="relative overflow-hidden bg-[#0A1220] py-14 lg:py-18 border-y border-[#1E2E4A]">
      {/* Background radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] pointer-events-none opacity-25 blur-[100px]"
        style={{
          background: 'radial-gradient(ellipse at center, #2563EB 0%, #10B981 40%, transparent 70%)',
        }}
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Free Website &amp; Technical SEO Diagnostic</span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3">
          Is your website losing clients to slow speed or poor SEO?
        </h2>

        {/* Subhead */}
        <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl mx-auto mb-8 leading-relaxed">
          Get an instant diagnostic report covering Google Core Web Vitals, mobile responsiveness,
          technical search metadata, and security vulnerabilities in 10 seconds.
        </p>

        {/* Audit Form Bar */}
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto relative flex flex-col sm:flex-row items-center gap-2.5 p-2 bg-[#0F1B2E]/90 border border-white/10 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl focus-within:border-[#2563EB]/60 focus-within:ring-2 focus-within:ring-[#2563EB]/20 transition-all"
        >
          <div className="relative flex-1 w-full flex items-center pl-3">
            <Globe className="w-5 h-5 text-[#64748B] shrink-0 mr-2.5" />
            <input
              type="text"
              value={domainInput}
              onChange={(e) => {
                setDomainInput(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter your website domain (e.g., brand.com)"
              className="w-full bg-transparent text-white placeholder-[#64748B] text-sm sm:text-base font-medium focus:outline-none py-2.5"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white transition-all shadow-[0_4px_16px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_24px_rgba(37,99,235,0.5)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <span>Run Free Audit</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {error && (
          <p className="text-red-400 text-xs sm:text-sm mt-3 font-medium animate-fadeIn">
            {error}
          </p>
        )}

        {/* Feature Badges below the bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-[#94A3B8]">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Google Core Web Vitals</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-blue-400" />
            <span>Technical SEO Scorecard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mobile Performance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Security &amp; SSL Check</span>
          </div>
        </div>
      </div>
    </section>
  );
}
