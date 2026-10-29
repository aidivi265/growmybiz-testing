import LegalDocView from '@/components/LegalDocView';
import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui';
import { siteConfig } from '@/data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'General information, performance disclaimers, and legal notices for Growmybiz24.',
};

export default function DisclaimerPage() {
  return (
    <>
      <div
        className="pt-24 pb-12 border-b border-white/[0.06]"
        style={{ background: 'linear-gradient(135deg, #1A2B4A 0%, #243B66 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            dark
            items={[{ label: 'Home', href: '/' }, { label: 'Legal' }, { label: 'Disclaimer' }]}
          />
          <div className="mt-5">
            <h1 className="text-3xl lg:text-4xl font-bold text-white">Legal Disclaimer</h1>
            <p className="text-white/40 text-sm mt-2">Last updated: February 2025</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <LegalDocView slug="disclaimer" defaultTitle="Disclaimer">
        <div className="prose-legal space-y-8">
          <LegalSection title="1. Informational & Educational Purposes Only">
            <p>
              The content published on {siteConfig.siteName} (including blog articles, guides, case studies, frameworks, and portfolio previews) is provided solely for general informational and educational purposes. Nothing on this website constitutes formal legal, tax, financial, or commercial advice.
            </p>
          </LegalSection>

          <LegalSection title="2. No Guarantees of Business or Financial Outcomes">
            <p>
              While we engineer digital platforms, campaigns, and user experiences using modern industry best practices, <strong>{siteConfig.siteName} makes no express or implied guarantees of specific commercial results, sales volumes, search engine rankings, or financial revenue.</strong>
            </p>
            <p className="mt-2">
              Business outcomes depend on numerous external variables beyond our direct control, including broader macroeconomic conditions, market competition, client fulfillment quality, product-market fit, and platform policy changes (such as Google or Meta algorithm updates).
            </p>
          </LegalSection>

          <LegalSection title="3. Portfolio Case Studies & Demonstrations">
            <p>
              In accordance with our commitment to transparency and truth in advertising:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2 text-[#3D4F63]">
              <li>
                Certain portfolio entries, prototypes, and UI mockups presented on this site are illustrative <strong>concept demonstrations</strong> engineered to showcase technical capability, architectural design, and interface standards.
              </li>
              <li>
                Past performance metrics highlighted in historical case studies reflect specific conditions and cannot guarantee identical outcomes for other projects.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="4. External Links & Third-Party Platforms">
            <p>
              Our website may contain hyperlinks to external websites, software documentation, and third-party tools. We do not endorse, guarantee the accuracy of, or assume liability for the contents, privacy policies, or practices of any external sites.
            </p>
          </LegalSection>

          <LegalSection title="5. Intellectual Property & Client Deliverables">
            <p>
              All trademarks, product names, and company logos displayed on this site are the property of their respective owners. Client deliverable rights and intellectual property transfers are strictly governed by individual project agreements signed upon engagement.
            </p>
          </LegalSection>

          <LegalSection title="6. Inquiries and Clarifications">
            <p>
              If you have any questions or require clarification regarding any aspect of this disclaimer, please reach out to our team at:{' '}
              <a href={`mailto:${siteConfig.email}`} className="text-[#477BDB] hover:underline">
                {siteConfig.email}
              </a>.
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
