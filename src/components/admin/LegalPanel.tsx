'use client';

import React, { useState, useEffect } from 'react';
import { Save, Check, Loader2, Shield, FileText, Sparkles, ExternalLink } from 'lucide-react';

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

  const currentMeta = LEGAL_PAGES.find((p) => p.slug === selectedSlug);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <div>
          <h2 className="text-lg font-semibold text-white">Legal Documents & Compliance Editor</h2>
          <p className="text-xs text-white/50">
            Edit statutory terms, privacy, cookie, and refund policies in Markdown with instant live revalidation.
            Data source: <span className="font-mono text-[#477BDB]">{source}</span>
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#477BDB] hover:bg-[#3b82d4] transition-colors disabled:opacity-50 cursor-pointer"
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
            Legal Policies ({LEGAL_PAGES.length})
          </div>
          {LEGAL_PAGES.map((p) => (
            <button
              key={p.slug}
              onClick={() => setSelectedSlug(p.slug)}
              className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                selectedSlug === p.slug
                  ? 'bg-[#477BDB]/10 border-[#477BDB]/40 text-white'
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
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-8 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-white/40">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading Document...</span>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="text-sm font-semibold text-white">
                  Editing: <span className="text-[#477BDB]">{doc.title || selectedSlug}</span>
                </div>
                <span className="text-[11px] font-mono text-white/40">
                  {doc.content?.length || 0} characters
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  Document Heading / Page Title
                </label>
                <input
                  type="text"
                  value={doc.title}
                  onChange={(e) => setDoc({ ...doc, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  Policy Content (Markdown syntax supported: ## Headings, - Bullets, **Bold**)
                </label>
                <textarea
                  rows={16}
                  value={doc.content}
                  onChange={(e) => setDoc({ ...doc, content: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs leading-relaxed outline-none focus:border-[#477BDB]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
