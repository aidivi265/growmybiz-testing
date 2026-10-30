import type { TeamMember, ValueProp, StatItem, Testimonial } from '@/types';

// ─── Team Members ─────────────────────────────────────────────────────────────
export const teamMembers: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Divyansh Gupta',
    role: 'Founder, CEO & CTO',
    bio: 'Passionate about building digital solutions, helping businesses grow and turning ideas into reality. Specialized in full-stack web platforms, conversion funnels, and modern AI automation.',
    avatar: 'https://cswpwcmtjzutuownuvez.supabase.co/storage/v1/object/public/growmybizz-media/uploads/1793247001414_latest.jpg',
    linkedin: 'https://linkedin.com/in/growmybiz24',
    instagram: 'https://instagram.com/growmybiz24',
    showLinkedin: true,
    showInstagram: true,
  },
  {
    id: 'tm-2',
    name: 'Swati Yadav',
    role: 'Co-Founder & COO',
    bio: 'Specialist in modern design systems, conversion-driven landing pages, and intuitive user experiences for B2B SaaS and D2C brands.',
    avatar: '',
    linkedin: 'https://linkedin.com/in/growmybiz24',
    instagram: 'https://instagram.com/growmybiz24',
    showLinkedin: true,
    showInstagram: true,
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
    label: 'Average ROAS Delivered',
    value: '4.2',
    suffix: 'x',
    description: 'Measured across performance marketing client sprints',
  },
];

// ─── Testimonials (Baseline Data & Fallback) ─────────────────────────────────
export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    author: 'Aarav Mehta',
    role: 'Founder & Managing Director',
    company: 'Zenith Wellness & Organics',
    quote:
      'Growmybiz24 rebuilt our entire storefront architecture and streamlined checkout. Our mobile conversion went from 1.6% to 2.4% within 45 days, and their communication was crystal clear throughout.',
    rating: 5,
    projectType: 'E-commerce & Web Architecture',
    verified: true,
  },
  {
    id: 'test-2',
    author: 'Neha Sharma',
    role: 'Head of Growth',
    company: 'Nexar AI Solutions',
    quote:
      'The difference between separate freelancers and Growmybiz24 is cohesive execution. They redesigned our product interface and built an interactive ROI calculator that doubled our qualified demo requests.',
    rating: 5,
    projectType: 'B2B SaaS Growth & UI/UX',
    verified: true,
  },
  {
    id: 'test-3',
    author: 'Vikramaditya Rathore',
    role: 'Operations Director',
    company: 'Kalyan Heritage Hotels',
    quote:
      'Our reliance on commission-heavy booking aggregators was hurting our margins. Growmybiz24 executed a local SEO and direct booking campaign that increased direct reservations by over 60%. Highly recommended.',
    rating: 5,
    projectType: 'Local SEO & Direct Bookings',
    verified: true,
  },
];
