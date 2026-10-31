import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { supabaseAdmin } from './supabaseServer';
import type { ProjectRecord, QuotationDetails, MilestoneItem, MockupData, ClientFeedback } from '@/types/project';

const LOCAL_STORAGE_DIR = path.join(process.cwd(), '.projects');
const LOCAL_STORAGE_FILE = path.join(LOCAL_STORAGE_DIR, 'projects.json');

// Ensure local backup directory exists
function ensureLocalBackup() {
  try {
    if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
      fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
    }
    if (!fs.existsSync(LOCAL_STORAGE_FILE)) {
      fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[PROJECT STORE] Local backup directory init notice:', err);
  }
}

// Read from local backup file
export function readLocalProjectsBackup(): ProjectRecord[] {
  ensureLocalBackup();
  try {
    if (fs.existsSync(LOCAL_STORAGE_FILE)) {
      const data = fs.readFileSync(LOCAL_STORAGE_FILE, 'utf-8');
      return JSON.parse(data) || [];
    }
  } catch (err) {
    console.error('[PROJECT STORE] Local read notice:', err);
  }
  return [];
}

// Save to local backup file
export function writeLocalProjectsBackup(projects: ProjectRecord[]): void {
  ensureLocalBackup();
  try {
    fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(projects, null, 2), 'utf-8');
  } catch (err) {
    console.error('[PROJECT STORE] Local write notice:', err);
  }
}

// Generate unique receipt ID: GMB-PRJ-2026-XXXX
export function generateReceiptId(): string {
  const random4 = Math.floor(1000 + Math.random() * 9000);
  return `GMB-PRJ-2026-${random4}`;
}

// Generate high-entropy 32-char secret client token
export function generateClientAccessToken(): string {
  return `sec_${crypto.randomBytes(16).toString('hex')}`;
}

// Supabase Document Key for page_content table
function getSupabaseDocKey(receiptId: string): string {
  return `project_${receiptId.trim().toUpperCase()}`;
}

// Fetch a single project by receipt ID (Authoritative from Supabase)
export async function getProjectByReceiptId(receiptId: string): Promise<ProjectRecord | null> {
  const cleanId = receiptId.trim().toUpperCase();
  const docKey = getSupabaseDocKey(cleanId);

  // 1. Authoritative: Fetch from Supabase PostgreSQL
  try {
    const { data, error } = await supabaseAdmin
      .from('page_content')
      .select('data')
      .eq('id', docKey)
      .single();

    if (!error && data && data.data) {
      return data.data as ProjectRecord;
    }
  } catch (err) {
    console.warn('[PROJECT STORE] Supabase single query notice:', err);
  }

  // 2. Fallback to local backup file
  const localProjects = readLocalProjectsBackup();
  const found = localProjects.find((p) => p.receiptId.toUpperCase() === cleanId);
  return found || null;
}

// List all projects for admin (Authoritative from Supabase)
export async function getAllProjects(): Promise<ProjectRecord[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('page_content')
      .select('data, updated_at')
      .like('id', 'project_%')
      .order('updated_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const records = data.map((d) => d.data as ProjectRecord).filter(Boolean);
      // Sync local backup
      writeLocalProjectsBackup(records);
      return records;
    }
  } catch (err) {
    console.warn('[PROJECT STORE] Supabase all query notice:', err);
  }

  // Fallback to local backup
  const local = readLocalProjectsBackup();
  return local.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Save or update a project (Authoritative to Supabase)
export async function saveProject(project: ProjectRecord): Promise<ProjectRecord> {
  project.updatedAt = new Date().toISOString();
  if (!project.clientAccessToken) {
    project.clientAccessToken = generateClientAccessToken();
  }

  const cleanId = project.receiptId.trim().toUpperCase();
  const docKey = getSupabaseDocKey(cleanId);

  // 1. Authoritative: Upsert to Supabase PostgreSQL
  let supabasePersisted = false;
  try {
    const { error } = await supabaseAdmin
      .from('page_content')
      .upsert({
        id: docKey,
        data: project,
        updated_at: project.updatedAt,
      });

    if (!error) {
      supabasePersisted = true;
    } else {
      console.warn('[PROJECT STORE] Supabase upsert error:', error.message);
    }
  } catch (err) {
    console.warn('[PROJECT STORE] Supabase upsert exception:', err);
  }

  // 2. Redundant dual-write to local backup
  const projects = readLocalProjectsBackup();
  const index = projects.findIndex((p) => p.receiptId.toUpperCase() === cleanId);
  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.unshift(project);
  }
  writeLocalProjectsBackup(projects);

  return project;
}

// Verify client access authorization
export function verifyProjectAuthorization(
  project: ProjectRecord,
  providedToken?: string | null,
  providedEmail?: string | null,
  isAdmin: boolean = false
): boolean {
  if (isAdmin) return true;

  if (providedToken && project.clientAccessToken) {
    const cleanProvided = providedToken.trim();
    const cleanActual = project.clientAccessToken.trim();
    if (crypto.timingSafeEqual(Buffer.from(cleanProvided), Buffer.from(cleanActual))) {
      return true;
    }
  }

  if (providedEmail && project.clientEmail) {
    if (providedEmail.trim().toLowerCase() === project.clientEmail.trim().toLowerCase()) {
      return true;
    }
  }

  return false;
}

// Return sanitized project for public/unauthorized viewers (Zero PII leakage)
export function getSanitizedPublicProject(project: ProjectRecord) {
  return {
    receiptId: project.receiptId,
    serviceTitle: project.serviceTitle,
    status: project.status,
    createdAt: project.createdAt,
    isRestricted: true,
    message: 'To view client details, full commercial quotation, invoices, and design mockups, please enter your client email or access token.',
  };
}

// Helper: Smart AI/Algorithmic Quotation Generator
export function generateDefaultQuotation(project: ProjectRecord): QuotationDetails {
  let baseAmount = 65000;
  if (project.budgetRange.includes('25,000') || project.budgetRange.includes('50,000')) {
    baseAmount = 45000;
  } else if (project.budgetRange.includes('1,50,000') || project.budgetRange.includes('3,50,000')) {
    baseAmount = 180000;
  } else if (project.budgetRange.includes('3,50,000+')) {
    baseAmount = 350000;
  }

  const m1Amount = Math.round(baseAmount * 0.5);
  const m2Amount = Math.round(baseAmount * 0.3);
  const m3Amount = baseAmount - m1Amount - m2Amount;

  const milestones: MilestoneItem[] = [
    {
      number: 1,
      title: 'Milestone 1: Kickoff Advance',
      percentage: 50,
      amount: m1Amount,
      trigger: 'Upon formal quotation acceptance and agreement signing. Unlocks architecture setup and Phase 1 UI/UX design sprint.',
      status: 'unlocked',
      invoiceNumber: `EST-${project.receiptId.replace('GMB-PRJ-', '')}-01`,
      invoiceDate: new Date().toISOString().split('T')[0],
    },
    {
      number: 2,
      title: 'Milestone 2: Design Approval',
      percentage: 30,
      amount: m2Amount,
      trigger: 'Upon client sign-off on interactive Figma mockups. Unlocks Phase 2 full-stack development and backend engineering.',
      status: 'locked',
      invoiceNumber: `EST-${project.receiptId.replace('GMB-PRJ-', '')}-02`,
    },
    {
      number: 3,
      title: 'Milestone 3: Final Handover & Launch',
      percentage: 20,
      amount: m3Amount,
      trigger: 'Upon completion of UAT testing and staging verification. Releases production DNS pointing, live credentials, Git repository, and Handover Certificate.',
      status: 'locked',
      invoiceNumber: `EST-${project.receiptId.replace('GMB-PRJ-', '')}-03`,
    },
  ];

  return {
    id: `quot_${Date.now()}`,
    projectId: project.id,
    receiptId: project.receiptId,
    title: `${project.serviceTitle || 'Digital Engineering'} — Master Project Scope & Proposal`,
    validityDays: 14,
    currency: project.currency || 'INR',
    totalAmount: baseAmount,
    executiveSummary: `Growmybiz24 has formulated this comprehensive engineering scope for ${project.companyName || project.clientName}. The objective is to design, develop, and deploy a conversion-driven, high-speed digital product aligned with: "${project.primaryGoal || 'Accelerated business growth'}".`,
    proposedArchitecture: [
      'Frontend: Next.js 16 (App Router + React 19) with Tailwind CSS for mobile-first responsiveness',
      'Backend & Database: Cloud PostgreSQL with Supabase Edge Functions & Row-Level Security',
      'Performance: Core Web Vitals optimized (sub-1s LCP, zero CLS)',
      'Security: Automated rate-limiting, CSRF protection, and HTTPS/SSL certification',
      'Integrations: Automated transactional alerts (Resend API) and payment webhooks',
    ],
    deliverables: [
      {
        id: 'del-1',
        title: 'Phase 1: Architecture & UI/UX Design System',
        description: 'Interactive wireframes and high-fidelity prototype covering desktop and mobile layouts. Includes brand-aligned color schemes, typography, and interactive component states.',
        includedRevisions: '2 Rounds of Design Iteration',
      },
      {
        id: 'del-2',
        title: 'Phase 2: Core Engineering & Database Implementation',
        description: `Bespoke full-stack development covering ${project.projectScale || 'all agreed pages'}, user interactive flows, and data persistence models.`,
        includedRevisions: '2 Rounds of Layout Refinements',
      },
      {
        id: 'del-3',
        title: 'Phase 3: Integrations & Payments',
        description: `Integration of ${project.integrations?.length ? project.integrations.join(', ') : 'Payment Gateway, Transactional Email, and Admin Dashboard'}.`,
        includedRevisions: 'End-to-End QA Testing',
      },
      {
        id: 'del-4',
        title: 'Phase 4: UAT, SEO Hardening & Go-Live',
        description: 'Technical SEO metadata setup (OpenGraph, Schema.org markup, XML sitemaps), cross-browser testing, 7-day client UAT staging period, and DNS production launch.',
        includedRevisions: 'Final Launch Acceptance',
      },
    ],
    exclusions: [
      'Native iOS / Android app store binary builds (unless explicitly quoted in SOW)',
      'Third-party recurring subscription fees (e.g. domain registrar, cloud hosting server bills, paid API credits)',
      'Professional media creation, on-site photography, or bespoke 3D motion graphics',
      'Features or revisions requested outside this agreed specification without an executed Change Request (CR)',
    ],
    milestones,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Process milestone payment
export async function recordMilestonePayment(
  receiptId: string,
  milestoneNumber: 1 | 2 | 3,
  transactionRef?: string
): Promise<ProjectRecord | null> {
  const project = await getProjectByReceiptId(receiptId);
  if (!project || !project.quotation) return null;

  const targetMilestone = project.quotation.milestones.find((m) => m.number === milestoneNumber);
  if (!targetMilestone) return null;

  // Mark paid
  targetMilestone.status = 'paid';
  targetMilestone.paidAt = new Date().toISOString();
  targetMilestone.transactionRef = transactionRef || `TXN-DEMO-SIM-${Date.now().toString().slice(-6)}`;
  targetMilestone.receiptSlipId = `SLIP-DEMO-${project.receiptId.replace('GMB-PRJ-', '')}-M${milestoneNumber}`;

  // Advance project state based on milestone
  if (milestoneNumber === 1) {
    project.status = 'phase_1_in_progress';
    const m2 = project.quotation.milestones.find((m) => m.number === 2);
    if (m2 && m2.status === 'locked') {
      m2.status = 'unlocked';
    }
  } else if (milestoneNumber === 2) {
    project.status = 'phase_2_in_progress';
    const m3 = project.quotation.milestones.find((m) => m.number === 3);
    if (m3 && m3.status === 'locked') {
      m3.status = 'unlocked';
    }
  } else if (milestoneNumber === 3) {
    project.status = 'completed';
  }

  await saveProject(project);
  return project;
}

// Submit or approve a mockup
export async function updateProjectMockup(
  receiptId: string,
  mockupData: Partial<MockupData>
): Promise<ProjectRecord | null> {
  const project = await getProjectByReceiptId(receiptId);
  if (!project) return null;

  if (!project.mockups) project.mockups = [];

  const existingIndex = project.mockups.findIndex((m) => m.id === mockupData.id);
  if (existingIndex >= 0) {
    project.mockups[existingIndex] = { ...project.mockups[existingIndex], ...mockupData };
  } else {
    project.mockups.push({
      id: mockupData.id || `mock_${Date.now()}`,
      title: mockupData.title || 'Initial UI/UX Prototype',
      previewUrl: mockupData.previewUrl || 'https://www.figma.com',
      description: mockupData.description || 'Full interactive mockups for review.',
      status: mockupData.status || 'ready_for_review',
      submittedAt: new Date().toISOString(),
    });
  }

  if (mockupData.status === 'approved') {
    project.status = 'design_ready';
  }

  await saveProject(project);
  return project;
}

// Submit feedback
export async function submitProjectFeedback(
  receiptId: string,
  feedback: ClientFeedback
): Promise<ProjectRecord | null> {
  const project = await getProjectByReceiptId(receiptId);
  if (!project) return null;

  project.feedback = feedback;
  await saveProject(project);
  return project;
}
