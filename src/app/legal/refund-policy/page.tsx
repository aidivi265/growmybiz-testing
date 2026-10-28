import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui';
import { siteConfig } from '@/data';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description: 'Clear commercial guidelines on project milestone payments, cancellations, and refunds for Growmybizz clients.',
};

export default function RefundPolicyPage() {
  return (
    <>
      <div
        className="pt-24 pb-12 border-b border-white/[0.06]"
        style={{ background: 'linear-gradient(135deg, #1A2B4A 0%, #243B66 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            dark
            items={[{ label: 'Home', href: '/' }, { label: 'Legal' }, { label: 'Refund Policy' }]}
          />
          <div className="mt-5">
            <h1 className="text-3xl lg:text-4xl font-bold text-white">Refund & Cancellation Policy</h1>
            <p className="text-white/40 text-sm mt-2">Last updated: February 2025</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="prose-legal space-y-8">
          <LegalSection title="1. Commercial Overview">
            <p>
              At {siteConfig.siteName}, we operate on transparent, milestone-driven Statements of Work (SOW). Before any commercial project commences, both parties agree in writing to the project scope, deliverables, timeline, and associated payment milestones.
            </p>
            <p className="mt-2">
              Because our digital services involve dedicated technical engineering, design craftsmanship, and reserved team capacity, our refund policies reflect the work invested at each stage.
            </p>
          </LegalSection>

          <LegalSection title="2. Milestone Payments & Sign-Offs">
            <p>
              Engagements are divided into clear deliverables (e.g. Discovery & Wireframes, UI Design Approval, Development Alpha, Final Deployment).
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2 text-[#3D4F63]">
              <li>
                <strong>Project Kickoff Deposit:</strong> The initial deposit covers technical discovery, project architecture, and research. Once work has commenced, the kickoff deposit is non-refundable.
              </li>
              <li>
                <strong>Approved Milestones:</strong> Once a deliverable milestone has been reviewed, approved, or signed off by the client, the corresponding milestone payment is non-refundable.
              </li>
              <li>
                <strong>Unstarted Milestones:</strong> If an engagement is terminated before subsequent, uncommenced milestones have begun, the client will not be invoiced for those future phases.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="3. Third-Party Costs & Disbursements">
            <p>
              Direct disbursements incurred on the client&apos;s behalf are strictly non-refundable under all circumstances. These include:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2 text-[#3D4F63]">
              <li>Domain registrations and SSL certification fees</li>
              <li>Cloud hosting infrastructure and database usage costs (e.g., Vercel, Supabase, AWS)</li>
              <li>Advertising media spend paid directly to ad networks (Google Ads, Meta Ads)</li>
              <li>Third-party API credits, SMS gateway packages, or proprietary software licenses</li>
            </ul>
          </LegalSection>

          <LegalSection title="4. Retainers & Ongoing Care Plans">
            <p>
              Monthly retainer services (such as SEO management, digital marketing, content retainers, and website maintenance plans) are billed on a month-to-month or fixed-term basis. Clients may cancel monthly retainers with a minimum of <strong>14 days written notice</strong> prior to the next billing cycle. Fees already billed for the active calendar month are non-refundable.
            </p>
          </LegalSection>

          <LegalSection title="5. Cancellation Procedure & Dispute Resolution">
            <p>
              If you wish to request a cancellation or discuss milestone adjustments, please provide written notification to your project lead or email us at{' '}
              <a href={`mailto:${siteConfig.email}`} className="text-[#477BDB] hover:underline">
                {siteConfig.email}
              </a>.
            </p>
            <p className="mt-2">
              We commit to reviewing every dispute in good faith within 5 business days to reach an equitable resolution, including pro-rata adjustments or service credit vouchers where appropriate.
            </p>
          </LegalSection>
        </div>
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
