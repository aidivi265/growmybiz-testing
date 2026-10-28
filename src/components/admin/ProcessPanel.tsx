'use client';

import React, { useState, useEffect } from 'react';
import { Save, Check, Loader2, Plus, Trash2, ArrowUp, ArrowDown, ChevronRight, Layers, Sparkles } from 'lucide-react';
import type { ProcessStep } from '@/types';

export default function ProcessPanel() {
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [source, setSource] = useState<string>('loading');
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const loadSteps = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/process');
      if (res.ok) {
        const data = await res.json();
        setSteps(data.steps || []);
        setSource(data.source || 'supabase');
      }
    } catch (e) {
      console.error('Failed to load process steps:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSteps();
  }, []);

  const handleStepChange = (index: number, field: keyof ProcessStep, value: any) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  };

  const handleDetailChange = (stepIdx: number, detailIdx: number, value: string) => {
    const updated = [...steps];
    const details = [...(updated[stepIdx].details || [])];
    details[detailIdx] = value;
    updated[stepIdx] = { ...updated[stepIdx], details };
    setSteps(updated);
  };

  const addDetail = (stepIdx: number) => {
    const updated = [...steps];
    const details = [...(updated[stepIdx].details || []), 'New checkpoint item'];
    updated[stepIdx] = { ...updated[stepIdx], details };
    setSteps(updated);
  };

  const removeDetail = (stepIdx: number, detailIdx: number) => {
    const updated = [...steps];
    const details = (updated[stepIdx].details || []).filter((_, i) => i !== detailIdx);
    updated[stepIdx] = { ...updated[stepIdx], details };
    setSteps(updated);
  };

  const addStep = () => {
    const newStep: ProcessStep = {
      id: `ps-${Date.now()}`,
      number: String(steps.length + 1).padStart(2, '0'),
      title: 'New Milestone Stage',
      description: 'Clear description of what occurs during this delivery phase.',
      icon: 'ChevronRight',
      details: ['Initial milestone requirement', 'Execution checkpoint', 'Client review and sign-off'],
    };
    setSteps([...steps, newStep]);
    setActiveStepIndex(steps.length);
  };

  const removeStep = (index: number) => {
    if (steps.length <= 1) {
      alert('You must have at least one process step.');
      return;
    }
    const filtered = steps.filter((_, i) => i !== index);
    setSteps(filtered);
    setActiveStepIndex(Math.max(0, index - 1));
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= steps.length) return;
    const updated = [...steps];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setSteps(updated);
    setActiveStepIndex(target);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steps }),
      });
      if (res.ok) {
        setSaved(true);
        setSource('supabase');
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      console.error('Failed to save process steps:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-white/40">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading Process Framework...</span>
      </div>
    );
  }

  const currentStep = steps[activeStepIndex] || steps[0];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <div>
          <h2 className="text-lg font-semibold text-white">Process & Delivery Framework</h2>
          <p className="text-xs text-white/50">
            Control the 6-stage delivery methodology displayed across the homepage and /process page.
            Data source: <span className="font-mono text-[#477BDB]">{source}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={addStep}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Stage</span>
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
            <span>{saved ? 'Saved Live to Site!' : saving ? 'Saving...' : 'Save All Stages'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stages Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-medium text-white/40 uppercase tracking-wider px-1 mb-2">
            Delivery Stages ({steps.length})
          </div>
          {steps.map((st, idx) => (
            <div
              key={st.id || idx}
              onClick={() => setActiveStepIndex(idx)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                activeStepIndex === idx
                  ? 'bg-[#477BDB]/10 border-[#477BDB]/40 text-white'
                  : 'bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/[0.04]'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/90 font-bold">
                    {st.number}
                  </span>
                  <span className="text-xs font-semibold text-white truncate">{st.title}</span>
                </div>
                <div className="text-[11px] text-white/40 truncate mt-1">
                  {(st.details || []).length} checkpoints
                </div>
              </div>
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => moveStep(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1 rounded text-white/40 hover:text-white disabled:opacity-20"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  onClick={() => moveStep(idx, 'down')}
                  disabled={idx === steps.length - 1}
                  className="p-1 rounded text-white/40 hover:text-white disabled:opacity-20"
                >
                  <ArrowDown size={12} />
                </button>
                <button
                  onClick={() => removeStep(idx)}
                  className="p-1 rounded text-rose-400/60 hover:text-rose-400"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stage Editor Form & Live Preview */}
        <div className="lg:col-span-8 space-y-6">
          {currentStep && (
            <>
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="text-sm font-semibold text-white">
                    Stage {currentStep.number}: {currentStep.title}
                  </div>
                  <span className="text-[11px] font-mono text-white/40">ID: {currentStep.id}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">
                      Stage Number
                    </label>
                    <input
                      type="text"
                      value={currentStep.number}
                      onChange={(e) => handleStepChange(activeStepIndex, 'number', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-white/70 mb-1">
                      Stage Title
                    </label>
                    <input
                      type="text"
                      value={currentStep.title}
                      onChange={(e) => handleStepChange(activeStepIndex, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">
                    Stage Overview Description
                  </label>
                  <textarea
                    rows={2}
                    value={currentStep.description}
                    onChange={(e) =>
                      handleStepChange(activeStepIndex, 'description', e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
                  />
                </div>

                {/* Checkpoint Bullets */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-white/70">
                      Phase Checkpoints & Deliverables
                    </label>
                    <button
                      type="button"
                      onClick={() => addDetail(activeStepIndex)}
                      className="text-[11px] font-medium text-[#477BDB] hover:underline flex items-center gap-1"
                    >
                      <Plus size={11} /> Add Bullet
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(currentStep.details || []).map((det, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#477BDB] shrink-0" />
                        <input
                          type="text"
                          value={det}
                          onChange={(e) =>
                            handleDetailChange(activeStepIndex, dIdx, e.target.value)
                          }
                          className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeDetail(activeStepIndex, dIdx)}
                          className="p-1 rounded text-white/30 hover:text-rose-400"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c0d12] to-[#141724] border border-white/10 space-y-3 relative overflow-hidden">
                <div className="absolute top-3 right-3 text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-1">
                  <Sparkles size={11} className="text-[#477BDB]" /> Live Preview
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-bold px-2 py-0.5 rounded bg-[#477BDB]/20 border border-[#477BDB]/40 text-[#477BDB]">
                    STAGE {currentStep.number}
                  </span>
                  <h3 className="text-lg font-bold text-white">{currentStep.title}</h3>
                </div>
                <p className="text-xs text-white/60 leading-relaxed max-w-lg">
                  {currentStep.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {(currentStep.details || []).map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-white/80"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="truncate">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
