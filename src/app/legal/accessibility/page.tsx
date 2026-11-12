import LegalDocView from '@/components/LegalDocView';
import { notFound } from 'next/navigation';
import { fetchPageVisibility } from '@/lib/dal';
import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui';
import { siteConfig } from '@/data';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Accessibility Statement',
  description: 'Our commitment to digital accessibility for all users.',
  alternates: {
    canonical: '/legal/accessibility',
  },
  openGraph: {
    title: 'Accessibility Statement | Growmybiz24',
    description: 'Our commitment to digital accessibility for all users.',
    url: '/legal/accessibility',
    type: 'website',
  },
};

export default async function AccessibilityStatementPage() {
  const visibility = await fetchPageVisibility();
  if (visibility.legalAccessibility === false) notFound();
  return (
    <>
      <div
        className="pt-24 pb-12 border-b border-white/[0.06]"
        style={{ background: 'linear-gradient(135deg, #1A2B4A 0%, #243B66 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            dark
            items={[{ label: 'Home', href: '/' }, { label: 'Legal' }, { label: 'Accessibility' }]}
          />
          <div className="mt-5">
            <h1 className="text-3xl lg:text-4xl font-bold text-white">Accessibility Statement</h1>
            <p className="text-white/40 text-sm mt-2">Last updated: February 2025</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <LegalDocView slug="accessibility" defaultTitle="Accessibility Statement">
        <div className="prose-legal space-y-8">
          <LegalSection title="1. Our Commitment">
            <p>
              At {siteConfig.siteName}, we believe the internet should be accessible to everyone. We are committed to ensuring our digital experiences, applications, and client deliverables conform to recognized digital accessibility standards, including the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>.
            </p>
          </LegalSection>

          <LegalSection title="2. Implementation Measures">
            <p>
              To maintain high accessibility across our digital properties, we adopt the following technical standards:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2 text-[#3D4F63]">
              <li><strong>Semantic HTML:</strong> Use of standard native landmarks, headings, lists, and button elements to ensure smooth screen-reader navigation.</li>
              <li><strong>Keyboard Operability:</strong> All interactive components, forms, and navigation menus are test-verified for full keyboard-only navigation.</li>
              <li><strong>Color Contrast:</strong> Text and critical UI elements adhere to strict contrast ratios (minimum 4.5:1 for normal text).</li>
              <li><strong>Responsive Scaling:</strong> Layouts maintain readability when magnified up to 200% without loss of content or functionality.</li>
            </ul>
          </LegalSection>

          <LegalSection title="3. Continuous Improvement & Feedback">
            <p>
              Digital accessibility is an ongoing effort. If you encounter any accessibility barrier or have difficulty using any part of our website, please let us know:
            </p>
            <p className="mt-2">
              Email:{' '}
              <a href={`mailto:${siteConfig.email}`} className="text-[#477BDB] hover:underline">
                {siteConfig.email}
              </a>
            </p>
            <p className="mt-1">
              We aim to investigate all feedback promptly and implement reasonable accommodations.
            </p>
          </LegalSection>
        </div>
        </LegalDocView>
      </div>
    </>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-[#0F1C31] mb-3">{title}</h2>
      <div className="prose-legal">{children}</div>
    </section>
  );
}
