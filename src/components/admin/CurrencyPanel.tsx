'use client';

import React, { useState, useEffect } from 'react';
import {
  Coins,
  Save,
  Check,
  Loader2,
  RefreshCw,
  Globe,
  DollarSign,
  ArrowRightLeft,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import type { CurrencyConfig, CurrencyCode } from '@/data/currencyConfig';
import {
  defaultCurrencyConfig,
  SUPPORTED_CURRENCIES,
  formatCurrencyAmount,
} from '@/data/currencyConfig';

export default function CurrencyPanel() {
  const [config, setConfig] = useState<CurrencyConfig>(defaultCurrencyConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [source, setSource] = useState<'supabase' | 'default'>('default');

  // Interactive conversion sandbox
  const [testAmountUSD, setTestAmountUSD] = useState<number>(1000);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/currency');
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          setConfig(data.config);
          setSource(data.source || 'supabase');
        }
      }
    } catch (err) {
      console.error('Failed to load currency config:', err);
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
      const res = await fetch('/api/admin/currency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save currency configuration');
      }

      setSaved(true);
      setSource('supabase');
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving currency config');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all exchange rates and currency rules to default market rates?')) {
      setConfig(defaultCurrencyConfig);
    }
  };

  const handleRateChange = (code: CurrencyCode, rateVal: number) => {
    if (rateVal <= 0 || isNaN(rateVal)) return;
    setConfig((prev) => ({
      ...prev,
      rates: {
        ...prev.rates,
        [code]: rateVal,
      },
    }));
  };

  const toggleCurrencyEnabled = (code: CurrencyCode) => {
    if (code === 'USD') return; // USD is always mandatory base
    setConfig((prev) => {
      const isEnabled = prev.enabledCurrencies.includes(code);
      const next = isEnabled
        ? prev.enabledCurrencies.filter((c) => c !== code)
        : [...prev.enabledCurrencies, code];
      return {
        ...prev,
        enabledCurrencies: next.length > 0 ? next : ['USD'],
      };
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-white/50">
        <Loader2 className="w-8 h-8 animate-spin text-[#477BDB] mb-3" />
        <p className="text-sm">Loading Multi-Currency Configuration from Supabase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#477BDB]/20 to-[#10B981]/20 border border-[#477BDB]/30 flex items-center justify-center text-[#477BDB]">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Multi-Currency &amp; Geo-Pricing CMS</h2>
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
              Manage automatic visitor location detection (INR / USD / EUR / AED) and live exchange rates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 border border-white/10 transition-colors flex items-center gap-1.5"
            title="Reset to default exchange rates"
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

      {/* Main Grid: Settings Left (7 cols) + Sandbox Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Rules & Rates (7 cols) */}
        <div className="lg:col-span-7 space-y-5 bg-white/[0.02] border border-white/10 rounded-2xl p-5">
          {/* Auto-detect toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>IP Header Location Auto-Detection</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    config.autoDetectEnabled
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {config.autoDetectEnabled ? 'Active' : 'Disabled'}
                </span>
              </div>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">
                Uses edge IP headers (<code className="text-[#38BDF8]">x-vercel-ip-country</code> / <code className="text-[#38BDF8]">cf-ipcountry</code>) to automatically show:
              </p>
              <ul className="text-[11px] text-white/60 space-y-0.5 mt-1.5 list-disc list-inside">
                <li><strong className="text-emerald-400">₹ INR</strong> for Indian visitors</li>
                <li><strong className="text-amber-400">AED</strong> for Middle East clients (UAE, Saudi, Qatar, Kuwait, Oman, Bahrain)</li>
                <li><strong className="text-blue-400">€ EUR</strong> for Eurozone visitors (Germany, France, Spain, etc.)</li>
                <li><strong className="text-purple-400">$ USD</strong> for US and global international clients</li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => setConfig({ ...config, autoDetectEnabled: !config.autoDetectEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ml-4 ${
                config.autoDetectEnabled ? 'bg-[#477BDB]' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  config.autoDetectEnabled ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Default Fallback Currency */}
          <div>
            <label className="text-xs font-medium text-white/70 mb-1.5 block">
              Default Fallback Currency (When Location Is Unresolved)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['USD', 'INR', 'EUR', 'AED'] as CurrencyCode[]).map((c) => {
                const isSelected = config.defaultCurrency === c;
                const details = SUPPORTED_CURRENCIES[c];
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setConfig({ ...config, defaultCurrency: c })}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-blue-600/20 border-[#477BDB] text-white font-bold'
                        : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    <span className="text-base block">{details.flag}</span>
                    <span className="text-xs block mt-0.5">{c}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exchange Rates Editor Table */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Live Exchange Rates (Base: 1.00 USD)
              </span>
              <span className="text-[10px] text-white/40 font-mono">
                Last modified: {config.lastUpdated ? new Date(config.lastUpdated).toLocaleDateString() : 'Baseline'}
              </span>
            </div>

            <div className="space-y-2.5">
              {(['USD', 'INR', 'EUR', 'AED'] as CurrencyCode[]).map((code) => {
                const item = SUPPORTED_CURRENCIES[code];
                const currentRate = config.rates[code] || item.rateFromUSD;
                const isEnabled = config.enabledCurrencies.includes(code);

                return (
                  <div
                    key={code}
                    className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        disabled={code === 'USD'}
                        onChange={() => toggleCurrencyEnabled(code)}
                        className="rounded text-[#477BDB] focus:ring-0 disabled:opacity-40"
                      />
                      <span className="text-xl leading-none">{item.flag}</span>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{code}</span>
                          <span className="text-white/40 font-normal">({item.name})</span>
                        </div>
                        <div className="text-[10px] text-white/40">
                          Symbol: <strong className="text-white/80">{item.symbol.trim()}</strong> • Rounding: ±{item.roundIncrement}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-white/40 font-mono">1 USD =</span>
                      {code === 'USD' ? (
                        <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono font-bold text-white select-none">
                          1.00
                        </span>
                      ) : (
                        <input
                          type="number"
                          step="0.01"
                          min="0.1"
                          value={currentRate}
                          onChange={(e) => handleRateChange(code, parseFloat(e.target.value))}
                          className="w-24 px-2.5 py-1.5 text-xs bg-black/50 border border-white/15 rounded-lg text-white font-mono font-bold text-right outline-none focus:border-[#477BDB]"
                        />
                      )}
                      <span className="text-xs font-bold text-[#38BDF8] w-8">{code}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Testing Sandbox (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-white/50 px-1">
            <span className="flex items-center gap-1.5">
              <ArrowRightLeft className="w-3.5 h-3.5 text-[#38BDF8]" />
              Interactive Rate Test Sandbox
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Real-time</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0E1726] border border-white/15 shadow-2xl space-y-4">
            <div>
              <label className="text-xs font-bold text-white mb-1.5 block">
                Enter Sample Quote Amount in USD ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-white/40 font-bold">$</span>
                <input
                  type="number"
                  step="50"
                  min="50"
                  value={testAmountUSD}
                  onChange={(e) => setTestAmountUSD(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full pl-8 pr-4 py-2 bg-black/40 border border-white/15 rounded-xl text-white font-mono font-bold text-base outline-none focus:border-[#477BDB]"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-2.5">
              <span className="text-xs font-semibold text-white/70 block">
                Visitor Price Renderings Across Regions:
              </span>

              {(['INR', 'USD', 'EUR', 'AED'] as CurrencyCode[]).map((c) => {
                const item = SUPPORTED_CURRENCIES[c];
                const formatted = formatCurrencyAmount(testAmountUSD, c, config.rates, 'USD');

                return (
                  <div
                    key={c}
                    className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg leading-none">{item.flag}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{c}</div>
                        <div className="text-[10px] text-white/40">{item.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-emerald-400 font-mono">{formatted}</div>
                      <div className="text-[9px] text-white/30 font-mono">
                        Rate: {config.rates[c] || item.rateFromUSD}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                These exact converted amounts will appear across the Cost Estimator and Proposal Generator based on visitor country.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
