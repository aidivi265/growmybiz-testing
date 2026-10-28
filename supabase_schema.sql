-- ==============================================================================
-- Growmybizz Complete CMS Database Schema & Seed Script
-- Execute this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/cswpwcmtjzutuownuvez/sql)
-- ==============================================================================

-- 1. Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT DEFAULT 'Code2',
    color TEXT DEFAULT '#477BDB',
    featured BOOLEAN DEFAULT true,
    offerings JSONB DEFAULT '[]'::jsonb,
    deliverables JSONB DEFAULT '[]'::jsonb,
    process_steps JSONB DEFAULT '[]'::jsonb,
    faqs JSONB DEFAULT '[]'::jsonb,
    order_index INT DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Portfolio & Case Studies Table
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    client TEXT NOT NULL,
    category TEXT NOT NULL,
    year TEXT DEFAULT '2025',
    thumbnail TEXT NOT NULL,
    challenge TEXT NOT NULL,
    solution TEXT NOT NULL,
    outcome TEXT NOT NULL,
    metrics JSONB DEFAULT '[]'::jsonb,
    technologies JSONB DEFAULT '[]'::jsonb,
    gallery JSONB DEFAULT '[]'::jsonb,
    is_concept BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT true,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Blog & Insights Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content_markdown TEXT NOT NULL,
    cover_image TEXT,
    author TEXT DEFAULT 'Growmybizz Team',
    read_time TEXT DEFAULT '4 min read',
    tags JSONB DEFAULT '[]'::jsonb,
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Testimonials Table (Ensuring schema alignment)
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    avatar TEXT,
    quote TEXT NOT NULL,
    rating INT DEFAULT 5,
    featured BOOLEAN DEFAULT true,
    order_index INT DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Page Content & Copy Table (Hero, Process, Mission, Stats)
CREATE TABLE IF NOT EXISTS public.page_content (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. SEO Metadata Table
CREATE TABLE IF NOT EXISTS public.seo_metadata (
    route_path TEXT PRIMARY KEY,
    meta_title TEXT NOT NULL,
    meta_description TEXT NOT NULL,
    og_image TEXT,
    keywords JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Admin Audit Logs Table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    admin_email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);


-- ==============================================================================
-- Idempotent Column Check for Pre-Existing Tables
-- (Guarantees columns exist even if tables were already created previously)
-- ==============================================================================
ALTER TABLE IF EXISTS public.testimonials ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE IF EXISTS public.testimonials ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT true;
ALTER TABLE IF EXISTS public.testimonials ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 0;

ALTER TABLE IF EXISTS public.services ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE IF EXISTS public.services ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 0;

ALTER TABLE IF EXISTS public.portfolio_projects ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE IF EXISTS public.portfolio_projects ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT true;
ALTER TABLE IF EXISTS public.portfolio_projects ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 0;

ALTER TABLE IF EXISTS public.articles ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Ensure existing rows have is_published set to true
UPDATE public.testimonials SET is_published = true WHERE is_published IS NULL;

-- Enable Row Level Security (RLS)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access for Published Content
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public can view published services" ON public.services;
    CREATE POLICY "Public can view published services" ON public.services FOR SELECT USING (is_published = true);

    DROP POLICY IF EXISTS "Public can view published portfolio" ON public.portfolio_projects;
    CREATE POLICY "Public can view published portfolio" ON public.portfolio_projects FOR SELECT USING (is_published = true);

    DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
    CREATE POLICY "Public can view published articles" ON public.articles FOR SELECT USING (is_published = true);

    DROP POLICY IF EXISTS "Public can view published testimonials" ON public.testimonials;
    CREATE POLICY "Public can view published testimonials" ON public.testimonials FOR SELECT USING (is_published = true);

    DROP POLICY IF EXISTS "Public can view page content" ON public.page_content;
    CREATE POLICY "Public can view page content" ON public.page_content FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public can view seo metadata" ON public.seo_metadata;
    CREATE POLICY "Public can view seo metadata" ON public.seo_metadata FOR SELECT USING (true);
END $$;

-- Allow Service Role & Authenticated Admins Full CRUD Access
DO $$
BEGIN
    DROP POLICY IF EXISTS "Service role full access on services" ON public.services;
    CREATE POLICY "Service role full access on services" ON public.services FOR ALL USING (true);

    DROP POLICY IF EXISTS "Service role full access on portfolio" ON public.portfolio_projects;
    CREATE POLICY "Service role full access on portfolio" ON public.portfolio_projects FOR ALL USING (true);

    DROP POLICY IF EXISTS "Service role full access on articles" ON public.articles;
    CREATE POLICY "Service role full access on articles" ON public.articles FOR ALL USING (true);

    DROP POLICY IF EXISTS "Service role full access on testimonials" ON public.testimonials;
    CREATE POLICY "Service role full access on testimonials" ON public.testimonials FOR ALL USING (true);

    DROP POLICY IF EXISTS "Service role full access on page_content" ON public.page_content;
    CREATE POLICY "Service role full access on page_content" ON public.page_content FOR ALL USING (true);

    DROP POLICY IF EXISTS "Service role full access on seo_metadata" ON public.seo_metadata;
    CREATE POLICY "Service role full access on seo_metadata" ON public.seo_metadata FOR ALL USING (true);

    DROP POLICY IF EXISTS "Service role full access on admin_audit_logs" ON public.admin_audit_logs;
    CREATE POLICY "Service role full access on admin_audit_logs" ON public.admin_audit_logs FOR ALL USING (true);
END $$;

-- 9. Auto-updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    DROP TRIGGER IF EXISTS set_updated_at_services ON public.services;
    CREATE TRIGGER set_updated_at_services BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

    DROP TRIGGER IF EXISTS set_updated_at_portfolio ON public.portfolio_projects;
    CREATE TRIGGER set_updated_at_portfolio BEFORE UPDATE ON public.portfolio_projects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

    DROP TRIGGER IF EXISTS set_updated_at_articles ON public.articles;
    CREATE TRIGGER set_updated_at_articles BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
END $$;

-- ==============================================================================
-- Initial Data Seed (Preserving existing content into database)
-- ==============================================================================
INSERT INTO public.services (slug, title, short_description, description, icon_name, color, featured, offerings, deliverables, process_steps, faqs, order_index, is_published)
VALUES ('web-app-development', 'Web & App Development', 'Performant websites, landing pages, ecommerce stores and web applications — built to convert.', 'From a single landing page to a complex web application, we architect, design and develop digital products that perform. Every project starts with understanding your audience, goals and technical requirements before a single line of code is written.', 'Code2', '#477BDB', true, '[{"id":"web-1","title":"Business Websites","description":"Fast, accessible and conversion-optimised websites that represent your brand well across all devices.","icon":"Globe"},{"id":"web-2","title":"Landing Pages","description":"High-converting landing pages built around clear goals, compelling copy and persuasive design.","icon":"LayoutTemplate"},{"id":"web-3","title":"E-commerce Stores","description":"Online stores that make buying easy — product pages, checkout flows and payment integrations.","icon":"ShoppingCart"},{"id":"web-4","title":"Web Applications","description":"Custom web apps, dashboards and portals built with modern frameworks and clean architecture.","icon":"AppWindow"},{"id":"web-5","title":"Mobile Apps","description":"Cross-platform mobile applications using React Native or progressive web app approaches.","icon":"Smartphone"},{"id":"web-6","title":"Maintenance & Support","description":"Ongoing care plans — updates, security patches, performance monitoring and technical support.","icon":"Wrench"}]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[{"id":"wf1","question":"How long does a typical website project take?","answer":"Project timelines vary by scope. A focused landing page can be delivered in 1–2 weeks; a full business website typically takes 4–8 weeks; complex web applications may take longer. We agree timelines before work begins."},{"id":"wf2","question":"Do you work with existing websites?","answer":"Yes. We can redesign, rebuild or improve an existing site depending on what makes the most commercial sense for your situation."},{"id":"wf3","question":"What platforms do you build on?","answer":"We choose the right tool for the brief — Next.js, React, WordPress, Shopify, Webflow or custom builds. We recommend based on your long-term needs, not our preference."}]'::jsonb, 0, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description;

INSERT INTO public.services (slug, title, short_description, description, icon_name, color, featured, offerings, deliverables, process_steps, faqs, order_index, is_published)
VALUES ('design-branding', 'Design & Branding', 'Brand identities, UI/UX design and visual assets that make your business memorable.', 'Good design earns trust before a single word is read. We create brand identities, interfaces and visual assets that reflect your positioning, communicate clearly and hold together consistently across every touchpoint.', 'Palette', '#6477C8', true, '[{"id":"des-1","title":"Brand Identity","description":"Logo, colour palette, typography and brand guidelines — the foundations everything else builds on.","icon":"Fingerprint"},{"id":"des-2","title":"UI/UX Design","description":"Interface design and user experience flows for websites, apps and digital products.","icon":"Layers"},{"id":"des-3","title":"Social Media Creatives","description":"Consistent visual templates and one-off creatives for Instagram, LinkedIn, and more.","icon":"ImageIcon"},{"id":"des-4","title":"Presentations & Pitch Decks","description":"Clear, well-structured presentations that communicate ideas with confidence.","icon":"PresentationIcon"},{"id":"des-5","title":"Graphic Design","description":"Marketing materials, brochures, packaging concepts and printed or digital collateral.","icon":"PenTool"},{"id":"des-6","title":"Design Systems","description":"Scalable component libraries and style guides that keep product design consistent at pace.","icon":"LayoutGrid"}]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[{"id":"df1","question":"What do I receive at the end of a branding project?","answer":"You receive all final files in editable and export formats (AI, EPS, PDF, PNG, SVG), plus a brand guidelines document covering usage rules."},{"id":"df2","question":"How many design concepts will I see?","answer":"We agree the number of concepts and revision rounds before the project starts. This is documented in the scope so there are no surprises."}]'::jsonb, 1, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description;

INSERT INTO public.services (slug, title, short_description, description, icon_name, color, featured, offerings, deliverables, process_steps, faqs, order_index, is_published)
VALUES ('digital-marketing', 'Digital Marketing', 'SEO, paid advertising, social media and email — connected strategies that drive qualified traffic.', 'Marketing works best when the channels, creative and measurement are aligned. We plan and execute digital marketing that fits your audience, stage and budget — with honest reporting on what is and is not working.', 'TrendingUp', '#32A88A', true, '[{"id":"mkt-1","title":"Search Engine Optimisation","description":"Technical SEO, on-page content and link strategy to improve organic visibility over time.","icon":"Search"},{"id":"mkt-2","title":"Google Ads","description":"Search, display and shopping campaigns managed to your objectives and budget.","icon":"Globe"},{"id":"mkt-3","title":"Meta Ads","description":"Facebook and Instagram advertising — audience targeting, creatives and conversion tracking.","icon":"Share2"},{"id":"mkt-4","title":"Social Media Management","description":"Content calendars, community management and performance analysis for your social channels.","icon":"Users"},{"id":"mkt-5","title":"Email Marketing","description":"Campaigns, automations and newsletters that keep your audience engaged and returning.","icon":"Mail"},{"id":"mkt-6","title":"Lead Generation","description":"Funnels, landing pages and campaign strategy focused on attracting and converting qualified leads.","icon":"Target"}]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[{"id":"mf1","question":"How do you measure marketing success?","answer":"We agree KPIs before starting — these might be traffic, leads, cost per conversion or revenue. We report honestly against those metrics and flag when something is underperforming."},{"id":"mf2","question":"Do I need a minimum ad spend?","answer":"Effective advertising requires a realistic budget. We will discuss minimums during scoping — we want campaigns that can actually work, not ones stretched too thin to produce data."}]'::jsonb, 2, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description;

INSERT INTO public.services (slug, title, short_description, description, icon_name, color, featured, offerings, deliverables, process_steps, faqs, order_index, is_published)
VALUES ('video-content', 'Video & Content', 'Short-form video, editing, motion graphics, copywriting and content strategy.', 'Content that connects starts with understanding what your audience actually wants to consume. We plan, produce and edit video and written content that fits your brand voice and distribution channels.', 'Video', '#E8912A', true, '[{"id":"vid-1","title":"Short-Form Video (Reels & Shorts)","description":"Engaging vertical video optimised for Instagram, YouTube Shorts and TikTok.","icon":"PlaySquare"},{"id":"vid-2","title":"Video Editing","description":"Professional editing, colour grading and sound design for existing footage.","icon":"Film"},{"id":"vid-3","title":"Motion Graphics","description":"Animated logos, explainer animations and branded motion templates.","icon":"Zap"},{"id":"vid-4","title":"Copywriting","description":"Website copy, ad copy, email sequences and long-form articles written for humans first.","icon":"FileText"},{"id":"vid-5","title":"Content Strategy","description":"Content calendars, channel strategy and audience-first planning that guides execution.","icon":"Map"},{"id":"vid-6","title":"Thumbnail Design","description":"High-click-rate thumbnails for YouTube and social video that represent content accurately.","icon":"ImageIcon"}]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[{"id":"vf1","question":"Do you handle filming as well as editing?","answer":"This depends on your location and project scope. We handle editing for footage you supply, and can arrange production for specific projects. We will clarify what is in scope during discovery."}]'::jsonb, 3, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description;

INSERT INTO public.services (slug, title, short_description, description, icon_name, color, featured, offerings, deliverables, process_steps, faqs, order_index, is_published)
VALUES ('ai-automation', 'AI & Automation', 'AI integrations, chatbots, workflow automation and business intelligence dashboards.', 'AI should create measurable value, not just novelty. We identify where automation and AI genuinely improve your workflows, customer experience or data visibility — then build and integrate thoughtfully.', 'Bot', '#0EA5C8', true, '[{"id":"ai-1","title":"AI Chatbots","description":"Intelligent conversational assistants for customer support, lead qualification and FAQs.","icon":"MessageSquare"},{"id":"ai-2","title":"Workflow Automation","description":"Connect your tools, eliminate manual tasks and build repeatable automated processes.","icon":"GitMerge"},{"id":"ai-3","title":"AI Integrations","description":"Embed AI capabilities — content generation, image processing, classification — into your product.","icon":"Cpu"},{"id":"ai-4","title":"Business Dashboards","description":"Visual dashboards that surface the data your team needs to make better decisions faster.","icon":"BarChart3"},{"id":"ai-5","title":"API Integrations","description":"Connect CRMs, payment systems, data sources and third-party tools into a cohesive workflow.","icon":"Plug"},{"id":"ai-6","title":"AI Consulting","description":"Identify where AI makes sense for your business — opportunity mapping without the hype.","icon":"Lightbulb"}]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[{"id":"af1","question":"Do I need to be technical to use AI tools you build?","answer":"No. We design for the end user. If your team will operate the system, we build it to match their workflow and provide training and documentation."},{"id":"af2","question":"What tools and platforms do you work with?","answer":"We work across OpenAI, Anthropic, Make, Zapier, n8n, custom APIs and more. Tool choice depends on your requirements, budget and existing tech stack."}]'::jsonb, 4, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description;

INSERT INTO public.services (slug, title, short_description, description, icon_name, color, featured, offerings, deliverables, process_steps, faqs, order_index, is_published)
VALUES ('other-digital-services', 'Other Digital Services', 'Consulting, data analysis, CRM setup, virtual assistance and ecommerce operations support.', 'Some digital needs do not fit neatly into a single category. We offer a range of supporting services for businesses that need practical, hands-on digital expertise without the overhead of full-time hires.', 'MoreHorizontal', '#B04EC4', false, '[{"id":"oth-1","title":"Digital Consulting","description":"Audits, roadmaps and strategy sessions to help you make better digital decisions.","icon":"Compass"},{"id":"oth-2","title":"Data Analysis","description":"Turn raw data into insight — reports, visualisations and recommendations.","icon":"BarChart2"},{"id":"oth-3","title":"CRM Setup & Management","description":"CRM configuration, pipeline setup, integrations and ongoing management.","icon":"Database"},{"id":"oth-4","title":"Virtual Assistance","description":"Executive support, research, scheduling and digital admin for busy founders and teams.","icon":"UserCheck"},{"id":"oth-5","title":"Ecommerce Operations","description":"Product listing, catalogue management, customer support and marketplace operations.","icon":"Package"},{"id":"oth-6","title":"Hosting & Domain Support","description":"Domain setup, DNS management, hosting configuration and migration support.","icon":"Server"}]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[{"id":"oth-faq-1","question":"What types of digital operations can you handle?","answer":"We assist with data cleanup, CRM configurations (HubSpot, Zoho, Salesforce), Shopify/WooCommerce catalog uploads, DNS migrations, email domain authentication (SPF, DKIM, DMARC), and custom technical advisory."},{"id":"oth-faq-2","question":"Can we book your team on a flexible monthly retainer?","answer":"Yes. We offer dedicated operational support retainers starting from 20 hours/month, giving you on-demand access to our technical and digital specialists without hiring full-time staff."},{"id":"oth-faq-3","question":"How quickly can your team onboard and begin execution?","answer":"Once scope is confirmed and access credentials are shared securely, we can typically commence operational tasks within 24–48 business hours."}]'::jsonb, 5, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description;

INSERT INTO public.portfolio_projects (slug, title, client, category, year, thumbnail, challenge, solution, outcome, metrics, technologies, gallery, is_concept, is_featured, is_published, order_index)
VALUES ('ecommerce-ux-prototype', 'D2C E-commerce Experience & Checkout Optimization', 'Zenith Organics', 'Web & App Development', '2025', '/portfolio/ecommerce-ux.svg', 'High mobile bounce rate and multi-step cart abandonment on the legacy store were capping online sales growth for this botanical wellness brand.', NULL, 'Demonstrated +42% mobile checkout conversion rate potential and sub-1.2s load speeds in simulated benchmark testing.', '[]'::jsonb, '["Next.js","React","Tailwind CSS","Razorpay","Figma"]'::jsonb, '[]'::jsonb, true, true, true, 0)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  outcome = EXCLUDED.outcome;

INSERT INTO public.portfolio_projects (slug, title, client, category, year, thumbnail, challenge, solution, outcome, metrics, technologies, gallery, is_concept, is_featured, is_published, order_index)
VALUES ('brand-identity-concept', 'Fintech Brand Identity & Scalable Design System', 'Aura Financial', 'Design & Branding', '2025', '/portfolio/brand-identity.svg', 'Aura Financial needed an authoritative, modern brand identity to transition from an early-stage concept into a credible commercial fintech platform.', NULL, 'Delivered a unified, institutional-grade visual system that established immediate market credibility and investor collateral standards.', '[]'::jsonb, '["Figma","Adobe Illustrator","Design Tokens"]'::jsonb, '[]'::jsonb, true, true, true, 1)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  outcome = EXCLUDED.outcome;

INSERT INTO public.portfolio_projects (slug, title, client, category, year, thumbnail, challenge, solution, outcome, metrics, technologies, gallery, is_concept, is_featured, is_published, order_index)
VALUES ('b2b-saas-platform', 'B2B SaaS Platform Redesign & Growth Pipeline', 'Nexar AI Solutions', 'Web & App Development', '2025', '/portfolio/saas-dashboard.svg', 'Nexar AI struggled to communicate the business ROI of its automation platform, leading to low demo booking rates on their corporate landing page.', NULL, 'Demonstrated a 2.3x increase in demo request funnel efficiency through interactive value calculators and simplified sign-up steps.', '[]'::jsonb, '["Next.js","TypeScript","Tailwind CSS","Chart.js","HubSpot"]'::jsonb, '[]'::jsonb, true, true, true, 2)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  outcome = EXCLUDED.outcome;

INSERT INTO public.portfolio_projects (slug, title, client, category, year, thumbnail, challenge, solution, outcome, metrics, technologies, gallery, is_concept, is_featured, is_published, order_index)
VALUES ('ai-chatbot-demo', '24/7 Intelligent Customer Assistant & CRM Sync', 'Apex Logistics & Freight', 'AI & Automation', '2025', '/portfolio/ai-chatbot.svg', 'Customer support teams were overwhelmed by repetitive tracking inquiries, rate requests, and delivery status calls across multiple regional hubs.', NULL, 'Demonstrated capability to automate 85%+ of repetitive shipment tracking requests with sub-1.5s latency and seamless agent handoff.', '[]'::jsonb, '["Python","OpenAI API","FastAPI","WhatsApp Cloud API","PostgreSQL"]'::jsonb, '[]'::jsonb, true, true, true, 3)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  outcome = EXCLUDED.outcome;

INSERT INTO public.portfolio_projects (slug, title, client, category, year, thumbnail, challenge, solution, outcome, metrics, technologies, gallery, is_concept, is_featured, is_published, order_index)
VALUES ('local-seo-revamp', 'Hospitality Local SEO & Direct Booking Growth', 'Kalyan Heritage Resort & Spa', 'Digital Marketing', '2024', '/portfolio/local-seo.svg', 'High dependence on Online Travel Agencies (OTAs) paying 18–22% commissions per booking was severely eroding operating margins for this heritage boutique hotel.', NULL, 'Demonstrated local search dominance framework to capture high-intent map searches and drive direct, commission-free reservations.', '[]'::jsonb, '["Google Search Console","Ahrefs","Schema.org","WordPress"]'::jsonb, '[]'::jsonb, true, true, true, 4)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  outcome = EXCLUDED.outcome;

INSERT INTO public.portfolio_projects (slug, title, client, category, year, thumbnail, challenge, solution, outcome, metrics, technologies, gallery, is_concept, is_featured, is_published, order_index)
VALUES ('performance-marketing-sprint', 'Omnichannel Paid Media Sprint & Creative Iteration', 'UrbanEdge Fashion', 'Digital Marketing', '2024', '/portfolio/performance-marketing.svg', 'Rising customer acquisition costs (CAC) and ad fatigue on Meta campaigns were producing unsustainable sub-1.8x ROAS for this apparel brand.', NULL, 'Standardized repeatable testing matrix to test multiple creative angles weekly while maintaining target blended return on ad spend.', '[]'::jsonb, '["Meta Ads Manager","Google Ads","Shopify","Triple Whale"]'::jsonb, '[]'::jsonb, true, true, true, 5)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  outcome = EXCLUDED.outcome;

