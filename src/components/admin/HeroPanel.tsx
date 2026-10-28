'use client';

import React, { useState, useEffect } from 'react';
import { Save, Check, Loader2, Sparkles, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { HeroSlide } from '@/types';

export default function HeroPanel() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [source, setSource] = useState<string>('loading');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    fetch('/api/admin/hero')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.slides) {
          setSlides(data.slides);
          setSource(data.source || 'supabase');
        }
      })
      .catch((e) => console.error('Failed to load hero slides:', e))
      .finally(() => setLoading(false));
  }, []);

  const handleSlideChange = (index: number, field: keyof HeroSlide, value: any) => {
    const updated = [...slides];
    updated[index] = { ...updated[index], [field]: value };
    setSlides(updated);
  };

  const handleCtaChange = (
    index: number,
    ctaType: 'ctaPrimary' | 'ctaSecondary',
    field: 'label' | 'href',
    value: string
  ) => {
    const updated = [...slides];
    const cta = updated[index][ctaType] || { label: '', href: '' };
    updated[index] = {
      ...updated[index],
      [ctaType]: { ...cta, [field]: value },
    };
    setSlides(updated);
  };

  const addSlide = () => {
    const newSlide: HeroSlide = {
      id: `hero-${Date.now()}`,
      badge: 'New Innovation',
      heading: 'Crafting High-Impact Digital Experiences',
      subheading: 'We engineer next-generation web platforms, brands, and automated pipelines.',
      ctaPrimary: { label: 'Start a Project', href: '/contact' },
      ctaSecondary: { label: 'Explore Services', href: '/services' },
    };
    setSlides([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
  };

  const removeSlide = (index: number) => {
    if (slides.length <= 1) {
      alert('You must have at least one hero slide.');
      return;
    }
    const filtered = slides.filter((_, i) => i !== index);
    setSlides(filtered);
    setActiveSlideIndex(Math.max(0, index - 1));
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSlides(updated);
    setActiveSlideIndex(targetIndex);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides }),
      });
      if (res.ok) {
        setSaved(true);
        setSource('supabase');
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      console.error('Failed to save hero slides:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-white/40">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading Hero Slides...</span>
      </div>
    );
  }

  const currentSlide = slides[activeSlideIndex] || slides[0];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <div>
          <h2 className="text-lg font-semibold text-white">Hero Slides Management</h2>
          <p className="text-xs text-white/50">
            Edit rotating headline banners, subtext, badges, and CTA action buttons on the homepage.
            Data source: <span className="font-mono text-[#477BDB]">{source}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={addSlide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Slide</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#477BDB] hover:bg-[#3b82d4] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <Loader2 size={13} className="animate-spin" />
            ) : saved ? (
              <Check size={13} />
            ) : (
              <Save size={13} />
            )}
            <span>{saved ? 'Saved Live to Site!' : saving ? 'Saving...' : 'Save All Slides'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Slide Selector & Reordering sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-medium text-white/40 uppercase tracking-wider px-1">
            Slides Sequence ({slides.length})
          </div>
          {slides.map((s, idx) => (
            <div
              key={s.id || idx}
              onClick={() => setActiveSlideIndex(idx)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                activeSlideIndex === idx
                  ? 'bg-[#477BDB]/10 border-[#477BDB]/40 text-white'
                  : 'bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/[0.04]'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/80">
                    Slide {idx + 1}
                  </span>
                  {s.badge && (
                    <span className="text-[10px] truncate text-[#477BDB] font-medium">
                      {s.badge}
                    </span>
                  )}
                </div>
                <div className="text-xs font-medium text-white truncate">
                  {s.heading.replace(/\n/g, ' ')}
                </div>
              </div>
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => moveSlide(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1 rounded text-white/40 hover:text-white disabled:opacity-20"
                  title="Move Up"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  onClick={() => moveSlide(idx, 'down')}
                  disabled={idx === slides.length - 1}
                  className="p-1 rounded text-white/40 hover:text-white disabled:opacity-20"
                  title="Move Down"
                >
                  <ArrowDown size={12} />
                </button>
                <button
                  onClick={() => removeSlide(idx)}
                  className="p-1 rounded text-rose-400/60 hover:text-rose-400"
                  title="Delete Slide"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Current Slide Editor Form & Live Preview */}
        <div className="lg:col-span-8 space-y-6">
          {currentSlide && (
            <>
              {/* Form Card */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="text-sm font-semibold text-white">
                    Editing Slide {activeSlideIndex + 1}
                  </div>
                  <span className="text-[11px] font-mono text-white/40">ID: {currentSlide.id}</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">
                    Badge Pill Text
                  </label>
                  <input
                    type="text"
                    value={currentSlide.badge || ''}
                    onChange={(e) => handleSlideChange(activeSlideIndex, 'badge', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:border-[#477BDB] outline-none"
                    placeholder="e.g. Full-Service Digital Agency"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">
                    Main Headline (use Enter for line break)
                  </label>
                  <textarea
                    rows={2}
                    value={currentSlide.heading}
                    onChange={(e) => handleSlideChange(activeSlideIndex, 'heading', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:border-[#477BDB] outline-none"
                    placeholder="Headline text..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">
                    Subheading Description
                  </label>
                  <textarea
                    rows={2}
                    value={currentSlide.subheading}
                    onChange={(e) =>
                      handleSlideChange(activeSlideIndex, 'subheading', e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:border-[#477BDB] outline-none"
                    placeholder="Detailed supporting copy..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-xs font-semibold text-white/80">Primary CTA Button</div>
                    <div>
                      <label className="block text-[11px] text-white/50 mb-1">Button Label</label>
                      <input
                        type="text"
                        value={currentSlide.ctaPrimary?.label || ''}
                        onChange={(e) =>
                          handleCtaChange(activeSlideIndex, 'ctaPrimary', 'label', e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-white/50 mb-1">Target URL</label>
                      <input
                        type="text"
                        value={currentSlide.ctaPrimary?.href || ''}
                        onChange={(e) =>
                          handleCtaChange(activeSlideIndex, 'ctaPrimary', 'href', e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-xs font-semibold text-white/80">Secondary CTA Button</div>
                    <div>
                      <label className="block text-[11px] text-white/50 mb-1">Button Label</label>
                      <input
                        type="text"
                        value={currentSlide.ctaSecondary?.label || ''}
                        onChange={(e) =>
                          handleCtaChange(activeSlideIndex, 'ctaSecondary', 'label', e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-white/50 mb-1">Target URL</label>
                      <input
                        type="text"
                        value={currentSlide.ctaSecondary?.href || ''}
                        onChange={(e) =>
                          handleCtaChange(activeSlideIndex, 'ctaSecondary', 'href', e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Website Simulation Preview Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c0d12] to-[#12141c] border border-white/10 relative overflow-hidden">
                <div className="absolute top-3 right-3 text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-1">
                  <Sparkles size={11} className="text-[#477BDB]" /> Live Preview
                </div>
                <div className="max-w-md space-y-3">
                  {currentSlide.badge && (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium text-[#477BDB] bg-[#477BDB]/10 border border-[#477BDB]/20">
                      {currentSlide.badge}
                    </span>
                  )}
                  <h3 className="text-2xl font-bold text-white tracking-tight whitespace-pre-line leading-tight">
                    {currentSlide.heading}
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    {currentSlide.subheading}
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    {currentSlide.ctaPrimary?.label && (
                      <span className="px-3.5 py-1.5 rounded-lg bg-[#477BDB] text-white text-xs font-semibold shadow-lg shadow-[#477BDB]/20">
                        {currentSlide.ctaPrimary.label}
                      </span>
                    )}
                    {currentSlide.ctaSecondary?.label && (
                      <span className="px-3.5 py-1.5 rounded-lg bg-white/10 text-white/80 text-xs font-medium border border-white/10">
                        {currentSlide.ctaSecondary.label}
                      </span>
                    )}
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
