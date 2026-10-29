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
    showLinkedin: false,
    showInstagram: false,
  },
  {
    id: 'tm-2',
    name: 'Swati Yadav',
    role: 'Co-Founder & COO',
    bio: 'Specialist in modern design systems, conversion-driven landing pages, and intuitive user experiences for B2B SaaS and D2C brands.',
    avatar: '/team/placeholder-sanya.jpg',
    linkedin: 'https://linkedin.com/in/growmybiz24',
    instagram: 'https://instagram.com/growmybiz24',
    showLinkedin: false,
    showInstagram: false,
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

// ─── Testimonials (Empty by default until real reviews are added via CMS) ───
export const testimonials: Testimonial[] = [];
