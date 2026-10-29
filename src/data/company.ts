import type { TeamMember, ValueProp, StatItem, Testimonial } from '@/types';

// ─── Team Members ─────────────────────────────────────────────────────────────
export const teamMembers: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Divyansh Gupta',
    role: 'Founder & Developer',
    bio: 'Passionate about building digital solutions, helping businesses grow and turning ideas into reality. Specialized in full-stack web platforms, conversion funnels, and modern AI automation.',
    avatar: '/team/placeholder-founder.jpg',
    linkedin: 'https://linkedin.com/in/growmybiz24',
    instagram: 'https://instagram.com/growmybiz24',
    showLinkedin: true,
    showInstagram: true,
  },
  {
    id: 'tm-2',
    name: 'Sanya Malhotra',
    role: 'Lead UI/UX & Brand Architect',
    bio: 'Specialist in modern design systems, conversion-driven landing pages, and intuitive user experiences for B2B SaaS and D2C brands.',
    avatar: '/team/placeholder-sanya.jpg',
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

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    author: 'Rohan Sharma',
    company: 'Zenith Organics',
    role: 'Co-Founder & CEO',
    quote:
      'Growmybiz24 completely revamped our e-commerce experience. Our mobile checkout drop-off decreased by 34% within the first month of launch. Having one team handle design, Next.js engineering, and conversion optimization saved us months of vendor back-and-forth.',
    rating: 5,
    projectType: 'D2C E-commerce & CRO',
    verified: true,
  },
  {
    id: 'test-2',
    author: 'Priya Nair',
    company: 'Nexar AI Solutions',
    role: 'Head of Product Marketing',
    quote:
      'Finding an agency that understands both technical AI positioning and modern B2B SaaS aesthetics is rare. The brand identity and landing page they delivered helped us close our seed funding round with strong investor praise.',
    rating: 5,
    projectType: 'Brand & SaaS Web App',
    verified: true,
  },
  {
    id: 'test-3',
    author: 'Vikramaditya Verma',
    company: 'Kalyan Heritage Resort & Spa',
    role: 'Managing Director',
    quote:
      'Their local SEO overhaul and Google Business profile revamp took our direct bookings up by 185%. They do not make vague promises—they give you weekly clear reports with real numbers and verifiable revenue impact.',
    rating: 5,
    projectType: 'Local SEO & Direct Bookings',
    verified: true,
  },
  {
    id: 'test-4',
    author: 'Aman Gupta',
    company: 'UrbanEdge Fashion',
    role: 'Founder',
    quote:
      'From day one, the scope, timeline, and deliverables were crystal clear. No hidden charges, no excuses. The website is lightning fast and our ad ROAS jumped to 4.2x with their creative testing sprints.',
    rating: 5,
    projectType: 'Performance Marketing',
    verified: true,
  },
];
