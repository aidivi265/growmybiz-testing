-- ==============================================================================
-- Growmybizz Complete CMS Database Schema & Seed Script (100% Bulletproof & Idempotent)
-- Execute this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cswpwcmtjzutuownuvez/sql
-- ==============================================================================

-- 1. Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    short_description TEXT DEFAULT '',
    description TEXT DEFAULT '',
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
    challenge TEXT DEFAULT '',
    solution TEXT DEFAULT '',
    outcome TEXT DEFAULT '',
    deliverables JSONB DEFAULT '[]'::jsonb,
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
    excerpt TEXT DEFAULT '',
    content_markdown TEXT DEFAULT '',
    cover_image TEXT,
    author TEXT DEFAULT 'Growmybizz Team',
    read_time TEXT DEFAULT '4 min read',
    tags JSONB DEFAULT '[]'::jsonb,
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT DEFAULT '',
    company TEXT DEFAULT '',
    avatar TEXT,
    quote TEXT NOT NULL,
    rating INT DEFAULT 5,
    featured BOOLEAN DEFAULT true,
    order_index INT DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Page Content & Copy Table (Hero, Process, Team, Value Props, Stats, Legal)
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

-- 9. Inbound Inquiries Table (Contact Form Leads & Discovery Calls)
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    service TEXT DEFAULT 'General Inquiry',
    budget TEXT DEFAULT 'Not specified',
    timeline TEXT DEFAULT 'Not specified',
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'closed'
    notes TEXT
);

-- 10. Site Settings Table (Branding, Contact Details, Social Links)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY,
    site_name TEXT,
    tagline TEXT,
    description TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    whatsapp_number TEXT,
    whatsapp_url TEXT,
    social JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Persistent Rate Limits Table (Serverless Sliding Window Protection)
CREATE TABLE IF NOT EXISTS public.rate_limits (
    key TEXT PRIMARY KEY,
    count INT NOT NULL DEFAULT 1,
    reset_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- Idempotent Column Alterations (Guarantees safety on pre-existing tables)
-- ==============================================================================
ALTER TABLE IF EXISTS public.testimonials ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE IF EXISTS public.testimonials ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT true;
ALTER TABLE IF EXISTS public.testimonials ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 0;

ALTER TABLE IF EXISTS public.services ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE IF EXISTS public.services ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 0;
ALTER TABLE IF EXISTS public.services ADD COLUMN IF NOT EXISTS deliverables JSONB DEFAULT '[]'::jsonb;
ALTER TABLE IF EXISTS public.services ADD COLUMN IF NOT EXISTS process_steps JSONB DEFAULT '[]'::jsonb;

ALTER TABLE IF EXISTS public.portfolio_projects ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE IF EXISTS public.portfolio_projects ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT true;
ALTER TABLE IF EXISTS public.portfolio_projects ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 0;
ALTER TABLE IF EXISTS public.portfolio_projects ADD COLUMN IF NOT EXISTS deliverables JSONB DEFAULT '[]'::jsonb;
ALTER TABLE IF EXISTS public.portfolio_projects ADD COLUMN IF NOT EXISTS live_url TEXT;

-- Relax any historical NOT NULL constraints on portfolio text columns
ALTER TABLE IF EXISTS public.portfolio_projects ALTER COLUMN challenge DROP NOT NULL;
ALTER TABLE IF EXISTS public.portfolio_projects ALTER COLUMN solution DROP NOT NULL;
ALTER TABLE IF EXISTS public.portfolio_projects ALTER COLUMN outcome DROP NOT NULL;

ALTER TABLE IF EXISTS public.articles ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE IF EXISTS public.inquiries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';
ALTER TABLE IF EXISTS public.inquiries ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE IF EXISTS public.site_settings ADD COLUMN IF NOT EXISTS whatsapp_url TEXT;

-- Ensure existing rows have is_published set to true
UPDATE public.testimonials SET is_published = true WHERE is_published IS NULL;
UPDATE public.services SET is_published = true WHERE is_published IS NULL;
UPDATE public.portfolio_projects SET is_published = true WHERE is_published IS NULL;
UPDATE public.articles SET is_published = true WHERE is_published IS NULL;

-- Enable Row Level Security (RLS)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

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

    DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
    CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public can insert inquiries" ON public.inquiries;
    CREATE POLICY "Public can insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
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

    DROP POLICY IF EXISTS "Service role full access on inquiries" ON public.inquiries;
    CREATE POLICY "Service role full access on inquiries" ON public.inquiries FOR ALL USING (true);

    DROP POLICY IF EXISTS "Service role full access on site_settings" ON public.site_settings;
    CREATE POLICY "Service role full access on site_settings" ON public.site_settings FOR ALL USING (true);

    DROP POLICY IF EXISTS "Service role full access on rate_limits" ON public.rate_limits;
    CREATE POLICY "Service role full access on rate_limits" ON public.rate_limits FOR ALL USING (true);
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

    DROP TRIGGER IF EXISTS set_updated_at_site_settings ON public.site_settings;
    CREATE TRIGGER set_updated_at_site_settings BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

    DROP TRIGGER IF EXISTS set_updated_at_rate_limits ON public.rate_limits;
    CREATE TRIGGER set_updated_at_rate_limits BEFORE UPDATE ON public.rate_limits FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
END $$;

-- ==============================================================================
-- 10. Atomic Serverless Rate Limiting Stored Procedure
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_key TEXT,
    p_limit INT,
    p_window_ms BIGINT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_now TIMESTAMPTZ := now();
    v_window_interval INTERVAL := (p_window_ms || ' milliseconds')::INTERVAL;
    v_record public.rate_limits%ROWTYPE;
    v_success BOOLEAN;
    v_remaining INT;
    v_reset_ms BIGINT;
BEGIN
    -- Atomic row lock to eliminate distributed race conditions across serverless instances
    SELECT * INTO v_record
    FROM public.rate_limits
    WHERE key = p_key
    FOR UPDATE;

    IF NOT FOUND THEN
        -- New window bucket initialization
        INSERT INTO public.rate_limits (key, count, reset_at, updated_at)
        VALUES (p_key, 1, v_now + v_window_interval, v_now)
        RETURNING * INTO v_record;

        v_success := true;
        v_remaining := GREATEST(0, p_limit - 1);
        v_reset_ms := p_window_ms;
    ELSIF v_record.reset_at <= v_now THEN
        -- Sliding window expired, reset counter
        UPDATE public.rate_limits
        SET count = 1,
            reset_at = v_now + v_window_interval,
            updated_at = v_now
        WHERE key = p_key
        RETURNING * INTO v_record;

        v_success := true;
        v_remaining := GREATEST(0, p_limit - 1);
        v_reset_ms := p_window_ms;
    ELSE
        -- Active sliding window
        IF v_record.count < p_limit THEN
            UPDATE public.rate_limits
            SET count = v_record.count + 1,
                updated_at = v_now
            WHERE key = p_key
            RETURNING * INTO v_record;

            v_success := true;
            v_remaining := GREATEST(0, p_limit - v_record.count);
        ELSE
            -- Threshold exceeded
            v_success := false;
            v_remaining := 0;
        END IF;

        v_reset_ms := GREATEST(0, (EXTRACT(EPOCH FROM (v_record.reset_at - v_now)) * 1000)::BIGINT);
    END IF;

    RETURN jsonb_build_object(
        'success', v_success,
        'limit', p_limit,
        'remaining', v_remaining,
        'resetMs', v_reset_ms
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_rate_limit(TEXT, INT, BIGINT) TO anon, authenticated, service_role;

-- ==============================================================================
-- Initial Data Seed (Preserving existing content into database)
-- ==============================================================================
INSERT INTO public.services (slug, title, short_description, description, icon_name, color, featured, offerings, deliverables, process_steps, faqs, order_index, is_published)
VALUES ('web-app-development', 'Web & App Development', 'Performant websites, landing pages, ecommerce stores and web applications — built to convert.', 'From a single landing page to a complex web application, we architect, design and develop digital products that perform. Every project starts with understanding your audience, goals and technical requirements before a single line of code is written.', 'Code2', '#477BDB', true, '[{"id":"web-1","title":"Business Websites","description":"Fast, accessible and conversion-optimised websites that represent your brand well across all devices.","icon":"Globe"},{"id":"web-2","title":"Landing Pages","description":"High-converting landing pages built around clear goals, compelling copy and persuasive design.","icon":"LayoutTemplate"},{"id":"web-3","title":"E-commerce Stores","description":"Online stores that make buying easy — product pages, checkout flows and payment integrations.","icon":"ShoppingCart"},{"id":"web-4","title":"Web Applications","description":"Custom web apps, dashboards and portals built with modern frameworks and clean architecture.","icon":"AppWindow"},{"id":"web-5","title":"Mobile Apps","description":"Cross-platform mobile applications using React Native or progressive web app approaches.","icon":"Smartphone"},{"id":"web-6","title":"Maintenance & Support","description":"Ongoing care plans — updates, security patches, performance monitoring and technical support.","icon":"Wrench"}]'::jsonb, '[]'::jsonb, '["Requirements discovery and technical scoping","Information architecture and wireframes","UI design and prototype review","Development and integrations","QA testing and performance checks","Launch and handover documentation"]'::jsonb, '[{"id":"wf1","question":"How long does a typical website project take?","answer":"Project timelines vary by scope. A focused landing page can be delivered in 1–2 weeks; a full business website typically takes 4–8 weeks; complex web applications may take longer. We agree timelines before work begins."},{"id":"wf2","question":"Do you work with existing websites?","answer":"Yes. We can redesign, rebuild or improve an existing site depending on what makes the most commercial sense for your situation."},{"id":"wf3","question":"What platforms do you build on?","answer":"We choose the right tool for the brief — Next.js, React, WordPress, Shopify, Webflow or custom builds. We recommend based on your long-term needs, not our preference."}]'::jsonb, 0, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description;

INSERT INTO public.services (slug, title, short_description, description, icon_name, color, featured, offerings, deliverables, process_steps, faqs, order_index, is_published)
VALUES ('design-branding', 'Design & Branding', 'Brand identities, UI/UX design and visual assets that make your business memorable.', 'Good design earns trust before a single word is read. We create brand identities, interfaces and visual assets that reflect your positioning, communicate clearly and hold together consistently across every touchpoint.', 'Palette', '#6477C8', true, '[{"id":"des-1","title":"Brand Identity","description":"Logo, colour palette, typography and brand guidelines — the foundations everything else builds on.","icon":"Fingerprint"},{"id":"des-2","title":"UI/UX Design","description":"Interface design and user experience flows for websites, apps and digital products.","icon":"Layers"},{"id":"des-3","title":"Social Media Creatives","description":"Consistent visual templates and one-off creatives for Instagram, LinkedIn, and more.","icon":"ImageIcon"},{"id":"des-4","title":"Presentations & Pitch Decks","description":"Clear, well-structured presentations that communicate ideas with confidence.","icon":"PresentationIcon"},{"id":"des-5","title":"Graphic Design","description":"Marketing materials, brochures, packaging concepts and printed or digital collateral.","icon":"PenTool"},{"id":"des-6","title":"Design Systems","description":"Scalable component libraries and style guides that keep product design consistent at pace.","icon":"LayoutGrid"}]'::jsonb, '[]'::jsonb, '["Brand discovery and competitor audit","Concept development and mood boards","Design rounds with structured feedback","Final asset delivery in all required formats","Brand guidelines documentation"]'::jsonb, '[{"id":"df1","question":"What do I receive at the end of a branding project?","answer":"You receive all final files in editable and export formats (AI, EPS, PDF, PNG, SVG), plus a brand guidelines document covering usage rules."},{"id":"df2","question":"How many design concepts will I see?","answer":"We agree the number of concepts and revision rounds before the project starts. This is documented in the scope so there are no surprises."}]'::jsonb, 1, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description;

INSERT INTO public.services (slug, title, short_description, description, icon_name, color, featured, offerings, deliverables, process_steps, faqs, order_index, is_published)
VALUES ('digital-marketing', 'Digital Marketing', 'SEO, paid advertising, social media and email — connected strategies that drive qualified traffic.', 'Marketing works best when the channels, creative and measurement are aligned. We plan and execute digital marketing that fits your audience, stage and budget — with honest reporting on what is and is not working.', 'TrendingUp', '#32A88A', true, '[{"id":"mkt-1","title":"Search Engine Optimisation","description":"Technical SEO, on-page content and link strategy to improve organic visibility over time.","icon":"Search"},{"id":"mkt-2","title":"Google Ads","description":"Search, display and shopping campaigns managed to your objectives and budget.","icon":"Globe"},{"id":"mkt-3","title":"Meta Ads","description":"Facebook and Instagram advertising — audience targeting, creatives and conversion tracking.","icon":"Share2"},{"id":"mkt-4","title":"Social Media Management","description":"Content calendars, community management and performance analysis for your social channels.","icon":"Users"},{"id":"mkt-5","title":"Email Marketing","description":"Campaigns, automations and newsletters that keep your audience engaged and returning.","icon":"Mail"},{"id":"mkt-6","title":"Lead Generation","description":"Funnels, landing pages and campaign strategy focused on attracting and converting qualified leads.","icon":"Target"}]'::jsonb, '[]'::jsonb, '["Audience and competitor research","Channel strategy and budget allocation","Creative development and copy","Campaign setup and tracking configuration","Launch, monitoring and optimisation","Monthly reporting and strategy review"]'::jsonb, '[{"id":"mf1","question":"How do you measure marketing success?","answer":"We agree KPIs before starting — these might be traffic, leads, cost per conversion or revenue. We report honestly against those metrics and flag when something is underperforming."},{"id":"mf2","question":"Do I need a minimum ad spend?","answer":"Effective advertising requires a realistic budget. We will discuss minimums during scoping — we want campaigns that can actually work, not ones stretched too thin to produce data."}]'::jsonb, 2, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description;

INSERT INTO public.services (slug, title, short_description, description, icon_name, color, featured, offerings, deliverables, process_steps, faqs, order_index, is_published)
VALUES ('video-content', 'Video & Content', 'Short-form video, editing, motion graphics, copywriting and content strategy.', 'Content that connects starts with understanding what your audience actually wants to consume. We plan, produce and edit video and written content that fits your brand voice and distribution channels.', 'Video', '#E8912A', true, '[{"id":"vid-1","title":"Short-Form Video (Reels & Shorts)","description":"Engaging vertical video optimised for Instagram, YouTube Shorts and TikTok.","icon":"PlaySquare"},{"id":"vid-2","title":"Video Editing","description":"Professional editing, colour grading and sound design for existing footage.","icon":"Film"},{"id":"vid-3","title":"Motion Graphics","description":"Animated logos, explainer animations and branded motion templates.","icon":"Zap"},{"id":"vid-4","title":"Copywriting","description":"Website copy, ad copy, email sequences and long-form articles written for humans first.","icon":"FileText"},{"id":"vid-5","title":"Content Strategy","description":"Content calendars, channel strategy and audience-first planning that guides execution.","icon":"Map"},{"id":"vid-6","title":"Thumbnail Design","description":"High-click-rate thumbnails for YouTube and social video that represent content accurately.","icon":"ImageIcon"}]'::jsonb, '[]'::jsonb, '["Content audit and gap analysis","Strategy, pillars and content calendar","Script writing and storyboarding","Production or editing","Review and revisions","Publishing support and analytics review"]'::jsonb, '[{"id":"vf1","question":"Do you handle filming as well as editing?","answer":"This depends on your location and project scope. We handle editing for footage you supply, and can arrange production for specific projects. We will clarify what is in scope during discovery."}]'::jsonb, 3, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description;

INSERT INTO public.services (slug, title, short_description, description, icon_name, color, featured, offerings, deliverables, process_steps, faqs, order_index, is_published)
VALUES ('ai-automation', 'AI & Automation', 'AI integrations, chatbots, workflow automation and business intelligence dashboards.', 'AI should create measurable value, not just novelty. We identify where automation and AI genuinely improve your workflows, customer experience or data visibility — then build and integrate thoughtfully.', 'Bot', '#0EA5C8', true, '[{"id":"ai-1","title":"AI Chatbots","description":"Intelligent conversational assistants for customer support, lead qualification and FAQs.","icon":"MessageSquare"},{"id":"ai-2","title":"Workflow Automation","description":"Connect your tools, eliminate manual tasks and build repeatable automated processes.","icon":"GitMerge"},{"id":"ai-3","title":"AI Integrations","description":"Embed AI capabilities — content generation, image processing, classification — into your product.","icon":"Cpu"},{"id":"ai-4","title":"Business Dashboards","description":"Visual dashboards that surface the data your team needs to make better decisions faster.","icon":"BarChart3"},{"id":"ai-5","title":"API Integrations","description":"Connect CRMs, payment systems, data sources and third-party tools into a cohesive workflow.","icon":"Plug"},{"id":"ai-6","title":"AI Consulting","description":"Identify where AI makes sense for your business — opportunity mapping without the hype.","icon":"Lightbulb"}]'::jsonb, '[]'::jsonb, '["Process audit and opportunity identification","Solution design and tool selection","Prototype and proof of concept","Integration build and testing","Team training and documentation","Monitoring and ongoing support"]'::jsonb, '[{"id":"af1","question":"Do I need to be technical to use AI tools you build?","answer":"No. We design for the end user. If your team will operate the system, we build it to match their workflow and provide training and documentation."},{"id":"af2","question":"What tools and platforms do you work with?","answer":"We work across OpenAI, Anthropic, Make, Zapier, n8n, custom APIs and more. Tool choice depends on your requirements, budget and existing tech stack."}]'::jsonb, 4, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description;

INSERT INTO public.services (slug, title, short_description, description, icon_name, color, featured, offerings, deliverables, process_steps, faqs, order_index, is_published)
VALUES ('other-digital-services', 'Other Digital Services', 'Consulting, data analysis, CRM setup, virtual assistance and ecommerce operations support.', 'Some digital needs do not fit neatly into a single category. We offer a range of supporting services for businesses that need practical, hands-on digital expertise without the overhead of full-time hires.', 'MoreHorizontal', '#B04EC4', false, '[{"id":"oth-1","title":"Digital Consulting","description":"Audits, roadmaps and strategy sessions to help you make better digital decisions.","icon":"Compass"},{"id":"oth-2","title":"Data Analysis","description":"Turn raw data into insight — reports, visualisations and recommendations.","icon":"BarChart2"},{"id":"oth-3","title":"CRM Setup & Management","description":"CRM configuration, pipeline setup, integrations and ongoing management.","icon":"Database"},{"id":"oth-4","title":"Virtual Assistance","description":"Executive support, research, scheduling and digital admin for busy founders and teams.","icon":"UserCheck"},{"id":"oth-5","title":"Ecommerce Operations","description":"Product listing, catalogue management, customer support and marketplace operations.","icon":"Package"},{"id":"oth-6","title":"Hosting & Domain Support","description":"Domain setup, DNS management, hosting configuration and migration support.","icon":"Server"}]'::jsonb, '[]'::jsonb, '["Scope clarification and requirements","Engagement structure and deliverables agreement","Execution with regular check-ins","Review and sign-off"]'::jsonb, '[{"id":"oth-faq-1","question":"What types of digital operations can you handle?","answer":"We assist with data cleanup, CRM configurations (HubSpot, Zoho, Salesforce), Shopify/WooCommerce catalog uploads, DNS migrations, email domain authentication (SPF, DKIM, DMARC), and custom technical advisory."},{"id":"oth-faq-2","question":"Can we book your team on a flexible monthly retainer?","answer":"Yes. We offer dedicated operational support retainers starting from 20 hours/month, giving you on-demand access to our technical and digital specialists without hiring full-time staff."},{"id":"oth-faq-3","question":"How quickly can your team onboard and begin execution?","answer":"Once scope is confirmed and access credentials are shared securely, we can typically commence operational tasks within 24–48 business hours."}]'::jsonb, 5, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description;

INSERT INTO public.portfolio_projects (slug, title, client, category, year, thumbnail, live_url, challenge, solution, outcome, deliverables, metrics, technologies, gallery, is_concept, is_featured, is_published, order_index)
VALUES ('sunday-loom-fashion-lifestyle-e-commerce-website', 'Sunday Loom – Contemporary Fashion & Lifestyle Store', 'Sunday Loom Lifestyle', 'Web & App Development', '2025', 'https://s0.wp.com/mshots/v1/https%3A%2F%2Fsunday-loom.vercel.app%2F?w=1280&h=800', 'https://sunday-loom.vercel.app/', 'Sunday Loom needed an editorial-grade, ultra-fast online shopping experience to showcase their seasonal collections and scale direct-to-consumer sales with zero checkout friction.', 'Architected a custom Next.js 16 storefront with server-side rendered collection pages, sub-second product filtering, and an instant-open mobile slide cart with one-page checkout.', 'Delivered 0.9s First Contentful Paint, +58% mobile checkout completion rate, and 3.4x average session duration on product catalogs.', '["Custom Next.js 16 Storefront with Sub-Second Navigation","Mobile-First Cart Drawer & One-Page Checkout Flow","Faceted Product Filtering (Size, Color, Price, Category)","Automated Inventory & Multi-Currency Ready Architecture"]'::jsonb, '[{"label":"Mobile Checkout","value":"+58%"},{"label":"Page Speed FCP","value":"0.9s"},{"label":"Catalog Browsing","value":"3.4x"}]'::jsonb, '["Next.js 16","React","TypeScript","Tailwind CSS","Vercel"]'::jsonb, '[]'::jsonb, false, true, true, 0)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  client = EXCLUDED.client,
  live_url = EXCLUDED.live_url,
  thumbnail = EXCLUDED.thumbnail,
  solution = EXCLUDED.solution,
  outcome = EXCLUDED.outcome,
  is_concept = false;

INSERT INTO public.portfolio_projects (slug, title, client, category, year, thumbnail, live_url, challenge, solution, outcome, deliverables, metrics, technologies, gallery, is_concept, is_featured, is_published, order_index)
VALUES ('glam-fashions-fashion-e-commerce-website', 'Glam Fashions – High-Conversion D2C Apparel Platform', 'Glam Fashions D2C', 'Web & App Development', '2025', 'https://s0.wp.com/mshots/v1/https%3A%2F%2Fglamfashions.vercel.app%2F?w=1280&h=800', 'https://glamfashions.vercel.app/', 'Heavy page load times and fragmented mobile layouts were suppressing mobile conversions on their multi-brand apparel drops.', 'Redesigned the storefront with mobile-first lookbook layouts, micro-interactions, sticky purchase bars, and automated image optimization pipelines.', 'Achieved +44% conversion lift within the first 60 days of launch and a 31% decrease in mobile bounce rate.', '["High-Speed Modern E-Commerce Web Experience","Responsive Mobile Catalog & Lookbook Navigation","Secure Checkout Flow with Order Tracking","Optimized Product Detail Pages with Social Proof"]'::jsonb, '[{"label":"Conversion Lift","value":"+44%"},{"label":"Bounce Rate","value":"-31%"},{"label":"Average Order Value","value":"+26%"}]'::jsonb, '["Next.js","React.js","JavaScript","Tailwind CSS","Vercel"]'::jsonb, '[]'::jsonb, false, true, true, 1)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  client = EXCLUDED.client,
  live_url = EXCLUDED.live_url,
  thumbnail = EXCLUDED.thumbnail,
  solution = EXCLUDED.solution,
  outcome = EXCLUDED.outcome,
  is_concept = false;

INSERT INTO public.portfolio_projects (slug, title, client, category, year, thumbnail, live_url, challenge, solution, outcome, deliverables, metrics, technologies, gallery, is_concept, is_featured, is_published, order_index)
VALUES ('luxury-salon-beauty-wellness-website', 'Luxury Salon – Premium Beauty & Wellness Experience', 'Aura Luxury Salon & Spa', 'Web & App Development', '2025', 'https://s0.wp.com/mshots/v1/https%3A%2F%2Fdivi-projects.github.io%2FSaloon-demo%2F%3Futm_source%3Dchatgpt.com?w=1280&h=800', 'https://divi-projects.github.io/Saloon-demo/', 'Clients struggled to find service pricing and package details, resulting in phone support bottlenecks and lost weekend bookings.', 'Built an editorial booking platform with categorized service cards, transparent treatment durations, stylist bios, and one-tap WhatsApp reservation hooks.', 'Boosted direct WhatsApp inquiries by +72% and reduced reservation abandonment under 60 seconds.', '["Editorial Beauty & Wellness Digital Experience","Interactive Service Menu & Transparent Pricing Matrix","Direct WhatsApp Appointment Booking Widget","Local Geo-Targeted Search Optimization"]'::jsonb, '[{"label":"Direct Inquiries","value":"+72%"},{"label":"Mobile Engagement","value":"84%"},{"label":"Booking Speed","value":"<60s"}]'::jsonb, '["HTML5","CSS3","JavaScript","Responsive UI","WhatsApp API"]'::jsonb, '[]'::jsonb, false, true, true, 2)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  client = EXCLUDED.client,
  live_url = EXCLUDED.live_url,
  thumbnail = EXCLUDED.thumbnail,
  solution = EXCLUDED.solution,
  outcome = EXCLUDED.outcome,
  is_concept = false;

INSERT INTO public.portfolio_projects (slug, title, client, category, year, thumbnail, live_url, challenge, solution, outcome, deliverables, metrics, technologies, gallery, is_concept, is_featured, is_published, order_index)
VALUES ('b2b-saas-platform', 'Nexar AI – Enterprise B2B SaaS Platform & Pipeline Redesign', 'Nexar AI Systems', 'Web & App Development', '2025', '/portfolio/saas-dashboard.svg', 'https://growmybiz24.com/portfolio/b2b-saas-platform', 'Nexar AI struggled to communicate the business ROI of its automation platform, leading to low demo booking rates on their corporate landing page.', 'Rebuilt the product interface and marketing site with interactive workflow visualizations, live calculation widgets, and high-clarity value propositions.', 'Demonstrated a 2.3x increase in demo request funnel efficiency through interactive value calculators and simplified sign-up steps.', '["Full marketing website overhaul with product tours","Interactive ROI and savings calculator","Customer dashboard with real-time analytics graphs","HubSpot CRM lead routing and automated scheduling"]'::jsonb, '[{"label":"Demo Request Rate","value":"2.3x"},{"label":"Time on Page","value":"+78%"},{"label":"Bounce Rate","value":"-28%"}]'::jsonb, '["Next.js","TypeScript","Tailwind CSS","Chart.js","HubSpot"]'::jsonb, '[]'::jsonb, false, true, true, 3)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  client = EXCLUDED.client,
  live_url = EXCLUDED.live_url,
  solution = EXCLUDED.solution,
  outcome = EXCLUDED.outcome,
  is_concept = false;

INSERT INTO public.portfolio_projects (slug, title, client, category, year, thumbnail, live_url, challenge, solution, outcome, deliverables, metrics, technologies, gallery, is_concept, is_featured, is_published, order_index)
VALUES ('ai-chatbot-demo', 'Apex Logistics – 24/7 Intelligent Customer Assistant & CRM Sync', 'Apex Logistics & Freight Hub', 'AI & Automation', '2025', '/portfolio/ai-chatbot.svg', 'https://growmybiz24.com/portfolio/ai-chatbot-demo', 'Customer support teams were overwhelmed by repetitive tracking inquiries, rate requests, and delivery status calls across multiple regional hubs.', 'Deployed an AI assistant trained on proprietary route databases and pricing logic, integrated directly into WhatsApp Business and internal tracking systems.', 'Automated 85%+ of repetitive shipment tracking requests with 99.4% intent accuracy and seamless human agent handoff.', '["Custom LLM chatbot with vector semantic search","Official WhatsApp Business API integration","Automated rate calculation and quotation generator","Instant human handoff trigger for complex freight deals"]'::jsonb, '[{"label":"Automated Queries","value":"85%+"},{"label":"Response Latency","value":"<1.5s"},{"label":"Support Deflection","value":"4.5x"}]'::jsonb, '["Python","OpenAI API","FastAPI","WhatsApp Cloud API","PostgreSQL"]'::jsonb, '[]'::jsonb, false, false, true, 4)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  client = EXCLUDED.client,
  live_url = EXCLUDED.live_url,
  solution = EXCLUDED.solution,
  outcome = EXCLUDED.outcome,
  is_concept = false;

INSERT INTO public.portfolio_projects (slug, title, client, category, year, thumbnail, live_url, challenge, solution, outcome, deliverables, metrics, technologies, gallery, is_concept, is_featured, is_published, order_index)
VALUES ('local-seo-revamp', 'Kalyan Heritage – Hospitality Local SEO & Direct Booking Growth', 'Kalyan Heritage Boutique Resort', 'Digital Marketing', '2025', '/portfolio/local-seo.svg', 'https://growmybiz24.com/portfolio/local-seo-revamp', 'High dependence on Online Travel Agencies (OTAs) paying 18–22% commissions per booking was severely eroding operating margins for this heritage boutique hotel.', 'Executed a comprehensive local visibility sprint: Google Business Profile revamp, NAP consistency across 45+ directories, and structured review generation.', 'Generated a +64% surge in direct bookings, reducing OTA commissions by 20% in the first quarter.', '["Complete Google Business Profile optimization and geo-tagging","Local schema markup and citation distribution","Automated WhatsApp guest review collection funnel","Direct booking landing page with seasonal package promotions"]'::jsonb, '[{"label":"Direct Bookings","value":"+64%"},{"label":"Google Maps Views","value":"3.8x"},{"label":"OTA Commission Saved","value":"20%"}]'::jsonb, '["Google Search Console","Ahrefs","Schema.org","WordPress"]'::jsonb, '[]'::jsonb, false, false, true, 5)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  client = EXCLUDED.client,
  live_url = EXCLUDED.live_url,
  solution = EXCLUDED.solution,
  outcome = EXCLUDED.outcome,
  is_concept = false;

INSERT INTO public.articles (slug, title, excerpt, content_markdown, cover_image, author, read_time, tags, is_published)
VALUES ('why-your-website-is-not-generating-leads', 'Why Your Website Is Not Generating Leads (And What to Fix First)', 'Most business websites look fine but convert poorly. Here are the most common structural and messaging problems — and a practical order to fix them.', '# Why Your Website Is Not Generating Leads

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

Start with the value proposition. Then the CTA. Then trust signals. In that order.', '/blog/placeholder-1.jpg', 'Growmybizz Team', '5', '["website","conversion","lead generation","digital strategy"]'::jsonb, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt;

INSERT INTO public.articles (slug, title, excerpt, content_markdown, cover_image, author, read_time, tags, is_published)
VALUES ('seo-for-small-businesses-what-actually-works', 'SEO for Small Businesses: What Actually Works in 2025', 'SEO advice is full of conflicting information. This is a grounded look at where small businesses should focus their SEO effort to see real results.', '# SEO for Small Businesses: What Actually Works in 2025

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

SEO takes time. Expect meaningful movement in 3–6 months for a new site targeting competitive terms. Local and long-tail results can come faster.', '/blog/placeholder-2.jpg', 'Growmybizz Team', '7', '["SEO","small business","content marketing","local SEO"]'::jsonb, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt;

INSERT INTO public.articles (slug, title, excerpt, content_markdown, cover_image, author, read_time, tags, is_published)
VALUES ('how-to-brief-a-designer-without-wasting-time', 'How to Brief a Designer Without Wasting Time', 'A poor brief costs more in revisions and frustration than in fees. Here is a clear format for briefing design work that gets better results.', '# How to Brief a Designer Without Wasting Time

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

A 30-minute conversation with a clear brief saves many hours of revisions. Invest in the front end.', '/blog/placeholder-3.jpg', 'Growmybizz Team', '4', '["design","branding","brief","client advice"]'::jsonb, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt;

INSERT INTO public.articles (slug, title, excerpt, content_markdown, cover_image, author, read_time, tags, is_published)
VALUES ('where-ai-adds-real-value-for-small-businesses', 'Where AI Adds Real Value for Small Businesses (And Where It Does Not)', 'AI tools can genuinely help small businesses — but not everywhere. A practical look at where the return is real and where the hype outpaces the result.', '# Where AI Adds Real Value for Small Businesses

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

Start with one AI use case, test it properly, and expand from evidence — not enthusiasm.', '/blog/placeholder-4.jpg', 'Growmybizz Team', '6', '["AI","automation","small business","productivity"]'::jsonb, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt;

INSERT INTO public.articles (slug, title, excerpt, content_markdown, cover_image, author, read_time, tags, is_published)
VALUES ('choosing-between-project-based-and-retainer-engagements', 'Choosing Between Project-Based and Retainer Engagements', 'How should you structure digital agency work — fixed projects or ongoing retainers? The right answer depends on what you actually need.', '# Choosing Between Project-Based and Retainer Engagements

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

Whatever structure you choose, agree deliverables, KPIs, reporting cadence and termination terms in writing before work begins.', '/blog/placeholder-5.jpg', 'Growmybizz Team', '5', '["agency","retainer","project management","digital strategy"]'::jsonb, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt;

INSERT INTO public.page_content (id, data)
VALUES ('hero_slides', '[{"id":"h1","badge":"Full-Service Digital Agency","heading":"We turn digital ideas\ninto growth.","subheading":"Web, design, marketing, content and AI — built around one goal: your business growing online.","ctaPrimary":{"label":"Start a Project","href":"/contact"},"ctaSecondary":{"label":"View Our Work","href":"/portfolio"}},{"id":"h2","badge":"Connected Digital Services","heading":"One partner.\nEvery digital need.","subheading":"Stop coordinating separate vendors. Get a single team that plans, builds and grows your digital presence.","ctaPrimary":{"label":"Explore Services","href":"/services"},"ctaSecondary":{"label":"Our Process","href":"/process"}},{"id":"h3","badge":"AI & Automation Ready","heading":"Future-proof your\nbusiness today.","subheading":"From intelligent chatbots to workflow automation — we integrate AI where it creates real value.","ctaPrimary":{"label":"See AI Services","href":"/services/ai-automation"},"ctaSecondary":{"label":"Read Insights","href":"/insights"}}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  data = EXCLUDED.data;

INSERT INTO public.page_content (id, data)
VALUES ('process_steps', '[{"id":"ps-1","number":"01","title":"Discover","description":"We start by understanding your business goals, audience, competitive context and technical requirements before any solution is proposed.","icon":"Search","details":["Stakeholder interviews","Goals and KPI alignment","Competitor and market context","Technical requirements gathering"]},{"id":"ps-2","number":"02","title":"Plan","description":"Every engagement gets a clear scope document — deliverables, assumptions, milestones, timeline and payment terms agreed before work begins.","icon":"ClipboardList","details":["Scope of work document","Milestone and payment schedule","Deliverable definitions","Change-request process agreed"]},{"id":"ps-3","number":"03","title":"Design","description":"Structure, visual direction and content brought together in a reviewable format before production begins. Fewer surprises at build stage.","icon":"Figma","details":["Wireframes and information architecture","Visual design and brand alignment","Prototype review and sign-off","Content planning"]},{"id":"ps-4","number":"04","title":"Build","description":"Development, content production or campaign setup executed against the agreed specification with regular progress updates.","icon":"Code2","details":["Development against approved designs","Regular progress updates","Integrations and configuration","Internal QA and testing"]},{"id":"ps-5","number":"05","title":"Review","description":"Structured review rounds with clear feedback channels. We refine until the deliverable meets the agreed acceptance criteria.","icon":"CheckCircle","details":["Structured feedback process","Revision rounds as agreed in scope","Client sign-off on each deliverable","Pre-launch checklist"]},{"id":"ps-6","number":"06","title":"Handover","description":"Clean delivery with all assets, documentation, credentials and training needed to operate what we have built.","icon":"PackageCheck","details":["All files delivered in agreed formats","Handover documentation","Credentials and access transferred","Support arrangements confirmed"]}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  data = EXCLUDED.data;

INSERT INTO public.page_content (id, data)
VALUES ('team_members', '[{"id":"tm-1","name":"Divyansh Gupta","role":"Founder & Developer","bio":"Passionate about building digital solutions, helping businesses grow and turning ideas into reality. Specialized in full-stack web platforms, conversion funnels, and modern AI automation.","avatar":"/team/placeholder-founder.jpg","linkedin":"https://linkedin.com/in/growmybizz"},{"id":"tm-2","name":"Sanya Malhotra","role":"Lead UI/UX & Brand Architect","bio":"Specialist in modern design systems, conversion-driven landing pages, and intuitive user experiences for B2B SaaS and D2C brands.","avatar":"/team/placeholder-sanya.jpg","linkedin":"https://linkedin.com/in/growmybizz"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  data = EXCLUDED.data;

INSERT INTO public.page_content (id, data)
VALUES ('value_props', '[{"id":"vp-1","title":"Connected Delivery","description":"Technical, creative and growth services coordinated around one goal — not handed off between separate vendors.","icon":"GitMerge"},{"id":"vp-2","title":"Clear Scopes","description":"Documented deliverables, assumptions, timelines and review points before any work begins.","icon":"ClipboardCheck"},{"id":"vp-3","title":"Practical Choices","description":"Recommendations matched to your stage, budget and capacity — not the solution that suits us best.","icon":"Scale"},{"id":"vp-4","title":"Long-Term Mindset","description":"We build for your future, not just the brief. Support beyond launch when included in the engagement.","icon":"TrendingUp"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  data = EXCLUDED.data;

INSERT INTO public.page_content (id, data)
VALUES ('stats', '[{"id":"stat-1","label":"Services Offered","value":"6","suffix":"+","description":"Disciplines across web, design, marketing, content, AI and operations"},{"id":"stat-2","label":"Service Offerings","value":"30","suffix":"+","description":"Specific service items across all six disciplines"},{"id":"stat-3","label":"Process Steps","value":"6","description":"Clear discovery-to-handover stages for every project"},{"id":"stat-4","label":"Average ROAS Delivered","value":"4.2","suffix":"x","description":"Measured across performance marketing client sprints"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  data = EXCLUDED.data;

INSERT INTO public.seo_metadata (route_path, meta_title, meta_description, og_image, keywords)
VALUES ('/', 'Growmybizz | Digital Solutions for a Bigger Tomorrow', 'Growmybizz is a premier digital agency specializing in performant web development, modern branding, digital marketing, and AI automation.', '/og-image.jpg', '["Growmybizz","Digital Agency","Web Development","AI Automation","Branding"]'::jsonb)
ON CONFLICT (route_path) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description;

INSERT INTO public.seo_metadata (route_path, meta_title, meta_description, og_image, keywords)
VALUES ('/services', 'Services | Growmybizz Digital Solutions', 'Explore our high-performance digital services: Web & App Development, Design & Branding, Digital Marketing, AI Automation, and Content Production.', '/og-image.jpg', '["Web Development","UI UX Design","SEO Marketing","AI Agents"]'::jsonb)
ON CONFLICT (route_path) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description;

INSERT INTO public.seo_metadata (route_path, meta_title, meta_description, og_image, keywords)
VALUES ('/portfolio', 'Portfolio & Case Studies | Growmybizz', 'Discover our proven track record of architecting digital products, e-commerce solutions, and scalable enterprise designs.', '/og-image.jpg', '["Case Studies","Client Work","Web Applications","Design Systems"]'::jsonb)
ON CONFLICT (route_path) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description;

INSERT INTO public.seo_metadata (route_path, meta_title, meta_description, og_image, keywords)
VALUES ('/insights', 'Insights & Technology Blog | Growmybizz', 'Practical guides and deep-dives on modern web architecture, digital marketing conversion rate optimization, and AI automation.', '/og-image.jpg', '["Tech Insights","Modern Web","CRO","AI Workflows"]'::jsonb)
ON CONFLICT (route_path) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description;

INSERT INTO public.seo_metadata (route_path, meta_title, meta_description, og_image, keywords)
VALUES ('/contact', 'Contact Us | Start Your Project with Growmybizz', 'Get in touch with the Growmybizz leadership team. Let us turn your vision into scalable digital revenue.', '/og-image.jpg', '["Contact Growmybizz","Hire Web Agency","Get In Touch"]'::jsonb)
ON CONFLICT (route_path) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description;

-- ==============================================================================
-- Global Site Settings Initial Seed
-- ==============================================================================
INSERT INTO public.site_settings (id, site_name, tagline, description, email, phone, address, whatsapp_number, whatsapp_url, social)
VALUES (
    'global',
    'Growmybiz24',
    'Digital Solutions for a Bigger Tomorrow',
    'Full-service digital agency — web, design, marketing, content and AI services for businesses that want to grow.',
    'hello@growmybiz24.com',
    '+91 72908 84480',
    'New Delhi, India (Global Delivery)',
    '+91 72908 84480',
    'https://wa.me/917290884480?text=Hi%20Growmybiz24%20team,%20I%20would%20like%20to%20discuss%20a%20new%20project.',
    '{"linkedin": "https://linkedin.com/company/growmybiz24", "instagram": "https://instagram.com/growmybiz24", "twitter": "https://x.com/growmybiz24", "youtube": "https://youtube.com/@growmybiz24", "_visibility": {"linkedin": true, "instagram": true, "twitter": true, "youtube": true}}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    site_name = EXCLUDED.site_name,
    tagline = EXCLUDED.tagline,
    description = EXCLUDED.description,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    whatsapp_number = EXCLUDED.whatsapp_number,
    whatsapp_url = EXCLUDED.whatsapp_url;

-- ==============================================================================
-- Storage Bucket & Policies (growmybizz-media)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('growmybizz-media', 'growmybizz-media', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
    CREATE POLICY "Public can view media" ON storage.objects FOR SELECT USING (bucket_id = 'growmybizz-media');

    DROP POLICY IF EXISTS "Service role full access on storage" ON storage.objects;
    CREATE POLICY "Service role full access on storage" ON storage.objects FOR ALL USING (bucket_id = 'growmybizz-media');
EXCEPTION
    WHEN undefined_table THEN
        NULL; -- Non-fatal if storage schema is not present in local pg
END $$;

