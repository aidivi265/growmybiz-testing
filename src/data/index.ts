import type {
  SiteConfig,
  NavItem,
  HeroSlide,
  Service,
  PortfolioItem,
  ProcessStep,
  BlogPost,
  Testimonial,
  TeamMember,
  ValueProp,
  StatItem,
} from '@/types';

// ─── Site Configuration ───────────────────────────────────────────────────────
export const siteConfig: SiteConfig = {
  siteName: 'Growmybizz',
  tagline: 'Digital Growth Partner',
  description:
    'Full-service digital agency — web, design, marketing, content and AI services for businesses that want to grow.',
  email: 'hello@growmybizz.com',
  phone: '+91 00000 00000',
  address: 'India',
  social: {
    instagram: '#',
    linkedin: '#',
    twitter: '#',
    youtube: '#',
  },
};

// ─── Navigation ───────────────────────────────────────────────────────────────
export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Web & App Development', href: '/services/web-app-development' },
      { label: 'Design & Branding', href: '/services/design-branding' },
      { label: 'Digital Marketing', href: '/services/digital-marketing' },
      { label: 'Video & Content', href: '/services/video-content' },
      { label: 'AI & Automation', href: '/services/ai-automation' },
      { label: 'Other Digital Services', href: '/services/other-digital-services' },
    ],
  },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Process', href: '/process' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
];

// ─── Hero Slides ──────────────────────────────────────────────────────────────
export const heroSlides: HeroSlide[] = [
  {
    id: 'h1',
    badge: 'Full-Service Digital Agency',
    heading: 'We turn digital ideas\ninto growth.',
    subheading:
      'Web, design, marketing, content and AI — built around one goal: your business growing online.',
    ctaPrimary: { label: 'Start a Project', href: '/contact' },
    ctaSecondary: { label: 'View Our Work', href: '/portfolio' },
  },
  {
    id: 'h2',
    badge: 'Connected Digital Services',
    heading: 'One partner.\nEvery digital need.',
    subheading:
      'Stop coordinating separate vendors. Get a single team that plans, builds and grows your digital presence.',
    ctaPrimary: { label: 'Explore Services', href: '/services' },
    ctaSecondary: { label: 'Our Process', href: '/process' },
  },
  {
    id: 'h3',
    badge: 'AI & Automation Ready',
    heading: 'Future-proof your\nbusiness today.',
    subheading:
      'From intelligent chatbots to workflow automation — we integrate AI where it creates real value.',
    ctaPrimary: { label: 'See AI Services', href: '/services/ai-automation' },
    ctaSecondary: { label: 'Read Insights', href: '/insights' },
  },
];

// ─── Services ─────────────────────────────────────────────────────────────────
export const services: Service[] = [
  {
    id: 'svc-1',
    slug: 'web-app-development',
    title: 'Web & App Development',
    shortDescription:
      'Performant websites, landing pages, ecommerce stores and web applications — built to convert.',
    description:
      'From a single landing page to a complex web application, we architect, design and develop digital products that perform. Every project starts with understanding your audience, goals and technical requirements before a single line of code is written.',
    icon: 'Code2',
    color: '#477BDB',
    featured: true,
    offerings: [
      {
        id: 'web-1',
        title: 'Business Websites',
        description: 'Fast, accessible and conversion-optimised websites that represent your brand well across all devices.',
        icon: 'Globe',
      },
      {
        id: 'web-2',
        title: 'Landing Pages',
        description: 'High-converting landing pages built around clear goals, compelling copy and persuasive design.',
        icon: 'LayoutTemplate',
      },
      {
        id: 'web-3',
        title: 'E-commerce Stores',
        description: 'Online stores that make buying easy — product pages, checkout flows and payment integrations.',
        icon: 'ShoppingCart',
      },
      {
        id: 'web-4',
        title: 'Web Applications',
        description: 'Custom web apps, dashboards and portals built with modern frameworks and clean architecture.',
        icon: 'AppWindow',
      },
      {
        id: 'web-5',
        title: 'Mobile Apps',
        description: 'Cross-platform mobile applications using React Native or progressive web app approaches.',
        icon: 'Smartphone',
      },
      {
        id: 'web-6',
        title: 'Maintenance & Support',
        description: 'Ongoing care plans — updates, security patches, performance monitoring and technical support.',
        icon: 'Wrench',
      },
    ],
    process: [
      'Requirements discovery and technical scoping',
      'Information architecture and wireframes',
      'UI design and prototype review',
      'Development and integrations',
      'QA testing and performance checks',
      'Launch and handover documentation',
    ],
    faqs: [
      {
        id: 'wf1',
        question: 'How long does a typical website project take?',
        answer:
          'Project timelines vary by scope. A focused landing page can be delivered in 1–2 weeks; a full business website typically takes 4–8 weeks; complex web applications may take longer. We agree timelines before work begins.',
      },
      {
        id: 'wf2',
        question: 'Do you work with existing websites?',
        answer:
          'Yes. We can redesign, rebuild or improve an existing site depending on what makes the most commercial sense for your situation.',
      },
      {
        id: 'wf3',
        question: 'What platforms do you build on?',
        answer:
          'We choose the right tool for the brief — Next.js, React, WordPress, Shopify, Webflow or custom builds. We recommend based on your long-term needs, not our preference.',
      },
    ],
  },
  {
    id: 'svc-2',
    slug: 'design-branding',
    title: 'Design & Branding',
    shortDescription:
      'Brand identities, UI/UX design and visual assets that make your business memorable.',
    description:
      'Good design earns trust before a single word is read. We create brand identities, interfaces and visual assets that reflect your positioning, communicate clearly and hold together consistently across every touchpoint.',
    icon: 'Palette',
    color: '#6477C8',
    featured: true,
    offerings: [
      {
        id: 'des-1',
        title: 'Brand Identity',
        description: 'Logo, colour palette, typography and brand guidelines — the foundations everything else builds on.',
        icon: 'Fingerprint',
      },
      {
        id: 'des-2',
        title: 'UI/UX Design',
        description: 'Interface design and user experience flows for websites, apps and digital products.',
        icon: 'Layers',
      },
      {
        id: 'des-3',
        title: 'Social Media Creatives',
        description: 'Consistent visual templates and one-off creatives for Instagram, LinkedIn, and more.',
        icon: 'ImageIcon',
      },
      {
        id: 'des-4',
        title: 'Presentations & Pitch Decks',
        description: 'Clear, well-structured presentations that communicate ideas with confidence.',
        icon: 'PresentationIcon',
      },
      {
        id: 'des-5',
        title: 'Graphic Design',
        description: 'Marketing materials, brochures, packaging concepts and printed or digital collateral.',
        icon: 'PenTool',
      },
      {
        id: 'des-6',
        title: 'Design Systems',
        description: 'Scalable component libraries and style guides that keep product design consistent at pace.',
        icon: 'LayoutGrid',
      },
    ],
    process: [
      'Brand discovery and competitor audit',
      'Concept development and mood boards',
      'Design rounds with structured feedback',
      'Final asset delivery in all required formats',
      'Brand guidelines documentation',
    ],
    faqs: [
      {
        id: 'df1',
        question: 'What do I receive at the end of a branding project?',
        answer:
          'You receive all final files in editable and export formats (AI, EPS, PDF, PNG, SVG), plus a brand guidelines document covering usage rules.',
      },
      {
        id: 'df2',
        question: 'How many design concepts will I see?',
        answer:
          'We agree the number of concepts and revision rounds before the project starts. This is documented in the scope so there are no surprises.',
      },
    ],
  },
  {
    id: 'svc-3',
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    shortDescription:
      'SEO, paid advertising, social media and email — connected strategies that drive qualified traffic.',
    description:
      'Marketing works best when the channels, creative and measurement are aligned. We plan and execute digital marketing that fits your audience, stage and budget — with honest reporting on what is and is not working.',
    icon: 'TrendingUp',
    color: '#32A88A',
    featured: true,
    offerings: [
      {
        id: 'mkt-1',
        title: 'Search Engine Optimisation',
        description: 'Technical SEO, on-page content and link strategy to improve organic visibility over time.',
        icon: 'Search',
      },
      {
        id: 'mkt-2',
        title: 'Google Ads',
        description: 'Search, display and shopping campaigns managed to your objectives and budget.',
        icon: 'Globe',
      },
      {
        id: 'mkt-3',
        title: 'Meta Ads',
        description: 'Facebook and Instagram advertising — audience targeting, creatives and conversion tracking.',
        icon: 'Share2',
      },
      {
        id: 'mkt-4',
        title: 'Social Media Management',
        description: 'Content calendars, community management and performance analysis for your social channels.',
        icon: 'Users',
      },
      {
        id: 'mkt-5',
        title: 'Email Marketing',
        description: 'Campaigns, automations and newsletters that keep your audience engaged and returning.',
        icon: 'Mail',
      },
      {
        id: 'mkt-6',
        title: 'Lead Generation',
        description: 'Funnels, landing pages and campaign strategy focused on attracting and converting qualified leads.',
        icon: 'Target',
      },
    ],
    process: [
      'Audience and competitor research',
      'Channel strategy and budget allocation',
      'Creative development and copy',
      'Campaign setup and tracking configuration',
      'Launch, monitoring and optimisation',
      'Monthly reporting and strategy review',
    ],
    faqs: [
      {
        id: 'mf1',
        question: 'How do you measure marketing success?',
        answer:
          'We agree KPIs before starting — these might be traffic, leads, cost per conversion or revenue. We report honestly against those metrics and flag when something is underperforming.',
      },
      {
        id: 'mf2',
        question: 'Do I need a minimum ad spend?',
        answer:
          'Effective advertising requires a realistic budget. We will discuss minimums during scoping — we want campaigns that can actually work, not ones stretched too thin to produce data.',
      },
    ],
  },
  {
    id: 'svc-4',
    slug: 'video-content',
    title: 'Video & Content',
    shortDescription:
      'Short-form video, editing, motion graphics, copywriting and content strategy.',
    description:
      'Content that connects starts with understanding what your audience actually wants to consume. We plan, produce and edit video and written content that fits your brand voice and distribution channels.',
    icon: 'Video',
    color: '#E8912A',
    featured: true,
    offerings: [
      {
        id: 'vid-1',
        title: 'Short-Form Video (Reels & Shorts)',
        description: 'Engaging vertical video optimised for Instagram, YouTube Shorts and TikTok.',
        icon: 'PlaySquare',
      },
      {
        id: 'vid-2',
        title: 'Video Editing',
        description: 'Professional editing, colour grading and sound design for existing footage.',
        icon: 'Film',
      },
      {
        id: 'vid-3',
        title: 'Motion Graphics',
        description: 'Animated logos, explainer animations and branded motion templates.',
        icon: 'Zap',
      },
      {
        id: 'vid-4',
        title: 'Copywriting',
        description: 'Website copy, ad copy, email sequences and long-form articles written for humans first.',
        icon: 'FileText',
      },
      {
        id: 'vid-5',
        title: 'Content Strategy',
        description: 'Content calendars, channel strategy and audience-first planning that guides execution.',
        icon: 'Map',
      },
      {
        id: 'vid-6',
        title: 'Thumbnail Design',
        description: 'High-click-rate thumbnails for YouTube and social video that represent content accurately.',
        icon: 'ImageIcon',
      },
    ],
    process: [
      'Content audit and gap analysis',
      'Strategy, pillars and content calendar',
      'Script writing and storyboarding',
      'Production or editing',
      'Review and revisions',
      'Publishing support and analytics review',
    ],
    faqs: [
      {
        id: 'vf1',
        question: 'Do you handle filming as well as editing?',
        answer:
          'This depends on your location and project scope. We handle editing for footage you supply, and can arrange production for specific projects. We will clarify what is in scope during discovery.',
      },
    ],
  },
  {
    id: 'svc-5',
    slug: 'ai-automation',
    title: 'AI & Automation',
    shortDescription:
      'AI integrations, chatbots, workflow automation and business intelligence dashboards.',
    description:
      'AI should create measurable value, not just novelty. We identify where automation and AI genuinely improve your workflows, customer experience or data visibility — then build and integrate thoughtfully.',
    icon: 'Bot',
    color: '#0EA5C8',
    featured: true,
    offerings: [
      {
        id: 'ai-1',
        title: 'AI Chatbots',
        description: 'Intelligent conversational assistants for customer support, lead qualification and FAQs.',
        icon: 'MessageSquare',
      },
      {
        id: 'ai-2',
        title: 'Workflow Automation',
        description: 'Connect your tools, eliminate manual tasks and build repeatable automated processes.',
        icon: 'GitMerge',
      },
      {
        id: 'ai-3',
        title: 'AI Integrations',
        description: 'Embed AI capabilities — content generation, image processing, classification — into your product.',
        icon: 'Cpu',
      },
      {
        id: 'ai-4',
        title: 'Business Dashboards',
        description: 'Visual dashboards that surface the data your team needs to make better decisions faster.',
        icon: 'BarChart3',
      },
      {
        id: 'ai-5',
        title: 'API Integrations',
        description: 'Connect CRMs, payment systems, data sources and third-party tools into a cohesive workflow.',
        icon: 'Plug',
      },
      {
        id: 'ai-6',
        title: 'AI Consulting',
        description: 'Identify where AI makes sense for your business — opportunity mapping without the hype.',
        icon: 'Lightbulb',
      },
    ],
    process: [
      'Process audit and opportunity identification',
      'Solution design and tool selection',
      'Prototype and proof of concept',
      'Integration build and testing',
      'Team training and documentation',
      'Monitoring and ongoing support',
    ],
    faqs: [
      {
        id: 'af1',
        question: 'Do I need to be technical to use AI tools you build?',
        answer:
          'No. We design for the end user. If your team will operate the system, we build it to match their workflow and provide training and documentation.',
      },
      {
        id: 'af2',
        question: 'What tools and platforms do you work with?',
        answer:
          'We work across OpenAI, Anthropic, Make, Zapier, n8n, custom APIs and more. Tool choice depends on your requirements, budget and existing tech stack.',
      },
    ],
  },
  {
    id: 'svc-6',
    slug: 'other-digital-services',
    title: 'Other Digital Services',
    shortDescription:
      'Consulting, data analysis, CRM setup, virtual assistance and ecommerce operations support.',
    description:
      'Some digital needs do not fit neatly into a single category. We offer a range of supporting services for businesses that need practical, hands-on digital expertise without the overhead of full-time hires.',
    icon: 'MoreHorizontal',
    color: '#B04EC4',
    featured: false,
    offerings: [
      {
        id: 'oth-1',
        title: 'Digital Consulting',
        description: 'Audits, roadmaps and strategy sessions to help you make better digital decisions.',
        icon: 'Compass',
      },
      {
        id: 'oth-2',
        title: 'Data Analysis',
        description: 'Turn raw data into insight — reports, visualisations and recommendations.',
        icon: 'BarChart2',
      },
      {
        id: 'oth-3',
        title: 'CRM Setup & Management',
        description: 'CRM configuration, pipeline setup, integrations and ongoing management.',
        icon: 'Database',
      },
      {
        id: 'oth-4',
        title: 'Virtual Assistance',
        description: 'Executive support, research, scheduling and digital admin for busy founders and teams.',
        icon: 'UserCheck',
      },
      {
        id: 'oth-5',
        title: 'Ecommerce Operations',
        description: 'Product listing, catalogue management, customer support and marketplace operations.',
        icon: 'Package',
      },
      {
        id: 'oth-6',
        title: 'Hosting & Domain Support',
        description: 'Domain setup, DNS management, hosting configuration and migration support.',
        icon: 'Server',
      },
    ],
    process: [
      'Scope clarification and requirements',
      'Engagement structure and deliverables agreement',
      'Execution with regular check-ins',
      'Review and sign-off',
    ],
    faqs: [],
  },
];

// ─── Portfolio Items ──────────────────────────────────────────────────────────
export const portfolioItems: PortfolioItem[] = [
  {
    id: 'port-1',
    slug: 'brand-identity-concept',
    title: 'Brand Identity Concept',
    client: 'Concept Project',
    category: 'Design & Branding',
    tags: ['branding', 'logo design', 'visual identity'],
    thumbnail: '/portfolio/placeholder-1.jpg',
    images: ['/portfolio/placeholder-1.jpg'],
    challenge: 'Demonstrate a complete brand identity system for a modern services business.',
    approach: 'Developed a concept brand from scratch: positioning, visual language, typography and application.',
    deliverables: ['Logo suite', 'Colour palette', 'Typography system', 'Brand guidelines document', 'Application mockups'],
    technologies: ['Figma', 'Adobe Illustrator'],
    outcome: 'Concept project demonstrating capability in brand identity design. Not a client result.',
    featured: true,
    published: true,
    year: 2024,
  },
  {
    id: 'port-2',
    slug: 'ecommerce-ux-prototype',
    title: 'E-commerce UX Prototype',
    client: 'Concept Project',
    category: 'Web & App Development',
    tags: ['UI/UX', 'ecommerce', 'prototype'],
    thumbnail: '/portfolio/placeholder-2.jpg',
    images: ['/portfolio/placeholder-2.jpg'],
    challenge: 'Design a streamlined buying journey for a direct-to-consumer product brand.',
    approach: 'Mapped the full purchase funnel, identified friction points, and prototyped a cleaner UX.',
    deliverables: ['User journey map', 'Wireframes', 'High-fidelity prototype', 'Interaction specification'],
    technologies: ['Figma', 'Next.js', 'Tailwind CSS'],
    outcome: 'Concept prototype demonstrating ecommerce UX design and development capability.',
    featured: true,
    published: true,
    year: 2024,
  },
  {
    id: 'port-3',
    slug: 'content-strategy-case-study',
    title: 'Content Strategy Case Study',
    client: 'Concept Project',
    category: 'Video & Content',
    tags: ['content strategy', 'copywriting', 'social media'],
    thumbnail: '/portfolio/placeholder-3.jpg',
    images: ['/portfolio/placeholder-3.jpg'],
    challenge: 'Build a repeatable content system for a business launching its social media presence.',
    approach: 'Defined content pillars, created a 30-day calendar, wrote post copy and produced template creatives.',
    deliverables: ['Content pillar framework', '30-day calendar', 'Post copy samples', 'Creative templates'],
    technologies: ['Notion', 'Canva', 'Later'],
    outcome: 'Concept case study demonstrating content planning and production capability.',
    featured: true,
    published: true,
    year: 2024,
  },
  {
    id: 'port-4',
    slug: 'ai-chatbot-demo',
    title: 'AI Customer Support Chatbot Demo',
    client: 'Concept Project',
    category: 'AI & Automation',
    tags: ['AI', 'chatbot', 'automation'],
    thumbnail: '/portfolio/placeholder-4.jpg',
    images: ['/portfolio/placeholder-4.jpg'],
    challenge: 'Show how a trained AI assistant can handle common customer enquiries for a service business.',
    approach: 'Built a demo chatbot trained on FAQ content, integrated with a simple web interface.',
    deliverables: ['Chatbot demo', 'Integration documentation', 'Training data structure'],
    technologies: ['OpenAI API', 'Next.js', 'Vercel'],
    outcome: 'Concept demonstration. Actual customer outcomes would depend on specific business implementation.',
    featured: false,
    published: true,
    year: 2024,
  },
  {
    id: 'port-5',
    slug: 'seo-audit-framework',
    title: 'SEO Audit Framework',
    client: 'Internal Tool',
    category: 'Digital Marketing',
    tags: ['SEO', 'audit', 'digital marketing'],
    thumbnail: '/portfolio/placeholder-5.jpg',
    images: ['/portfolio/placeholder-5.jpg'],
    challenge: 'Create a repeatable SEO audit process that covers technical, content and link factors.',
    approach: 'Mapped all key audit dimensions, built scoring criteria and created a client-facing report template.',
    deliverables: ['Audit checklist', 'Scoring framework', 'Report template', 'Prioritisation matrix'],
    technologies: ['Screaming Frog', 'Ahrefs', 'Google Search Console'],
    outcome: 'Internal framework used as a starting point for client SEO engagements.',
    featured: false,
    published: true,
    year: 2024,
  },
  {
    id: 'port-6',
    slug: 'landing-page-concept',
    title: 'SaaS Landing Page Concept',
    client: 'Concept Project',
    category: 'Web & App Development',
    tags: ['landing page', 'web design', 'conversion'],
    thumbnail: '/portfolio/placeholder-6.jpg',
    images: ['/portfolio/placeholder-6.jpg'],
    challenge: 'Design and build a high-conversion landing page for a hypothetical SaaS product.',
    approach: 'Structured the page around AIDA principles with a clear above-fold value prop, social proof section and CTA.',
    deliverables: ['Designed and built landing page', 'Copy framework', 'A/B test hypothesis'],
    technologies: ['Next.js', 'Framer Motion', 'Tailwind CSS'],
    outcome: 'Concept project. Conversion results would depend on real traffic and offer validation.',
    featured: false,
    published: true,
    year: 2024,
  },
];

// ─── Process Steps ────────────────────────────────────────────────────────────
export const processSteps: ProcessStep[] = [
  {
    id: 'ps-1',
    number: '01',
    title: 'Discover',
    description: 'We start by understanding your business goals, audience, competitive context and technical requirements before any solution is proposed.',
    icon: 'Search',
    details: ['Stakeholder interviews', 'Goals and KPI alignment', 'Competitor and market context', 'Technical requirements gathering'],
  },
  {
    id: 'ps-2',
    number: '02',
    title: 'Plan',
    description: 'Every engagement gets a clear scope document — deliverables, assumptions, milestones, timeline and payment terms agreed before work begins.',
    icon: 'ClipboardList',
    details: ['Scope of work document', 'Milestone and payment schedule', 'Deliverable definitions', 'Change-request process agreed'],
  },
  {
    id: 'ps-3',
    number: '03',
    title: 'Design',
    description: 'Structure, visual direction and content brought together in a reviewable format before production begins. Fewer surprises at build stage.',
    icon: 'Figma',
    details: ['Wireframes and information architecture', 'Visual design and brand alignment', 'Prototype review and sign-off', 'Content planning'],
  },
  {
    id: 'ps-4',
    number: '04',
    title: 'Build',
    description: 'Development, content production or campaign setup executed against the agreed specification with regular progress updates.',
    icon: 'Code2',
    details: ['Development against approved designs', 'Regular progress updates', 'Integrations and configuration', 'Internal QA and testing'],
  },
  {
    id: 'ps-5',
    number: '05',
    title: 'Review',
    description: 'Structured review rounds with clear feedback channels. We refine until the deliverable meets the agreed acceptance criteria.',
    icon: 'CheckCircle',
    details: ['Structured feedback process', 'Revision rounds as agreed in scope', 'Client sign-off on each deliverable', 'Pre-launch checklist'],
  },
  {
    id: 'ps-6',
    number: '06',
    title: 'Handover',
    description: 'Clean delivery with all assets, documentation, credentials and training needed to operate what we have built.',
    icon: 'PackageCheck',
    details: ['All files delivered in agreed formats', 'Handover documentation', 'Credentials and access transferred', 'Support arrangements confirmed'],
  },
];

// ─── Blog Posts ───────────────────────────────────────────────────────────────
export const blogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'why-your-website-is-not-generating-leads',
    title: 'Why Your Website Is Not Generating Leads (And What to Fix First)',
    excerpt: 'Most business websites look fine but convert poorly. Here are the most common structural and messaging problems — and a practical order to fix them.',
    content: `# Why Your Website Is Not Generating Leads

A website that looks good but generates no enquiries is one of the most frustrating digital problems for a small business owner. You invested in something that sits there. No calls, no form fills, no messages.

The reasons are almost always structural — not cosmetic.

## 1. No clear value proposition above the fold

The first thing a visitor sees should answer: what do you do, for whom, and why should I stay? Most websites either say something too vague ("We help you grow") or too specific too early (lists of features before anyone understands the benefit).

Fix this before changing anything else.

## 2. No obvious next step

If someone likes what they see, what do you want them to do? One clear call to action, consistently placed, outperforms five competing options.

## 3. Trust signals are missing or unconvincing

Generic phrases like "trusted by hundreds of clients" do not create trust. Specific testimonials, project examples with honest context, and transparent process information do.

## 4. The page loads slowly

A one-second delay can reduce conversions meaningfully. Run a Core Web Vitals check and fix anything that scores poorly — image optimisation is usually the biggest quick win.

## 5. You are not tracking what matters

If you cannot see which pages get traffic, where people drop off and what CTAs get clicked, you cannot improve anything systematically. Set up basic analytics before running any paid traffic.

Start with the value proposition. Then the CTA. Then trust signals. In that order.`,
    category: 'Web & Digital Strategy',
    tags: ['website', 'conversion', 'lead generation', 'digital strategy'],
    author: 'Growmybizz Team',
    publishedAt: '2024-11-15',
    readTime: 5,
    featured: true,
    published: true,
    coverImage: '/blog/placeholder-1.jpg',
  },
  {
    id: 'blog-2',
    slug: 'seo-for-small-businesses-what-actually-works',
    title: 'SEO for Small Businesses: What Actually Works in 2025',
    excerpt: 'SEO advice is full of conflicting information. This is a grounded look at where small businesses should focus their SEO effort to see real results.',
    content: `# SEO for Small Businesses: What Actually Works in 2025

Search engine optimisation has a reputation for being complicated, slow and unpredictable. For small businesses, that reputation is partly earned — but the fundamentals are more approachable than most content suggests.

## Start with technical basics

Before worrying about content or links, make sure Google can crawl and understand your site. Check for:

- Mobile usability (Google indexes mobile-first)
- Page speed (Core Web Vitals)
- HTTPS
- No broken links or redirect chains
- A clean site structure

Most small business sites have at least one of these issues. Fix them before investing in content.

## Focus on local search if location matters

If customers need to be near you, Google Business Profile is your most important SEO asset. Keep it updated, respond to reviews and ensure your NAP (Name, Address, Phone) is consistent everywhere it appears online.

## Write content that answers real questions

You do not need to publish three articles a week. One well-researched, genuinely useful page targeting a specific question your customers actually search for outperforms ten thin posts written to fill a calendar.

## Build links through genuine value

Earn links by creating something worth referencing — a useful tool, a well-researched guide, original data. Buying links or participating in link exchanges creates risk.

## Track the right metrics

Organic traffic is a vanity metric if it does not lead to enquiries. Track keyword rankings for commercial terms, organic traffic to key conversion pages, and form fills or calls attributed to organic.

SEO takes time. Expect meaningful movement in 3–6 months for a new site targeting competitive terms. Local and long-tail results can come faster.`,
    category: 'SEO',
    tags: ['SEO', 'small business', 'content marketing', 'local SEO'],
    author: 'Growmybizz Team',
    publishedAt: '2024-11-08',
    readTime: 7,
    featured: true,
    published: true,
    coverImage: '/blog/placeholder-2.jpg',
  },
  {
    id: 'blog-3',
    slug: 'how-to-brief-a-designer-without-wasting-time',
    title: 'How to Brief a Designer Without Wasting Time',
    excerpt: 'A poor brief costs more in revisions and frustration than in fees. Here is a clear format for briefing design work that gets better results.',
    content: `# How to Brief a Designer Without Wasting Time

The most common cause of expensive, frustrating design revisions is not a bad designer — it is a brief that did not contain enough useful information to produce the right output the first time.

## What belongs in a good design brief

**1. What is being designed and why**
Not just the format — the context. A logo for a tech startup being pitched to B2B enterprise clients needs a very different approach than a logo for a local food brand.

**2. Who the audience is**
Age, profession, what they value, what they distrust. The more specific the better.

**3. What you want people to feel or do**
"I want it to look modern" is not enough. "I want enterprise prospects to feel confident about buying from us" is useful.

**4. What you like and do not like**
Link to examples with notes. "I like this because of the typography, not the colour palette" is much more actionable than "something like this."

**5. Technical specifications**
Size, format, where it will be used, what it needs to work alongside.

**6. What success looks like**
How will you evaluate whether the design worked? Knowing this upfront prevents subjective disagreements later.

## What to avoid

- Changing direction mid-project without acknowledging it is a scope change
- Briefing by committee without a single decision-maker
- Asking for "something different" without being specific about what the current version lacks

A 30-minute conversation with a clear brief saves many hours of revisions. Invest in the front end.`,
    category: 'Design & Branding',
    tags: ['design', 'branding', 'brief', 'client advice'],
    author: 'Growmybizz Team',
    publishedAt: '2024-10-28',
    readTime: 4,
    featured: false,
    published: true,
    coverImage: '/blog/placeholder-3.jpg',
  },
  {
    id: 'blog-4',
    slug: 'where-ai-adds-real-value-for-small-businesses',
    title: 'Where AI Adds Real Value for Small Businesses (And Where It Does Not)',
    excerpt: 'AI tools can genuinely help small businesses — but not everywhere. A practical look at where the return is real and where the hype outpaces the result.',
    content: `# Where AI Adds Real Value for Small Businesses

AI tools have improved significantly. Many are now genuinely useful for small businesses. But the gap between what AI is marketed as and what it actually delivers well is still meaningful.

## Where AI genuinely helps

**Content drafting and editing**
AI assistants are good at generating first drafts, summarising long documents, rewriting for tone and checking grammar. They save time in the drafting stage. They do not replace a skilled writer, but they reduce the blank-page problem.

**Customer support automation**
A well-configured AI chatbot handling FAQ queries — order status, opening hours, common questions — can reduce support volume meaningfully without frustrating customers, provided the scope is clear and there is a human escalation path.

**Data processing and summarisation**
If you have data in spreadsheets or reports that you spend time manually reviewing, AI can often summarise, categorise and extract patterns faster than a human.

**Code assistance for non-developers**
AI coding tools allow people with basic technical knowledge to build small automations, scripts and integrations that previously required a developer.

## Where AI disappoints

**Strategy and original thinking**
AI produces plausible-sounding output. "Plausible" and "correct" or "strategic" are different things. Decisions that matter should not be delegated to a tool that cannot be accountable for them.

**Relationship-dependent work**
Sales, negotiation and anything that depends on genuine human trust and judgement is not a good candidate for automation.

**Replacing specialised expertise**
AI can assist experts. It is not a reliable substitute for them in high-stakes contexts.

Start with one AI use case, test it properly, and expand from evidence — not enthusiasm.`,
    category: 'AI & Automation',
    tags: ['AI', 'automation', 'small business', 'productivity'],
    author: 'Growmybizz Team',
    publishedAt: '2024-10-15',
    readTime: 6,
    featured: true,
    published: true,
    coverImage: '/blog/placeholder-4.jpg',
  },
  {
    id: 'blog-5',
    slug: 'choosing-between-project-based-and-retainer-engagements',
    title: 'Choosing Between Project-Based and Retainer Engagements',
    excerpt: 'How should you structure digital agency work — fixed projects or ongoing retainers? The right answer depends on what you actually need.',
    content: `# Choosing Between Project-Based and Retainer Engagements

When working with a digital agency, you will typically choose between a fixed-scope project or an ongoing retainer. Each structure has advantages — and the right choice depends on your situation, not a general rule.

## Project-based engagements

Best when:
- The scope is clearly defined (a website, a brand, a campaign)
- You need a specific deliverable with a clear end point
- You want cost certainty

Risks:
- Out-of-scope requests create friction
- Post-project support may not be included
- Good agencies may be harder to re-engage quickly if you delay the next project

## Retainer engagements

Best when:
- The work is ongoing (social media, SEO, content, support)
- Volume and priorities shift month to month
- You want a team that builds context and improves over time

Risks:
- Easy to drift without clear goals and reporting
- Measuring value requires agreed KPIs upfront
- Minimum useful commitment is often higher than a single project

## The hybrid approach

Many good agency relationships start with a defined project to build trust, then transition to a retainer for ongoing work. This lets both sides test the relationship before committing to a longer arrangement.

Whatever structure you choose, agree deliverables, KPIs, reporting cadence and termination terms in writing before work begins.`,
    category: 'Business & Strategy',
    tags: ['agency', 'retainer', 'project management', 'digital strategy'],
    author: 'Growmybizz Team',
    publishedAt: '2024-10-01',
    readTime: 5,
    featured: false,
    published: true,
    coverImage: '/blog/placeholder-5.jpg',
  },
];

// ─── Team Members ─────────────────────────────────────────────────────────────
export const teamMembers: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Founder',
    role: 'Founder & Digital Strategist',
    bio: 'Founder bio to be added. Background in web development, digital strategy and building digital products for growing businesses.',
    avatar: '/team/placeholder-founder.jpg',
    linkedin: '#',
  },
];

// ─── Value Propositions ───────────────────────────────────────────────────────
export const valueProps: ValueProp[] = [
  {
    id: 'vp-1',
    title: 'Connected Delivery',
    description: 'Technical, creative and growth services coordinated around one goal — not handed off between separate vendors.',
    icon: 'GitMerge',
  },
  {
    id: 'vp-2',
    title: 'Clear Scopes',
    description: 'Documented deliverables, assumptions, timelines and review points before any work begins.',
    icon: 'ClipboardCheck',
  },
  {
    id: 'vp-3',
    title: 'Practical Choices',
    description: 'Recommendations matched to your stage, budget and capacity — not the solution that suits us best.',
    icon: 'Scale',
  },
  {
    id: 'vp-4',
    title: 'Long-Term Mindset',
    description: 'We build for your future, not just the brief. Support beyond launch when included in the engagement.',
    icon: 'TrendingUp',
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────
// Note: No fabricated client stats. These are structural placeholders for CMS.
export const stats: StatItem[] = [
  {
    id: 'stat-1',
    label: 'Services Offered',
    value: '6',
    suffix: '+',
    description: 'Disciplines across web, design, marketing, content, AI and operations',
  },
  {
    id: 'stat-2',
    label: 'Service Offerings',
    value: '30',
    suffix: '+',
    description: 'Specific service items across all six disciplines',
  },
  {
    id: 'stat-3',
    label: 'Process Steps',
    value: '6',
    description: 'Clear discovery-to-handover stages for every project',
  },
  {
    id: 'stat-4',
    label: 'Markets',
    value: '2',
    description: 'India-first with delivery designed for international clients',
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
// Note: Only genuine testimonials collected with permission should be published here.
// This array is intentionally empty — do not add fabricated testimonials.
export const testimonials: Testimonial[] = [];

// ─── Budget Ranges ────────────────────────────────────────────────────────────
export const budgetRanges = [
  { value: 'under-25k', label: 'Under ₹25,000' },
  { value: '25k-50k', label: '₹25,000 – ₹50,000' },
  { value: '50k-1l', label: '₹50,000 – ₹1,00,000' },
  { value: '1l-2.5l', label: '₹1,00,000 – ₹2,50,000' },
  { value: '2.5l-plus', label: '₹2,50,000+' },
  { value: 'not-sure', label: 'Not sure yet' },
];

export const timelineOptions = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-month', label: 'Within 1 month' },
  { value: '1-3-months', label: '1–3 months' },
  { value: '3-6-months', label: '3–6 months' },
  { value: 'flexible', label: 'Flexible' },
];

export const portfolioCategories = [
  'All',
  'Web & App Development',
  'Design & Branding',
  'Digital Marketing',
  'Video & Content',
  'AI & Automation',
  'Other Digital Services',
];

export const blogCategories = [
  'All',
  'Web & Digital Strategy',
  'SEO',
  'Design & Branding',
  'AI & Automation',
  'Business & Strategy',
];
