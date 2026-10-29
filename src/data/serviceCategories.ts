export interface ServiceNicheCategory {
  serviceSlug: string;
  categories: string[];
}

export const defaultServiceCategories: Record<string, string[]> = {
  'web-app-development': [
    'Cafes, Restaurants & Hospitality',
    'Hospitals, Clinics & Healthcare',
    'E-Commerce & D2C Brands',
    'Real Estate & Builders',
    'B2B SaaS & Tech Startups',
    'EdTech & Coaching Academies',
    'Fitness, Gyms & Wellness',
    'Legal & Financial Services',
  ],
  'design-branding': [
    'D2C Brands & Consumer Packaging',
    'Fintech & Enterprise Tech',
    'Cafes, Food & Restaurant Branding',
    'Fashion, Luxury & Apparel',
    'Healthcare & Clinical Identity',
    'Real Estate Brand Systems',
  ],
  'digital-marketing': [
    'E-Commerce Performance & ROAS Ads',
    'Clinics, Doctors & Patient Funnels',
    'Restaurants & Hyperlocal Footfall',
    'Real Estate High-Ticket Lead Gen',
    'B2B LinkedIn & Corporate Pipeline',
    'Education & Course Admissions',
  ],
  'video-content': [
    'Cafes & Dining Viral Reels',
    'Founder & Executive LinkedIn Presence',
    'D2C Product Reels & UGC Creators',
    'Healthcare & Doctor Thought Leadership',
    'Real Estate Property Video Tours',
    'Brand Films & Commercial Storytelling',
  ],
  'ai-automation': [
    'Clinics 24/7 Appointment Booking Bots',
    'Cafes & Dining WhatsApp Order Bots',
    'Real Estate Lead Qualification Bots',
    'Customer Support & Invoicing Automation',
    'E-Commerce Abandoned Cart Recovery Flows',
  ],
  'other-digital-services': [
    'Local SEO & Google Business 3-Pack',
    'Custom API & CRM Integrations',
    'Cloud Migration & Serverless DevOps',
    'Core Web Vitals & Security Hardening',
    'Ongoing Web Maintenance Retainers',
  ],
  // Backwards compatibility aliases
  'content-production': [
    'Cafes & Dining Viral Reels',
    'Founder & Executive LinkedIn Presence',
    'D2C Product Reels & UGC Creators',
    'Healthcare & Doctor Thought Leadership',
  ],
  'seo-organic-growth': [
    'Medical Practices & Local 3-Pack',
    'Cafes & Restaurant Discovery',
    'E-Commerce Category Rank Dominance',
    'B2B Technical & Topical Authority',
  ],
};
