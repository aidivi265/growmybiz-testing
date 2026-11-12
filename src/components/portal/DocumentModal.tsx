'use client';



import { X, Printer, Shield, CheckCircle, FileText, AlertTriangle } from 'lucide-react';
import type { ProjectRecord, MilestoneItem } from '@/types/project';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  docType: 'proposal' | 'agreement' | 'invoice' | 'slip' | 'welcome' | 'handover';
  project: ProjectRecord;
  milestone?: MilestoneItem;
}

export default function DocumentModal({
  isOpen,
  onClose,
  docType,
  project,
  milestone,
}: DocumentModalProps) {


  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;
  const q = project.quotation;
  const activeCurr = 'INR';
  const fmt = (amt?: number) => {
    if (amt === undefined || amt === null) return '-';
    return '₹' + Math.round(amt).toLocaleString('en-IN');
  };
  const m1 = q?.milestones.find((m) => m.number === 1);
  const activeMilestone = milestone || m1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:m-0">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F1C31]/80 backdrop-blur-sm print:hidden"
        onClick={onClose}
      />

      {/* Modal Dialog / Document Page */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#E8EDF4] z-10 overflow-hidden my-8 print:border-none print:shadow-none print:m-0 print:w-full print:max-w-none">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8EDF4] bg-[#F7F9FC] print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#477BDB]/10 text-[#477BDB] flex items-center justify-center font-bold text-xs">
              DOC
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#0F1C31]">
                {docType === 'proposal' && 'Project Proposal & Commercial Quotation'}
                {docType === 'agreement' && 'Project Service Agreement (Draft PSA)'}
                {docType === 'invoice' && `Proforma Milestone Estimate — ${activeMilestone?.invoiceNumber || 'EST-01'}`}
                {docType === 'slip' && `Internal Milestone Clearance Slip (Demo Record) — ${activeMilestone?.receiptSlipId || 'SLIP-01'}`}
                {docType === 'welcome' && 'Client Welcome & Asset Kickoff Pack'}
                {docType === 'handover' && 'Project Handover & IP Release Certificate'}
              </h3>
              <p className="text-[11px] text-[#6B7E95]">Reference: {project.receiptId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#0F1C31] bg-white border border-[#E8EDF4] hover:bg-[#F0F4FA] transition-colors shadow-sm"
            >
              <Printer size={14} />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#6B7E95] hover:text-[#0F1C31] hover:bg-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Document Content Container */}
        <div className="p-8 sm:p-12 text-[#0F1C31] font-sans leading-relaxed text-sm bg-white print:p-6 print:text-black">
          {/* Official Document Letterhead */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-[#0F1C31] mb-6">
            <div>
              <div className="text-2xl font-black tracking-tight text-[#0F1C31]">
                GROWMYBIZ<span className="text-[#477BDB]">24</span>
              </div>
              <div className="text-xs text-[#6B7E95] font-medium mt-0.5">
                Digital Engineering, Next.js Architecture & Cloud Automation
              </div>
              <div className="text-[11px] text-[#6B7E95] mt-1">
                Website: growmybiz24.com | Email: hello@growmybiz24.com | Operations: New Delhi / NCR, India
              </div>
            </div>

            <div className="text-right sm:text-right">
              <div className="inline-block px-3 py-1 rounded text-xs font-mono font-bold bg-[#EBF1FB] text-[#477BDB] border border-[#477BDB]/20">
                {project.receiptId}
              </div>
              <div className="text-xs text-[#6B7E95] mt-1.5">
                Date: {new Date(project.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
              <div className="text-xs text-[#6B7E95]">Jurisdiction: New Delhi / Noida, India</div>
            </div>
          </div>

          {/* Statutory / CA Notice Banner */}
          <div className="p-3 mb-6 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
            <AlertTriangle size={15} className="shrink-0 text-amber-600 mt-0.5" />
            <div>
              <strong>Audit & Compliance Disclosure:</strong> This document is an operational commercial estimate prepared for technical scoping. It does not constitute certified legal advice or a certified GST tax invoice under Section 31 of the CGST Act, 2017. All final billing is subject to review by an independent Chartered Accountant (CA) based on applicable turnover thresholds and SAC classifications.
            </div>
          </div>

          {/* 1. DOCUMENT TYPE: PROPOSAL & QUOTATION */}
          {docType === 'proposal' && (
            <div className="space-y-6">
              <div className="text-center pb-4 border-b border-[#E8EDF4]">
                <h1 className="text-xl sm:text-2xl font-black text-[#0F1C31] uppercase tracking-wide">
                  Formal Project Proposal & Commercial Quotation
                </h1>
                <p className="text-xs text-[#6B7E95] mt-1">
                  Issued to: <strong className="text-[#0F1C31]">{project.companyName || project.clientName}</strong> ({project.clientEmail})
                </p>
              </div>

              {/* Executive Summary */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#477BDB] mb-1.5">
                  1. Executive Summary & Objective
                </h2>
                <p className="text-xs text-[#3D4F63] leading-relaxed">
                  {q?.executiveSummary || project.primaryGoal}
                </p>
              </div>

              {/* Scope Table */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#477BDB] mb-2">
                  2. Scope of Work (Schedule A)
                </h2>
                <div className="overflow-x-auto border border-[#E8EDF4] rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F9FC] text-[#0F1C31] font-bold border-b border-[#E8EDF4]">
                      <tr>
                        <th className="py-2.5 px-3">Module</th>
                        <th className="py-2.5 px-3">Deliverable Description</th>
                        <th className="py-2.5 px-3">Revisions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8EDF4] text-[#3D4F63]">
                      {q?.deliverables.map((del) => (
                        <tr key={del.id}>
                          <td className="py-3 px-3 font-semibold text-[#0F1C31] align-top">{del.title}</td>
                          <td className="py-3 px-3 align-top leading-relaxed">{del.description}</td>
                          <td className="py-3 px-3 text-[#6B7E95] align-top whitespace-nowrap">{del.includedRevisions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Explicit Exclusions */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#477BDB] mb-1.5">
                  3. Explicit Scope Exclusions (Negative Scope)
                </h2>
                <ul className="list-disc pl-5 text-xs text-[#6B7E95] space-y-1">
                  {q?.exclusions.map((exc, idx) => (
                    <li key={idx}>{exc}</li>
                  ))}
                </ul>
              </div>

              {/* Commercial Investment & Milestones */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#477BDB] mb-2">
                  4. Commercial Investment & 50-30-20 Milestone Structure
                </h2>
                <div className="overflow-x-auto border border-[#E8EDF4] rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F9FC] text-[#0F1C31] font-bold border-b border-[#E8EDF4]">
                      <tr>
                        <th className="py-2.5 px-3">Milestone Stage</th>
                        <th className="py-2.5 px-3">Verification Trigger</th>
                        <th className="py-2.5 px-3">Split</th>
                        <th className="py-2.5 px-3 text-right">Amount ({activeCurr})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8EDF4] text-[#3D4F63]">
                      {q?.milestones.map((m) => (
                        <tr key={m.number}>
                          <td className="py-3 px-3 font-semibold text-[#0F1C31]">{m.title}</td>
                          <td className="py-3 px-3 text-[11px] text-[#6B7E95]">{m.trigger}</td>
                          <td className="py-3 px-3 font-mono font-bold text-[#477BDB]">{m.percentage}%</td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-[#0F1C31]">
                            {fmt(m.amount)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-[#F7F9FC] font-black text-[#0F1C31]">
                        <td colSpan={3} className="py-3 px-3 text-right uppercase text-xs">Total Professional Fee:</td>
                        <td className="py-3 px-3 text-right font-mono text-sm text-[#477BDB]">
                          {fmt(q?.totalAmount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. DOCUMENT TYPE: PROJECT SERVICE AGREEMENT (PSA) */}
          {docType === 'agreement' && (
            <div className="space-y-5 text-xs text-[#3D4F63] leading-relaxed">
              <div className="text-center pb-4 border-b border-[#E8EDF4]">
                <h1 className="text-xl sm:text-2xl font-black text-[#0F1C31] uppercase tracking-wide">
                  Project Service Agreement (Draft PSA)
                </h1>
                <p className="text-xs text-[#6B7E95] mt-1">
                  Commercial Engagement Terms between Growmybiz24 and {project.companyName || project.clientName}
                </p>
              </div>

              <div>
                <strong className="text-[#0F1C31]">1. SCOPE & DELIVERABLES:</strong> Agency agrees to engineer the deliverables defined in Proposal ({project.receiptId}). No verbal modifications or out-of-scope additions shall be binding unless agreed upon via an executed Change Request (CR) with independent billing.
              </div>

              <div>
                <strong className="text-[#0F1C31]">2. COMMERCIAL MILESTONES & 50-30-20 GATE:</strong> Total professional fee is {fmt(q?.totalAmount)}. Payment schedule is governed strictly by:
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  <li><strong>Milestone 1 (50% Advance):</strong> Payable upon agreement execution to unlock architecture and Phase 1 UI/UX design.</li>
                  <li><strong>Milestone 2 (30% Design Approval):</strong> Payable upon formal sign-off of interactive mockups to unlock full development.</li>
                  <li><strong>Milestone 3 (20% Final Handover):</strong> Payable upon successful staging UAT prior to production DNS pointing and repository release.</li>
                </ul>
              </div>

              <div>
                <strong className="text-[#0F1C31]">3. INTELLECTUAL PROPERTY & TRANSFER GATE:</strong> All bespoke custom software, UI design components, and visual assets developed exclusively for the Client shall transfer to the Client **strictly upon receipt of 100% full and final payment clearance**. Agency retains ownership of pre-existing boilerplates and utility libraries.
              </div>

              <div>
                <strong className="text-[#0F1C31]">4. CLIENT DELAY & ASSET DELIVERY:</strong> Timelines are contingent on Client supplying required brand assets, copywriting, and feedback within five (5) business days of request. Delays by the Client will automatically re-baseline delivery schedules without liability to Agency.
              </div>

              <div>
                <strong className="text-[#0F1C31]">5. UAT & 30-DAY DEFECT WARRANTY:</strong> Client has seven (7) business days from staging delivery to inspect deliverables and provide an itemized defect log based strictly on agreed SOW. Deliverables are deemed legally accepted if launched commercially or if no log is submitted within 7 days. Agency provides a thirty (30) day defect warranty covering reproducible bugs in SOW features.
              </div>

              <div>
                <strong className="text-[#0F1C31]">6. GOVERNING LAW:</strong> This Agreement is governed by the laws of India, subject to exclusive court jurisdiction in New Delhi / Noida, India.
              </div>

              {/* Signatures */}
              <div className="pt-6 border-t border-[#E8EDF4] grid grid-cols-2 gap-8 text-center">
                <div>
                  <div className="font-bold text-[#0F1C31]">FOR GROWMYBIZ24</div>
                  <div className="h-12 flex items-center justify-center font-mono text-[#477BDB] text-xs">
                    [Digitally Signed / Authorized]
                  </div>
                  <div className="text-[11px] text-[#6B7E95] border-t border-[#E8EDF4] pt-1">
                    Growmybiz24 Authorized Principal
                  </div>
                </div>
                <div>
                  <div className="font-bold text-[#0F1C31]">FOR THE CLIENT</div>
                  <div className="h-12 flex items-center justify-center font-mono text-emerald-600 text-xs">
                    {project.status !== 'under_review' ? `[Accepted: ${project.clientName}]` : '[Awaiting Advance Clearance]'}
                  </div>
                  <div className="text-[11px] text-[#6B7E95] border-t border-[#E8EDF4] pt-1">
                    {project.clientName} ({project.companyName})
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. DOCUMENT TYPE: PROFORMA INVOICE / ESTIMATE */}
          {docType === 'invoice' && (
            <div className="space-y-6">
              <div className="text-center pb-4 border-b border-[#E8EDF4]">
                <h1 className="text-xl sm:text-2xl font-black text-[#0F1C31] uppercase tracking-wide">
                  Proforma Milestone Estimate / Invoice
                </h1>
                <p className="text-xs text-[#6B7E95] mt-1 font-mono">
                  Document Ref: {activeMilestone?.invoiceNumber || `EST-${project.receiptId.replace('GMB-PRJ-', '')}`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E8EDF4]">
                  <div className="font-bold text-[#0F1C31] mb-1">Billed To (Client Entity):</div>
                  <div className="font-semibold">{project.companyName || project.clientName}</div>
                  <div className="text-[#6B7E95]">{project.clientEmail}</div>
                  <div className="text-[#6B7E95]">{project.city}, {project.country}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E8EDF4]">
                  <div className="font-bold text-[#0F1C31] mb-1">Estimate Details:</div>
                  <div><strong>Date:</strong> {activeMilestone?.invoiceDate || new Date().toISOString().split('T')[0]}</div>
                  <div><strong>Proposed SAC:</strong> 998314 (IT Design & Development Services)</div>
                  <div><strong>Payment Status:</strong> {activeMilestone?.status === 'paid' ? 'SETTLED (DEMO MODE)' : 'DUE FOR SETTLEMENT'}</div>
                </div>
              </div>

              <div className="overflow-x-auto border border-[#E8EDF4] rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F9FC] text-[#0F1C31] font-bold border-b border-[#E8EDF4]">
                    <tr>
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3">Proposed SAC</th>
                      <th className="py-2.5 px-3 text-right">Amount ({activeCurr})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8EDF4] text-[#3D4F63]">
                    <tr>
                      <td className="py-3 px-3">
                        <div className="font-bold text-[#0F1C31]">{activeMilestone?.title}</div>
                        <div className="text-[11px] text-[#6B7E95] mt-0.5">{activeMilestone?.trigger}</div>
                      </td>
                      <td className="py-3 px-3 font-mono">998314</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#0F1C31]">
                        {fmt(activeMilestone?.amount)}
                      </td>
                    </tr>
                    <tr className="bg-[#F7F9FC] font-bold text-[#0F1C31]">
                      <td colSpan={2} className="py-2 px-3 text-right">Subtotal Professional Fee:</td>
                      <td className="py-2 px-3 text-right font-mono">{fmt(activeMilestone?.amount)}</td>
                    </tr>
                    <tr className="bg-[#0F1C31] text-white font-black text-sm">
                      <td colSpan={2} className="py-3 px-3 text-right uppercase tracking-wider">Milestone Amount Due:</td>
                      <td className="py-3 px-3 text-right font-mono text-[#477BDB]">
                        {fmt(activeMilestone?.amount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. DOCUMENT TYPE: INTERNAL CLEARANCE SLIP (DEMO RECORD) */}
          {docType === 'slip' && (
            <div className="space-y-6">
              <div className="text-center pb-4 border-b border-[#E8EDF4]">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
                  <CheckCircle size={14} />
                  Milestone Clearance Verified (Demo Simulation)
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-[#0F1C31] uppercase tracking-wide">
                  Internal Milestone Clearance Slip
                </h1>
                <p className="text-xs text-[#6B7E95] mt-0.5 font-mono">
                  Slip Reference: {activeMilestone?.receiptSlipId || `SLIP-DEMO-${project.receiptId.replace('GMB-PRJ-', '')}`}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F7F9FC] border-2 border-emerald-500/20 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-[#6B7E95] text-[11px] uppercase tracking-wider font-bold">Client Entity</div>
                  <div className="text-sm font-bold text-[#0F1C31] mt-0.5">{project.companyName || project.clientName}</div>
                  <div className="text-[#6B7E95] mt-1">{project.clientEmail}</div>
                </div>

                <div>
                  <div className="text-[#6B7E95] text-[11px] uppercase tracking-wider font-bold">Simulation Record</div>
                  <div className="text-sm font-bold text-emerald-600 mt-0.5 font-mono">
                    {fmt(activeMilestone?.amount)} (DEMO CLEARED)
                  </div>
                  <div className="text-[11px] text-[#6B7E95] font-mono mt-1">
                    TXN ID: {activeMilestone?.transactionRef || (activeMilestone?.receiptSlipId ? `TXN-REF-${activeMilestone.receiptSlipId}` : 'TXN-DEMO-RECORDED')}
                  </div>
                </div>

                <div>
                  <div className="text-[#6B7E95] text-[11px] uppercase tracking-wider font-bold">Milestone Credited</div>
                  <div className="text-xs font-semibold text-[#0F1C31] mt-0.5">{activeMilestone?.title} ({activeMilestone?.percentage}%)</div>
                </div>

                <div>
                  <div className="text-[#6B7E95] text-[11px] uppercase tracking-wider font-bold">Execution Date & Time</div>
                  <div className="text-xs font-semibold text-[#0F1C31] mt-0.5">
                    {activeMilestone?.paidAt ? new Date(activeMilestone.paidAt).toLocaleString('en-IN') : new Date().toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-900">
                <strong>Simulated Clearance Notice:</strong> This clearance slip was generated in a local demonstration / test environment. It represents verified milestone progression inside the Growmybiz24 operations engine and does not constitute a real banking receipt.
              </div>
            </div>
          )}

          {/* 5. DOCUMENT TYPE: WELCOME DOCUMENT & ASSET KICKOFF */}
          {docType === 'welcome' && (
            <div className="space-y-6">
              <div className="text-center pb-4 border-b border-[#E8EDF4]">
                <h1 className="text-xl sm:text-2xl font-black text-[#0F1C31] uppercase tracking-wide">
                  Client Welcome & Onboarding Kickoff Pack
                </h1>
                <p className="text-xs text-[#6B7E95] mt-1">
                  Prepared for: <strong className="text-[#0F1C31]">{project.companyName || project.clientName}</strong> | Project Ref: {project.receiptId}
                </p>
              </div>

              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#477BDB] mb-1.5">
                  1. Welcome to Growmybiz24
                </h2>
                <p className="text-xs text-[#3D4F63] leading-relaxed">
                  We are excited to build your digital presence. This pack details your assigned team, project cadence, communication channels, and asset intake protocol.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E8EDF4]">
                  <div className="font-bold text-[#0F1C31]">Primary Account Lead</div>
                  <div className="text-[#6B7E95] mt-0.5">Divyansh Gupta</div>
                  <div className="text-[11px] text-[#477BDB] mt-1">hello@growmybiz24.com</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E8EDF4]">
                  <div className="font-bold text-[#0F1C31]">Technical Architecture</div>
                  <div className="text-[#6B7E95] mt-0.5">Engineering Operations</div>
                  <div className="text-[11px] text-[#477BDB] mt-1">Next.js & Supabase Core</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E8EDF4]">
                  <div className="font-bold text-[#0F1C31]">Sprint Cadence</div>
                  <div className="text-[#6B7E95] mt-0.5">Weekly Staging Releases</div>
                  <div className="text-[11px] text-emerald-600 font-bold mt-1">Portal Tracking Live</div>
                </div>
              </div>

              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#477BDB] mb-2">
                  2. Required Client Assets & Credentials Checklist
                </h2>
                <div className="p-4 rounded-xl border border-[#E8EDF4] space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span><strong>Brand Assets:</strong> Vector logo (.SVG or transparent .PNG), brand color codes, typography guidelines.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span><strong>Content Copy:</strong> Written text for hero banners, services, about pages, and contact details.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span><strong>Technical Credentials:</strong> Domain registrar access or DNS delegation (Cloudflare/GoDaddy).</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span><strong>Payment Gateway:</strong> Razorpay / Stripe merchant account API test and live keys.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. DOCUMENT TYPE: HANDOVER CERTIFICATE */}
          {docType === 'handover' && (
            <div className="space-y-6">
              <div className="text-center pb-4 border-b border-[#E8EDF4]">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-300 mb-2">
                  <Shield size={14} />
                  100% Settled & IP Formally Assigned
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-[#0F1C31] uppercase tracking-wide">
                  Project Handover & IP Release Certificate
                </h1>
                <p className="text-xs text-[#6B7E95] mt-1">
                  Issued to: <strong className="text-[#0F1C31]">{project.companyName || project.clientName}</strong>
                </p>
              </div>

              <div className="text-xs text-[#3D4F63] space-y-3 leading-relaxed">
                <p>
                  Growmybiz24 certifies that all digital engineering deliverables outlined in Project Brief <strong>{project.receiptId}</strong> have undergone formal User Acceptance Testing (UAT), production deployment, and 100% commercial milestone settlement.
                </p>
                <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#E8EDF4] space-y-1.5 font-mono text-[11px]">
                  <div>• Production Domain: https://{project.companyName ? project.companyName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com' : 'clientproject.com'}</div>
                  <div>• Git Source Repository: Transferred to Client GitHub Organization</div>
                  <div>• Administrative Credentials: Securely Dispatched</div>
                  <div>• 30-Day Defect Warranty Period: Active (Commenced Today)</div>
                </div>
                <p>
                  Pursuant to Section 3 of the Project Service Agreement, all bespoke intellectual property (custom source code, database architecture, and graphic assets) is irrevocably assigned to the Client.
                </p>
              </div>
            </div>
          )}

          {/* Footer Notice */}
          <div className="mt-12 pt-4 border-t border-[#E8EDF4] flex items-center justify-between text-[11px] text-[#A0AEC0]">
            <div>Growmybiz24 • Engineering Luxury Digital Experiences</div>
            <div>Operational Document Draft Engine</div>
          </div>
        </div>
      </div>
    </div>
  );
}
