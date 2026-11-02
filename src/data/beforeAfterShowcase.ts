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
      'Sunday Loom was bleeding ₹8.5 Lakhs every month because their legacy WordPress catalog took 4.8 seconds to load on 4G mobile devices. We re-engineered the storefront on Next.js 15, deployed on Cloudflare global edge with instant Razorpay 1-click checkout.',
    beforeImage: '/transformations/before-ecommerce.svg',
    afterImage: '/transformations/after-ecommerce.svg',
    beforeLabel: 'Legacy 2018 WooCommerce',
    afterLabel: 'Growmybiz24 Edge Storefront',
    beforeSummary: '4.8s TTFB • 1.1% conversion rate • 71% mobile cart abandonment',
    afterSummary: '0.42s edge load • 4.82% conversion rate • 4.2x monthly revenue',
    metrics: [
      {
        label: 'Page Load Speed',
        before: '4.8s',
        after: '0.42s',
        lift: '-91% Faster',
        isPositive: true,
      },
      {
        label: 'Storefront Conversion Rate',
        before: '1.12%',
        after: '4.82%',
        lift: '+330% Lift',
        isPositive: true,
      },
      {
        label: 'Monthly Online Revenue',
        before: '₹6.8 Lakhs',
        after: '₹28.4 Lakhs',
        lift: '4.2x Growth',
        isPositive: true,
      },
      {
        label: 'Mobile Bounce Rate',
        before: '64.2%',
        after: '18.4%',
        lift: '-71% Drops',
        isPositive: true,
      },
    ],
    deliverables: [
      'Next.js 15 App Router Edge Architecture',
      'Dynamic WebP/AVIF Image Pipeline via CDN',
      'Instant 1-Click Razorpay & Cashfree Checkout',
      'Automated Inventory & Shiprocket Sync',
    ],
    testimonial: {
      quote:
        'The difference was night and day within 72 hours of launch. Our mobile conversion rate shot up to nearly 5%, and customer support calls regarding failed checkout drops dropped to zero.',
      author: 'Ananya Singhania',
      role: 'Founder & Creative Director',
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
      'High-net-worth buyers browsing luxury villas after 9 PM were abandoning static inquiry forms because broker teams took up to 48 hours to reply. We deployed an autonomous AI WhatsApp Agent trained on property floor plans, pricing tiers, and direct calendar booking.',
    beforeImage: '/transformations/before-ai.svg',
    afterImage: '/transformations/after-ai.svg',
    beforeLabel: 'Legacy 48-Hour Contact Form',
    afterLabel: '24/7 Live AI WhatsApp Copilot',
    beforeSummary: '48h avg response • 72% night-time lead drop • manual broker CRM entry',
    afterSummary: '0.8s instant answer • 94% lead qualification • auto-scheduled site visits',
    metrics: [
      {
        label: 'Average Lead Response Time',
        before: '48 Hours',
        after: '0.8 Seconds',
        lift: 'Instant 24/7',
        isPositive: true,
      },
      {
        label: 'Lead-to-Tour Booking Rate',
        before: '6.4%',
        after: '28.6%',
        lift: '+346% Lift',
        isPositive: true,
      },
      {
        label: 'Broker Time Spent on Manual FAQ',
        before: '22 hrs/week',
        after: '2 hrs/week',
        lift: '-90% Saved',
        isPositive: true,
      },
      {
        label: 'Night-Time Deal Inquiries Closed',
        before: '0 / month',
        after: '14 / month',
        lift: '+₹4.2 Cr Pipeline',
        isPositive: true,
      },
    ],
    deliverables: [
      'Multi-turn RAG AI Agent powered by Claude & Gemini',
      'Official Meta WhatsApp Cloud API integration',
      'Automated Google Calendar & CRM Sync',
      'Human-handover alert notifications on Slack & SMS',
    ],
    testimonial: {
      quote:
        'The AI agent closed two villa deals worth ₹3.8 Crores from leads that landed on our website at 11:30 PM. It answered their amenity queries in seconds and booked private Sunday walkthroughs automatically.',
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
    industry: 'Private Family Offices & Wealth Management',
    tagline: 'Elevating an outdated local accountant look into an ultra-luxury institutional brand',
    description:
      'Apex Wealth was managing ₹120+ Crores in assets but had an amateur logo designed in 2017 that made them look like a neighbourhood tax filing kiosk. We built an authoritative, Swiss-inspired typographic identity, gold-accented design tokens, and luxury brand guidelines.',
    beforeImage: '/transformations/before-branding.svg',
    afterImage: '/transformations/after-branding.svg',
    beforeLabel: '2017 Inconsistent Identity',
    afterLabel: 'Institutional Luxury Brand System',
    beforeSummary: 'Cluttered fonts • no token system • perceived as budget accountant',
    afterSummary: 'Vector design system • 3.2x average retainer • enterprise institutional trust',
    metrics: [
      {
        label: 'Average Client Retainer Value',
        before: '₹35,000/mo',
        after: '₹1,15,000/mo',
        lift: '3.2x Increase',
        isPositive: true,
      },
      {
        label: 'Pitch-to-Close Win Rate',
        before: '19%',
        after: '54%',
        lift: '+184% Conversion',
        isPositive: true,
      },
      {
        label: 'Enterprise Family Office Inquiries',
        before: '1 / quarter',
        after: '8 / month',
        lift: '+700% Lift',
        isPositive: true,
      },
      {
        label: 'Brand Equity Valuation Score',
        before: '32/100',
        after: '94/100',
        lift: 'Tier-1 Grade',
        isPositive: true,
      },
    ],
    deliverables: [
      'Complete Vector Logomark, Monogram & Wordmark',
      'Figma Token System (Dark Luxury Slate + Pure Gold)',
      'Editorial Pitch Deck & Investor Prospectus System',
      'Premium Stationery, Letterheads & Digital Business Cards',
    ],
    testimonial: {
      quote:
        'Our prospective clients now treat us like Morgan Stanley or Goldman Sachs from the very first slide deck. We tripled our fee structure immediately without losing a single deal.',
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
      'Zenith was spending ₹3.5 Lakhs/month on generic Google Ads with a previous agency that generated low-intent tire kickers while their organic rankings sat on page 5. We executed technical SEO, structured clinic schema, and localized Google Maps 3-pack dominance.',
    beforeImage: '/transformations/before-seo.svg',
    afterImage: '/transformations/after-seo.svg',
    beforeLabel: 'Flatline Traffic (Page 5)',
    afterLabel: 'Google Page 1 Market Leader',
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
        lift: 'Dominated SERP',
        isPositive: true,
      },
      {
        label: 'Customer Acquisition Cost (CAC)',
        before: '₹4,200 / patient',
        after: '₹1,760 / patient',
        lift: '-58% Cheaper',
        isPositive: true,
      },
      {
        label: 'Paid Advertising Return (ROAS)',
        before: '1.2x',
        after: '4.62x',
        lift: '3.8x Lift',
        isPositive: true,
      },
    ],
    deliverables: [
      'Comprehensive Programmatic SEO & Doctor Schemas',
      'Local 3-Pack Optimization across 4 City Branches',
      'Intent-Driven Google Search Ads with Negative Keyword Scrub',
      'Real-Time CallRail Attribution & Appointment Sync',
    ],
    testimonial: {
      quote:
        'Growmybiz24 took us from invisible on Google to having our consulting rooms completely booked out three weeks in advance across all four branches.',
      author: 'Dr. Sameer Kulkarni',
      role: 'Head of Clinical Operations',
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
    industry: '15-Minute Grocery & Organic Farm Deliveries',
    tagline: 'Replacing a buggy 1.8-star WebView wrapper with a 60fps native Flutter app',
    description:
      'FastCart launched with an outsourced hybrid web wrapper that had a 3.2-second tap delay, drained phone batteries, and was rejected twice by Apple App Store review. We built a native Flutter 60 FPS mobile app with offline local storage, instant biometrics, and 1-tap UPI payment.',
    beforeImage: '/transformations/before-mobile.svg',
    afterImage: '/transformations/after-mobile.svg',
    beforeLabel: 'Laggy 1.8-Star Web Wrapper',
    afterLabel: 'Silky 60fps Native Flutter App',
    beforeSummary: '1.8/5 App Store rating • 3.2s tap lag • 64% 30-day user churn',
    afterSummary: '4.9/5 App Store rating • 60 FPS silky smooth • +41% repeat ordering',
    metrics: [
      {
        label: 'App Store Rating',
        before: '1.8 / 5.0',
        after: '4.9 / 5.0',
        lift: '+172% Lift',
        isPositive: true,
      },
      {
        label: 'App UI Frame Rate',
        before: '22 FPS (Stutter)',
        after: '60 FPS (Fluid)',
        lift: 'Silky Smooth',
        isPositive: true,
      },
      {
        label: 'Crash-Free Session Rate',
        before: '84.2%',
        after: '99.98%',
        lift: 'Rock Solid',
        isPositive: true,
      },
      {
        label: '30-Day Customer Retention',
        before: '14.8%',
        after: '55.6%',
        lift: '3.7x Retention',
        isPositive: true,
      },
    ],
    deliverables: [
      'Cross-Platform Flutter 3.x Production Codebase',
      'Local SQLite & Hive Cache for Instant Offline Boot',
      'Integrated Native Apple Pay, Google Pay & UPI Intent Flow',
      'Automated OneSignal Geofenced Push Campaigns',
    ],
    testimonial: {
      quote:
        'Our app store reviews went from angry 1-star complaints about frozen screens to thousands of 5-star reviews praising the instant speed. Repeat orders doubled in the first month.',
      author: 'Karan Bhasin',
      role: 'Co-Founder & VP of Product',
      company: 'FastCart Deliveries',
    },
    ctaText: 'Build High-Performance Mobile App',
    ctaService: 'web-app-development',
  },
  {
    id: 'ignite-kinetic-video',
    serviceSlug: 'video-content',
    serviceName: '3D Kinetic Motion & Video Production',
    clientName: 'Ignite Hardware Tech',
    industry: 'Consumer Smart Wearables & Audio Gear',
    tagline: 'Replacing boring 2D static graphics with high-retention 3D kinetic video ads',
    description:
      'Ignite was spending heavily on Meta and TikTok ads using static banner graphics that had an average watch time under 0.8 seconds. We created a high-energy series of 3D exploded product renders, kinetic typography, and viral sound-designed reels.',
    beforeImage: '/transformations/before-video.svg',
    afterImage: '/transformations/after-video.svg',
    beforeLabel: 'Static 2D Product Banner',
    afterLabel: '3D Kinetic Motion Reel',
    beforeSummary: '0.8s avg watch time • 0.38% click rate • high ad burn',
    afterSummary: '18.4s avg watch time • 3.92% CTR • 5.8x verified ad ROAS',
    metrics: [
      {
        label: 'Ad Click-Through Rate (CTR)',
        before: '0.38%',
        after: '3.92%',
        lift: '10.3x Higher',
        isPositive: true,
      },
      {
        label: 'Average Video Watch Time',
        before: '0.8 Seconds',
        after: '18.4 Seconds',
        lift: '68% Completion',
        isPositive: true,
      },
      {
        label: 'Return on Ad Spend (ROAS)',
        before: '1.4x',
        after: '5.82x',
        lift: '4.1x Lift',
        isPositive: true,
      },
      {
        label: 'Organic Social Shares & Saves',
        before: '12 / post',
        after: '3,840 / post',
        lift: 'Viral Reach',
        isPositive: true,
      },
    ],
    deliverables: [
      'Photorealistic 3D CAD Product Exploded Views (Blender/Cinema4D)',
      'High-Energy Kinetic Typography & Hook Architecture',
      'Custom Audio Engineering & Dolby Sound Mastering',
      'Multi-Format Deliverables for 9:16 Reels, 16:9 YouTube, and 1:1 Ads',
    ],
    testimonial: {
      quote:
        'The 3D motion videos completely transformed our ad account economics. Our blended customer acquisition cost plummeted by 62% in the very first week of launching the reels.',
      author: 'Tara Nair',
      role: 'Growth Marketing Director',
      company: 'Ignite Wearables',
    },
    ctaText: 'Create Viral 3D Video Ads',
    ctaService: 'video-content',
  },
];
