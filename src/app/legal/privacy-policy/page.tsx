import LegalDocView from '@/components/LegalDocView';
import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui';
import { siteConfig } from '@/data';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Growmybizz collects, uses and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="pt-24 pb-12 border-b border-white/[0.06]" style={{ background: 'linear-gradient(135deg, #1A2B4A 0%, #243B66 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            dark
            items={[{ label: 'Home', href: '/' }, { label: 'Legal' }, { label: 'Privacy Policy' }]}
          />
          <div className="mt-5">
            <h1 className="text-3xl lg:text-4xl font-bold text-white">Privacy Policy</h1>
            <p className="text-white/40 text-sm mt-2">Last updated: January 15, 2025</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <LegalDocView slug="privacy-policy" defaultTitle="Privacy Policy">
        <div className="prose-legal space-y-8">
          <LegalSection title="1. Who we are">
            <p>{siteConfig.siteName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a digital agency. Our contact address is: <a href={`mailto:${siteConfig.email}`} className="text-[#477BDB] hover:underline">{siteConfig.email}</a>.</p>
            <p>This policy explains how we collect, use, store and protect personal information when you use our website or contact us.</p>
          </LegalSection>

          <LegalSection title="2. Information we collect">
            <p>We may collect the following types of personal information:</p>
            <ul>
              <li><strong>Contact information:</strong> Name, email address, phone number, company name — collected when you submit an enquiry form or contact us directly.</li>
              <li><strong>Usage data:</strong> Pages visited, browser type, device, referral source — collected automatically via analytics tools (if implemented).</li>
              <li><strong>Communications:</strong> Any information you include in messages, emails or project briefs you send to us.</li>
            </ul>
          </LegalSection>

          <LegalSection title="3. How we use your information">
            <p>We use personal information to:</p>
            <ul>
              <li>Respond to your enquiries and project requests</li>
              <li>Communicate about projects you are engaged on with us</li>
              <li>Improve our website and services based on usage data</li>
              <li>Meet any legal or regulatory obligations</li>
            </ul>
            <p>We do not sell, rent or trade your personal information to third parties.</p>
          </LegalSection>

          <LegalSection title="4. Legal basis for processing (if applicable)">
            <p>Where applicable under data protection law, we process personal data on the following bases:</p>
            <ul>
              <li><strong>Consent:</strong> Where you have provided explicit consent (e.g. by submitting a contact form).</li>
              <li><strong>Legitimate interests:</strong> To respond to enquiries and provide the services you have requested.</li>
              <li><strong>Legal obligation:</strong> Where we are required to process data to comply with applicable law.</li>
            </ul>
          </LegalSection>

          <LegalSection title="5. Data retention">
            <p>We retain personal data only as long as necessary for the purposes described in this policy or as required by law. Enquiry data is retained for up to 24 months for client correspondence and commercial records. Client project data and financial transaction records are retained for the duration of the engagement plus 7 years in accordance with statutory accounting and tax regulations.</p>
          </LegalSection>

          <LegalSection title="6. Third-party services">
            <p>Our website may use third-party services including analytics providers and hosting platforms. These services have their own privacy policies and data practices. We will update this section when specific services are implemented.</p>
          </LegalSection>

          <LegalSection title="7. Cookies">
            <p>This website may use cookies for analytics and functionality. Details of cookies used will be provided in a cookie notice when the website is live. You can manage cookie preferences through your browser settings.</p>
          </LegalSection>

          <LegalSection title="8. Your rights">
            <p>Depending on your location, you may have rights including:</p>
            <ul>
              <li>The right to access the personal data we hold about you</li>
              <li>The right to correct inaccurate data</li>
              <li>The right to request deletion of your data</li>
              <li>The right to object to or restrict certain processing</li>
              <li>The right to data portability (where applicable)</li>
            </ul>
            <p>To exercise any of these rights, contact us at: <a href={`mailto:${siteConfig.email}`} className="text-[#477BDB] hover:underline">{siteConfig.email}</a>.</p>
          </LegalSection>

          <LegalSection title="9. Security">
            <p>We take reasonable technical and organisational measures to protect personal data from unauthorised access, loss or misuse. However, no internet transmission is completely secure. We encourage you to exercise caution when submitting personal information online.</p>
          </LegalSection>

          <LegalSection title="10. Changes to this policy">
            <p>We may update this privacy policy from time to time. Changes will be published on this page with an updated date. We encourage you to review this policy periodically.</p>
          </LegalSection>

          <LegalSection title="11. Contact">
            <p>For questions, concerns or requests related to this policy, contact us at: <a href={`mailto:${siteConfig.email}`} className="text-[#477BDB] hover:underline">{siteConfig.email}</a>.</p>
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
