import type { Service } from '@/types';

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
    faqs: [
      {
        id: 'oth-faq-1',
        question: 'What types of digital operations can you handle?',
        answer:
          'We assist with data cleanup, CRM configurations (HubSpot, Zoho, Salesforce), Shopify/WooCommerce catalog uploads, DNS migrations, email domain authentication (SPF, DKIM, DMARC), and custom technical advisory.',
      },
      {
        id: 'oth-faq-2',
        question: 'Can we book your team on a flexible monthly retainer?',
        answer:
          'Yes. We offer dedicated operational support retainers starting from 20 hours/month, giving you on-demand access to our technical and digital specialists without hiring full-time staff.',
      },
      {
        id: 'oth-faq-3',
        question: 'How quickly can your team onboard and begin execution?',
        answer:
          'Once scope is confirmed and access credentials are shared securely, we can typically commence operational tasks within 24–48 business hours.',
      },
    ],
  },
];

