// ─── Project & Client Portal Types ──────────────────────────────────────────

export type ProjectStatus =
  | 'under_review'        // Client submitted form, admin reviewing
  | 'quotation_live'       // Quotation prepared & sent to client
  | 'phase_1_in_progress'  // 50% advance paid, design sprint underway
  | 'design_ready'         // Mockup submitted for client approval
  | 'phase_2_in_progress'  // Design approved, 30% paid, development underway
  | 'uat_ready'            // Staging build ready for client testing
  | 'completed';           // 20% final paid, project handed over

export interface ProjectDeliverableItem {
  id: string;
  title: string;
  description: string;
  includedRevisions: string;
}

export interface MilestoneItem {
  number: 1 | 2 | 3;
  title: string;
  percentage: number; // 50, 30, 20
  amount: number;
  trigger: string;
  status: 'locked' | 'unlocked' | 'paid';
  invoiceNumber?: string;
  invoiceDate?: string;
  receiptSlipId?: string;
  paidAt?: string;
  transactionRef?: string;
}

export interface MockupData {
  id: string;
  title: string;
  previewUrl: string;
  description: string;
  status: 'draft' | 'ready_for_review' | 'approved';
  submittedAt?: string;
  signedAt?: string;
  signedBy?: string;
}

export interface QuotationDetails {
  id: string;
  projectId: string;
  receiptId: string;
  title: string;
  validityDays: number;
  currency: string;
  totalAmount: number;
  executiveSummary: string;
  proposedArchitecture: string[];
  deliverables: ProjectDeliverableItem[];
  exclusions: string[];
  milestones: MilestoneItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ClientFeedback {
  rating: number; // 1 to 5
  satisfactionLevel: string;
  bestAspect: string;
  suggestions: string;
  allowTestimonial: boolean;
  interestedInRetainer: boolean;
  submittedAt: string;
}

export interface ProjectRecord {
  id: string;
  receiptId: string; // e.g. GMB-PRJ-2026-8492
  clientAccessToken?: string; // High-entropy secret token for client isolation
  createdAt: string;
  updatedAt: string;

  // Slide 1: Contact
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName: string;
  city: string;
  country: string;

  // Slide 2: Project Info
  serviceCategory: string;
  serviceTitle: string;
  primaryGoal: string;
  inspirationUrls: string[];

  // Slide 3: Scope & Features
  projectScale: string; // e.g. '1-5 pages', 'Web Application'
  featureWishlist: string[];
  integrations: string[];
  technicalNotes?: string;

  // Slide 4: Budget & Timeline
  budgetRange: string;
  budgetNumericEstimate?: number;
  currency: string;
  targetTimeline: string;
  urgencyLevel: string;

  // Slide 5: Asset Readiness
  assetsReady: {
    logo: boolean;
    copy: boolean;
    photos: boolean;
    domain: boolean;
    otherNotes?: string;
  };

  // State Management
  status: ProjectStatus;
  quotation?: QuotationDetails;
  mockups?: MockupData[];
  feedback?: ClientFeedback;
  stagingUrl?: string;
  productionUrl?: string;
}

export interface QuickInquiryRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'converted';
}
