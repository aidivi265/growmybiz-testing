import type { PortfolioItem } from '@/types';

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'port-1',
    slug: 'ecommerce-ux-prototype',
    title: 'D2C E-commerce Experience & Checkout Optimization',
    client: 'Zenith Organics',
    category: 'Web & App Development',
    industry: 'E-Commerce & D2C Brands',
    serviceSlug: 'web-app-development',
    tags: ['Next.js', 'eCommerce', 'Conversion UX', 'Tailwind CSS', 'Razorpay'],
    thumbnail: '/portfolio/ecommerce-ux.svg',
    images: ['/portfolio/ecommerce-ux.svg'],
    isConcept: true,
    conceptDisclaimer:
      'Concept Demonstration: Prototype engineered as an architectural benchmark to demonstrate high-performance e-commerce UX, rapid checkout flows, and sub-1.2s headless storefront standards.',
    challenge:
      'High mobile bounce rate and multi-step cart abandonment on the legacy store were capping online sales growth for this botanical wellness brand.',
    approach:
      'Re-architected the customer journey around mobile-first speed, one-click bundle selections, transparent ingredient proof, and a sub-1.2s instant checkout flow.',
    deliverables: [
      'Next.js 16 Storefront with SSG product pages',
      'Mobile-optimized one-page checkout flow',
      'Razorpay & Cash on Delivery payment integration',
      'Instant search and faceted category filters',
      'Speed optimization achieving 1.1s First Contentful Paint',
    ],
    technologies: ['Next.js', 'React', 'Tailwind CSS', 'Razorpay', 'Figma'],
    outcome:
      'Demonstrated +42% mobile checkout conversion rate potential and sub-1.2s load speeds in simulated benchmark testing.',
    featured: true,
    published: true,
    year: 2025,
  },
  {
    id: 'port-2',
    slug: 'brand-identity-concept',
    title: 'Fintech Brand Identity & Scalable Design System',
    client: 'Aura Financial',
    category: 'Design & Branding',
    industry: 'Fintech & Enterprise Tech',
    serviceSlug: 'design-branding',
    tags: ['Brand Identity', 'Design System', 'Typography', 'Figma', 'Fintech'],
    thumbnail: '/portfolio/brand-identity.svg',
    images: ['/portfolio/brand-identity.svg'],
    isConcept: true,
    conceptDisclaimer:
      'Concept Demonstration: Comprehensive visual identity and design system created to illustrate institutional-grade fintech branding and modular component architecture.',
    challenge:
      'Aura Financial needed an authoritative, modern brand identity to transition from an early-stage concept into a credible commercial fintech platform.',
    approach:
      'Engineered an end-to-end design language: geometric monogram logo, high-contrast dark/light palette, editorial typography hierarchy, and a modular Figma component library.',
    deliverables: [
      'Primary, secondary and monogram logo suites',
      'Color architecture and accessibility contrast specs',
      'Typography system based on Plus Jakarta Sans and DM Sans',
      'Cross-platform UI component library in Figma',
      'Pitch deck and investor collateral design',
    ],
    technologies: ['Figma', 'Adobe Illustrator', 'Design Tokens'],
    outcome:
      'Delivered a unified, institutional-grade visual system that established immediate market credibility and investor collateral standards.',
    featured: true,
    published: true,
    year: 2025,
  },
  {
    id: 'port-3',
    slug: 'b2b-saas-platform',
    title: 'B2B SaaS Platform Redesign & Growth Pipeline',
    client: 'Nexar AI Solutions',
    category: 'Web & App Development',
    industry: 'B2B SaaS & Tech Startups',
    serviceSlug: 'web-app-development',
    tags: ['SaaS', 'Web App', 'Analytics', 'Conversion Rate', 'TypeScript'],
    thumbnail: '/portfolio/saas-dashboard.svg',
    images: ['/portfolio/saas-dashboard.svg'],
    isConcept: true,
    conceptDisclaimer:
      'Concept Demonstration: Prototype demonstrating interactive enterprise SaaS conversion design, live ROI calculators, and analytics dashboard UX.',
    challenge:
      'Nexar AI struggled to communicate the business ROI of its automation platform, leading to low demo booking rates on their corporate landing page.',
    approach:
      'Rebuilt the product interface and marketing site with interactive workflow visualizations, live calculation widgets, and high-clarity value propositions.',
    deliverables: [
      'Full marketing website overhaul with product tours',
      'Interactive ROI and savings calculator',
      'Customer dashboard with real-time analytics graphs',
      'HubSpot CRM lead routing and automated scheduling',
    ],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Chart.js', 'HubSpot'],
    outcome:
      'Demonstrated a 2.3x increase in demo request funnel efficiency through interactive value calculators and simplified sign-up steps.',
    featured: true,
    published: true,
    year: 2025,
  },
  {
    id: 'port-4',
    slug: 'ai-chatbot-demo',
    title: '24/7 Intelligent Customer Assistant & CRM Sync',
    client: 'Apex Logistics & Freight',
    category: 'AI & Automation',
    industry: 'Customer Support & Invoicing Automation',
    serviceSlug: 'ai-automation',
    tags: ['AI Assistant', 'RAG', 'WhatsApp API', 'Automation', 'CRM'],
    thumbnail: '/portfolio/ai-chatbot.svg',
    images: ['/portfolio/ai-chatbot.svg'],
    isConcept: true,
    conceptDisclaimer:
      'Concept Demonstration: AI customer support assistant architecture demonstrating RAG retrieval, WhatsApp Cloud API integration, and Tier-1 ticket deflection.',
    challenge:
      'Customer support teams were overwhelmed by repetitive tracking inquiries, rate requests, and delivery status calls across multiple regional hubs.',
    approach:
      'Deployed an AI assistant trained on proprietary route databases and pricing logic, integrated directly into WhatsApp Business and internal tracking systems.',
    deliverables: [
      'Custom LLM chatbot with vector semantic search',
      'Official WhatsApp Business API integration',
      'Automated rate calculation and quotation generator',
      'Instant human handoff trigger for complex freight deals',
    ],
    technologies: ['Python', 'OpenAI API', 'FastAPI', 'WhatsApp Cloud API', 'PostgreSQL'],
    outcome:
      'Demonstrated capability to automate 85%+ of repetitive shipment tracking requests with sub-1.5s latency and seamless agent handoff.',
    featured: true,
    published: true,
    year: 2025,
  },
  {
    id: 'port-5',
    slug: 'local-seo-revamp',
    title: 'Hospitality Local SEO & Direct Booking Growth',
    client: 'Kalyan Heritage Resort & Spa',
    category: 'Digital Marketing',
    industry: 'Cafes, Restaurants & Hospitality',
    serviceSlug: 'seo-organic-growth',
    tags: ['Local SEO', 'Google Maps', 'Hospitality', 'Organic Growth'],
    thumbnail: '/portfolio/local-seo.svg',
    images: ['/portfolio/local-seo.svg'],
    isConcept: true,
    conceptDisclaimer:
      'Concept Demonstration: Framework demonstrating multi-location Google Business Profile optimization, local citation architecture, and direct booking funnels.',
    challenge:
      'High dependence on Online Travel Agencies (OTAs) paying 18–22% commissions per booking was severely eroding operating margins for this heritage boutique hotel.',
    approach:
      'Executed a comprehensive local visibility sprint: Google Business Profile revamp, NAP consistency across 45+ directories, and structured review generation.',
    deliverables: [
      'Complete Google Business Profile optimization and geo-tagging',
      'Local schema markup and citation distribution',
      'Automated WhatsApp guest review collection funnel',
      'Direct booking landing page with seasonal package promotions',
    ],
    technologies: ['Google Search Console', 'Ahrefs', 'Schema.org', 'WordPress'],
    outcome:
      'Demonstrated local search dominance framework to capture high-intent map searches and drive direct, commission-free reservations.',
    featured: true,
    published: true,
    year: 2024,
  },
  {
    id: 'port-6',
    slug: 'performance-marketing-sprint',
    title: 'Omnichannel Paid Media Sprint & Creative Iteration',
    client: 'UrbanEdge Fashion',
    category: 'Digital Marketing',
    industry: 'E-Commerce Performance & ROAS Ads',
    serviceSlug: 'digital-marketing',
    tags: ['Meta Ads', 'Google Ads', 'ROAS', 'UGC Video', 'Performance'],
    thumbnail: '/portfolio/performance-marketing.svg',
    images: ['/portfolio/performance-marketing.svg'],
    isConcept: true,
    conceptDisclaimer:
      'Concept Demonstration: Paid media campaign blueprint illustrating UGC video hook testing, server-side CAPI tracking, and landing page conversion optimization.',
    challenge:
      'Rising customer acquisition costs (CAC) and ad fatigue on Meta campaigns were producing unsustainable sub-1.8x ROAS for this apparel brand.',
    approach:
      'Restructured campaign ad architecture: short-form UGC video hooks, audience segment exclusions, server-side Conversion API (CAPI) tracking, and landing page A/B tests.',
    deliverables: [
      'Full ad account restructuring across Meta & Google Performance Max',
      '12 weekly iterated UGC hook concepts and ad creatives',
      'Server-side Meta Conversions API (CAPI) setup',
      'High-velocity landing page split testing',
    ],
    technologies: ['Meta Ads Manager', 'Google Ads', 'Shopify', 'Triple Whale'],
    outcome:
      'Standardized repeatable testing matrix to test multiple creative angles weekly while maintaining target blended return on ad spend.',
    featured: true,
    published: true,
    year: 2024,
  },
];

export const portfolioCategories = [
  'All',
  'Web & App Development',
  'Design & Branding',
  'Digital Marketing',
  'AI & Automation',
];
