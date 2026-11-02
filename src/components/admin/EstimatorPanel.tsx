'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Check,
  Loader2,
  Calculator,
  RefreshCw,
  ExternalLink,
  Code,
  Sliders,
  DollarSign,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import type { EstimatorConfig } from '@/data/estimatorConfig';
import { defaultEstimatorConfig } from '@/data/estimatorConfig';

export default function EstimatorPanel() {
  const [config, setConfig] = useState<EstimatorConfig>(defaultEstimatorConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [source, setSource] = useState<'supabase' | 'default'>('default');
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [activeTab, setActiveTab] = useState<'rates' | 'platforms' | 'tiers' | 'features'>('platforms');

  const loadConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/estimator');
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          setConfig(data.config);
          setSource(data.source || 'supabase');
          setJsonText(JSON.stringify(data.config, null, 2));
        }
      }
    } catch (err) {
      console.error('Failed to load estimator config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setJsonError('');

    let payload = config;

    if (jsonMode) {
      try {
        payload = JSON.parse(jsonText);
        setConfig(payload);
      } catch (err: any) {
        setJsonError('Invalid JSON format: ' + err.message);
        setSaving(false);
        return;
      }
    }

    try {
      const res = await fetch('/api/admin/estimator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: payload }),
      });

      if (res.ok) {
        setSaved(true);
        setSource('supabase');
        setJsonText(JSON.stringify(payload, null, 2));
        setTimeout(() => setSaved(false), 2500);
      } else {
        const errData = await res.json();
        alert(`Error saving: ${errData.error || 'Server error'}`);
      }
    } catch (err: any) {
      console.error('Failed to save estimator config:', err);
      alert('Failed to save estimator configuration.');
    } finally {
      setSaving(false);
    }
  };

  const updatePlatformPrice = (
    catIndex: number,
    platIndex: number,
    field: 'basePriceINR' | 'basePriceUSD' | 'baseWeeks',
    val: number
  ) => {
    const updated = { ...config };
    updated.categories = [...updated.categories];
    updated.categories[catIndex].platforms = [...updated.categories[catIndex].platforms];
    updated.categories[catIndex].platforms[platIndex] = {
      ...updated.categories[catIndex].platforms[platIndex],
      [field]: val,
    };
    setConfig(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const updateTierPrice = (tierIndex: number, field: 'additionalPriceINR' | 'additionalPriceUSD', val: number) => {
    const updated = { ...config };
    updated.designTiers = [...updated.designTiers];
    updated.designTiers[tierIndex] = {
      ...updated.designTiers[tierIndex],
      [field]: val,
    };
    setConfig(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const updateFeaturePrice = (featureIndex: number, field: 'priceINR' | 'priceUSD', val: number) => {
    const updated = { ...config };
    updated.features = [...updated.features];
    updated.features[featureIndex] = {
      ...updated.features[featureIndex],
      [field]: val,
    };
    setConfig(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const resetToFactory = () => {
    if (confirm('Reset estimator pricing to recommended factory defaults?')) {
      setConfig(defaultEstimatorConfig);
      setJsonText(JSON.stringify(defaultEstimatorConfig, null, 2));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-white/40">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading Estimator Studio...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">Cost Estimator CMS & Rule Studio</h2>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                source === 'supabase'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {source === 'supabase' ? 'Synced with Supabase' : 'Using Local Baseline'}
            </span>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Configure base prices, design tier multipliers, modular add-on rates, and currency exchange live on the public calculator.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <a
            href="/estimator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <ExternalLink size={12} />
            <span>View /estimator</span>
          </a>

          <button
            onClick={() => setJsonMode(!jsonMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              jsonMode
                ? 'bg-[#477BDB]/20 border-[#477BDB] text-white'
                : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
            }`}
          >
            <Code size={12} />
            <span>{jsonMode ? 'Form View' : 'Raw JSON'}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#477BDB] to-[#6477C8] hover:opacity-95 transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-blue-900/30"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <Check size={13} /> : <Save size={13} />}
            <span>{saved ? 'Saved Live!' : saving ? 'Publishing...' : 'Save Pricing'}</span>
          </button>
        </div>
      </div>

      {jsonMode ? (
        /* JSON Direct Editor */
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Advanced Estimator JSON Schema Editor</span>
            <button
              onClick={resetToFactory}
              className="text-[11px] text-white/40 hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <RefreshCw size={11} /> Reset to Defaults
            </button>
          </div>

          {jsonError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
              {jsonError}
            </div>
          )}

          <textarea
            rows={22}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-emerald-400 font-mono text-xs outline-none focus:border-[#477BDB] leading-relaxed"
          />
        </div>
      ) : (
        /* Visual Form Studio */
        <div className="space-y-6">
          {/* Sub Navigation Tabs */}
          <div className="flex gap-2 border-b border-white/10 pb-2">
            {[
              { id: 'platforms', label: '1. Service Deliverables & Base Rates' },
              { id: 'tiers', label: '2. Design Tier Multipliers' },
              { id: 'features', label: '3. Modular Add-on Pricing' },
              { id: 'rates', label: '4. Currency & Exchange Rates' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#477BDB] text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Platforms by Category */}
          {activeTab === 'platforms' && (
            <div className="space-y-6">
              {config.categories.map((cat, catIdx) => (
                <div key={cat.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{cat.title}</span>
                        <span className="text-[10px] font-mono text-[#477BDB] px-1.5 py-0.5 rounded bg-blue-500/10">
                          {cat.slug}
                        </span>
                      </h3>
                      <p className="text-[11px] text-white/50">{cat.tagline}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {cat.platforms.map((plat, platIdx) => (
                      <div
                        key={plat.id}
                        className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">{plat.title}</span>
                          {plat.badge && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                              {plat.badge}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <label className="block text-[10px] text-white/40 mb-1">Base INR (₹)</label>
                            <input
                              type="number"
                              value={plat.basePriceINR}
                              onChange={(e) =>
                                updatePlatformPrice(catIdx, platIdx, 'basePriceINR', parseInt(e.target.value, 10) || 0)
                              }
                              className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white font-mono text-xs outline-none focus:border-[#477BDB]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-white/40 mb-1">Base USD ($)</label>
                            <input
                              type="number"
                              value={plat.basePriceUSD}
                              onChange={(e) =>
                                updatePlatformPrice(catIdx, platIdx, 'basePriceUSD', parseInt(e.target.value, 10) || 0)
                              }
                              className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white font-mono text-xs outline-none focus:border-[#477BDB]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-white/40 mb-1">Est. Weeks</label>
                            <input
                              type="number"
                              value={plat.baseWeeks}
                              onChange={(e) =>
                                updatePlatformPrice(catIdx, platIdx, 'baseWeeks', parseInt(e.target.value, 10) || 1)
                              }
                              className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white font-mono text-xs outline-none focus:border-[#477BDB]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Design Tiers */}
          {activeTab === 'tiers' && (
            <div className="grid grid-cols-1 gap-4">
              {config.designTiers.map((tier, tierIdx) => (
                <div key={tier.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{tier.title}</h4>
                      <p className="text-xs text-white/50">{tier.description}</p>
                    </div>
                    {tier.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {tier.badge}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-[10px] text-white/50 mb-1">Additional Cost INR (₹)</label>
                      <input
                        type="number"
                        value={tier.additionalPriceINR}
                        onChange={(e) =>
                          updateTierPrice(tierIdx, 'additionalPriceINR', parseInt(e.target.value, 10) || 0)
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-white/50 mb-1">Additional Cost USD ($)</label>
                      <input
                        type="number"
                        value={tier.additionalPriceUSD}
                        onChange={(e) =>
                          updateTierPrice(tierIdx, 'additionalPriceUSD', parseInt(e.target.value, 10) || 0)
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-white/50 mb-1">Tier Multiplier Factor</label>
                      <input
                        type="number"
                        step="0.05"
                        value={tier.multiplier}
                        onChange={(e) => {
                          const updated = { ...config };
                          updated.designTiers[tierIdx].multiplier = parseFloat(e.target.value) || 1.0;
                          setConfig(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Features & Add-ons */}
          {activeTab === 'features' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {config.features.map((feat, featIdx) => (
                <div key={feat.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{feat.title}</span>
                    <span className="text-[10px] font-mono text-white/40 uppercase">{feat.category}</span>
                  </div>
                  <p className="text-[11px] text-white/50 line-clamp-2">{feat.description}</p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                    <div>
                      <label className="block text-[10px] text-white/40 mb-1">Price INR (₹)</label>
                      <input
                        type="number"
                        value={feat.priceINR}
                        onChange={(e) =>
                          updateFeaturePrice(featIdx, 'priceINR', parseInt(e.target.value, 10) || 0)
                        }
                        className="w-full px-2 py-1 rounded bg-black/40 border border-white/10 text-white font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-white/40 mb-1">Price USD ($)</label>
                      <input
                        type="number"
                        value={feat.priceUSD}
                        onChange={(e) =>
                          updateFeaturePrice(featIdx, 'priceUSD', parseInt(e.target.value, 10) || 0)
                        }
                        className="w-full px-2 py-1 rounded bg-black/40 border border-white/10 text-white font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Currency & Exchange Rate */}
          {activeTab === 'rates' && (
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 max-w-lg">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign size={16} className="text-[#477BDB]" />
                Currency Conversion Benchmark
              </h4>
              <p className="text-xs text-white/50">
                Set the internal exchange rate used when calculating approximate USD equivalencies.
              </p>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  1 USD to INR (₹) Benchmark
                </label>
                <input
                  type="number"
                  value={config.exchangeRateUsdToInr}
                  onChange={(e) => {
                    const rate = parseFloat(e.target.value) || 85;
                    setConfig({ ...config, exchangeRateUsdToInr: rate });
                  }}
                  className="w-full max-w-xs px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs"
                />
              </div>

              <div className="pt-2 text-xs text-white/40">
                Last updated: <span className="font-mono text-white/60">{new Date(config.lastUpdated).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
