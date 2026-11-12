import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StartProjectWizardClient from './StartProjectWizardClient';
import { fetchPageVisibility } from '@/lib/dal';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Start a Project | Growmybiz24 Client Intake & Scoping',
  description:
    'Submit your project requirement slide by slide. Receive an itemized INR quotation, transparent 50-30-20 milestone billing, and a dedicated client portal.',
};

function WizardLoadingFallback() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center pt-24 pb-16">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#477BDB]/30 border-t-[#477BDB] rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-[#6B7E95]">Loading Project Intake Wizard...</p>
      </div>
    </div>
  );
}

export default async function StartProjectPage() {
  const visibility = await fetchPageVisibility();
  if (visibility.startProject === false) {
    notFound();
  }

  return (
    <Suspense fallback={<WizardLoadingFallback />}>
      <StartProjectWizardClient />
    </Suspense>
  );
}
