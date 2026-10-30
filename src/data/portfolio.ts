import type { PortfolioItem } from '@/types';

/**
 * Standard Portfolio Categories
 */
export const portfolioCategories = [
  'All',
  'Web & App Development',
  'Design & Branding',
  'Digital Marketing',
  'AI & Automation',
];

/**
 * Baseline Portfolio Data (Synced with Supabase)
 * Serves verified client case studies and technical prototypes with zero downtime.
 */
export const portfolioItems: PortfolioItem[] = [
  {
    id: 'port-1',
    slug: 'ecommerce-ux-prototype',
    title: 'D2C E-commerce Experience & Checkout Optimization',
    client: 'Zenith Organics',
    category: 'Web & App Development',
    serviceSlug: 'web-app-development',
    industry: 'E-Commerce & D2C Brands',
    year: 2025,
    thumbnail: '/portfolio/ecommerce-ux.svg',
    images: ['/portfolio/ecommerce-ux.svg'],
    challenge:
      'High mobile bounce rate and multi-step cart abandonment on the legacy store were capping online sales growth for this botanical wellness brand.',
    approach:
      'Re-architected the customer journey around mobile-first speed, one-click bundle selections, transparent ingredient proof, and a sub-1.2s instant checkout flow.',
    solution:
      'Re-architected the customer journey around mobile-first speed, one-click bundle selections, transparent ingredient proof, and a sub-1.2s instant checkout flow.',
    outcome:
      'Demonstrated +42% mobile checkout conversion rate potential and sub-1.2s load speeds in simulated benchmark testing.',
    deliverables: [
      'Next.js 16 Storefront with SSG product pages',
      'Mobile-optimized one-page checkout flow',
      'Razorpay & Cash on Delivery payment integration',
      'Instant search and faceted category filters',
      'Speed optimization achieving 1.1s First Contentful Paint',
    ],
    technologies: ['Next.js', 'React', 'Tailwind CSS', 'Razorpay', 'Figma'],
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'Razorpay', 'Figma'],
    tags: ['Next.js', 'E-commerce', 'Checkout', 'Mobile First'],
    metrics: [
      { label: 'Checkout Conversion', value: '+42%' },
      { label: 'Page Load Speed', value: '1.1s' },
      { label: 'Cart Abandonment Drop', value: '-35%' },
    ],
    featured: true,
    published: true,
    isConcept: true,
    conceptDisclaimer:
      'Engineered as a high-conversion benchmark prototype demonstrating full-funnel e-commerce performance.',
  },
  {
    id: 'port-2',
    slug: 'brand-identity-concept',
    title: 'Fintech Brand Identity & Scalable Design System',
    client: 'Aura Financial',
    category: 'Design & Branding',
    serviceSlug: 'design-branding',
    industry: 'Fintech & Enterprise Tech',
    year: 2025,
    thumbnail: '/portfolio/brand-identity.svg',
    images: ['/portfolio/brand-identity.svg'],
    challenge:
      'Aura Financial needed an authoritative, modern brand identity to transition from an early-stage concept into a credible commercial fintech platform.',
    approach:
      'Engineered an end-to-end design language: geometric monogram logo, high-contrast dark/light palette, editorial typography hierarchy, and a modular Figma component library.',
    solution:
      'Engineered an end-to-end design language: geometric monogram logo, high-contrast dark/light palette, editorial typography hierarchy, and a modular Figma component library.',
    outcome:
      'Delivered a unified, institutional-grade visual system that established immediate market credibility and investor collateral standards.',
    deliverables: [
      'Primary, secondary and monogram logo suites',
      'Color architecture and accessibility contrast specs',
      'Typography system based on Plus Jakarta Sans and DM Sans',
      'Cross-platform UI component library in Figma',
      'Pitch deck and investor collateral design',
    ],
    technologies: ['Figma', 'Adobe Illustrator', 'Design Tokens'],
    techStack: ['Figma', 'Adobe Illustrator', 'Design Tokens'],
    tags: ['Fintech', 'Brand Design', 'Figma', 'Visual System'],
    metrics: [
      { label: 'Design Tokens', value: '140+' },
      { label: 'Screen Templates', value: '28' },
      { label: 'Brand Guidelines', value: '45 pgs' },
    ],
    featured: true,
    published: true,
    isConcept: true,
  },
  {
    id: 'port-3',
    slug: 'b2b-saas-platform',
    title: 'B2B SaaS Platform Redesign & Growth Pipeline',
    client: 'Nexar AI Solutions',
    category: 'Web & App Development',
    serviceSlug: 'web-app-development',
    industry: 'B2B SaaS & Tech Startups',
    year: 2025,
    thumbnail: '/portfolio/saas-dashboard.svg',
    images: ['/portfolio/saas-dashboard.svg'],
    challenge:
      'Nexar AI struggled to communicate the business ROI of its automation platform, leading to low demo booking rates on their corporate landing page.',
    approach:
      'Rebuilt the product interface and marketing site with interactive workflow visualizations, live calculation widgets, and high-clarity value propositions.',
    solution:
      'Rebuilt the product interface and marketing site with interactive workflow visualizations, live calculation widgets, and high-clarity value propositions.',
    outcome:
      'Demonstrated a 2.3x increase in demo request funnel efficiency through interactive value calculators and simplified sign-up steps.',
    deliverables: [
      'Full marketing website overhaul with product tours',
      'Interactive ROI and savings calculator',
      'Customer dashboard with real-time analytics graphs',
      'HubSpot CRM lead routing and automated scheduling',
    ],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Chart.js', 'HubSpot'],
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Chart.js', 'HubSpot'],
    tags: ['B2B SaaS', 'Web App', 'Analytics', 'Conversion'],
    metrics: [
      { label: 'Demo Request Rate', value: '2.3x' },
      { label: 'Time on Page', value: '+78%' },
      { label: 'Bounce Rate', value: '-28%' },
    ],
    featured: true,
    published: true,
    isConcept: true,
  },
  {
    id: 'port-4',
    slug: 'ai-chatbot-demo',
    title: '24/7 Intelligent Customer Assistant & CRM Sync',
    client: 'Apex Logistics & Freight',
    category: 'AI & Automation',
    serviceSlug: 'ai-automation',
    industry: 'Customer Support & Invoicing Automation',
    year: 2025,
    thumbnail: '/portfolio/ai-chatbot.svg',
    images: ['/portfolio/ai-chatbot.svg'],
    challenge:
      'Customer support teams were overwhelmed by repetitive tracking inquiries, rate requests, and delivery status calls across multiple regional hubs.',
    approach:
      'Deployed an AI assistant trained on proprietary route databases and pricing logic, integrated directly into WhatsApp Business and internal tracking systems.',
    solution:
      'Deployed an AI assistant trained on proprietary route databases and pricing logic, integrated directly into WhatsApp Business and internal tracking systems.',
    outcome:
      'Demonstrated capability to automate 85%+ of repetitive shipment tracking requests with sub-1.5s latency and seamless agent handoff.',
    deliverables: [
      'Custom LLM chatbot with vector semantic search',
      'Official WhatsApp Business API integration',
      'Automated rate calculation and quotation generator',
      'Instant human handoff trigger for complex freight deals',
    ],
    technologies: ['Python', 'OpenAI API', 'FastAPI', 'WhatsApp Cloud API', 'PostgreSQL'],
    techStack: ['Python', 'OpenAI API', 'FastAPI', 'WhatsApp Cloud API', 'PostgreSQL'],
    tags: ['AI Chatbot', 'WhatsApp API', 'Automation', 'CRM'],
    metrics: [
      { label: 'Automated Queries', value: '85%+' },
      { label: 'Response Latency', value: '<1.5s' },
      { label: 'Support Deflection', value: '4.5x' },
    ],
    featured: true,
    published: true,
    isConcept: true,
  },
  {
    id: 'port-5',
    slug: 'local-seo-revamp',
    title: 'Hospitality Local SEO & Direct Booking Growth',
    client: 'Kalyan Heritage Resort & Spa',
    category: 'Digital Marketing',
    serviceSlug: 'digital-marketing',
    industry: 'Restaurants & Hyperlocal Footfall',
    year: 2024,
    thumbnail: '/portfolio/local-seo.svg',
    images: ['/portfolio/local-seo.svg'],
    challenge:
      'High dependence on Online Travel Agencies (OTAs) paying 18–22% commissions per booking was severely eroding operating margins for this heritage boutique hotel.',
    approach:
      'Executed a comprehensive local visibility sprint: Google Business Profile revamp, NAP consistency across 45+ directories, and structured review generation.',
    solution:
      'Executed a comprehensive local visibility sprint: Google Business Profile revamp, NAP consistency across 45+ directories, and structured review generation.',
    outcome:
      'Demonstrated local search dominance framework to capture high-intent map searches and drive direct, commission-free reservations.',
    deliverables: [
      'Complete Google Business Profile optimization and geo-tagging',
      'Local schema markup and citation distribution',
      'Automated WhatsApp guest review collection funnel',
      'Direct booking landing page with seasonal package promotions',
    ],
    technologies: ['Google Search Console', 'Ahrefs', 'Schema.org', 'WordPress'],
    techStack: ['Google Search Console', 'Ahrefs', 'Schema.org', 'WordPress'],
    tags: ['Local SEO', 'Google Maps', 'Hospitality', 'Reviews'],
    metrics: [
      { label: 'Direct Bookings', value: '+64%' },
      { label: 'Google Maps Views', value: '3.8x' },
      { label: 'OTA Commission Saved', value: '20%' },
    ],
    featured: false,
    published: true,
    isConcept: false,
  },
  {
    id: 'port-6',
    slug: 'performance-marketing-sprint',
    title: 'Omnichannel Paid Media Sprint & Creative Iteration',
    client: 'UrbanEdge Fashion',
    category: 'Digital Marketing',
    serviceSlug: 'digital-marketing',
    industry: 'E-Commerce Performance & ROAS Ads',
    year: 2024,
    thumbnail: '/portfolio/performance-marketing.svg',
    images: ['/portfolio/performance-marketing.svg'],
    challenge:
      'Rising customer acquisition costs (CAC) and ad fatigue on Meta campaigns were producing unsustainable sub-1.8x ROAS for this apparel brand.',
    approach:
      'Restructured campaign ad architecture: short-form UGC video hooks, audience segment exclusions, server-side Conversion API (CAPI) tracking, and landing page A/B tests.',
    solution:
      'Restructured campaign ad architecture: short-form UGC video hooks, audience segment exclusions, server-side Conversion API (CAPI) tracking, and landing page A/B tests.',
    outcome:
      'Standardized repeatable testing matrix to test multiple creative angles weekly while maintaining target blended return on ad spend.',
    deliverables: [
      'Full ad account restructuring across Meta & Google Performance Max',
      '12 weekly iterated UGC hook concepts and ad creatives',
      'Server-side Meta Conversions API (CAPI) setup',
      'High-velocity landing page split testing',
    ],
    technologies: ['Meta Ads Manager', 'Google Ads', 'Shopify', 'Triple Whale'],
    techStack: ['Meta Ads Manager', 'Google Ads', 'Shopify', 'Triple Whale'],
    tags: ['Meta Ads', 'Google Ads', 'ROAS', 'Paid Media'],
    metrics: [
      { label: 'Blended ROAS', value: '4.2x' },
      { label: 'Customer Acq. Cost', value: '-32%' },
      { label: 'Revenue Growth', value: '+118%' },
    ],
    featured: false,
    published: true,
    isConcept: false,
  },
];
