export interface EstimatorPlatform {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  badge?: string;
  basePriceINR: number;
  basePriceUSD: number;
  baseWeeks: number;
}

export interface EstimatorServiceCategory {
  id: string;
  title: string;
  slug: string;
  icon: string;
  tagline: string;
  platforms: EstimatorPlatform[];
}

export interface EstimatorDesignTier {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  additionalPriceINR: number;
  additionalPriceUSD: number;
  multiplier: number;
  badge?: string;
}

export interface EstimatorFeature {
  id: string;
  title: string;
  description: string;
  category: 'core' | 'commerce' | 'automation' | 'growth' | 'infrastructure';
  icon: string;
  priceINR: number;
  priceUSD: number;
  recommendedFor?: string[]; // category IDs where it's recommended
}

export interface EstimatorTimeline {
  id: string;
  title: string;
  durationLabel: string;
  multiplier: number;
  badge?: string;
  description: string;
}

export interface EstimatorConfig {
  version: string;
  lastUpdated: string;
  exchangeRateUsdToInr: number;
  categories: EstimatorServiceCategory[];
  designTiers: EstimatorDesignTier[];
  features: EstimatorFeature[];
  timelines: EstimatorTimeline[];
}

export const defaultEstimatorConfig: EstimatorConfig = {
  version: '2026.1',
  lastUpdated: new Date().toISOString(),
  exchangeRateUsdToInr: 85,
  categories: [
    {
      id: 'web-dev',
      title: 'Web & App Development',
      slug: 'web-app-development',
      icon: 'Code2',
      tagline: 'High-performance websites, e-commerce stores & custom SaaS applications.',
      platforms: [
        {
          id: 'business-website',
          title: 'High-Impact Business Website',
          subtitle: 'Corporate & Lead Generation',
          description: 'Custom responsive web experience with blazing performance, modern animation, and SEO architecture.',
          icon: 'Globe',
          badge: 'Most Popular',
          basePriceINR: 35000,
          basePriceUSD: 420,
          baseWeeks: 3,
        },
        {
          id: 'ecommerce-store',
          title: 'Full-Featured E-Commerce Store',
          subtitle: 'Shopify / WooCommerce / Custom',
          description: 'High-converting online store with frictionless checkout, payment gateway, inventory, and cart recovery.',
          icon: 'ShoppingCart',
          badge: 'High ROI',
          basePriceINR: 55000,
          basePriceUSD: 650,
          baseWeeks: 4,
        },
        {
          id: 'web-app-saas',
          title: 'Custom Web Application / SaaS',
          subtitle: 'Next.js, Supabase & Cloud Backend',
          description: 'Full-stack platform with user dashboards, complex relational data, RBAC, and subscription billing.',
          icon: 'AppWindow',
          badge: 'Enterprise',
          basePriceINR: 75000,
          basePriceUSD: 890,
          baseWeeks: 6,
        },
        {
          id: 'mobile-app',
          title: 'Cross-Platform Mobile App',
          subtitle: 'iOS & Android (Flutter / React Native)',
          description: 'Native performance mobile application with offline caching, push notifications, and app store submission.',
          icon: 'Smartphone',
          basePriceINR: 90000,
          basePriceUSD: 1060,
          baseWeeks: 7,
        },
      ],
    },
    {
      id: 'ai-automation',
      title: 'AI & Business Automation',
      slug: 'ai-automation',
      icon: 'Bot',
      tagline: 'Autonomous AI agents, custom RAG LLM workflows & WhatsApp automation.',
      platforms: [
        {
          id: 'ai-support-agent',
          title: '24/7 AI Customer Support Bot',
          subtitle: 'Web Widget & WhatsApp Integration',
          description: 'Conversational assistant trained on your products, handling queries and capturing qualified leads automatically.',
          icon: 'MessageSquare',
          badge: '24/7 Live',
          basePriceINR: 35000,
          basePriceUSD: 420,
          baseWeeks: 2,
        },
        {
          id: 'ai-knowledge-rag',
          title: 'Custom Enterprise RAG Knowledge Base',
          subtitle: 'LLM Document Search & Wiki Assistant',
          description: 'Private semantic AI agent indexing PDFs, Notion, Google Docs, and internal knowledge with citation accuracy.',
          icon: 'Cpu',
          badge: 'Advanced AI',
          basePriceINR: 60000,
          basePriceUSD: 720,
          baseWeeks: 4,
        },
        {
          id: 'crm-workflow-automation',
          title: 'Multi-App Workflow Automation Engine',
          subtitle: 'Make / Zapier / Custom Webhooks',
          description: 'Seamless data sync between website inquiries, HubSpot, Google Sheets, Slack, and instant WhatsApp alerts.',
          icon: 'Workflow',
          basePriceINR: 38000,
          basePriceUSD: 450,
          baseWeeks: 2,
        },
        {
          id: 'ai-lead-engine',
          title: 'Autonomous AI Lead Qualifier',
          subtitle: 'Interactive Forms & Smart Scoring',
          description: 'Multi-step qualification agent that scores incoming prospects and books strategy meetings directly.',
          icon: 'Zap',
          basePriceINR: 48000,
          basePriceUSD: 570,
          baseWeeks: 3,
        },
      ],
    },
    {
      id: 'design-branding',
      title: 'Design & Brand Identity',
      slug: 'design-branding',
      icon: 'Palette',
      tagline: 'Distinctive visual identity, Figma UI/UX prototypes & enterprise design systems.',
      platforms: [
        {
          id: 'brand-identity',
          title: 'Complete Brand Identity System',
          subtitle: 'Logo, Typography & Brand Book',
          description: 'End-to-end corporate branding, visual tokens, color theory, social templates, and usage guidelines.',
          icon: 'Sparkles',
          badge: 'Brand Core',
          basePriceINR: 28000,
          basePriceUSD: 330,
          baseWeeks: 2,
        },
        {
          id: 'uiux-prototype',
          title: 'High-Fidelity UI/UX Product Design',
          subtitle: 'Figma Interactive Prototype (10+ Screens)',
          description: 'User-tested wireframes, bespoke design components, interactive micro-animations, and developer handoff.',
          icon: 'Layout',
          badge: 'Product Ready',
          basePriceINR: 42000,
          basePriceUSD: 500,
          baseWeeks: 3,
        },
        {
          id: 'design-system',
          title: 'Scalable Enterprise Design System',
          subtitle: 'Tokenized UI Kit & Component Library',
          description: 'Reusable Figma library with tokenized code-ready components, responsive variants, and dark/light modes.',
          icon: 'Layers',
          basePriceINR: 58000,
          basePriceUSD: 690,
          baseWeeks: 4,
        },
        {
          id: 'pitch-deck-kit',
          title: 'Investor Pitch Deck & Marketing Kit',
          subtitle: 'High-Ticket Presentation & Collateral',
          description: 'Persuasive 15-20 slide investor deck with custom 3D graphics, diagrams, and print-ready one-pagers.',
          icon: 'FileText',
          basePriceINR: 22000,
          basePriceUSD: 260,
          baseWeeks: 2,
        },
      ],
    },
    {
      id: 'digital-marketing',
      title: 'Digital Marketing & SEO',
      slug: 'digital-marketing',
      icon: 'TrendingUp',
      tagline: 'Aggressive search engine domination, high-ROI paid ads & conversion optimization.',
      platforms: [
        {
          id: 'seo-architecture',
          title: 'Technical & Organic SEO Architecture',
          subtitle: 'Rankings, Structured Schemas & Core Vitals',
          description: 'Comprehensive keyword gap analysis, high-intent page architecture, schema markup, and backlink audit.',
          icon: 'Search',
          badge: 'Long-term Asset',
          basePriceINR: 35000,
          basePriceUSD: 420,
          baseWeeks: 3,
        },
        {
          id: 'paid-ads-funnel',
          title: 'High-ROI Paid Ads Engine (Meta & Google)',
          subtitle: 'Creative Testing, Pixel Setup & Tracking',
          description: 'High-converting ad creatives, audience lookalikes, conversion tracking, and campaign optimization.',
          icon: 'Target',
          badge: 'Fast Traffic',
          basePriceINR: 32000,
          basePriceUSD: 380,
          baseWeeks: 2,
        },
        {
          id: 'cro-funnel-audit',
          title: 'Conversion Rate Optimization (CRO)',
          subtitle: 'Heatmap Tracking, Funnel Fixes & A/B Tests',
          description: 'Deep funnel diagnostic identifying drop-off friction, copy rewrites, and landing page conversion lifts.',
          icon: 'Gauge',
          basePriceINR: 26000,
          basePriceUSD: 310,
          baseWeeks: 2,
        },
        {
          id: 'local-seo-domination',
          title: 'Local SEO & Multi-Location Dominance',
          subtitle: 'Google Business Profile & Review Engine',
          description: 'Geo-targeted landing pages, citation cleanups, and automated review capture for local market leadership.',
          icon: 'MapPin',
          basePriceINR: 22000,
          basePriceUSD: 260,
          baseWeeks: 2,
        },
      ],
    },
    {
      id: 'video-content',
      title: 'Video & Content Production',
      slug: 'video-content',
      icon: 'Video',
      tagline: 'High-conversion explainer videos, short-form ad creatives & content engines.',
      platforms: [
        {
          id: 'explainer-video',
          title: 'Animated 2D/3D Explainer Video',
          subtitle: '60-90s Product Showcase with Voiceover',
          description: 'Professional scriptwriting, custom storyboard illustration, professional voiceover, and kinetic motion.',
          icon: 'Film',
          badge: 'High Conversion',
          basePriceINR: 36000,
          basePriceUSD: 430,
          baseWeeks: 3,
        },
        {
          id: 'social-video-pack',
          title: 'High-Converting Social Ads Bundle',
          subtitle: '10x Hook-Driven Reels / Shorts / TikToks',
          description: 'Batch production of 10 viral-formatted video creatives engineered for high engagement and low CAC.',
          icon: 'Clapperboard',
          badge: 'Content Engine',
          basePriceINR: 30000,
          basePriceUSD: 360,
          baseWeeks: 2,
        },
        {
          id: 'product-demo-tour',
          title: 'SaaS Interactive Product Tour Video',
          subtitle: 'High-Fidelity Screen Capture & Callouts',
          description: 'Polished walkthrough video highlighting core features, UI zooms, smooth cursors, and audio mastering.',
          icon: 'MonitorPlay',
          basePriceINR: 24000,
          basePriceUSD: 290,
          baseWeeks: 2,
        },
        {
          id: 'content-authority',
          title: 'Authority Thought Leadership Content',
          subtitle: '4x Pillar Articles + Case Studies',
          description: 'Deep-dive technical articles written by industry researchers with custom infographics and schema markup.',
          icon: 'BookOpen',
          basePriceINR: 20000,
          basePriceUSD: 240,
          baseWeeks: 2,
        },
      ],
    },
    {
      id: 'cloud-infrastructure',
      title: 'Cloud, DevOps & Solutions',
      slug: 'other-digital-services',
      icon: 'Server',
      tagline: 'Cloud migrations, database optimization, CI/CD pipelines & custom APIs.',
      platforms: [
        {
          id: 'cloud-migration',
          title: 'Cloud Infrastructure & DB Architecture',
          subtitle: 'Supabase / AWS / GCP Production Setup',
          description: 'Zero-downtime database provisioning, read replicas, RLS policy hardening, and multi-region CDN routing.',
          icon: 'Database',
          badge: 'Scale Ready',
          basePriceINR: 45000,
          basePriceUSD: 540,
          baseWeeks: 3,
        },
        {
          id: 'cicd-edge-caching',
          title: 'CI/CD Pipeline & Automated Deployments',
          subtitle: 'GitHub Actions, Vercel & Edge CDN',
          description: 'Automated staging and production deployment gates, preview branches, regression testing, and caching rules.',
          icon: 'GitBranch',
          basePriceINR: 28000,
          basePriceUSD: 340,
          baseWeeks: 2,
        },
        {
          id: 'api-integration-gateway',
          title: 'Custom API Gateway & System Integration',
          subtitle: 'REST / GraphQL Microservices',
          description: 'Secure API middleware connecting legacy backends, payment processors, ERPs, and external SaaS webhooks.',
          icon: 'Key',
          basePriceINR: 38000,
          basePriceUSD: 450,
          baseWeeks: 3,
        },
      ],
    },
  ],

  designTiers: [
    {
      id: 'baseline-mvp',
      title: 'Essential MVP / Clean Baseline',
      subtitle: 'Fast Turnaround & Core Utility',
      description: 'Streamlined design layout leveraging clean responsive grids and battle-tested components. Ideal for rapid market validation.',
      additionalPriceINR: 0,
      additionalPriceUSD: 0,
      multiplier: 1.0,
      badge: 'Fastest Launch',
    },
    {
      id: 'custom-pro',
      title: 'Custom Bespoke UI/UX',
      subtitle: 'Tailored Brand Identity & Micro-Interactions',
      description: 'Handcrafted design tailored specifically to your audience. Custom micro-animations, bespoke iconography, and multi-breakpoint polish.',
      additionalPriceINR: 20000,
      additionalPriceUSD: 240,
      multiplier: 1.25,
      badge: 'Recommended',
    },
    {
      id: 'enterprise-flagship',
      title: 'Enterprise Flagship & Design System',
      subtitle: 'World-Class Polish & Scalable Component Kit',
      description: 'High-ticket agency execution. Full Figma tokenized design system, complex state management, custom 3D/ambient visuals, and accessibility compliance.',
      additionalPriceINR: 45000,
      additionalPriceUSD: 540,
      multiplier: 1.5,
      badge: 'Enterprise Grade',
    },
  ],

  features: [
    {
      id: 'user-auth',
      title: 'User Authentication & RBAC',
      description: 'Secure JWT session tokens, Google/GitHub OAuth, role permissions, and user profile management.',
      category: 'core',
      icon: 'ShieldCheck',
      priceINR: 12000,
      priceUSD: 140,
      recommendedFor: ['web-dev', 'cloud-infrastructure'],
    },
    {
      id: 'payment-gateway',
      title: 'Payment Gateway & Subscriptions',
      description: 'Seamless Stripe / Razorpay checkout, recurring subscription billing, automatic invoice generation, and webhooks.',
      category: 'commerce',
      icon: 'CreditCard',
      priceINR: 15000,
      priceUSD: 180,
      recommendedFor: ['web-dev'],
    },
    {
      id: 'headless-cms',
      title: 'Headless CMS & Dynamic Blog',
      description: 'Real-time content management (Supabase / Sanity), rich markdown editor, media upload library, and instantaneous publishing.',
      category: 'core',
      icon: 'FileCode',
      priceINR: 14000,
      priceUSD: 165,
      recommendedFor: ['web-dev', 'design-branding'],
    },
    {
      id: 'crm-whatsapp-sync',
      title: 'CRM & Instant WhatsApp Lead Routing',
      description: 'Instant WhatsApp alert upon form submission, automatic contact sync to HubSpot or Zoho CRM with lead tags.',
      category: 'automation',
      icon: 'MessageCircle',
      priceINR: 10000,
      priceUSD: 120,
      recommendedFor: ['web-dev', 'ai-automation', 'digital-marketing'],
    },
    {
      id: 'ai-copilot',
      title: 'Embedded AI Knowledge Base / Chatbot',
      description: 'Interactive conversational assistant trained on your specific product catalogs, docs, and FAQs to convert leads 24/7.',
      category: 'automation',
      icon: 'Bot',
      priceINR: 22000,
      priceUSD: 260,
      recommendedFor: ['web-dev', 'ai-automation'],
    },
    {
      id: 'analytics-heatmaps',
      title: 'Advanced Funnel Analytics & Heatmaps',
      description: 'Google Analytics 4 custom event pipeline, Microsoft Clarity / PostHog session recording, and CRO funnel metrics.',
      category: 'growth',
      icon: 'Activity',
      priceINR: 8000,
      priceUSD: 95,
      recommendedFor: ['web-dev', 'digital-marketing'],
    },
    {
      id: 'localization',
      title: 'Multi-Lingual & Global Currency Engine',
      description: 'Automatic IP geolocation detection, real-time currency conversion (INR/USD/AED/EUR), and multi-language content switching.',
      category: 'commerce',
      icon: 'Globe',
      priceINR: 12000,
      priceUSD: 140,
      recommendedFor: ['web-dev'],
    },
    {
      id: 'seo-pro-schemas',
      title: 'Technical SEO Pro & JSON-LD Schemas',
      description: 'Automated dynamic OpenGraph social image generator, FAQPage rich snippet schema, and instant sitemap sync on publish.',
      category: 'growth',
      icon: 'Search',
      priceINR: 9000,
      priceUSD: 110,
      recommendedFor: ['web-dev', 'digital-marketing'],
    },
    {
      id: 'security-hardening',
      title: 'Cloudflare Edge Firewall & Turnstile Protection',
      description: 'Zero-friction bot prevention, DDoS protection, edge caching rules, and automated rate-limiting security headers.',
      category: 'infrastructure',
      icon: 'Lock',
      priceINR: 7000,
      priceUSD: 85,
      recommendedFor: ['web-dev', 'cloud-infrastructure'],
    },
  ],

  timelines: [
    {
      id: 'standard-pace',
      title: 'Standard Cadence',
      durationLabel: '4 - 8 Weeks',
      multiplier: 1.0,
      description: 'Optimal engineering balance with thorough review milestones, full QA iterations, and steady sprint pacing.',
    },
    {
      id: 'accelerated-sprint',
      title: 'Accelerated Priority Sprint',
      durationLabel: '2 - 4 Weeks',
      multiplier: 1.2,
      badge: 'Fast Track (+20%)',
      description: 'Priority resource allocation, parallel design & engineering cycles for time-sensitive marketing deadlines.',
    },
    {
      id: 'rapid-emergency',
      title: 'Critical Rapid Launch',
      durationLabel: 'Under 2 Weeks',
      multiplier: 1.4,
      badge: 'Rush (+40%)',
      description: 'Dedicated team sprint working in dedicated shifts to meet strict investor, funding, or product launch windows.',
    },
  ],
};
