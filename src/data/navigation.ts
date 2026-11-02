import type { NavItem } from '@/types';

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
  { label: 'Client Portal', href: '/portal' },
  { label: 'Contact', href: '/contact' },
];
