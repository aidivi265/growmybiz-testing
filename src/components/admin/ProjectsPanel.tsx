'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  ExternalLink,
  Eye,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  CreditCard,
  Send,
  RefreshCw,
  Plus,
  X,
  Bot,
  Shield,
} from 'lucide-react';
import type { ProjectRecord, MilestoneItem, QuotationDetails } from '@/types/project';

export default function ProjectsPanel() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null);

  // Edit Quotation state
  const [quotationAmount, setQuotationAmount] = useState<number>(0);
  const [publishing, setPublishing] = useState(false);

  // Mockup update state
  const [mockupTitle, setMockupTitle] = useState('');
  const [mockupUrl, setMockupUrl] = useState('');
  const [submittingMockup, setSubmittingMockup] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error('Error fetching admin projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSelectProject = (p: ProjectRecord) => {
    setSelectedProject(p);
    setQuotationAmount(p.quotation?.totalAmount || 180000);
    setMockupTitle(p.mockups?.[0]?.title || 'Phase 1: High-Fidelity UI/UX Prototype');
    setMockupUrl(p.mockups?.[0]?.previewUrl || 'https://www.figma.com');
  };

  // AI Auto-Draft Quotation
  const handleAiGenerateQuotation = async () => {
    if (!selectedProject) return;
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(selectedProject.receiptId)}/quotation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ai_generate' }),
      });
      const data = await res.json();
      if (res.ok && data.quotation) {
        setSelectedProject((prev) => prev ? { ...prev, quotation: data.quotation } : null);
        setQuotationAmount(data.quotation.totalAmount);
        alert('AI Quotation & SOW successfully generated with 50-30-20 milestone gates!');
      }
    } catch {
      alert('Error generating AI quotation.');
    }
  };

  // Publish Quotation to Portal
  const handlePublishQuotation = async () => {
    if (!selectedProject) return;
    setPublishing(true);
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(selectedProject.receiptId)}/quotation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publishLive: true,
          quotation: {
            ...selectedProject.quotation,
            totalAmount: quotationAmount,
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data.project) {
        setSelectedProject(data.project);
        setProjects((prev) => prev.map((p) => p.receiptId === data.project.receiptId ? data.project : p));
        alert('Quotation is now LIVE on the client portal! Client can view and pay 50% advance.');
      }
    } catch {
      alert('Error publishing quotation.');
    } finally {
      setPublishing(false);
    }
  };

  // Submit Mockup to Client
  const handleSubmitMockup = async () => {
    if (!selectedProject) return;
    setSubmittingMockup(true);
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(selectedProject.receiptId)}/mockup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: mockupTitle.trim() || 'Interactive Prototype',
          previewUrl: mockupUrl.trim() || 'https://www.figma.com',
          description: 'High-fidelity responsive UI mockups ready for review and sign-off.',
          status: 'ready_for_review',
        }),
      });
      const data = await res.json();
      if (res.ok && data.project) {
        setSelectedProject(data.project);
        setProjects((prev) => prev.map((p) => p.receiptId === data.project.receiptId ? data.project : p));
        alert('Mockup submitted! Client portal updated with interactive preview and sign-off prompt.');
      }
    } catch {
      alert('Error updating mockup.');
    } finally {
      setSubmittingMockup(false);
    }
  };

  const filtered = projects.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Top Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Sparkles size={18} />
            </span>
            <h2 className="text-xl font-bold text-white">Client Projects & Automated Portals</h2>
          </div>
          <p className="text-xs text-white/40 mt-1">
            Manage incoming project requests, AI quotation drafting, 50-30-20 billing gates, and design sign-offs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchProjects}
            className="p-2 rounded-xl bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors"
            title="Refresh Projects"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <a
            href="/start-project"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-[#3b82d4] hover:bg-[#3270b8] transition-colors"
          >
            <Plus size={14} />
            Test Client Wizard
          </a>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs">
        {['all', 'under_review', 'quotation_live', 'phase_1_in_progress', 'design_ready', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === f ? 'bg-white/10 text-white font-bold' : 'text-white/40 hover:text-white'
            }`}
          >
            {f === 'all' && 'All Projects'}
            {f === 'under_review' && 'Under Review'}
            {f === 'quotation_live' && 'Quotation Live'}
            {f === 'phase_1_in_progress' && 'Phase 1 (Design)'}
            {f === 'design_ready' && 'Design Ready'}
            {f === 'completed' && 'Completed'}
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div className="bg-[#0d0d14] rounded-2xl border border-white/[0.06] overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-white/30">Loading projects...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-white/30">
            No projects in this category. Submit a project from the website to see it appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.06] text-white/40 bg-white/[0.01]">
                <tr>
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Client / Brand</th>
                  <th className="py-3 px-4">Service Required</th>
                  <th className="py-3 px-4">Budget Range</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] text-white/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#3b82d4]">
                      {p.receiptId}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div>{p.companyName || p.clientName}</div>
                      <div className="text-[11px] text-white/40 font-normal">{p.clientEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 text-white/70">{p.serviceTitle}</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-mono">{p.budgetRange}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        p.status === 'under_review'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : p.status === 'quotation_live'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : p.status === 'phase_1_in_progress'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : p.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}>
                        {p.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleSelectProject(p)}
                          className="px-2.5 py-1 rounded-lg bg-[#3b82d4]/10 text-[#3b82d4] hover:bg-[#3b82d4]/20 font-semibold text-xs transition-colors"
                        >
                          Manage & Quote
                        </button>
                        <a
                          href={`/portal?receipt=${encodeURIComponent(p.receiptId)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-white/[0.04] text-white/40 hover:text-white hover:bg-white/[0.08]"
                          title="Open Client View"
                        >
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed Project Management Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          />

          <div className="relative w-full max-w-3xl bg-[#0d0d14] border border-white/[0.1] rounded-2xl shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#3b82d4]">
                  {selectedProject.receiptId}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {selectedProject.companyName || selectedProject.clientName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Client Intake Summary */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2 text-xs">
              <div className="text-white/40 uppercase tracking-wider text-[10px] font-bold">
                Client Intake Brief
              </div>
              <div className="text-white">
                <strong>Primary Goal:</strong> {selectedProject.primaryGoal}
              </div>
              <div className="text-white/70">
                <strong>Scale:</strong> {selectedProject.projectScale} | <strong>Timeline:</strong> {selectedProject.targetTimeline}
              </div>
              <div className="text-white/70">
                <strong>Features Requested:</strong> {selectedProject.featureWishlist.join(', ') || 'Standard scope'}
              </div>
            </div>

            {/* AI Quotation Engine */}
            <div className="p-5 rounded-2xl bg-[#12121c] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot size={18} className="text-[#3b82d4]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    AI Quotation & SOW Engine
                  </span>
                </div>
                <button
                  onClick={handleAiGenerateQuotation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#3b82d4] bg-[#3b82d4]/10 hover:bg-[#3b82d4]/20 transition-colors"
                >
                  <Sparkles size={12} />
                  Re-Draft with AI
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-white/40">Total Project Value</div>
                  <input
                    type="number"
                    value={quotationAmount}
                    onChange={(e) => setQuotationAmount(Number(e.target.value))}
                    className="w-full mt-1 bg-transparent font-mono font-bold text-sm text-white focus:outline-none"
                  />
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-white/40">Milestone 1 (50% Advance)</div>
                  <div className="font-mono font-bold text-sm text-emerald-400 mt-1">
                    ₹{Math.round(quotationAmount * 0.5).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-white/40">M2 (30%) + M3 (20%)</div>
                  <div className="font-mono font-bold text-sm text-white mt-1">
                    ₹{Math.round(quotationAmount * 0.3).toLocaleString('en-IN')} / ₹{Math.round(quotationAmount * 0.2).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <button
                onClick={handlePublishQuotation}
                disabled={publishing}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#3b82d4] hover:bg-[#3270b8] transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                <Send size={14} />
                {publishing ? 'Publishing...' : 'Publish Quotation to Client Portal'}
              </button>
            </div>

            {/* Mockup Management */}
            <div className="p-5 rounded-2xl bg-[#12121c] border border-white/[0.08] space-y-3">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-amber-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Phase 1: Design Mockup Handoff
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-white/40 mb-1">Mockup Title</label>
                  <input
                    type="text"
                    value={mockupTitle}
                    onChange={(e) => setMockupTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/40 mb-1">Figma / Prototype Preview URL</label>
                  <input
                    type="url"
                    value={mockupUrl}
                    onChange={(e) => setMockupUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmitMockup}
                disabled={submittingMockup}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors disabled:opacity-60"
              >
                {submittingMockup ? 'Submitting...' : 'Send Mockups to Client for Sign-Off'}
              </button>
            </div>

            {/* Quick Link to Client Portal */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <a
                href={`/portal?receipt=${encodeURIComponent(selectedProject.receiptId)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#3b82d4] hover:underline"
              >
                Open Client Portal View <ExternalLink size={12} />
              </a>
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 rounded-xl text-white/60 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
