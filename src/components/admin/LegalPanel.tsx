'use client';

import React, { useState, useEffect } from 'react';
import { Save, Check, Loader2, Shield, FileText, Sparkles, ExternalLink, Eye, Edit3, Heading, List, Bold, Link2 } from 'lucide-react';

const LEGAL_PAGES = [
  { slug: 'privacy-policy', label: 'Privacy Policy', path: '/legal/privacy-policy' },
  { slug: 'terms-of-service', label: 'Terms of Service', path: '/legal/terms-of-service' },
  { slug: 'cookie-policy', label: 'Cookie Policy', path: '/legal/cookie-policy' },
  { slug: 'refund-policy', label: 'Refund Policy', path: '/legal/refund-policy' },
  { slug: 'disclaimer', label: 'Disclaimer', path: '/legal/disclaimer' },
  { slug: 'accessibility', label: 'Accessibility', path: '/legal/accessibility' },
];

export default function LegalPanel() {
  const [selectedSlug, setSelectedSlug] = useState('privacy-policy');
  const [doc, setDoc] = useState<{ title: string; content: string }>({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [source, setSource] = useState('loading');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  const loadDoc = async (slug: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/legal?slug=${slug}`);
      if (res.ok) {
        const json = await res.json();
        setDoc(json.doc || { title: '', content: '' });
        setSource(json.source || 'supabase');
      }
    } catch (e) {
      console.error('Failed to load legal doc:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoc(selectedSlug);
  }, [selectedSlug]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/legal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: selectedSlug,
          title: doc.title,
          content: doc.content,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setSource('supabase');
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      console.error('Failed to save legal policy:', err);
    } finally {
      setSaving(false);
    }
  };

  const insertSnippet = (snippet: string) => {
    setDoc((prev) => ({
      ...prev,
      content: prev.content ? `${prev.content}\n\n${snippet}` : snippet,
    }));
  };

  const currentMeta = LEGAL_PAGES.find((p) => p.slug === selectedSlug);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#477BDB]" />
            <h2 className="text-lg font-semibold text-white">Legal Documents & Compliance Editor</h2>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Edit statutory terms, privacy, cookie, and refund policies in Markdown with instant live revalidation.
            Data source: <span className="font-mono text-[#477BDB] font-semibold">{source}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {currentMeta && (
            <a
              href={currentMeta.path}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <span>View Live Page</span>
              <ExternalLink size={12} />
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#477BDB] hover:bg-[#3b82d4] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {saving ? (
              <Loader2 size={13} className="animate-spin" />
            ) : saved ? (
              <Check size={13} />
            ) : (
              <Save size={13} />
            )}
            <span>{saved ? 'Policy Saved!' : saving ? 'Saving...' : 'Save Document'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Policy Selector Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-medium text-white/40 uppercase tracking-wider px-1 mb-2">
            Select Legal Document ({LEGAL_PAGES.length})
          </div>
          {LEGAL_PAGES.map((p) => (
            <button
              key={p.slug}
              onClick={() => setSelectedSlug(p.slug)}
              className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                selectedSlug === p.slug
                  ? 'bg-[#477BDB]/15 border-[#477BDB]/50 text-white shadow-sm'
                  : 'bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Shield size={14} className={selectedSlug === p.slug ? 'text-[#477BDB]' : 'text-white/40'} />
                <span className="text-xs font-semibold text-white">{p.label}</span>
              </div>
              <span className="text-[10px] font-mono text-white/30">{p.path}</span>
            </button>
          ))}

          <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/10 text-[11px] text-blue-200/70 space-y-1 mt-4">
            <div className="font-semibold text-blue-300">💡 Instant Website Sync:</div>
            <p>
              Changes saved here instantly update the public legal pages at <code className="text-white">/legal/*</code> and clear Next.js cache.
            </p>
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-8 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-white/40">
              <Loader2 className="w-6 h-6 animate-spin mr-2 text-[#477BDB]" />
              <span>Loading Document...</span>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
                <div className="text-sm font-semibold text-white">
                  Editing: <span className="text-[#477BDB]">{doc.title || selectedSlug}</span>
                </div>
                
                {/* Mode Switcher */}
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10">
                  <button
                    type="button"
                    onClick={() => setViewMode('edit')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                      viewMode === 'edit'
                        ? 'bg-[#477BDB] text-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Edit3 size={12} />
                    <span>Markdown Editor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('preview')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                      viewMode === 'preview'
                        ? 'bg-[#477BDB] text-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Eye size={12} />
                    <span>Live Preview</span>
                  </button>
                </div>
              </div>

              {viewMode === 'edit' ? (
                <>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">
                      Document Heading / Page Title
                    </label>
                    <input
                      type="text"
                      value={doc.title}
                      onChange={(e) => setDoc({ ...doc, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-[#477BDB]"
                    />
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] text-white/40 mr-1">Quick Add:</span>
                    <button
                      type="button"
                      onClick={() => insertSnippet('## New Section Title\nEnter your section description here.')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[11px] text-white/70 border border-white/10 cursor-pointer"
                    >
                      <Heading size={11} />
                      <span>+ Heading</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('- Bullet Item 1\n- Bullet Item 2\n- Bullet Item 3')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[11px] text-white/70 border border-white/10 cursor-pointer"
                    >
                      <List size={11} />
                      <span>+ Bullet List</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('**Important Notice:** ')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[11px] text-white/70 border border-white/10 cursor-pointer"
                    >
                      <Bold size={11} />
                      <span>+ Bold Prefix</span>
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-white/70">
                        Policy Content (Markdown syntax supported)
                      </label>
                      <span className="text-[10px] font-mono text-white/40">
                        {doc.content?.length || 0} characters
                      </span>
                    </div>
                    <textarea
                      rows={18}
                      value={doc.content}
                      onChange={(e) => setDoc({ ...doc, content: e.target.value })}
                      className="w-full px-3.5 py-3 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs leading-relaxed outline-none focus:border-[#477BDB]"
                      placeholder="## 1. Title&#10;Write content here..."
                    />
                  </div>
                </>
              ) : (
                /* Live Preview Render */
                <div className="p-6 rounded-xl bg-white text-[#0F1C31] min-h-[400px] overflow-y-auto max-h-[600px] shadow-inner space-y-5">
                  <div className="border-b pb-3 mb-4">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Document Preview</span>
                    <h1 className="text-2xl font-black text-[#0F1C31] mt-1">{doc.title}</h1>
                  </div>
                  {doc.content.split('\n\n').map((block, idx) => {
                    const trimmed = block.trim();
                    if (trimmed.startsWith('## ')) {
                      return (
                        <h2 key={idx} className="text-lg font-bold text-[#0F1C31] mt-6 mb-2 border-b pb-1">
                          {trimmed.replace('## ', '')}
                        </h2>
                      );
                    }
                    if (trimmed.startsWith('# ')) {
                      return (
                        <h1 key={idx} className="text-xl font-bold text-[#0F1C31] mt-6 mb-3">
                          {trimmed.replace('# ', '')}
                        </h1>
                      );
                    }
                    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                      const items = trimmed.split('\n').filter((l) => l.trim().length > 0);
                      return (
                        <ul key={idx} className="list-disc pl-5 space-y-1 text-gray-700 text-xs leading-relaxed">
                          {items.map((it, iIdx) => (
                            <li key={iIdx}>{it.replace(/^[-*]\s*/, '')}</li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={idx} className="text-gray-700 text-xs leading-relaxed whitespace-pre-line">
                        {trimmed}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
