import type { SiteConfig } from '@/types';

export const siteConfig: SiteConfig & { whatsappNumber: string; whatsappUrl: string } = {
  siteName: 'Growmybiz24',
  tagline: 'Digital Solutions for a Bigger Tomorrow',
  description:
    'Full-service digital agency — web, design, marketing, content and AI services for businesses that want to grow.',
  email: 'hello@growmybiz24.com',
  phone: '+91 72908 84480',
  address: 'New Delhi, India (Global Delivery)',
  whatsappNumber: '+91 72908 84480',
  whatsappUrl:
    'https://wa.me/917290884480?text=Hi%20Growmybiz24%20team,%20I%20would%20like%20to%20discuss%20a%20new%20project.',
  social: {
    linkedin: 'https://linkedin.com/company/growmybiz24',
    twitter: 'https://x.com/growmybiz24',
    instagram: 'https://instagram.com/growmybiz24',
    youtube: 'https://youtube.com/@growmybiz24',
  },
};
