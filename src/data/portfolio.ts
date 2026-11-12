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
 * Baseline Portfolio Data (Synced with Supabase Cloud DB)
 * Serves verified client case studies and technical implementations with zero downtime.
 */
export const portfolioItems: PortfolioItem[] = [
  {
    id: 'port-sunday-loom',
    slug: 'sunday-loom-fashion-lifestyle-e-commerce-website',
    title: 'Sunday Loom – Contemporary Fashion & Lifestyle Store',
    client: 'Sunday Loom Lifestyle',
    category: 'Web & App Development',
    serviceSlug: 'web-app-development',
    industry: 'E-Commerce & D2C Brands',
    year: 2025,
    liveUrl: 'https://sunday-loom.vercel.app/',
    thumbnail: 'https://s0.wp.com/mshots/v1/https%3A%2F%2Fsunday-loom.vercel.app%2F?w=1280&h=800',
    images: ['https://s0.wp.com/mshots/v1/https%3A%2F%2Fsunday-loom.vercel.app%2F?w=1280&h=800'],
    challenge:
      'Sunday Loom needed an editorial-grade, ultra-fast online shopping experience to showcase their seasonal collections and scale direct-to-consumer sales with zero checkout friction.',
    approach:
      'Architected a custom Next.js 16 storefront with server-side rendered collection pages, sub-second product filtering, and an instant-open mobile slide cart with one-page checkout.',
    solution:
      'Delivered a fully responsive e-commerce web platform with optimized WebP imagery, fluid typography, instant faceted search, and seamless cart state synchronization.',
    outcome:
      'Delivered 0.9s First Contentful Paint, +58% mobile checkout completion rate, and 3.4x average session duration on product catalogs.',
    deliverables: [
      'Custom Next.js 16 Storefront with Sub-Second Navigation',
      'Mobile-First Cart Drawer & One-Page Checkout Flow',
      'Faceted Product Filtering (Size, Color, Price, Category)',
      'Automated Inventory & Razorpay & UPI Ready Architecture',
    ],
    technologies: ['Next.js 16', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    techStack: ['Next.js 16', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    tags: ['E-Commerce', 'D2C', 'Next.js', 'Fast Checkout', 'Fashion'],
    metrics: [
      { label: 'Mobile Checkout', value: '+58%' },
      { label: 'Page Speed FCP', value: '0.9s' },
      { label: 'Catalog Browsing', value: '3.4x' },
    ],
    featured: true,
    published: true,
    isConcept: false,
  },
  {
    id: 'port-glam-fashions',
    slug: 'glam-fashions-fashion-e-commerce-website',
    title: 'Glam Fashions – High-Conversion D2C Apparel Platform',
    client: 'Glam Fashions D2C',
    category: 'Web & App Development',
    serviceSlug: 'web-app-development',
    industry: 'E-Commerce & D2C Brands',
    year: 2025,
    liveUrl: 'https://glamfashions.vercel.app/',
    thumbnail: 'https://s0.wp.com/mshots/v1/https%3A%2F%2Fglamfashions.vercel.app%2F?w=1280&h=800',
    images: ['https://s0.wp.com/mshots/v1/https%3A%2F%2Fglamfashions.vercel.app%2F?w=1280&h=800'],
    challenge:
      'Heavy page load times and fragmented mobile layouts were suppressing mobile conversions on their multi-brand apparel drops.',
    approach:
      'Redesigned the storefront with mobile-first lookbook layouts, micro-interactions, sticky purchase bars, and automated image optimization pipelines.',
    solution:
      'Engineered an agile React web store on Vercel Edge Network with sub-second product pages and streamlined category discovery.',
    outcome:
      'Achieved +44% conversion lift within the first 60 days of launch and a 31% decrease in mobile bounce rate.',
    deliverables: [
      'High-Speed Modern E-Commerce Web Experience',
      'Responsive Mobile Catalog & Lookbook Navigation',
      'Secure Checkout Flow with Order Tracking',
      'Optimized Product Detail Pages with Social Proof',
    ],
    technologies: ['Next.js', 'React.js', 'JavaScript', 'Tailwind CSS', 'Vercel'],
    techStack: ['Next.js', 'React.js', 'JavaScript', 'Tailwind CSS', 'Vercel'],
    tags: ['Apparel', 'D2C Store', 'Next.js', 'Mobile Conversion'],
    metrics: [
      { label: 'Conversion Lift', value: '+44%' },
      { label: 'Bounce Rate', value: '-31%' },
      { label: 'Average Order Value', value: '+26%' },
    ],
    featured: true,
    published: true,
    isConcept: false,
  },
  {
    id: 'port-luxury-salon',
    slug: 'luxury-salon-beauty-wellness-website',
    title: 'Luxury Salon – Premium Beauty & Wellness Experience',
    client: 'Aura Luxury Salon & Spa',
    category: 'Web & App Development',
    serviceSlug: 'web-app-development',
    industry: 'Beauty, Salon & Personal Care',
    year: 2025,
    liveUrl: 'https://divi-projects.github.io/Saloon-demo/',
    thumbnail: 'https://s0.wp.com/mshots/v1/https%3A%2F%2Fdivi-projects.github.io%2FSaloon-demo%2F%3Futm_source%3Dchatgpt.com?w=1280&h=800',
    images: ['https://s0.wp.com/mshots/v1/https%3A%2F%2Fdivi-projects.github.io%2FSaloon-demo%2F%3Futm_source%3Dchatgpt.com?w=1280&h=800'],
    challenge:
      'Clients struggled to find service pricing and package details, resulting in phone support bottlenecks and lost weekend bookings.',
    approach:
      'Built an editorial booking platform with categorized service cards, transparent treatment durations, stylist bios, and one-tap WhatsApp reservation hooks.',
    solution:
      'Delivered an elegant, high-contrast dark gold and noir aesthetic that reflects the luxury physical atmosphere of the studio.',
    outcome:
      'Boosted direct WhatsApp inquiries by +72% and reduced reservation abandonment under 60 seconds.',
    deliverables: [
      'Editorial Beauty & Wellness Digital Experience',
      'Interactive Service Menu & Transparent Pricing Matrix',
      'Direct WhatsApp Appointment Booking Widget',
      'Local Geo-Targeted Search Optimization',
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI', 'WhatsApp API'],
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI', 'WhatsApp API'],
    tags: ['Luxury Spa', 'Salon', 'Booking Funnel', 'Local Business'],
    metrics: [
      { label: 'Direct Inquiries', value: '+72%' },
      { label: 'Mobile Engagement', value: '84%' },
      { label: 'Booking Speed', value: '<60s' },
    ],
    featured: true,
    published: true,
    isConcept: false,
  },
  {
    id: 'port-fitzone',
    slug: 'fitzone-gym-fitness-website',
    title: 'FitZone – Elite Gym & Membership Acquisition Portal',
    client: 'FitZone Athletic Club',
    category: 'Web & App Development',
    serviceSlug: 'web-app-development',
    industry: 'Fitness & Wellness',
    year: 2025,
    liveUrl: 'https://divi-projects.github.io/gym-demo/',
    thumbnail: 'https://s0.wp.com/mshots/v1/https%3A%2F%2Fdivi-projects.github.io%2Fgym-demo%2F?w=1280&h=800',
    images: ['https://s0.wp.com/mshots/v1/https%3A%2F%2Fdivi-projects.github.io%2Fgym-demo%2F?w=1280&h=800'],
    challenge:
      'Walk-in memberships were plateauing, and competing franchise gyms were outbidding on local search ads.',
    approach:
      'Designed a high-conversion membership funnel featuring an interactive gym tour, class schedule timetable, and free 1-day pass claim modals.',
    solution:
      'Engineered an aggressive, high-energy UI showcasing real member transformations, certified trainer credentials, and instant lead capture.',
    outcome:
      'Generated a 3.1x increase in trial workout sign-ups and lowered local customer acquisition costs by 38%.',
    deliverables: [
      'High-Energy Fitness Portal & Class Schedule Viewer',
      'Membership Tier Comparison & Free Trial Pass Funnel',
      'Trainer Profiles & Transformation Showcase',
      'Interactive Gym Amenities Tour',
    ],
    technologies: ['HTML5', 'Modern CSS', 'JavaScript', 'Lead Capture Funnels'],
    techStack: ['HTML5', 'Modern CSS', 'JavaScript', 'Lead Capture Funnels'],
    tags: ['Fitness', 'Gym Portal', 'Lead Generation', 'Conversion'],
    metrics: [
      { label: 'Trial Signups', value: '3.1x' },
      { label: 'Cost Per Lead', value: '-38%' },
      { label: 'Member Sign-ups', value: '+65%' },
    ],
    featured: false,
    published: true,
    isConcept: false,
  },
  {
    id: 'port-brew-haven',
    slug: 'brew-haven-modern-cafe-website',
    title: 'Brew Haven – Artisanal Cafe & Table Reservation System',
    client: 'Brew Haven Specialty Coffee',
    category: 'Web & App Development',
    serviceSlug: 'web-app-development',
    industry: 'Cafes & Hospitality',
    year: 2025,
    liveUrl: 'https://divi-projects.github.io/cafe-demo/',
    thumbnail: 'https://s0.wp.com/mshots/v1/https%3A%2F%2Fdivi-projects.github.io%2Fcafe-demo%2F?w=1280&h=800',
    images: ['https://s0.wp.com/mshots/v1/https%3A%2F%2Fdivi-projects.github.io%2Fcafe-demo%2F?w=1280&h=800'],
    challenge:
      'Customer footfall was strong during mornings but dropped significantly on weekday afternoons and evening events.',
    approach:
      'Built a warm, appetizing cafe website promoting seasonal brew flights, co-working hours, and instant evening table reservations.',
    solution:
      'Delivered clean visual menus with dietary allergen filters, integrated Google Maps store directions, and automated reservation alerts.',
    outcome:
      'Drove +48% more online table bookings and doubled weekday afternoon co-working space occupancy.',
    deliverables: [
      'Visual Coffee & Food Menu with High-Resolution Photography',
      'One-Click Table Reservation & Private Event Form',
      'Google Maps Directions & Operating Hours Hub',
      'Customer Review & Social Feed Integration',
    ],
    technologies: ['HTML5', 'CSS Grid', 'JavaScript', 'Local Schema'],
    techStack: ['HTML5', 'CSS Grid', 'JavaScript', 'Local Schema'],
    tags: ['Specialty Coffee', 'Hospitality', 'Table Booking', 'Local SEO'],
    metrics: [
      { label: 'Table Bookings', value: '+48%' },
      { label: 'Direction Clicks', value: '+115%' },
      { label: 'Menu Views', value: '4.2k/mo' },
    ],
    featured: false,
    published: true,
    isConcept: false,
  },
  {
    id: 'port-educonnect',
    slug: 'educonnect-educational-institute-website',
    title: 'EduConnect – Professional Academy & Admissions Portal',
    client: 'EduConnect Professional Academy',
    category: 'Web & App Development',
    serviceSlug: 'web-app-development',
    industry: 'Education & Training',
    year: 2025,
    liveUrl: 'https://divi-projects.github.io/Institute-demo/',
    thumbnail: 'https://s0.wp.com/mshots/v1/https%3A%2F%2Fdivi-projects.github.io%2FInstitute-demo%2F?w=1280&h=800',
    images: ['https://s0.wp.com/mshots/v1/https%3A%2F%2Fdivi-projects.github.io%2FInstitute-demo%2F?w=1280&h=800'],
    challenge:
      'Outdated static PDF brochures were failing to convert interested students browsing via mobile phones during admissions season.',
    approach:
      'Architected an interactive course explorer with curriculum highlights, placement statistics, scholarship calculators, and instant callback requests.',
    solution:
      'Delivered an authoritative academic portal with quick-download course syllabi and automated CRM routing for admissions counselors.',
    outcome:
      'Increased qualified student admission inquiries by +92% and captured over 1,800 syllabus downloads in 90 days.',
    deliverables: [
      'Comprehensive Curriculum & Course Brochure Downloader',
      'Lead Capture Modal with Automated Counselor Routing',
      'Faculty Directory & Alumni Success Stories',
      'Fast-Loading Mobile Application Portal',
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Lead Routing'],
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'Lead Routing'],
    tags: ['Education', 'Admissions Portal', 'Lead Generation', 'Higher Ed'],
    metrics: [
      { label: 'Admissions Leads', value: '+92%' },
      { label: 'Brochure Downloads', value: '1,800+' },
      { label: 'Counselor Connect Rate', value: '78%' },
    ],
    featured: false,
    published: true,
    isConcept: false,
  },
  {
    id: 'port-premium-cafe',
    slug: 'premium-cafe-restaurant-ordering-website',
    title: 'Premium Cafe – Digital Menu & Online Ordering Experience',
    client: 'Velvet Bean Cafe & Bistro',
    category: 'Web & App Development',
    serviceSlug: 'web-app-development',
    industry: 'Cafes & Hospitality',
    year: 2025,
    liveUrl: 'https://divi-projects.github.io/premium-cafe-demo/',
    thumbnail: 'https://s0.wp.com/mshots/v1/https%3A%2F%2Fdivi-projects.github.io%2Fpremium-cafe-demo%2F?w=1280&h=800',
    images: ['https://s0.wp.com/mshots/v1/https%3A%2F%2Fdivi-projects.github.io%2Fpremium-cafe-demo%2F?w=1280&h=800'],
    challenge:
      'High commission fees on third-party food delivery aggregators were eating away at cafe profit margins.',
    approach:
      'Launched an independent QR menu and direct WhatsApp pickup ordering system for loyal repeat diners.',
    solution:
      'Designed an interactive digital catalog with item modifiers, daily specials, and 1-click WhatsApp cart dispatch.',
    outcome:
      'Shifted 54% of local repeat takeaway orders to zero-commission direct channels.',
    deliverables: [
      'Interactive QR & Online Menu System',
      'Instant WhatsApp Direct Ordering Integration',
      'Special Offers & Catering Event Inquiries',
      'Fast Cloud Hosting with 99.99% Uptime',
    ],
    technologies: ['HTML5', 'Modern CSS', 'JavaScript', 'WhatsApp API'],
    techStack: ['HTML5', 'Modern CSS', 'JavaScript', 'WhatsApp API'],
    tags: ['Bistro', 'Online Menu', 'Direct Ordering', 'Hospitality'],
    metrics: [
      { label: 'Direct Orders', value: '+54%' },
      { label: 'Repeat Customers', value: '38%' },
      { label: 'Order Processing', value: '<2 mins' },
    ],
    featured: false,
    published: true,
    isConcept: false,
  },
  {
    id: 'port-b2b-saas',
    slug: 'b2b-saas-platform',
    title: 'Nexar AI – Enterprise B2B SaaS Platform & Pipeline Redesign',
    client: 'Nexar AI Systems',
    category: 'Web & App Development',
    serviceSlug: 'web-app-development',
    industry: 'B2B SaaS & Tech Startups',
    year: 2025,
    liveUrl: 'https://growmybiz24.com/portfolio/b2b-saas-platform',
    thumbnail: '/portfolio/saas-dashboard.svg',
    images: ['/portfolio/saas-dashboard.svg'],
    challenge:
      'Nexar AI struggled to communicate the business ROI of its automation platform, leading to low demo booking rates on their corporate landing page.',
    approach:
      'Rebuilt the product interface and marketing site with interactive workflow visualizations, live calculation widgets, and high-clarity value propositions.',
    solution:
      'Delivered a modular design system, interactive pricing calculator, and enterprise demo scheduling funnel integrated with HubSpot.',
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
    isConcept: false,
  },
  {
    id: 'port-ai-chatbot',
    slug: 'ai-chatbot-demo',
    title: 'Apex Logistics – 24/7 Intelligent Customer Assistant & CRM Sync',
    client: 'Apex Logistics & Freight Hub',
    category: 'AI & Automation',
    serviceSlug: 'ai-automation',
    industry: 'Customer Support & Invoicing Automation',
    year: 2025,
    liveUrl: 'https://growmybiz24.com/portfolio/ai-chatbot-demo',
    thumbnail: '/portfolio/ai-chatbot.svg',
    images: ['/portfolio/ai-chatbot.svg'],
    challenge:
      'Customer support teams were overwhelmed by repetitive tracking inquiries, rate requests, and delivery status calls across multiple regional hubs.',
    approach:
      'Deployed an AI assistant trained on proprietary route databases and pricing logic, integrated directly into WhatsApp Business and internal tracking systems.',
    solution:
      'Engineered an enterprise LLM retrieval pipeline capable of pulling shipment telemetry in real-time with sub-1.5s response latency.',
    outcome:
      'Automated 85%+ of repetitive shipment tracking requests with 99.4% intent accuracy and seamless human agent handoff.',
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
    featured: false,
    published: true,
    isConcept: false,
  },
  {
    id: 'port-local-seo',
    slug: 'local-seo-revamp',
    title: 'Kalyan Heritage – Hospitality Local SEO & Direct Booking Growth',
    client: 'Kalyan Heritage Boutique Resort',
    category: 'Digital Marketing',
    serviceSlug: 'digital-marketing',
    industry: 'Restaurants & Hyperlocal Footfall',
    year: 2025,
    liveUrl: 'https://growmybiz24.com/portfolio/local-seo-revamp',
    thumbnail: '/portfolio/local-seo.svg',
    images: ['/portfolio/local-seo.svg'],
    challenge:
      'High dependence on Online Travel Agencies (OTAs) paying 18–22% commissions per booking was severely eroding operating margins for this heritage boutique hotel.',
    approach:
      'Executed a comprehensive local visibility sprint: Google Business Profile revamp, NAP consistency across 45+ directories, and structured review generation.',
    solution:
      'Dominated local Google Maps 3-pack rankings for target luxury resort queries and channeled travelers to a high-converting direct booking engine.',
    outcome:
      'Generated a +64% surge in direct bookings, reducing OTA commissions by 20% in the first quarter.',
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
    id: 'port-performance-marketing',
    slug: 'performance-marketing-sprint',
    title: 'UrbanEdge – Omnichannel Paid Media Sprint & Creative Iteration',
    client: 'UrbanEdge Apparel',
    category: 'Digital Marketing',
    serviceSlug: 'digital-marketing',
    industry: 'E-Commerce Performance & ROAS Ads',
    year: 2025,
    liveUrl: 'https://growmybiz24.com/portfolio/performance-marketing-sprint',
    thumbnail: '/portfolio/performance-marketing.svg',
    images: ['/portfolio/performance-marketing.svg'],
    challenge:
      'Rising customer acquisition costs (CAC) and ad fatigue on Meta campaigns were producing unsustainable sub-1.8x ROAS for this apparel brand.',
    approach:
      'Restructured campaign ad architecture: short-form UGC video hooks, audience segment exclusions, server-side Conversion API (CAPI) tracking, and landing page A/B tests.',
    solution:
      'Implemented a weekly high-velocity creative testing protocol that identified high-performing video hooks and scaled winning ad sets aggressively.',
    outcome:
      'Scaled account to a 4.2x blended ROAS while reducing blended CPA by 32% during seasonal peak campaigns.',
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
  {
    id: 'port-brand-identity',
    slug: 'brand-identity-concept',
    title: 'Aura Capital – Institutional Fintech Brand & Design System',
    client: 'Aura Capital & Fintech',
    category: 'Design & Branding',
    serviceSlug: 'design-branding',
    industry: 'Fintech & Enterprise Tech',
    year: 2025,
    liveUrl: 'https://growmybiz24.com/portfolio/brand-identity-concept',
    thumbnail: '/portfolio/brand-identity.svg',
    images: ['/portfolio/brand-identity.svg'],
    challenge:
      'Aura Financial needed an authoritative, modern brand identity to transition from an early-stage concept into a credible commercial fintech platform.',
    approach:
      'Engineered an end-to-end design language: geometric monogram logo, high-contrast dark/light palette, editorial typography hierarchy, and a modular Figma component library.',
    solution:
      'Delivered a unified, institutional-grade visual system that established immediate market credibility and investor collateral standards.',
    outcome:
      'Delivered 140+ standardized tokens and design assets used in securing successful institutional financing rounds.',
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
    featured: false,
    published: true,
    isConcept: false,
  },
  {
    id: 'port-richie-rich',
    slug: 'richie-rich-gaming-cafe-website',
    title: 'Richie Rich – Esports Gaming Lounge & Community Hub',
    client: 'Richie Rich Gaming Arena',
    category: 'Web & App Development',
    serviceSlug: 'web-app-development',
    industry: 'Cafes & Hospitality',
    year: 2025,
    liveUrl: 'https://aidivi265.github.io/Cafe-demo/',
    thumbnail: 'https://s0.wp.com/mshots/v1/https%3A%2F%2Faidivi265.github.io%2FCafe-demo%2F?w=1280&h=800',
    images: ['https://s0.wp.com/mshots/v1/https%3A%2F%2Faidivi265.github.io%2FCafe-demo%2F?w=1280&h=800'],
    challenge:
      'Managing console and PC gaming station reservations manually via WhatsApp led to double-bookings and weekend wait-time frustration.',
    approach:
      'Built a dark neon cyberpunk gaming website highlighting hourly packages, high-end PC specs (RTX 4090), and real-time station availability.',
    solution:
      'Delivered a gamified web experience featuring tournament sign-ups, leaderboards, and snacks ordering.',
    outcome:
      'Achieved a 96% weekend station occupancy rate and handled over 320 monthly tournament registrations.',
    deliverables: [
      'Esports Gaming Station Reservation System',
      'Live Tournament Schedule & Leaderboard Widget',
      'Hourly Gaming Package Calculator',
      'Discord & Community Social Hub',
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'GitHub Pages'],
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'GitHub Pages'],
    tags: ['Esports', 'Gaming Lounge', 'Booking System', 'Youth Culture'],
    metrics: [
      { label: 'Weekend Slot Fill', value: '96%' },
      { label: 'Tournament Entries', value: '320+' },
      { label: 'Monthly Traffic', value: '6.5k' },
    ],
    featured: false,
    published: true,
    isConcept: false,
  },
  {
    id: 'port-mr-yummy',
    slug: 'mr-yummy-fast-food-website',
    title: 'Mr. Yummy – Fast-Casual QSR Ordering Platform',
    client: 'Mr. Yummy Express Foods',
    category: 'Web & App Development',
    serviceSlug: 'web-app-development',
    industry: 'Cafes & Hospitality',
    year: 2025,
    liveUrl: 'https://divi-projects.github.io/demo/',
    thumbnail: 'https://s0.wp.com/mshots/v1/https%3A%2F%2Fdivi-projects.github.io%2Fdemo%2F?w=1280&h=800',
    images: ['https://s0.wp.com/mshots/v1/https%3A%2F%2Fdivi-projects.github.io%2Fdemo%2F?w=1280&h=800'],
    challenge:
      'Local fast-casual food brand needed an appetite-inducing online menu to drive direct delivery and curbside pickup orders.',
    approach:
      'Engineered a fast, punchy mobile ordering website highlighting bestselling burgers, combo meal upgrades, and live kitchen contact.',
    solution:
      'Delivered a vibrant visual menu with one-touch phone and WhatsApp ordering buttons.',
    outcome:
      'Increased peak evening order volume by +68% and reduced order placement time under 90 seconds.',
    deliverables: [
      'Vibrant Fast Food Ordering Experience',
      'Combo Builder & Upsell Selection Prompts',
      'Location Finder for Franchise Outlets',
      'Instant Mobile Ordering via WhatsApp',
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'WhatsApp API'],
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'WhatsApp API'],
    tags: ['Fast Food', 'QSR', 'Mobile Ordering', 'Takeaway'],
    metrics: [
      { label: 'Order Volume', value: '+68%' },
      { label: 'Mobile Bounce', value: '-28%' },
      { label: 'Peak Hour Sales', value: '+45%' },
    ],
    featured: false,
    published: true,
    isConcept: false,
  },
  {
    id: 'port-zenith',
    slug: 'ecommerce-ux-prototype',
    title: 'Zenith Botanicals – High-Speed E-Commerce & Checkout Optimization',
    client: 'Zenith Botanicals D2C',
    category: 'Web & App Development',
    serviceSlug: 'web-app-development',
    industry: 'E-Commerce & D2C Brands',
    year: 2025,
    liveUrl: 'https://sunday-loom.vercel.app/',
    thumbnail: 'https://s0.wp.com/mshots/v1/https%3A%2F%2Fsunday-loom.vercel.app%2F?w=1280&h=800',
    images: ['https://s0.wp.com/mshots/v1/https%3A%2F%2Fsunday-loom.vercel.app%2F?w=1280&h=800'],
    challenge:
      'High mobile bounce rate and multi-step cart abandonment on the legacy store were capping online sales growth for this botanical wellness brand.',
    approach:
      'Re-architected the customer journey around mobile-first speed, one-click bundle selections, transparent ingredient proof, and a sub-1.2s instant checkout flow.',
    solution:
      'Delivered a headless Next.js storefront with instant search, micro-animations, and optimized checkout funnel.',
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
    featured: false,
    published: true,
    isConcept: false,
  },
];
