// ─── Core Content Types ───────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface SiteConfig {
  siteName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  whatsappNumber?: string;
  whatsappUrl?: string;
  googleAnalyticsId?: string;
  googleSiteVerification?: string;
  social: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    github?: string;
  };
  socialVisibility?: {
    instagram?: boolean;
    linkedin?: boolean;
    twitter?: boolean;
    youtube?: boolean;
    github?: boolean;
  };
}

export interface HeroSlide {
  id: string;
  heading: string;
  subheading: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  badge?: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: string;
  color: string;
  offerings: ServiceOffering[];
  deliverables?: string[];
  process?: string[];
  faqs?: FAQ[];
  featured: boolean;
  published?: boolean;
  updatedAt?: string;
}

export interface ServiceOffering {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  industry?: string;
  serviceSlug?: string;
  liveUrl?: string;
  tags: string[];
  thumbnail: string;
  images: string[];
  challenge: string;
  approach: string;
  solution?: string;
  deliverables: string[];
  technologies: string[];
  techStack?: string[];
  outcome: string;
  metrics?: { label: string; value: string }[];
  featured: boolean;
  published: boolean;
  year: number;
  isConcept?: boolean;
  conceptDisclaimer?: string;
  updatedAt?: string;
}

export interface OrbitNodeConfig {
  id: string;
  label: string;
  sub: string;
  icon?: string;
  color: string;
  glow?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface OrbitConfig {
  centerLabel?: string;
  centerSubtitle?: string;
  nodes: OrbitNodeConfig[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  linkedin?: string;
  instagram?: string;
  showLinkedin?: boolean;
  showInstagram?: boolean;
}

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  readTime: number;
  featured: boolean;
  published: boolean;
  coverImage: string;
  updatedAt?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  company: string;
  role: string;
  quote: string;
  avatar?: string;
  rating: number;
  projectType: string;
  verified: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  suffix?: string;
  description: string;
}

export interface ValueProp {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface EnquiryFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
}

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  role: 'superadmin' | 'editor';
}
