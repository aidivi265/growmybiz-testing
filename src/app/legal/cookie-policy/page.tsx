import LegalDocView from '@/components/LegalDocView';
import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui';
import { siteConfig } from '@/data';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Learn how Growmybizz uses cookies and tracking technologies to improve your experience.',
};

export default function CookiePolicyPage() {
  return (
    <>
      <div
        className="pt-24 pb-12 border-b border-white/[0.06]"
        style={{ background: 'linear-gradient(135deg, #1A2B4A 0%, #243B66 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            dark
            items={[{ label: 'Home', href: '/' }, { label: 'Legal' }, { label: 'Cookie Policy' }]}
          />
          <div className="mt-5">
            <h1 className="text-3xl lg:text-4xl font-bold text-white">Cookie Policy</h1>
            <p className="text-white/40 text-sm mt-2">Last updated: February 2025</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <LegalDocView slug="cookie-policy" defaultTitle="Cookie Policy">
        <div className="prose-legal space-y-8">
          <LegalSection title="1. What Are Cookies?">
            <p>
              Cookies are small text files placed on your device (computer, smartphone, or tablet) by websites you visit. They are widely used to make websites work efficiently, provide a smoother browsing experience, and deliver analytical information to website operators.
            </p>
          </LegalSection>

          <LegalSection title="2. Types of Cookies We Use">
            <p>
              {siteConfig.siteName} uses minimal cookies necessary for website performance and user preference tracking:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2 text-[#3D4F63]">
              <li>
                <strong>Strictly Necessary Cookies:</strong> Essential for the website to function, navigate secure pages, and handle form token protection. You cannot disable these without breaking site functionality.
              </li>
              <li>
                <strong>Performance & Analytics Cookies:</strong> Collect anonymous data on how visitors interact with our pages, which pages are most popular, and identify load-time bottlenecks.
              </li>
              <li>
                <strong>Functionality & Session Cookies:</strong> Remember your preferences (such as admin login state and interface settings) across sessions.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="3. Third-Party Cookies">
            <p>
              We may utilize third-party services (such as Supabase for session authentication, Vercel for edge caching and web vitals telemetry, and Google Analytics). These providers may set their own cookies subject to their independent privacy and cookie policies.
            </p>
          </LegalSection>

          <LegalSection title="4. How to Control and Delete Cookies">
            <p>
              Most web browsers automatically accept cookies, but you can modify your browser settings to decline cookies or notify you when a cookie is set. If you choose to block cookies, certain features of our website (including administrative session persistence) may not function as intended.
            </p>
            <p className="mt-2">
              For comprehensive information on controlling cookies across different browsers, visit{' '}
              <a
                href="https://www.aboutcookies.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#477BDB] hover:underline"
              >
                www.aboutcookies.org
              </a>{' '}
              or check your browser&apos;s privacy settings.
            </p>
          </LegalSection>

          <LegalSection title="5. Updates to This Policy">
            <p>
              We may update this Cookie Policy periodically to reflect technological, legal, or operational changes. The latest version will always be accessible on this page with the effective date specified above.
            </p>
          </LegalSection>

          <LegalSection title="6. Contact Us">
            <p>
              If you have any questions regarding our use of cookies or other technologies, please contact us at:{' '}
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
