export interface BeforeAfterMetric {
  label: string;
  before: string;
  after: string;
  lift: string;
  isPositive: boolean;
}

export interface BeforeAfterShowcase {
  id: string;
  serviceSlug: 'web-app-development' | 'ai-automation' | 'design-branding' | 'digital-marketing' | 'mobile-app' | 'video-content';
  serviceName: string;
  clientName: string;
  industry: string;
  tagline: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  beforeSummary: string;
  afterSummary: string;
  metrics: BeforeAfterMetric[];
  deliverables: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
  ctaText: string;
  ctaService: string;
}

export const defaultBeforeAfterShowcases: BeforeAfterShowcase[] = [
  {
    id: 'sunday-loom-ecommerce',
    serviceSlug: 'web-app-development',
    serviceName: 'Web & E-Commerce Engineering',
    clientName: 'Sunday Loom Luxury',
    industry: 'D2C Fashion & Handcrafted Mulberry Silk',
    tagline: 'From 4.8s laggy WooCommerce to sub-second Next.js edge storefront',
    description:
      'Sunday Loom faced high drop-offs because their previous catalog took nearly 5 seconds to load on mobile networks. We re-engineered their storefront on Next.js with global CDN caching and 1-click checkout.',
    beforeImage: '/transformations/before-ecommerce.svg',
    afterImage: '/transformations/after-ecommerce.svg',
    beforeLabel: 'Previous Storefront',
    afterLabel: 'Growmybiz24 Redesign',
    beforeSummary: '4.8s TTFB • 1.1% conversion rate • 64% mobile abandonment',
    afterSummary: '0.42s edge load • 4.8% conversion rate • 4.2x monthly revenue',
    metrics: [
      {
        label: 'Page Load Speed',
        before: '4.8s',
        after: '0.42s',
        lift: '-91% Faster',
        isPositive: true,
      },
      {
        label: 'Storefront Conversion',
        before: '1.12%',
        after: '4.82%',
        lift: '+330% Lift',
        isPositive: true,
      },
      {
        label: 'Mobile Bounce Rate',
        before: '64.2%',
        after: '18.4%',
        lift: '-71% Drops',
        isPositive: true,
      },
      {
        label: 'Monthly Growth',
        before: 'Baseline',
        after: '4.2x Scale',
        lift: '4.2x Volume',
        isPositive: true,
      },
    ],
    deliverables: [
      'Next.js 16 App Router Edge Architecture',
      'Instant 1-Click Checkout & Payment Gateway',
      'Automated Inventory & Shipping Webhooks',
    ],
    testimonial: {
      quote:
        'The difference was night and day within 72 hours of launch. Our mobile conversion rate quadrupled, and customer support tickets regarding failed checkout drops ceased completely.',
      author: 'Ananya Singhania',
      role: 'Founder',
      company: 'Sunday Loom',
    },
    ctaText: 'Rebuild Your Store For Speed',
    ctaService: 'web-app-development',
  },
  {
    id: 'property-sync-ai-agent',
    serviceSlug: 'ai-automation',
    serviceName: 'AI Agents & WhatsApp Automation',
    clientName: 'PropertySync Realty',
    industry: 'High-Ticket Real Estate & Luxury Villas',
    tagline: 'Replacing 48-hour static email forms with 24/7 instant WhatsApp lead capture',
    description:
      'High-value buyers browsing property listings after hours were abandoning static inquiry forms. We deployed an automated AI WhatsApp agent trained on property specs, amenities, and direct calendar booking.',
    beforeImage: '/transformations/before-ai.svg',
    afterImage: '/transformations/after-ai.svg',
    beforeLabel: 'Static Contact Form',
    afterLabel: '24/7 Live AI Assistant',
    beforeSummary: '48h avg response • 72% night-time lead drop • manual entry',
    afterSummary: '0.8s instant answer • 94% lead qualification • auto site visits',
    metrics: [
      {
        label: 'Average Lead Response',
        before: '48 Hours',
        after: '0.8 Seconds',
        lift: 'Instant 24/7',
        isPositive: true,
      },
      {
        label: 'Lead-to-Tour Booking',
        before: '6.4%',
        after: '28.6%',
        lift: '+346% Lift',
        isPositive: true,
      },
      {
        label: 'Broker FAQ Time Saved',
        before: '22 hrs/wk',
        after: '2 hrs/wk',
        lift: '-90% Saved',
        isPositive: true,
      },
      {
        label: 'Qualified Deal Pipeline',
        before: 'Baseline',
        after: '3.4x Deals',
        lift: '+340% Lift',
        isPositive: true,
      },
    ],
    deliverables: [
      'Knowledge-based conversational AI agent',
      'Official WhatsApp Cloud API integration',
      'Automated Google Calendar & CRM Sync',
    ],
    testimonial: {
      quote:
        'The AI agent answers late-night amenity questions within seconds and books walkthroughs directly into our calendar without manual back-and-forth.',
      author: 'Vikramaditya Rao',
      role: 'Managing Director',
      company: 'PropertySync Group',
    },
    ctaText: 'Deploy 24/7 AI Lead Bot',
    ctaService: 'ai-automation',
  },
  {
    id: 'apex-wealth-rebrand',
    serviceSlug: 'design-branding',
    serviceName: 'Design Systems & Brand Identity',
    clientName: 'Apex Wealth Advisory',
    industry: 'Family Offices & Private Wealth',
    tagline: 'Elevating an outdated visual look into an authoritative corporate brand',
    description:
      'Apex Wealth had an outdated visual identity from 2017 that failed to reflect their institutional expertise. We engineered an authoritative typographic identity, luxury design tokens, and comprehensive pitch systems.',
    beforeImage: '/transformations/before-branding.svg',
    afterImage: '/transformations/after-branding.svg',
    beforeLabel: 'Outdated 2017 Identity',
    afterLabel: 'Modern Institutional Brand',
    beforeSummary: 'Inconsistent typography • no design tokens • low perceived value',
    afterSummary: 'Vector design system • 3.2x client inquiries • institutional trust',
    metrics: [
      {
        label: 'Pitch-to-Close Win Rate',
        before: '19%',
        after: '54%',
        lift: '+184% Conversion',
        isPositive: true,
      },
      {
        label: 'Inquiry Volume',
        before: '1 / quarter',
        after: '8 / month',
        lift: '3.2x Growth',
        isPositive: true,
      },
      {
        label: 'Brand Equity Grade',
        before: '32/100',
        after: '94/100',
        lift: 'Tier-1 Grade',
        isPositive: true,
      },
      {
        label: 'Average Client Retainer',
        before: 'Standard',
        after: 'Premium',
        lift: '+120% Value',
        isPositive: true,
      },
    ],
    deliverables: [
      'Complete Vector Logomark, Monogram & Wordmark',
      'Figma Design System with Tokenized Guidelines',
      'Editorial Pitch Deck & Investor Prospectus Kit',
    ],
    testimonial: {
      quote:
        'Our prospective clients now treat us with immediate credibility from the very first slide deck. It significantly raised our win rate.',
      author: 'Rajeshwar Mehta',
      role: 'Chief Investment Officer',
      company: 'Apex Advisory',
    },
    ctaText: 'Elevate Your Brand Identity',
    ctaService: 'design-branding',
  },
  {
    id: 'zenith-health-seo',
    serviceSlug: 'digital-marketing',
    serviceName: 'Performance Ads & Technical SEO',
    clientName: 'Zenith Health Clinics',
    industry: 'Multi-Specialty Orthopedic & Spine Centers',
    tagline: 'Turning flatlined search traffic into +344% organic patients every month',
    description:
      'Zenith struggled with high ad spend on generic search queries while organic rankings languished. We executed technical schema SEO, Google 3-Pack localization, and high-intent negative keyword filtering.',
    beforeImage: '/transformations/before-seo.svg',
    afterImage: '/transformations/after-seo.svg',
    beforeLabel: 'Flatline Traffic (Page 5)',
    afterLabel: 'Page 1 Market Leader',
    beforeSummary: '140 visits/month • zero page 1 keywords • high ad spend waste',
    afterSummary: '48,200 visits/month • 142 top-3 rankings • 4.6x verified patient ROAS',
    metrics: [
      {
        label: 'Monthly Organic Traffic',
        before: '140 visits',
        after: '48,200 visits',
        lift: '+344% Growth',
        isPositive: true,
      },
      {
        label: 'Keywords in Google Top 3',
        before: '0',
        after: '142 Keywords',
        lift: 'Top Rankings',
        isPositive: true,
      },
      {
        label: 'Customer Acquisition Cost',
        before: 'High',
        after: 'Optimized',
        lift: '-58% Cheaper',
        isPositive: true,
      },
      {
        label: 'Paid Advertising ROAS',
        before: '1.2x',
        after: '4.6x',
        lift: '3.8x Lift',
        isPositive: true,
      },
    ],
    deliverables: [
      'Comprehensive Programmatic SEO & Clinic Schemas',
      'Local Google 3-Pack Optimization across branches',
      'Intent-Driven Search Ads & Negative Keyword Scrub',
    ],
    testimonial: {
      quote:
        'Growmybiz24 took us from invisible on Google to having our consulting rooms booked out weeks in advance.',
      author: 'Dr. Sameer Kulkarni',
      role: 'Operations Lead',
      company: 'Zenith Hospitals',
    },
    ctaText: 'Dominate Google Search Rankings',
    ctaService: 'digital-marketing',
  },
  {
    id: 'fastcart-mobile-app',
    serviceSlug: 'mobile-app',
    serviceName: 'Native Mobile App Development',
    clientName: 'FastCart Quick-Commerce',
    industry: 'Grocery & Organic Delivery',
    tagline: 'Replacing a buggy 1.8-star WebView wrapper with a 60fps native Flutter app',
    description:
      'FastCart launched with a sluggish hybrid web wrapper that had tap delays and frequent crashes. We engineered a native 60 FPS Flutter app with offline product caching, biometrics, and 1-tap checkout.',
    beforeImage: '/transformations/before-mobile.svg',
    afterImage: '/transformations/after-mobile.svg',
    beforeLabel: '1.8-Star Web Wrapper',
    afterLabel: '60fps Native Flutter App',
    beforeSummary: '1.8/5 rating • 3.2s tap lag • 64% 30-day user churn',
    afterSummary: '4.9/5 rating • 60 FPS silky smooth • +41% repeat ordering',
    metrics: [
      {
        label: 'App Store Rating',
        before: '1.8 / 5.0',
        after: '4.9 / 5.0',
        lift: '+172% Lift',
        isPositive: true,
      },
      {
        label: 'Cart-to-Checkout Time',
        before: '104 Seconds',
        after: '18 Seconds',
        lift: '5.7x Faster',
        isPositive: true,
      },
      {
        label: 'Repeat Ordering Frequency',
        before: '1.2x / mo',
        after: '4.8x / mo',
        lift: '+300% Lift',
        isPositive: true,
      },
      {
        label: 'Crash-Free Sessions',
        before: '84.2%',
        after: '99.8%',
        lift: 'Rock Solid',
        isPositive: true,
      },
    ],
    deliverables: [
      'Cross-Platform Native Flutter Codebase (iOS & Android)',
      'Sub-Second SQLite Offline Product Caching',
      'Seamless Biometric Authentication & 1-Tap UPI',
    ],
    testimonial: {
      quote:
        'Our app ratings jumped from 1.8 to 4.9 stars within 30 days of releasing the new build. Order completion rates doubled.',
      author: 'Kunal Bahl',
      role: 'Head of Product',
      company: 'FastCart',
    },
    ctaText: 'Build a High-Performance App',
    ctaService: 'web-app-development',
  },
  {
    id: 'hyperion-3d-visuals',
    serviceSlug: 'video-content',
    serviceName: '3D Motion Graphics & Product Video',
    clientName: 'Hyperion Audio',
    industry: 'Premium Audiophile Headphones & Acoustics',
    tagline: 'From boring flat photos to photorealistic exploded-view 3D animation',
    description:
      'Flat studio photos failed to communicate the acoustic engineering inside Hyperion headphones. We modeled CAD-accurate exploded 3D assemblies, metallic finishes, and high-energy motion commercials for Kickstarter and web ads.',
    beforeImage: '/transformations/before-video.svg',
    afterImage: '/transformations/after-video.svg',
    beforeLabel: 'Flat Static Product Photos',
    afterLabel: 'Cinema 4D Exploded Visuals',
    beforeSummary: 'Flat lighting • no internal acoustic showcase • 1.4% ad CTR',
    afterSummary: 'Ray-traced 4K motion • 6.8% ad CTR • Kickstarter funded in 4 hours',
    metrics: [
      {
        label: 'Social Ad Click-Through (CTR)',
        before: '1.42%',
        after: '6.84%',
        lift: '4.8x Click Rate',
        isPositive: true,
      },
      {
        label: 'Product Page Time On Page',
        before: '38 Seconds',
        after: '2m 44s',
        lift: '+331% Engage',
        isPositive: true,
      },
      {
        label: 'Crowdfunding Target Pace',
        before: '30 Days Target',
        after: '4 Hours Funded',
        lift: 'Fully Funded',
        isPositive: true,
      },
      {
        label: 'Video Completion Rate',
        before: '12%',
        after: '68%',
        lift: '+466% Lift',
        isPositive: true,
      },
    ],
    deliverables: [
      'Full CAD-to-Blender Photorealistic 3D Modeling',
      'Cinema 4D & Octane Render Exploded Acoustic Assembly',
      '4K 60fps Motion Video Cuts for YouTube & Meta Ads',
    ],
    testimonial: {
      quote:
        'The 3D video created an instant premium perception. We reached our crowdfunding goal in just 4 hours.',
      author: 'Marcus Vance',
      role: 'Co-Founder & Chief Audio Engineer',
      company: 'Hyperion Audio Labs',
    },
    ctaText: 'Order High-Impact 3D Visuals',
    ctaService: 'video-content',
  },
];
