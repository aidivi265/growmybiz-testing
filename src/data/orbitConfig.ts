import type { OrbitConfig } from '@/types';

export const defaultOrbitConfig: OrbitConfig = {
  centerLabel: 'Growmybizz',
  centerSubtitle: 'Digital Agency OS',
  nodes: [
    {
      id: 'full-stack-dev',
      label: 'Full-Stack Dev',
      sub: 'Next.js 15 & TS',
      icon: 'Code2',
      color: '#60a5fa',
      size: 'lg',
    },
    {
      id: 'ai-agents',
      label: 'AI Automation',
      sub: 'LLMs & Workflows',
      icon: 'Bot',
      color: '#34d399',
      size: 'md',
    },
    {
      id: 'growth-marketing',
      label: 'Performance Ads',
      sub: 'Meta & Google ROAS',
      icon: 'TrendingUp',
      color: '#c084fc',
      size: 'lg',
    },
    {
      id: 'ui-ux',
      label: 'UI/UX Design',
      sub: 'Figma Systems',
      icon: 'Palette',
      color: '#fbbf24',
      size: 'md',
    },
    {
      id: 'mvp-sprint',
      label: '14-Day MVP',
      sub: 'Live to Market',
      icon: 'Zap',
      color: '#60a5fa',
      size: 'sm',
    },
    {
      id: 'cloud-scale',
      label: '99.98% Uptime',
      sub: 'Supabase Cloud',
      icon: 'Shield',
      color: '#2dd4bf',
      size: 'sm',
    },
  ],
};
