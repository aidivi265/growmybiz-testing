'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  CheckCircle2,
  Lock,
  Unlock,
  CreditCard,
  FileText,
  Printer,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Clock,
  ChevronRight,
  Eye,
  Star,
  Layers,
  ArrowRight,
  MessageSquare,
  AlertCircle,
  AlertTriangle,
  KeyRound,
} from 'lucide-react';
import { SYNE_FONT } from '@/lib/fonts';
import type { ProjectRecord, MilestoneItem } from '@/types/project';
import DocumentModal from '@/components/portal/DocumentModal';

export default function ClientPortalClient() {
  const searchParams = useSearchParams();
  const initialReceipt = searchParams.get('receipt') || 'GMB-PRJ-2026-1001';
  const initialToken = searchParams.get('token') || '';

  const [searchReceipt, setSearchReceipt] = useState(initialReceipt);
  const [token, setToken] = useState(initialToken);
  const [verifyEmailInput, setVerifyEmailInput] = useState('');
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [isRestricted, setIsRestricted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Document Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDocType, setModalDocType] = useState<'proposal' | 'agreement' | 'invoice' | 'slip' | 'welcome' | 'handover'>('proposal');
  const [activeMilestone, setActiveMilestone] = useState<MilestoneItem | undefined>(undefined);

  // Payment simulator state
  const [payingMilestone, setPayingMilestone] = useState<number | null>(null);

  // Mockup approval state
  const [approvingMockup, setApprovingMockup] = useState(false);
  const [signatureName, setSignatureName] = useState('');

  // Feedback form state
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackAspect, setFeedbackAspect] = useState('');
  const [feedbackComments, setFeedbackComments] = useState('');
  const [allowTestimonial, setAllowTestimonial] = useState(true);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Retrieve token from localStorage if present
  useEffect(() => {
    if (!token && initialReceipt) {
      try {
        const stored = localStorage.getItem(`gmb_token_${initialReceipt.trim().toUpperCase()}`);
        if (stored) setToken(stored);
      } catch {}
    }
  }, [token, initialReceipt]);

  const fetchProject = async (receiptId: string, customToken?: string, customEmail?: string) => {
    if (!receiptId.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const activeToken = customToken !== undefined ? customToken : token;
      let url = `/api/projects/${encodeURIComponent(receiptId.trim())}?`;
      if (activeToken) url += `token=${encodeURIComponent(activeToken)}&`;
      if (customEmail) url += `email=${encodeURIComponent(customEmail)}&`;

      const res = await fetch(url, {
        headers: activeToken ? { 'x-client-token': activeToken } : {},
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Project not found. Please verify your receipt number.');
        setProject(null);
        setIsRestricted(false);
      } else {
        setProject(data.project);
        setIsRestricted(!!data.isRestricted);
        if (data.project?.clientName) {
          setSignatureName(data.project.clientName);
        }
      }
    } catch {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialReceipt) {
      fetchProject(initialReceipt);
    }
  }, [initialReceipt]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let rememberedToken = token;
    try {
      const stored = localStorage.getItem(`gmb_token_${searchReceipt.trim().toUpperCase()}`);
      if (stored) rememberedToken = stored;
    } catch {}
    fetchProject(searchReceipt, rememberedToken);
  };

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyEmailInput.trim()) return;
    fetchProject(searchReceipt, token, verifyEmailInput.trim());
  };

  const handleOpenDoc = (
    type: 'proposal' | 'agreement' | 'invoice' | 'slip' | 'welcome' | 'handover',
    milestone?: MilestoneItem
  ) => {
    setModalDocType(type);
    setActiveMilestone(milestone);
    setModalOpen(true);
  };

  // Process milestone payment
  const handlePayMilestone = async (milestoneNumber: 1 | 2 | 3) => {
    if (!project) return;
    setPayingMilestone(milestoneNumber);
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(project.receiptId)}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'x-client-token': token } : {}),
        },
        body: JSON.stringify({
          milestoneNumber,
          token,
          email: project.clientEmail,
          transactionRef: `TXN-DEMO-SIM-${Date.now().toString().slice(-6)}`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.project) {
        setProject(data.project);
        const paidM = data.project.quotation?.milestones.find((m: MilestoneItem) => m.number === milestoneNumber);
        handleOpenDoc('slip', paidM);
      } else {
        alert(data.error || 'Payment simulation failed.');
      }
    } catch {
      alert('Error recording payment.');
    } finally {
      setPayingMilestone(null);
    }
  };

  // Approve Mockup
  const handleApproveMockup = async () => {
    if (!project) return;
    if (!signatureName.trim()) {
      alert('Please enter your full name as digital signature confirmation.');
      return;
    }
    setApprovingMockup(true);
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(project.receiptId)}/mockup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'x-client-token': token } : {}),
        },
        body: JSON.stringify({
          id: project.mockups?.[0]?.id || 'mock_1',
          status: 'approved',
          signedAt: new Date().toISOString(),
          signedBy: signatureName.trim(),
          token,
          clientEmail: project.clientEmail,
        }),
      });
      const data = await res.json();
      if (res.ok && data.project) {
        setProject(data.project);
        alert('Design mockups approved! Milestone 2 (30% payment) is now unlocked.');
      } else {
        alert(data.error || 'Failed to approve mockups.');
      }
    } catch {
      alert('Error updating mockup.');
    } finally {
      setApprovingMockup(false);
    }
  };

  // Submit Feedback
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setSubmittingFeedback(true);
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(project.receiptId)}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: feedbackRating,
          bestAspect: feedbackAspect || 'Engineering speed and transparent milestones',
          suggestions: feedbackComments,
          allowTestimonial,
          interestedInRetainer: true,
        }),
      });
      const data = await res.json();
      if (res.ok && data.project) {
        setProject(data.project);
        setFeedbackSubmitted(true);
      }
    } catch {
      alert('Error submitting feedback.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const q = project?.quotation;
  const m1 = q?.milestones.find((m) => m.number === 1);
  const m2 = q?.milestones.find((m) => m.number === 2);
  const m3 = q?.milestones.find((m) => m.number === 3);

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#0F1C31] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Bar with Search */}
        <div className="bg-white rounded-2xl border border-[#E8EDF4] p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-lg font-bold text-[#0F1C31]">Growmybiz24 Client Portal</h1>
            </div>
            <p className="text-xs text-[#6B7E95] mt-0.5">
              Live tracking, milestone billing, design approvals, and document downloads.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <input
                type="text"
                value={searchReceipt}
                onChange={(e) => setSearchReceipt(e.target.value)}
                placeholder="Enter Receipt # (e.g. GMB-PRJ-2026-1001)"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8EDF4] text-xs font-mono uppercase text-[#0F1C31] focus:outline-none focus:border-[#477BDB]"
              />
              <Search size={14} className="absolute left-3 top-2.5 text-[#A0AEC0]" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#477BDB] hover:bg-[#3b6ec7] transition-colors disabled:opacity-60"
            >
              {loading ? 'Finding...' : 'Track'}
            </button>
          </form>
        </div>

        {/* Global Demo Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600 shrink-0" />
            <span>
              <strong>DEMO TEST ENVIRONMENT:</strong> All milestone payment buttons and slips operate in simulation mode. No real bank or card charges will occur.
            </span>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-amber-200/60 font-mono text-[10px] font-bold text-amber-800">
            TEST MODE
          </span>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-medium text-red-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-red-600" />
              <span>{error}</span>
            </div>
            <span className="text-[11px] text-red-700">Try demo receipt: <strong>GMB-PRJ-2026-1001</strong></span>
          </div>
        )}

        {/* RESTRICTED ACCESS CHALLENGE (Zero PII Leakage) */}
        {project && isRestricted && (
          <div className="bg-white rounded-3xl border border-[#E8EDF4] p-8 sm:p-10 text-center shadow-lg max-w-xl mx-auto space-y-5">
            <div className="w-14 h-14 bg-[#EBF1FB] text-[#477BDB] rounded-2xl flex items-center justify-center mx-auto">
              <KeyRound size={28} />
            </div>

            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#477BDB] bg-[#EBF1FB] px-3 py-1 rounded-full">
                {project.receiptId}
              </span>
              <h2
                style={{ fontFamily: SYNE_FONT }}
                className="text-xl sm:text-2xl font-bold text-[#0F1C31] mt-3"
              >
                Confidential Project Access
              </h2>
              <p className="text-xs text-[#6B7E95] mt-1.5 max-w-sm mx-auto leading-relaxed">
                Service: <strong>{project.serviceTitle}</strong> | Status: <strong className="capitalize">{project.status.replace(/_/g, ' ')}</strong>.
                To protect client privacy, enter the work email used when commissioning this project.
              </p>
            </div>

            <form onSubmit={handleVerifyEmail} className="space-y-3 max-w-sm mx-auto">
              <input
                type="email"
                value={verifyEmailInput}
                onChange={(e) => setVerifyEmailInput(e.target.value)}
                placeholder="Enter client work email to unlock"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8EDF4] text-xs text-[#0F1C31] focus:outline-none focus:border-[#477BDB]"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#477BDB] hover:bg-[#3b6ec7] transition-colors shadow-md"
              >
                {loading ? 'Verifying...' : 'Unlock Full Project Dashboard'}
              </button>
            </form>
          </div>
        )}

        {/* FULL AUTHORIZED PORTAL VIEW */}
        {project && !isRestricted && (
          <>
            {/* Status Header Banner */}
            <div className="bg-gradient-to-r from-[#0F1C31] via-[#1A2B4A] to-[#243B66] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#477BDB]/25 text-[#8cb5f5] border border-[#477BDB]/40">
                      {project.receiptId}
                    </span>
                    <span className="text-xs text-white/60">
                      Submitted on {new Date(project.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h2
                    style={{ fontFamily: SYNE_FONT }}
                    className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white"
                  >
                    {project.companyName || project.clientName}
                  </h2>
                  <p className="text-sm text-white/70 mt-1 max-w-2xl">
                    Service: <strong className="text-white">{project.serviceTitle}</strong> | Goal: {project.primaryGoal}
                  </p>
                </div>

                {/* Status Indicator Badge */}
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 lg:min-w-[280px]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">
                    Current Milestone Status
                  </div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    {project.status === 'under_review' && 'Under Admin Review'}
                    {project.status === 'quotation_live' && 'Your Project is Reviewed — Quotation Live!'}
                    {project.status === 'phase_1_in_progress' && 'Phase 1: Design Sprint in Progress'}
                    {project.status === 'design_ready' && 'Design Mockups Ready for Approval'}
                    {project.status === 'phase_2_in_progress' && 'Phase 2: Full Development in Progress'}
                    {project.status === 'uat_ready' && 'Staging Build Ready for UAT'}
                    {project.status === 'completed' && 'Project 100% Completed & Handed Over'}
                  </div>
                </div>
              </div>

              {/* 50-30-20 Milestone Progress Bar */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="text-[11px] font-bold uppercase tracking-wider text-white/60 mb-3">
                  Payment & Delivery Pipeline (50% Advance • 30% Design Approval • 20% Handover)
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Milestone 1 */}
                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    m1?.status === 'paid'
                      ? 'bg-emerald-500/20 border-emerald-400 text-white'
                      : m1?.status === 'unlocked'
                      ? 'bg-[#477BDB]/20 border-[#477BDB] text-white'
                      : 'bg-white/5 border-white/10 text-white/50'
                  }`}>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>Milestone 1: Kickoff (50%)</span>
                      {m1?.status === 'paid' ? (
                        <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                          <CheckCircle2 size={13} /> PAID (DEMO)
                        </span>
                      ) : (
                        <span className="text-[#8cb5f5] text-[11px]">ACTION REQUIRED</span>
                      )}
                    </div>
                    <div className="text-base font-extrabold font-mono mt-1 text-white">
                      ₹{m1?.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-white/60 mt-0.5">
                      Unlocks Architecture & Design Sprint
                    </div>
                  </div>

                  {/* Milestone 2 */}
                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    m2?.status === 'paid'
                      ? 'bg-emerald-500/20 border-emerald-400 text-white'
                      : m2?.status === 'unlocked'
                      ? 'bg-amber-500/20 border-amber-400 text-white'
                      : 'bg-white/5 border-white/10 text-white/50'
                  }`}>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>Milestone 2: Design (30%)</span>
                      {m2?.status === 'paid' ? (
                        <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                          <CheckCircle2 size={13} /> PAID (DEMO)
                        </span>
                      ) : m2?.status === 'unlocked' ? (
                        <span className="text-amber-300 text-[11px]">UNLOCKED</span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] text-white/40">
                          <Lock size={12} /> LOCKED
                        </span>
                      )}
                    </div>
                    <div className="text-base font-extrabold font-mono mt-1 text-white">
                      ₹{m2?.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-white/60 mt-0.5">
                      Triggered after Design Mockup Sign-Off
                    </div>
                  </div>

                  {/* Milestone 3 */}
                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    m3?.status === 'paid'
                      ? 'bg-emerald-500/20 border-emerald-400 text-white'
                      : m3?.status === 'unlocked'
                      ? 'bg-purple-500/20 border-purple-400 text-white'
                      : 'bg-white/5 border-white/10 text-white/50'
                  }`}>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>Milestone 3: Handover (20%)</span>
                      {m3?.status === 'paid' ? (
                        <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                          <CheckCircle2 size={13} /> PAID (DEMO)
                        </span>
                      ) : m3?.status === 'unlocked' ? (
                        <span className="text-purple-300 text-[11px]">UNLOCKED</span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] text-white/40">
                          <Lock size={12} /> LOCKED
                        </span>
                      )}
                    </div>
                    <div className="text-base font-extrabold font-mono mt-1 text-white">
                      ₹{m3?.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-white/60 mt-0.5">
                      Releases DNS, Git Source Code & IP
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Document Access Strip */}
            <div className="bg-white rounded-2xl border border-[#E8EDF4] p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-[#477BDB]" />
                <span className="text-xs font-bold text-[#0F1C31]">Document Vault:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleOpenDoc('proposal')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0F1C31] bg-[#F7F9FC] border border-[#E8EDF4] hover:bg-[#F0F4FA] transition-colors"
                >
                  View Proposal
                </button>
                <button
                  onClick={() => handleOpenDoc('agreement')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0F1C31] bg-[#F7F9FC] border border-[#E8EDF4] hover:bg-[#F0F4FA] transition-colors"
                >
                  View Agreement (PSA)
                </button>
                {m1?.status === 'paid' && (
                  <button
                    onClick={() => handleOpenDoc('welcome')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                  >
                    Welcome Kit & Intake
                  </button>
                )}
                {project.status === 'completed' && (
                  <button
                    onClick={() => handleOpenDoc('handover')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors"
                  >
                    Handover Certificate
                  </button>
                )}
              </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column (2 Cols): Quotation, Scope & Design Review */}
              <div className="lg:col-span-2 space-y-6">
                {/* 1. Quotation & Scope Review Hub */}
                <div className="bg-white rounded-2xl border border-[#E8EDF4] p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#477BDB]">
                        Commercial Scope
                      </span>
                      <h3 className="text-lg font-bold text-[#0F1C31] mt-0.5">
                        {q?.title || 'Project Scope & Deliverables'}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-[#6B7E95]">Total Project Value</div>
                      <div className="text-lg font-black font-mono text-[#0F1C31]">
                        ₹{q?.totalAmount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Deliverables list */}
                  <div className="space-y-3 pt-2">
                    {q?.deliverables.map((del) => (
                      <div key={del.id} className="p-4 rounded-xl bg-[#F7F9FC] border border-[#E8EDF4]">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-xs font-bold text-[#0F1C31]">{del.title}</h4>
                          <span className="text-[10px] text-[#6B7E95] font-medium">{del.includedRevisions}</span>
                        </div>
                        <p className="text-xs text-[#6B7E95] leading-relaxed">{del.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* Actions for Quotation */}
                  <div className="pt-3 border-t border-[#E8EDF4] flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => handleOpenDoc('proposal')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#477BDB] hover:underline"
                    >
                      <Eye size={14} />
                      Inspect Full Legal Proposal & Exclusions
                    </button>

                    {m1?.status !== 'paid' && (
                      <button
                        onClick={() => handlePayMilestone(1)}
                        disabled={payingMilestone === 1}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md hover:shadow-lg disabled:opacity-60"
                        style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                      >
                        <CreditCard size={14} />
                        {payingMilestone === 1 ? 'Processing Simulation...' : `Accept & Pay 50% Advance (Demo Mode: ₹${m1?.amount.toLocaleString('en-IN')})`}
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Phase 1: Design Mockup Review Hub */}
                <div className="bg-white rounded-2xl border border-[#E8EDF4] p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#477BDB]">
                        Phase 1 Deliverable
                      </span>
                      <h3 className="text-lg font-bold text-[#0F1C31] mt-0.5">
                        Interactive UI/UX Mockup Review
                      </h3>
                    </div>
                    {project.mockups?.[0]?.status === 'approved' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 size={13} /> Approved by Client
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        <Clock size={13} /> Awaiting Sign-Off
                      </span>
                    )}
                  </div>

                  {/* Mockup Preview Card */}
                  <div className="p-4 rounded-xl border border-[#E8EDF4] bg-[#F7F9FC]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-xs text-[#0F1C31]">
                        {project.mockups?.[0]?.title || 'Phase 1: High-Fidelity Figma Prototype'}
                      </div>
                      <a
                        href={project.mockups?.[0]?.previewUrl || 'https://www.figma.com'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#477BDB] hover:underline"
                      >
                        Open Figma Fullscreen <ExternalLink size={12} />
                      </a>
                    </div>
                    <p className="text-xs text-[#6B7E95] mb-4">
                      {project.mockups?.[0]?.description || 'Complete responsive wireframes, design system tokens, and interactive user flows.'}
                    </p>

                    {/* Interactive Frame / Mock Preview Container */}
                    <div className="w-full h-56 rounded-xl bg-gradient-to-br from-[#0F1C31] to-[#1A2B4A] text-white flex flex-col items-center justify-center p-4 text-center border border-white/10">
                      <Layers size={32} className="text-[#477BDB] mb-2" />
                      <div className="text-sm font-bold">Interactive Design Prototype Viewport</div>
                      <div className="text-xs text-white/60 max-w-sm mt-1">
                        Inspect layouts, typography, and mobile responsiveness. Once satisfied, execute design approval below to trigger Phase 2 development.
                      </div>
                    </div>
                  </div>

                  {/* Design Sign-off Approval Box */}
                  {project.mockups?.[0]?.status !== 'approved' ? (
                    <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-3">
                      <div className="text-xs font-bold text-amber-900">
                        Execute Formal Design Approval
                      </div>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        By signing below, you approve the visual design system and authorize our engineering team to commence Phase 2 development. This unlocks Milestone 2 (30% payment).
                      </p>

                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <input
                          type="text"
                          value={signatureName}
                          onChange={(e) => setSignatureName(e.target.value)}
                          placeholder="Type your full name as signature"
                          className="w-full sm:w-72 px-3 py-2 rounded-xl border border-amber-300 text-xs text-[#0F1C31] bg-white focus:outline-none focus:border-[#477BDB]"
                        />
                        <button
                          onClick={handleApproveMockup}
                          disabled={approvingMockup || m1?.status !== 'paid'}
                          className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#477BDB] hover:bg-[#3b6ec7] transition-colors disabled:opacity-50"
                        >
                          {m1?.status !== 'paid'
                            ? 'Requires 50% Advance First'
                            : approvingMockup
                            ? 'Signing...'
                            : 'Approve Design & Sign Off'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                      <div>
                        <strong>Design Sign-Off Executed:</strong> Signed by {project.mockups[0].signedBy || project.clientName}
                      </div>
                      <span className="font-mono text-[11px] text-emerald-700">
                        {project.mockups[0].signedAt ? new Date(project.mockups[0].signedAt).toLocaleDateString() : 'Active'}
                      </span>
                    </div>
                  )}
                </div>

                {/* 3. Client Feedback Form */}
                <div className="bg-white rounded-2xl border border-[#E8EDF4] p-6 shadow-sm space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#477BDB]">
                      Quality Assurance
                    </span>
                    <h3 className="text-lg font-bold text-[#0F1C31] mt-0.5">
                      Client Feedback & Review
                    </h3>
                  </div>

                  {!feedbackSubmitted && !project.feedback ? (
                    <form onSubmit={handleSubmitFeedback} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#0F1C31] mb-1.5">
                          How satisfied are you with our engineering pace and communication?
                        </label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setFeedbackRating(star)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                feedbackRating >= star ? 'text-amber-400' : 'text-gray-300'
                              }`}
                            >
                              <Star size={24} fill={feedbackRating >= star ? 'currentColor' : 'none'} />
                            </button>
                          ))}
                          <span className="text-xs font-bold text-[#477BDB] ml-2">
                            {feedbackRating} of 5 Stars
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#0F1C31] mb-1.5">
                          What aspect of the engagement has stood out most?
                        </label>
                        <input
                          type="text"
                          value={feedbackAspect}
                          onChange={(e) => setFeedbackAspect(e.target.value)}
                          placeholder="e.g. Design aesthetics, fast delivery, transparent communication"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF4] text-xs text-[#0F1C31] focus:outline-none focus:border-[#477BDB]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#0F1C31] mb-1.5">
                          Suggestions or Additional Comments
                        </label>
                        <textarea
                          value={feedbackComments}
                          onChange={(e) => setFeedbackComments(e.target.value)}
                          rows={2}
                          placeholder="Any thoughts on how we can serve you even better?"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF4] text-xs text-[#0F1C31] focus:outline-none focus:border-[#477BDB] resize-none"
                        />
                      </div>

                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allowTestimonial}
                          onChange={(e) => setAllowTestimonial(e.target.checked)}
                          className="w-4 h-4 text-[#477BDB] rounded"
                        />
                        <span className="text-xs text-[#3D4F63]">
                          Growmybiz24 may feature this review and our logo on their portfolio showcase.
                        </span>
                      </label>

                      <button
                        type="submit"
                        disabled={submittingFeedback}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F1C31] hover:bg-[#1A2B4A] transition-colors"
                      >
                        {submittingFeedback ? 'Submitting...' : 'Submit Client Review'}
                      </button>
                    </form>
                  ) : (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center py-6">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircle2 size={20} />
                      </div>
                      <div className="font-bold text-sm text-emerald-900">Thank you for your feedback!</div>
                      <p className="text-xs text-emerald-800 mt-1">
                        Your partnership fuels our engineering standards.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column (1 Col): Billing & Verified Invoices Vault */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-[#E8EDF4] p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8EDF4]">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#477BDB]">
                        Billing Policy
                      </span>
                      <h3 className="text-base font-bold text-[#0F1C31] mt-0.5">
                        Estimates & Clearance Slips
                      </h3>
                    </div>
                    <CreditCard size={18} className="text-[#477BDB]" />
                  </div>

                  {/* STRICT POLICY CALLOUT */}
                  <div className="p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E8EDF4] text-[11px] text-[#6B7E95] leading-relaxed">
                    <strong className="text-[#0F1C31]">Milestone Clearance Gate:</strong> In accordance with our commercial policy, official clearance slips are issued <strong>strictly after milestone payment</strong>.
                  </div>

                  {/* Milestone 1 Card */}
                  <div className="p-4 rounded-xl border border-[#E8EDF4] bg-white space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F1C31]">Milestone 1 (50%)</span>
                      <span className="text-xs font-mono font-bold text-[#477BDB]">
                        ₹{m1?.amount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {m1?.status === 'paid' ? (
                      <div className="space-y-2">
                        <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 size={13} /> Paid & Cleared (Demo)
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => handleOpenDoc('slip', m1)}
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200 text-center"
                          >
                            Clearance Slip
                          </button>
                          <button
                            onClick={() => handleOpenDoc('invoice', m1)}
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-[#0F1C31] bg-[#F7F9FC] hover:bg-[#F0F4FA] transition-colors border border-[#E8EDF4] text-center"
                          >
                            Proforma Estimate
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                          <Lock size={12} /> Slip locked until paid
                        </div>
                        <button
                          onClick={() => handlePayMilestone(1)}
                          disabled={payingMilestone === 1}
                          className="w-full py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
                        >
                          {payingMilestone === 1 ? 'Settling...' : 'Pay 50% Advance [Demo Simulation]'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Milestone 2 Card */}
                  <div className="p-4 rounded-xl border border-[#E8EDF4] bg-white space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F1C31]">Milestone 2 (30%)</span>
                      <span className="text-xs font-mono font-bold text-[#477BDB]">
                        ₹{m2?.amount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {m2?.status === 'paid' ? (
                      <div className="space-y-2">
                        <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 size={13} /> Paid & Cleared (Demo)
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => handleOpenDoc('slip', m2)}
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200 text-center"
                          >
                            Clearance Slip
                          </button>
                          <button
                            onClick={() => handleOpenDoc('invoice', m2)}
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-[#0F1C31] bg-[#F7F9FC] hover:bg-[#F0F4FA] transition-colors border border-[#E8EDF4] text-center"
                          >
                            Proforma Estimate
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-[11px] text-[#6B7E95]">
                          {project.mockups?.[0]?.status === 'approved'
                            ? 'Ready for 30% Design Payment'
                            : 'Unlocks upon Design Approval'}
                        </div>
                        <button
                          onClick={() => handlePayMilestone(2)}
                          disabled={payingMilestone === 2 || project.mockups?.[0]?.status !== 'approved'}
                          className="w-full py-2 rounded-xl text-xs font-bold text-white bg-[#477BDB] hover:bg-[#3b6ec7] transition-colors disabled:opacity-40"
                        >
                          {payingMilestone === 2 ? 'Settling...' : 'Pay 30% Milestone [Demo Simulation]'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Milestone 3 Card */}
                  <div className="p-4 rounded-xl border border-[#E8EDF4] bg-white space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F1C31]">Milestone 3 (20%)</span>
                      <span className="text-xs font-mono font-bold text-[#477BDB]">
                        ₹{m3?.amount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {m3?.status === 'paid' ? (
                      <div className="space-y-2">
                        <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 size={13} /> Final Settlement Cleared (Demo)
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => handleOpenDoc('slip', m3)}
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200 text-center"
                          >
                            Clearance Slip
                          </button>
                          <button
                            onClick={() => handleOpenDoc('handover')}
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-200 text-center"
                          >
                            Handover Cert
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-[11px] text-[#6B7E95]">
                          Unlocks after UAT verification
                        </div>
                        <button
                          onClick={() => handlePayMilestone(3)}
                          disabled={payingMilestone === 3 || m2?.status !== 'paid'}
                          className="w-full py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors disabled:opacity-40"
                        >
                          {payingMilestone === 3 ? 'Settling...' : 'Pay 20% Handover [Demo Simulation]'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Need Support Box */}
                <div className="p-5 rounded-2xl bg-[#0F1C31] text-white space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-[#477BDB]" />
                    <span className="text-xs font-bold">Dedicated Engineering Support</span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Have questions about your quotation or milestone delivery? Your account lead is standing by.
                  </p>
                  <a
                    href="https://wa.me/917290884480?text=Hi%20Growmybiz24%2C%20I%20am%20checking%20my%20project%20portal%21"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] transition-colors"
                  >
                    Direct WhatsApp Lead
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Render Document Modal */}
      {project && (
        <DocumentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          docType={modalDocType}
          project={project}
          milestone={activeMilestone}
        />
      )}
    </div>
  );
}
