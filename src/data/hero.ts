import type { HeroSlide } from '@/types';

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
