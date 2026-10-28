import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui';
import { siteConfig } from '@/data';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions governing use of Growmybizz services and website.',
};

export default function TermsOfServicePage() {
  return (
    <>
      <div className="pt-24 pb-12 border-b border-white/[0.06]" style={{ background: 'linear-gradient(135deg, #1A2B4A 0%, #243B66 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            dark
            items={[{ label: 'Home', href: '/' }, { label: 'Legal' }, { label: 'Terms of Service' }]}
          />
          <div className="mt-5">
            <h1 className="text-3xl lg:text-4xl font-bold text-white">Terms of Service</h1>
            <p className="text-white/40 text-sm mt-2">Last updated: January 15, 2025</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="space-y-8">
          <LegalSection title="1. Agreement to terms">
            <p>By accessing or using the {siteConfig.siteName} website and engaging our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use this website or engage our services.</p>
          </LegalSection>

          <LegalSection title="2. Services">
            <p>{siteConfig.siteName} provides digital services including, but not limited to, web development, design, digital marketing, content production, AI integration and related consulting.</p>
            <p>Specific services, deliverables, timelines and fees are agreed in individual project scopes or service agreements. In the event of a conflict between these terms and a specific agreement, the specific agreement prevails.</p>
          </LegalSection>

          <LegalSection title="3. Intellectual property">
            <p>Upon receipt of full payment for a project, we assign ownership of final deliverables to you as agreed in the project scope, unless otherwise specified.</p>
            <p>We retain ownership of all work product until full payment is received. We also retain the right to use completed work in our portfolio and marketing materials unless explicitly agreed otherwise in writing.</p>
            <p>We retain ownership of any underlying tools, frameworks, processes and methodologies used to produce deliverables.</p>
          </LegalSection>

          <LegalSection title="4. Payments and fees">
            <p>Payment terms are set out in individual project proposals or service agreements. Unless explicitly agreed otherwise in writing, we typically require an initial 50% deposit upon project commencement, with the remaining 50% payable upon milestone completion or final delivery acceptance.</p>
            <p>Late payments may attract a late payment fee of 1.5% per month (or the maximum permitted by applicable law) on outstanding balances. We reserve the right to pause work on overdue accounts until outstanding invoices are settled.</p>
          </LegalSection>

          <LegalSection title="5. Revisions and scope">
            <p>The number of revision rounds and the scope of revisions included in any project are defined in the project proposal. Changes beyond the agreed scope may be subject to additional fees and timeline adjustments, communicated in writing before proceeding.</p>
          </LegalSection>

          <LegalSection title="6. Client responsibilities">
            <p>You agree to provide accurate briefing materials, content, feedback and approvals in a timely manner. Delays caused by late approvals or content delivery may affect project timelines without constituting a breach on our part.</p>
          </LegalSection>

          <LegalSection title="7. Confidentiality">
            <p>We treat information shared with us in the context of a project as confidential. We do not share project-specific information with third parties without your consent, except as required to deliver the agreed services (e.g. using third-party tools or subcontractors bound by equivalent confidentiality obligations).</p>
          </LegalSection>

          <LegalSection title="8. Limitation of liability">
            <p>To the maximum extent permitted by applicable law, {siteConfig.siteName} shall not be liable for any indirect, incidental, consequential or punitive damages arising from the use of our services or website.</p>
            <p>Our total liability in connection with any project shall not exceed the fees paid by you for that project.</p>
          </LegalSection>

          <LegalSection title="9. Website use">
            <p>This website is provided for informational purposes. You agree not to use this website to transmit unlawful, harmful or disruptive content. We reserve the right to restrict access to this website at our discretion.</p>
          </LegalSection>

          <LegalSection title="10. Governing law">
            <p>These terms are governed by and construed in accordance with the laws of India. Any legal action or proceeding arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts of Bengaluru, Karnataka, India.</p>
          </LegalSection>

          <LegalSection title="11. Changes to these terms">
            <p>We may update these terms from time to time. Changes will be published on this page. Continued use of our services after changes constitutes acceptance of the updated terms.</p>
          </LegalSection>

          <LegalSection title="12. Contact">
            <p>For questions about these terms, contact us at: <a href={`mailto:${siteConfig.email}`} className="text-[#477BDB] hover:underline">{siteConfig.email}</a>.</p>
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
