import { supabaseAdmin } from '@/lib/supabaseServer';
import { services as staticServices } from '@/data/services';
import { portfolioItems as staticPortfolio } from '@/data/portfolio';
import { blogPosts as staticInsights } from '@/data/insights';
import { testimonials as staticTestimonials, teamMembers as staticTeamMembers, valueProps as staticValueProps, stats as staticStats } from '@/data/company';
import { heroSlides as staticHeroSlides } from '@/data/hero';
import { processSteps as staticProcessSteps } from '@/data/process';
import { siteConfig as staticSiteConfig } from '@/data/siteConfig';
import type { Service, PortfolioItem, BlogPost, Testimonial, SiteConfig, HeroSlide, ProcessStep, TeamMember, ValueProp, StatItem } from '@/types';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Unified Data Access Layer (DAL)
 * Serves live published data from Supabase Cloud PostgreSQL.
 * If tables are being configured or database is unreachable, transparently
 * falls back to baseline static files with ZERO downtime.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── 1. Services ──────────────────────────────────────────────────────────────
export async function fetchServices(): Promise<Service[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        shortDescription: item.short_description || '',
        description: item.description || '',
        icon: item.icon_name || 'Code2',
        color: item.color || '#477BDB',
        offerings: Array.isArray(item.offerings) ? item.offerings : [],
        deliverables: Array.isArray(item.deliverables) ? item.deliverables : [],
        process: Array.isArray(item.process_steps) ? item.process_steps : [],
        faqs: Array.isArray(item.faqs) ? item.faqs : [],
        featured: item.featured ?? true,
      }));
    }
  } catch (err) {
    console.warn('[DAL Notice] Supabase services fetch fallback:', err);
  }

  return staticServices;
}

export async function fetchServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        shortDescription: data.short_description || '',
        description: data.description || '',
        icon: data.icon_name || 'Code2',
        color: data.color || '#477BDB',
        offerings: Array.isArray(data.offerings) ? data.offerings : [],
        deliverables: Array.isArray(data.deliverables) ? data.deliverables : [],
        process: Array.isArray(data.process_steps) ? data.process_steps : [],
        faqs: Array.isArray(data.faqs) ? data.faqs : [],
        featured: data.featured ?? true,
      };
    }
  } catch {
    // Fall through to static
  }

  return staticServices.find((s) => s.slug === slug) || null;
}

// ── 2. Portfolio Projects ────────────────────────────────────────────────────
export async function fetchPortfolio(): Promise<PortfolioItem[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('portfolio_projects')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((p) => {
        const rawMetrics = Array.isArray(p.metrics) ? p.metrics : [];
        const industry = (p as any).industry || rawMetrics.find((m: any) => m.label === '_industry')?.value;
        const serviceSlug = (p as any).serviceSlug || rawMetrics.find((m: any) => m.label === '_serviceSlug')?.value;
        const cleanMetrics = rawMetrics.filter((m: any) => !m.label?.startsWith('_'));

        return {
          id: p.id,
          slug: p.slug,
          title: p.title,
          client: p.client,
          category: p.category,
          industry,
          serviceSlug,
          tags: Array.isArray(p.technologies) ? p.technologies : [],
          thumbnail: p.thumbnail,
          images: Array.isArray(p.gallery) ? p.gallery : [p.thumbnail],
          challenge: p.challenge,
          approach: p.solution || p.approach || '',
          solution: p.solution || p.approach || '',
          deliverables: Array.isArray(p.deliverables) ? p.deliverables : [],
          technologies: Array.isArray(p.technologies) ? p.technologies : [],
          techStack: Array.isArray(p.technologies) ? p.technologies : [],
          outcome: p.outcome,
          metrics: cleanMetrics,
          featured: p.is_featured ?? true,
          published: p.is_published ?? true,
          year: parseInt(p.year, 10) || 2025,
          isConcept: p.is_concept ?? false,
        };
      });
    }
  } catch (err) {
    console.warn('[DAL Notice] Supabase portfolio fetch fallback:', err);
  }

  return staticPortfolio;
}

export async function fetchPortfolioBySlug(slug: string): Promise<PortfolioItem | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('portfolio_projects')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (!error && data) {
      const rawMetrics = Array.isArray(data.metrics) ? data.metrics : [];
      const industry = (data as any).industry || rawMetrics.find((m: any) => m.label === '_industry')?.value;
      const serviceSlug = (data as any).serviceSlug || rawMetrics.find((m: any) => m.label === '_serviceSlug')?.value;
      const cleanMetrics = rawMetrics.filter((m: any) => !m.label?.startsWith('_'));

      return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        client: data.client,
        category: data.category,
        industry,
        serviceSlug,
        tags: Array.isArray(data.technologies) ? data.technologies : [],
        thumbnail: data.thumbnail,
        images: Array.isArray(data.gallery) ? data.gallery : [data.thumbnail],
        challenge: data.challenge,
        approach: data.solution || data.approach || '',
        solution: data.solution || data.approach || '',
        deliverables: Array.isArray(data.deliverables) ? data.deliverables : [],
        technologies: Array.isArray(data.technologies) ? data.technologies : [],
        techStack: Array.isArray(data.technologies) ? data.technologies : [],
        outcome: data.outcome,
        metrics: cleanMetrics,
        featured: data.is_featured ?? true,
        published: data.is_published ?? true,
        year: parseInt(data.year, 10) || 2025,
        isConcept: data.is_concept ?? false,
      };
    }
  } catch {
    // Fall through to static
  }

  return staticPortfolio.find((p) => p.slug === slug) || null;
}

// ── 3. Blog & Insights Articles ──────────────────────────────────────────────
export async function fetchInsights(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((a) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        content: a.content_markdown || '',
        category: Array.isArray(a.tags) && a.tags.length > 0 ? a.tags[0] : 'Insight',
        tags: Array.isArray(a.tags) ? a.tags : [],
        author: a.author || 'Growmybizz Team',
        publishedAt: a.published_at || a.created_at,
        readTime: parseInt(a.read_time, 10) || 4,
        featured: true,
        published: a.is_published ?? true,
        coverImage: a.cover_image || '/portfolio-mockups/mobile-app.png',
      }));
    }
  } catch (err) {
    console.warn('[DAL Notice] Supabase articles fetch fallback:', err);
  }

  return staticInsights;
}

export async function fetchInsightBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content_markdown || '',
        category: Array.isArray(data.tags) && data.tags.length > 0 ? data.tags[0] : 'Insight',
        tags: Array.isArray(data.tags) ? data.tags : [],
        author: data.author || 'Growmybizz Team',
        publishedAt: data.published_at || data.created_at,
        readTime: parseInt(data.read_time, 10) || 4,
        featured: true,
        published: data.is_published ?? true,
        coverImage: data.cover_image || '/portfolio-mockups/mobile-app.png',
      };
    }
  } catch {
    // Fall through to static
  }

  return staticInsights.find((a) => a.slug === slug) || null;
}

// ── 4. Testimonials ──────────────────────────────────────────────────────────
export async function fetchTestimonials(): Promise<Testimonial[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .select('*')
      .order('order_index', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((t) => ({
        id: t.id,
        author: t.name || t.author || 'Client',
        role: t.role || '',
        company: t.company || '',
        quote: t.quote || '',
        avatar: t.avatar || undefined,
        rating: t.rating || 5,
        projectType: 'Client Engagement',
        verified: true,
      }));
    }
  } catch (err) {
    console.warn('[DAL Notice] Supabase testimonials fetch fallback:', err);
  }

  return staticTestimonials;
}

// ── 5. Site Settings ─────────────────────────────────────────────────────────
export async function fetchSiteSettings(): Promise<
  SiteConfig & { whatsappNumber: string; whatsappUrl: string }
> {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('*')
      .eq('id', 'global')
      .maybeSingle();

    if (!error && data) {
      const rawSocial = data.social || staticSiteConfig.social;
      const socialVisibility = rawSocial?._visibility || {};
      const cleanSocial = { ...rawSocial };
      delete cleanSocial._visibility;

      return {
        siteName: data.site_name || staticSiteConfig.siteName,
        tagline: data.tagline || staticSiteConfig.tagline,
        description: data.description || staticSiteConfig.description,
        email: data.email || staticSiteConfig.email,
        phone: data.phone || staticSiteConfig.phone,
        address: data.address || staticSiteConfig.address,
        whatsappNumber: data.whatsapp_number || staticSiteConfig.whatsappNumber,
        whatsappUrl: data.whatsapp_url || staticSiteConfig.whatsappUrl,
        social: cleanSocial,
        socialVisibility,
      };
    }
  } catch {
    // Fall through to static
  }

  return staticSiteConfig;
}

// ── 7. Hero Slides ───────────────────────────────────────────────────────────
export async function fetchHeroSlides(): Promise<HeroSlide[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('page_content')
      .select('data')
      .eq('id', 'hero_slides')
      .maybeSingle();

    if (!error && data && Array.isArray(data.data) && data.data.length > 0) {
      return data.data as HeroSlide[];
    }
  } catch (err) {
    console.warn('[DAL Notice] Hero slides fetch fallback:', err);
  }

  return staticHeroSlides;
}

// ── 8. Process Steps ─────────────────────────────────────────────────────────
export async function fetchProcessSteps(): Promise<ProcessStep[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('page_content')
      .select('data')
      .eq('id', 'process_steps')
      .maybeSingle();

    if (!error && data && Array.isArray(data.data) && data.data.length > 0) {
      return data.data as ProcessStep[];
    }
  } catch (err) {
    console.warn('[DAL Notice] Process steps fetch fallback:', err);
  }

  return staticProcessSteps;
}

// ── 9. Team Members ──────────────────────────────────────────────────────────
export async function fetchTeamMembers(): Promise<TeamMember[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('page_content')
      .select('data')
      .eq('id', 'team_members')
      .maybeSingle();

    if (!error && data && Array.isArray(data.data) && data.data.length > 0) {
      return data.data as TeamMember[];
    }
  } catch (err) {
    console.warn('[DAL Notice] Team members fetch fallback:', err);
  }

  return staticTeamMembers;
}

// ── 10. Value Propositions & Pillars ─────────────────────────────────────────
export async function fetchValueProps(): Promise<ValueProp[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('page_content')
      .select('data')
      .eq('id', 'value_props')
      .maybeSingle();

    if (!error && data && Array.isArray(data.data) && data.data.length > 0) {
      return data.data as ValueProp[];
    }
  } catch (err) {
    console.warn('[DAL Notice] Value props fetch fallback:', err);
  }

  return staticValueProps;
}

// ── 11. Key Agency Stats ─────────────────────────────────────────────────────
export async function fetchStats(): Promise<StatItem[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('page_content')
      .select('data')
      .eq('id', 'stats')
      .maybeSingle();

    if (!error && data && Array.isArray(data.data) && data.data.length > 0) {
      return data.data as StatItem[];
    }
  } catch (err) {
    console.warn('[DAL Notice] Stats fetch fallback:', err);
  }

  return staticStats;
}

// ── 12. Page Copy / Custom Block ─────────────────────────────────────────────
export async function fetchPageCopy<T>(sectionId: string, fallback: T): Promise<T> {
  try {
    const { data, error } = await supabaseAdmin
      .from('page_content')
      .select('data')
      .eq('id', sectionId)
      .maybeSingle();

    if (!error && data?.data) {
      return data.data as T;
    }
  } catch (err) {
    console.warn(`[DAL Notice] Page copy fetch fallback for ${sectionId}:`, err);
  }

  return fallback;
}

// ── 13. Legal Policy Document ────────────────────────────────────────────────
export async function fetchLegalDoc(slug: string, fallback: string): Promise<string> {
  try {
    const { data, error } = await supabaseAdmin
      .from('page_content')
      .select('data')
      .eq('id', `legal_${slug}`)
      .maybeSingle();

    if (!error && data?.data && typeof data.data.content === 'string') {
      return data.data.content;
    }
  } catch (err) {
    console.warn(`[DAL Notice] Legal doc fetch fallback for ${slug}:`, err);
  }

  return fallback;
}

import { defaultServiceCategories } from '@/data/serviceCategories';
import { defaultOrbitConfig } from '@/data/orbitConfig';
import type { OrbitConfig } from '@/types';

export { defaultOrbitConfig };

// ── 14. Service Niche Categories ──────────────────────────────────────────────
export async function fetchServiceCategories(): Promise<Record<string, string[]>> {
  try {
    const { data, error } = await supabaseAdmin
      .from('page_content')
      .select('data')
      .eq('id', 'service_categories')
      .maybeSingle();

    if (!error && data?.data && typeof data.data === 'object') {
      return data.data as Record<string, string[]>;
    }
  } catch (err) {
    console.warn('[DAL Notice] Service categories fetch fallback:', err);
  }

  return defaultServiceCategories;
}

// ── 15. Homepage 3D Interactive Orbit Config ──────────────────────────────────
export async function fetchOrbitConfig(): Promise<OrbitConfig> {
  try {
    const { data, error } = await supabaseAdmin
      .from('page_content')
      .select('data')
      .eq('id', 'orbit_config')
      .maybeSingle();

    if (!error && data?.data && Array.isArray((data.data as any)?.nodes)) {
      return data.data as OrbitConfig;
    }
  } catch (err) {
    console.warn('[DAL Notice] Orbit config fetch fallback:', err);
  }

  return defaultOrbitConfig;
}

