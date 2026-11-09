'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, ArrowRight, Zap, Shield, Smartphone, Search, Loader2 } from 'lucide-react';
import { SYNE_FONT } from '@/lib/fonts';

export default function HomeAuditBar() {
  const router = useRouter();
  const [domainInput, setDomainInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let clean = domainInput.trim().toLowerCase();
    clean = clean.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

    if (!clean || clean.length < 3 || !clean.includes('.')) {
      setError('Please enter a valid domain name (e.g., yourcompany.com)');
      return;
    }

    setLoading(true);
    router.push(`/audit?url=${encodeURIComponent(`https://${clean}`)}`);
  };

  return (
    <section className="relative overflow-hidden bg-[#070D19] py-12 lg:py-16 border-y border-white/[0.08]">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Clean Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-mono font-bold tracking-wider mb-3 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <Search size={12} />
          <span>NEURAL DIAGNOSTIC SCANNER</span>
        </div>

        {/* Heading */}
        <h2
          style={{ fontFamily: SYNE_FONT }}
          className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2"
        >
          Free Website Speed, SEO &amp; Mobile Diagnostic
        </h2>

        {/* Subhead */}
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mb-6 leading-relaxed">
          Test your website across Google Core Web Vitals, mobile viewport responsiveness, search metadata, and SSL security in 10 seconds.
        </p>

        {/* Clean Audit Form Bar */}
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto relative flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-[#0B1325]/90 border border-cyan-500/30 rounded-xl shadow-[0_0_25px_rgba(0,240,255,0.1)] focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all"
        >
          <div className="relative flex-1 w-full flex items-center pl-3">
            <Globe className="w-4 h-4 text-cyan-400 shrink-0 mr-2" />
            <input
              type="text"
              value={domainInput}
              onChange={(e) => {
                setDomainInput(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter your website domain (e.g. brand.com)"
              className="w-full bg-transparent text-white placeholder-slate-500 text-xs sm:text-sm font-medium focus:outline-none py-2"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-60 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>Run Free Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {error && (
          <p className="text-red-400 text-xs mt-2.5 font-medium animate-fadeIn">
            {error}
          </p>
        )}

        {/* Minimal Feature Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-5 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Core Web Vitals</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Search className="w-3 h-3 text-blue-400" />
            <span>Search Metadata</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-3 h-3 text-emerald-400" />
            <span>Mobile Viewport</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-indigo-400" />
            <span>Security Headers</span>
          </div>
        </div>
      </div>
    </section>
  );
}
