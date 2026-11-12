export interface PageVisibility {
  // Main Pages
  services: boolean;
  portfolio: boolean;
  about: boolean;
  process: boolean;
  insights: boolean;
  contact: boolean;

  // Interactive Tools & Client Pages
  audit: boolean;
  estimator: boolean;
  portal: boolean;
  startProject: boolean;

  // Homepage Sections
  aiCopilot: boolean;
  homeAuditBar: boolean;
  valueProps: boolean;
  homeEstimator: boolean;
  beforeAfter: boolean;
  testimonials: boolean;

  // Legal Pages
  legalPrivacy: boolean;
  legalTerms: boolean;
  legalCookies: boolean;
  legalRefund: boolean;
  legalDisclaimer: boolean;
  legalAccessibility: boolean;
}

export const defaultPageVisibility: PageVisibility = {
  services: true,
  portfolio: true,
  about: true,
  process: true,
  insights: true,
  contact: true,
  audit: true,
  estimator: true,
  portal: true,
  startProject: true,
  aiCopilot: true,
  homeAuditBar: true,
  valueProps: true,
  homeEstimator: true,
  beforeAfter: true,
  testimonials: true,
  legalPrivacy: true,
  legalTerms: true,
  legalCookies: true,
  legalRefund: true,
  legalDisclaimer: true,
  legalAccessibility: true,
};

export function normalizePageVisibility(raw?: Record<string, unknown> | null): PageVisibility {
  const result = { ...defaultPageVisibility };
  if (!raw || typeof raw !== 'object') return result;

  (Object.keys(defaultPageVisibility) as Array<keyof PageVisibility>).forEach((key) => {
    if (typeof raw[key] === 'boolean') {
      result[key] = raw[key] as boolean;
    }
  });
  return result;
}

export interface PageVisibilityItem {
  key: keyof PageVisibility;
  label: string;
  path: string;
  description: string;
  group: 'pages' | 'tools' | 'homepage' | 'legal';
}

export const PAGE_VISIBILITY_ITEMS: PageVisibilityItem[] = [
  // Main Pages
  {
    key: 'services',
    label: 'Services & Catalog',
    path: '/services',
    description: 'All service listings, detail pages (/services/*), and homepage services section.',
    group: 'pages',
  },
  {
    key: 'portfolio',
    label: 'Portfolio & Case Studies',
    path: '/portfolio',
    description: 'Work showcase (/portfolio, /portfolio/*) and homepage portfolio preview.',
    group: 'pages',
  },
  {
    key: 'about',
    label: 'About Us & Team',
    path: '/about',
    description: 'Agency story, mission, values, and team member directory.',
    group: 'pages',
  },
  {
    key: 'process',
    label: 'Our Process',
    path: '/process',
    description: 'Step-by-step project delivery methodology page & homepage process preview.',
    group: 'pages',
  },
  {
    key: 'insights',
    label: 'Blog & Insights',
    path: '/insights',
    description: 'Guides & articles (/insights, /insights/*) and homepage insights preview.',
    group: 'pages',
  },
  {
    key: 'contact',
    label: 'Contact Page',
    path: '/contact',
    description: 'Lead inquiry form and direct agency contact options.',
    group: 'pages',
  },

  // Interactive Tools & Client Portals
  {
    key: 'estimator',
    label: 'Cost Estimator Tool',
    path: '/estimator',
    description: 'Interactive INR (₹) project cost & scope calculator page.',
    group: 'tools',
  },
  {
    key: 'audit',
    label: 'Free Website & SEO Audit',
    path: '/audit',
    description: 'Live Core Web Vitals, speed & technical SEO scanner page.',
    group: 'tools',
  },
  {
    key: 'startProject',
    label: 'Start a Project Wizard',
    path: '/start-project',
    description: 'Step-by-step project intake & quotation onboarding wizard.',
    group: 'tools',
  },
  {
    key: 'portal',
    label: 'Client Portal',
    path: '/portal',
    description: 'Client project tracker, milestone billing, invoices & mockup approval portal.',
    group: 'tools',
  },

  // Homepage Sections
  {
    key: 'aiCopilot',
    label: 'AI Architecture Copilot',
    path: 'Homepage',
    description: 'Interactive AI tech stack & roadmap generator section on homepage.',
    group: 'homepage',
  },
  {
    key: 'homeAuditBar',
    label: 'Quick Audit Bar',
    path: 'Homepage',
    description: 'Website & SEO diagnostic scanner strip below the Hero section.',
    group: 'homepage',
  },
  {
    key: 'valueProps',
    label: 'Why Choose Us (Value Props)',
    path: 'Homepage',
    description: 'Core agency differentiators & engineering guarantees grid.',
    group: 'homepage',
  },
  {
    key: 'homeEstimator',
    label: 'Estimator Teaser Widget',
    path: 'Homepage',
    description: 'Quick INR scope & pricing teaser card on homepage.',
    group: 'homepage',
  },
  {
    key: 'beforeAfter',
    label: 'Before & After Slider',
    path: 'Homepage',
    description: 'Interactive website transformation comparison showcase.',
    group: 'homepage',
  },
  {
    key: 'testimonials',
    label: 'Client Testimonials',
    path: 'Homepage',
    description: 'Verified client reviews and feedback carousel.',
    group: 'homepage',
  },

  // Legal Pages
  {
    key: 'legalPrivacy',
    label: 'Privacy Policy',
    path: '/legal/privacy-policy',
    description: 'Data collection, storage, and privacy compliance policy.',
    group: 'legal',
  },
  {
    key: 'legalTerms',
    label: 'Terms of Service',
    path: '/legal/terms-of-service',
    description: 'Terms, conditions, and service engagement agreements.',
    group: 'legal',
  },
  {
    key: 'legalCookies',
    label: 'Cookie Policy',
    path: '/legal/cookie-policy',
    description: 'Browser cookies and analytics tracking disclosure.',
    group: 'legal',
  },
  {
    key: 'legalRefund',
    label: 'Refund Policy',
    path: '/legal/refund-policy',
    description: 'Cancellation and milestone refund terms.',
    group: 'legal',
  },
  {
    key: 'legalDisclaimer',
    label: 'Disclaimer',
    path: '/legal/disclaimer',
    description: 'General website and results disclaimer notice.',
    group: 'legal',
  },
  {
    key: 'legalAccessibility',
    label: 'Accessibility Statement',
    path: '/legal/accessibility',
    description: 'Website accessibility standards and contact notice.',
    group: 'legal',
  },
];

export const ALL_REVALIDATE_PATHS = [
  '/',
  '/about',
  '/services',
  '/portfolio',
  '/process',
  '/insights',
  '/contact',
  '/audit',
  '/estimator',
  '/portal',
  '/start-project',
  '/legal/privacy-policy',
  '/legal/terms-of-service',
  '/legal/cookie-policy',
  '/legal/refund-policy',
  '/legal/disclaimer',
  '/legal/accessibility',
  '/sitemap.xml',
];
