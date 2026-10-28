import type { ProcessStep } from '@/types';

export const processSteps: ProcessStep[] = [
  {
    id: 'ps-1',
    number: '01',
    title: 'Discover',
    description: 'We start by understanding your business goals, audience, competitive context and technical requirements before any solution is proposed.',
    icon: 'Search',
    details: ['Stakeholder interviews', 'Goals and KPI alignment', 'Competitor and market context', 'Technical requirements gathering'],
  },
  {
    id: 'ps-2',
    number: '02',
    title: 'Plan',
    description: 'Every engagement gets a clear scope document — deliverables, assumptions, milestones, timeline and payment terms agreed before work begins.',
    icon: 'ClipboardList',
    details: ['Scope of work document', 'Milestone and payment schedule', 'Deliverable definitions', 'Change-request process agreed'],
  },
  {
    id: 'ps-3',
    number: '03',
    title: 'Design',
    description: 'Structure, visual direction and content brought together in a reviewable format before production begins. Fewer surprises at build stage.',
    icon: 'Figma',
    details: ['Wireframes and information architecture', 'Visual design and brand alignment', 'Prototype review and sign-off', 'Content planning'],
  },
  {
    id: 'ps-4',
    number: '04',
    title: 'Build',
    description: 'Development, content production or campaign setup executed against the agreed specification with regular progress updates.',
    icon: 'Code2',
    details: ['Development against approved designs', 'Regular progress updates', 'Integrations and configuration', 'Internal QA and testing'],
  },
  {
    id: 'ps-5',
    number: '05',
    title: 'Review',
    description: 'Structured review rounds with clear feedback channels. We refine until the deliverable meets the agreed acceptance criteria.',
    icon: 'CheckCircle',
    details: ['Structured feedback process', 'Revision rounds as agreed in scope', 'Client sign-off on each deliverable', 'Pre-launch checklist'],
  },
  {
    id: 'ps-6',
    number: '06',
    title: 'Handover',
    description: 'Clean delivery with all assets, documentation, credentials and training needed to operate what we have built.',
    icon: 'PackageCheck',
    details: ['All files delivered in agreed formats', 'Handover documentation', 'Credentials and access transferred', 'Support arrangements confirmed'],
  },
];

