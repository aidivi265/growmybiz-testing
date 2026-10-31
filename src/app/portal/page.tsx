import { Suspense } from 'react';
import type { Metadata } from 'next';
import ClientPortalClient from './ClientPortalClient';

export const metadata: Metadata = {
  title: 'Client Portal | Track Project, Quotation & Milestones | Growmybiz24',
  description:
    'Track your digital engineering project in real time. Access your formal quotation, transparent 50-30-20 milestone billing, payment slips, design mockups, and handover documents.',
};

function PortalLoadingFallback() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center pt-24 pb-16">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#477BDB]/30 border-t-[#477BDB] rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-[#6B7E95]">Loading Growmybiz24 Client Portal...</p>
      </div>
    </div>
  );
}

export default function ClientPortalPage() {
  return (
    <Suspense fallback={<PortalLoadingFallback />}>
      <ClientPortalClient />
    </Suspense>
  );
}
