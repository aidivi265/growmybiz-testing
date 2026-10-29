'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, Loader2, BookOpen, X } from 'lucide-react';
import MediaUploadInput from './MediaUploadInput';
import type { BlogPost } from '@/types';

interface ArticleFormState {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content_markdown: string;
  cover_image: string;
  author: string;
  read_time: string;
  tags_str: string;
  is_published: boolean;
}

export default function BlogPanel() {
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string>('loading');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<ArticleFormState>({
    slug: '',
    title: '',
    excerpt: '',
    content_markdown: '',
    cover_image: '/portfolio-mockups/mobile-app.png',
    author: 'Growmybiz24 Team',
    read_time: '4 min read',
    tags_str: 'Web & Digital Strategy, Conversion',
    is_published: true,
  });

  const loadArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/insights');
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles || []);
        setSource(data.source || 'supabase');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      slug: '',
      title: '',
      excerpt: '',
      content_markdown: '# Article Title\n\nWrite your insights here in standard Markdown...',
      cover_image: '/portfolio-mockups/mobile-app.png',
      author: 'Growmybiz24 Team',
      read_time: '4 min read',
      tags_str: 'Strategy, Growth',
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (a: BlogPost) => {
    setEditingId(a.id);
    setForm({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      content_markdown: a.content,
      cover_image: a.coverImage || '/portfolio-mockups/mobile-app.png',
      author: a.author || 'Growmybiz24 Team',
      read_time: `${a.readTime} min read`,
      tags_str: Array.isArray(a.tags) ? a.tags.join(', ') : a.category || '',
      is_published: a.published ?? true,
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    if (!editingId) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setForm((prev) => ({ ...prev, title: val, slug: autoSlug }));
    } else {
      setForm((prev) => ({ ...prev, title: val }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.content_markdown) return;

    setSaving(true);
    try {
      const tags = form.tags_str
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        id: editingId,
        slug: form.slug,
        title: form.title,
        excerpt: form.excerpt,
        content_markdown: form.content_markdown,
        cover_image: form.cover_image,
        author: form.author,
        read_time: form.read_time,
        tags,
        is_published: form.is_published,
      };

      const res = await fetch('/api/admin/insights', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadArticles();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save article');
      }
    } catch {
      alert('Error saving article');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete article "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/insights?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        loadArticles();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete article');
      }
    } catch {
      alert('Error deleting article');
    }
  };

  return (
    <div className="bg-[#0d0d14] rounded-xl border border-white/[0.06] p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Blog & Insights Manager</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Engine ({source})
            </span>
          </div>
          <p className="text-xs text-white/40 mt-0.5">
            Create, edit, and publish thought leadership articles with full Markdown support.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#3b82d4] hover:bg-[#2563eb] transition-all shrink-0"
        >
          <Plus size={14} />
          <span>Write Article</span>
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-12 flex items-center justify-center gap-2 text-white/40 text-xs">
          <Loader2 size={16} className="animate-spin text-[#3b82d4]" />
          <span>Loading articles from database...</span>
        </div>
      ) : articles.length === 0 ? (
        <div className="py-12 text-center text-white/40 text-xs">
          No articles published yet. Click &quot;Write Article&quot; to create your first post.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-white/40">
                <th className="py-2.5 px-3">Article</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Read Time</th>
                <th className="py-2.5 px-3">Published</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {articles.map((a) => (
                <tr key={a.id || a.slug} className="hover:bg-white/[0.02] text-white/80">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#3b82d4]/10 text-[#3b82d4] flex items-center justify-center shrink-0">
                        <BookOpen size={14} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{a.title}</p>
                        <p className="text-[11px] text-white/40 line-clamp-1">{a.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-white/60">{a.category}</td>
                  <td className="py-3 px-3 text-white/50 font-mono">{a.readTime} min</td>
                  <td className="py-3 px-3 text-white/40 whitespace-nowrap">
                    {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Draft'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <a
                        href={`/insights/${a.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors"
                        title="View Live Article"
                      >
                        <Eye size={13} />
                      </a>
                      <button
                        onClick={() => openEditModal(a)}
                        className="p-1.5 rounded-lg text-white/40 hover:text-[#3b82d4] hover:bg-white/[0.05] transition-colors"
                        title="Edit Article"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id, a.title)}
                        className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/[0.05] transition-colors"
                        title="Delete Article"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0f0f18] rounded-2xl border border-white/10 w-full max-w-2xl p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
              <h3 className="text-base font-bold text-white">
                {editingId ? 'Edit Article' : 'Write New Article'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/40 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. SEO for Small Businesses: What Actually Works"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="seo-for-small-businesses"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Summary / Excerpt *</label>
                <input
                  type="text"
                  required
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="Key takeaway shown on listing cards (1-2 sentences)"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                />
              </div>

              {/* Cover Image */}
              <MediaUploadInput
                label="Cover Image"
                value={form.cover_image}
                onChange={(url) => setForm({ ...form, cover_image: url })}
                placeholder="Upload banner or paste image URL"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Author</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Read Time</label>
                  <input
                    type="text"
                    value={form.read_time}
                    onChange={(e) => setForm({ ...form, read_time: e.target.value })}
                    placeholder="5 min read"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={form.tags_str}
                    onChange={(e) => setForm({ ...form, tags_str: e.target.value })}
                    placeholder="SEO, Marketing, Growth"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Article Body (Markdown) *</label>
                <textarea
                  rows={8}
                  required
                  value={form.content_markdown}
                  onChange={(e) => setForm({ ...form, content_markdown: e.target.value })}
                  placeholder="# Section Heading&#10;&#10;Write article paragraphs here with standard markdown support (**bold**, *italic*, lists, headings)..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4] font-mono leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="rounded bg-white/10 border-white/20 text-[#3b82d4]"
                />
                <label htmlFor="is_published" className="text-xs text-white/80">
                  Publish immediately (Uncheck to save as draft)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#3b82d4] hover:bg-[#2563eb] disabled:opacity-50"
                >
                  {saving && <Loader2 size={13} className="animate-spin" />}
                  <span>{editingId ? 'Save Changes' : 'Publish Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
