'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Settings,
  Users,
  Globe,
  LogOut,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Save,
  ChevronRight,
  Image,
  BookOpen,
  MessageSquare,
  Shield,
  Menu,
  X,
} from 'lucide-react';

// ─── Admin Nav Items ──────────────────────────────────────────────────────────
const adminNav = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'site-config', label: 'Site Settings', icon: Settings },
  { id: 'hero', label: 'Hero Slides', icon: Globe },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'portfolio', label: 'Portfolio', icon: Image },
  { id: 'blog', label: 'Blog / Insights', icon: BookOpen },
  { id: 'process', label: 'Process Steps', icon: ChevronRight },
  { id: 'team', label: 'Team Members', icon: Users },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { id: 'legal', label: 'Legal Pages', icon: Shield },
];

// ─── Placeholder data for demo ────────────────────────────────────────────────
import {
  siteConfig,
  heroSlides,
  services,
  portfolioItems,
  blogPosts,
  processSteps,
  teamMembers,
  testimonials,
} from '@/data';

export default function AdminDashboardClient() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('gmb_admin_auth');
    if (auth !== 'true') {
      router.push('/admin/login');
    } else {
      setAuthed(true);
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('gmb_admin_auth');
    router.push('/admin/login');
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#07070d]">
      {/* Sidebar backdrop — mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-60 bg-[#0a0a10] border-r border-white/[0.06] z-40 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3b82d4] to-[#7c5cd8] flex items-center justify-center">
              <span className="text-white text-xs font-bold">G</span>
            </div>
            <span className="text-white text-sm font-semibold">CMS Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/40 hover:text-white p-1"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3">
          {adminNav.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                activeSection === item.id
                  ? 'bg-[#3b82d4]/15 text-[#3b82d4] border-r-2 border-[#3b82d4]'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <item.icon size={15} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.06]">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 mb-2 transition-colors"
          >
            <Eye size={12} /> View live site
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-red-400/60 hover:text-red-400 transition-colors w-full"
          >
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="h-14 border-b border-white/[0.06] flex items-center justify-between px-5 bg-[#0a0a10] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05]"
            >
              <Menu size={18} />
            </button>
            <h1 className="text-sm font-semibold text-white capitalize">
              {adminNav.find((n) => n.id === activeSection)?.label ?? 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30 hidden sm:block">admin</span>
            <div className="w-7 h-7 rounded-full bg-[#3b82d4]/30 flex items-center justify-center">
              <span className="text-[#3b82d4] text-xs font-bold">A</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          {activeSection === 'dashboard' && <DashboardHome setSection={setActiveSection} />}
          {activeSection === 'site-config' && <SiteConfigPanel />}
          {activeSection === 'hero' && <HeroPanel />}
          {activeSection === 'services' && <ServicesPanel />}
          {activeSection === 'portfolio' && <PortfolioPanel />}
          {activeSection === 'blog' && <BlogPanel />}
          {activeSection === 'process' && <ProcessPanel />}
          {activeSection === 'team' && <TeamPanel />}
          {activeSection === 'testimonials' && <TestimonialsPanel />}
          {activeSection === 'legal' && <LegalPanel />}
        </main>
      </div>
    </div>
  );
}

// ─── Dashboard Home ───────────────────────────────────────────────────────────
function DashboardHome({ setSection }: { setSection: (s: string) => void }) {
  const stats = [
    { label: 'Services', count: services.length, section: 'services' },
    { label: 'Portfolio Items', count: portfolioItems.length, section: 'portfolio' },
    { label: 'Blog Posts', count: blogPosts.length, section: 'blog' },
    { label: 'Team Members', count: teamMembers.length, section: 'team' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Welcome to the CMS</h2>
        <p className="text-white/40 text-sm">Manage all website content from here. Changes go live when you deploy.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => setSection(s.section)}
            className="p-5 rounded-xl bg-[#0d0d14] border border-white/[0.06] text-left hover:border-white/[0.12] transition-colors group"
          >
            <p className="text-3xl font-bold text-white mb-1 group-hover:text-[#3b82d4] transition-colors">{s.count}</p>
            <p className="text-white/40 text-xs">{s.label}</p>
          </button>
        ))}
      </div>

      <div className="bg-[#0d0d14] rounded-xl border border-amber-500/20 p-5">
        <h3 className="text-amber-400 font-semibold text-sm mb-2">Production setup reminder</h3>
        <ul className="space-y-1.5 text-white/40 text-xs">
          <li>• Replace demo credentials with environment variables before going live</li>
          <li>• Connect a real database or headless CMS (Contentful, Sanity, Strapi) to persist changes</li>
          <li>• Implement proper server-side authentication (NextAuth, JWT tokens)</li>
          <li>• Fill in legal page [placeholder] fields with accurate information</li>
          <li>• Replace mock data with real content before launch</li>
        </ul>
      </div>
    </div>
  );
}

// ─── Shared Panel Wrapper ─────────────────────────────────────────────────────
function PanelWrapper({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
          {subtitle && <p className="text-white/40 text-sm mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function CMSNote({ text }: { text: string }) {
  return (
    <div className="mb-5 p-3 rounded-lg bg-[#3b82d4]/10 border border-[#3b82d4]/20">
      <p className="text-[#3b82d4] text-xs">{text}</p>
    </div>
  );
}

function CMSTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="rounded-xl border border-white/[0.06] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06] bg-white/[0.02]">
            {headers.map((h) => (
              <th key={h} className="text-left px-4 py-3 text-white/40 text-xs font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.01]">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-white/70 text-xs">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EditDeleteButtons() {
  return (
    <div className="flex items-center gap-2">
      <button className="p-1.5 rounded-lg border border-white/[0.06] text-white/40 hover:text-[#3b82d4] hover:border-[#3b82d4]/30 transition-colors">
        <Edit3 size={12} />
      </button>
      <button className="p-1.5 rounded-lg border border-white/[0.06] text-white/40 hover:text-red-400 hover:border-red-400/30 transition-colors">
        <Trash2 size={12} />
      </button>
    </div>
  );
}

function AddButton({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3b82d4] hover:bg-[#2563eb] text-white text-xs font-medium transition-colors">
      <Plus size={13} />
      {label}
    </button>
  );
}

// ─── Site Config Panel ────────────────────────────────────────────────────────
function SiteConfigPanel() {
  return (
    <PanelWrapper title="Site Settings" subtitle="Global configuration for the website.">
      <CMSNote text="In production, these values are stored in the database and loaded at runtime. Currently sourced from src/data/index.ts." />
      <div className="space-y-4 max-w-xl">
        {Object.entries(siteConfig).map(([key, value]) => {
          if (typeof value === 'object') return null;
          return (
            <div key={key}>
              <label className="block text-xs text-white/40 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type="text"
                defaultValue={value as string}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#3b82d4]/50 focus:ring-1 focus:ring-[#3b82d4]/15 transition-colors"
              />
            </div>
          );
        })}
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3b82d4] hover:bg-[#2563eb] text-white text-sm font-medium transition-colors mt-2">
          <Save size={13} /> Save Changes
        </button>
      </div>
    </PanelWrapper>
  );
}

// ─── Hero Panel ───────────────────────────────────────────────────────────────
function HeroPanel() {
  return (
    <PanelWrapper
      title="Hero Slides"
      subtitle="Manage the rotating hero section on the home page."
      action={<AddButton label="Add Slide" />}
    >
      <CMSNote text="Changes to hero slides update the home page hero carousel. All 3 slides are active by default." />
      <div className="space-y-3">
        {heroSlides.map((slide, i) => (
          <div key={slide.id} className="p-5 rounded-xl bg-[#0d0d14] border border-white/[0.06] hover:border-white/[0.10] transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-xs text-white/30 mr-2">Slide {i + 1}</span>
                {slide.badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#3b82d4]/15 text-[#3b82d4] border border-[#3b82d4]/20">{slide.badge}</span>
                )}
              </div>
              <EditDeleteButtons />
            </div>
            <p className="text-white text-sm font-semibold leading-snug mb-1">{slide.heading.replace('\n', ' ')}</p>
            <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{slide.subheading}</p>
            <div className="flex gap-3 mt-3">
              <span className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.04] text-white/30 border border-white/[0.06]">
                Primary: {slide.ctaPrimary.label}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.04] text-white/30 border border-white/[0.06]">
                Secondary: {slide.ctaSecondary.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </PanelWrapper>
  );
}

// ─── Services Panel ───────────────────────────────────────────────────────────
function ServicesPanel() {
  return (
    <PanelWrapper
      title="Services"
      subtitle="Manage service categories and their offerings."
      action={<AddButton label="Add Service" />}
    >
      <CMSNote text="Each service maps to a page at /services/[slug]. Offerings, FAQs and process steps are all editable." />
      <CMSTable
        headers={['Service', 'Slug', 'Offerings', 'Featured', 'Actions']}
        rows={services.map((s) => [
          <span key="n" className="font-medium text-white/80">{s.title}</span>,
          <code key="sl" className="text-white/30">{s.slug}</code>,
          <span key="o">{s.offerings.length}</span>,
          <span key="f">{s.featured ? '✓' : '–'}</span>,
          <EditDeleteButtons key="act" />,
        ])}
      />
    </PanelWrapper>
  );
}

// ─── Portfolio Panel ──────────────────────────────────────────────────────────
function PortfolioPanel() {
  return (
    <PanelWrapper
      title="Portfolio"
      subtitle="Manage portfolio items. Published items appear on /portfolio."
      action={<AddButton label="Add Item" />}
    >
      <CMSNote text="Label concept projects clearly in the 'client' field. Never publish fabricated client results." />
      <CMSTable
        headers={['Title', 'Category', 'Client', 'Year', 'Published', 'Actions']}
        rows={portfolioItems.map((p) => [
          <span key="n" className="font-medium text-white/80">{p.title}</span>,
          <span key="cat">{p.category}</span>,
          <span key="cl">{p.client}</span>,
          <span key="yr">{p.year}</span>,
          <span key="pub" className={p.published ? 'text-emerald-400' : 'text-red-400/60'}>{p.published ? 'Yes' : 'No'}</span>,
          <EditDeleteButtons key="act" />,
        ])}
      />
    </PanelWrapper>
  );
}

// ─── Blog Panel ───────────────────────────────────────────────────────────────
function BlogPanel() {
  return (
    <PanelWrapper
      title="Blog / Insights"
      subtitle="Manage articles. Published posts appear on /insights."
      action={<AddButton label="New Article" />}
    >
      <CMSNote text="Articles support basic markdown-style formatting. Set 'featured' to show a post as the hero on the insights page." />
      <CMSTable
        headers={['Title', 'Category', 'Read time', 'Published', 'Featured', 'Actions']}
        rows={blogPosts.map((p) => [
          <span key="n" className="font-medium text-white/80 line-clamp-1 max-w-[200px] block">{p.title}</span>,
          <span key="cat">{p.category}</span>,
          <span key="rt">{p.readTime} min</span>,
          <span key="pub" className={p.published ? 'text-emerald-400' : 'text-red-400/60'}>{p.published ? 'Yes' : 'No'}</span>,
          <span key="feat">{p.featured ? '✓' : '–'}</span>,
          <EditDeleteButtons key="act" />,
        ])}
      />
    </PanelWrapper>
  );
}

// ─── Process Panel ────────────────────────────────────────────────────────────
function ProcessPanel() {
  return (
    <PanelWrapper
      title="Process Steps"
      subtitle="Manage the six-step delivery process shown on /process."
      action={<AddButton label="Add Step" />}
    >
      <CMSNote text="Process steps appear in order on the Process page and in the home page preview." />
      <div className="space-y-3">
        {processSteps.map((step) => (
          <div key={step.id} className="flex items-center gap-4 p-4 rounded-xl bg-[#0d0d14] border border-white/[0.06]">
            <span className="text-[#3b82d4] font-bold text-sm w-8 shrink-0">{step.number}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">{step.title}</p>
              <p className="text-white/35 text-xs line-clamp-1">{step.description}</p>
            </div>
            <EditDeleteButtons />
          </div>
        ))}
      </div>
    </PanelWrapper>
  );
}

// ─── Team Panel ───────────────────────────────────────────────────────────────
function TeamPanel() {
  return (
    <PanelWrapper
      title="Team Members"
      subtitle="Manage team profiles shown on /about."
      action={<AddButton label="Add Member" />}
    >
      <CMSNote text="Add real team members and collaborators here. Profiles appear on the About page." />
      <div className="space-y-3">
        {teamMembers.map((m) => (
          <div key={m.id} className="flex items-center gap-4 p-4 rounded-xl bg-[#0d0d14] border border-white/[0.06]">
            <div className="w-9 h-9 rounded-full bg-[#3b82d4]/20 flex items-center justify-center shrink-0">
              <span className="text-[#3b82d4] text-xs font-bold">{m.name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">{m.name}</p>
              <p className="text-white/35 text-xs">{m.role}</p>
            </div>
            <EditDeleteButtons />
          </div>
        ))}
        <div className="p-4 rounded-xl border border-dashed border-white/[0.06] text-center text-white/25 text-xs">
          Add team members as the agency grows
        </div>
      </div>
    </PanelWrapper>
  );
}

// ─── Testimonials Panel ───────────────────────────────────────────────────────
function TestimonialsPanel() {
  return (
    <PanelWrapper
      title="Testimonials"
      subtitle="Only publish genuine testimonials with client permission."
      action={<AddButton label="Add Testimonial" />}
    >
      <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5 mb-5">
        <p className="text-amber-400 text-sm font-semibold mb-1">Important: Testimonial policy</p>
        <p className="text-white/40 text-xs leading-relaxed">
          Only publish testimonials from real clients who have given explicit permission. Do not fabricate or paraphrase without permission. Each testimonial should include the client name, company and project type for credibility.
        </p>
      </div>
      {testimonials.length === 0 ? (
        <div className="p-8 rounded-xl border border-white/[0.06] text-center">
          <p className="text-white/30 text-sm mb-1">No testimonials yet</p>
          <p className="text-white/20 text-xs">Add testimonials only with client permission.</p>
        </div>
      ) : (
        <CMSTable
          headers={['Author', 'Company', 'Rating', 'Verified', 'Actions']}
          rows={testimonials.map((t) => [
            t.author, t.company,
            `${t.rating}/5`,
            t.verified ? '✓' : '–',
            <EditDeleteButtons key="act" />,
          ])}
        />
      )}
    </PanelWrapper>
  );
}

// ─── Legal Panel ─────────────────────────────────────────────────────────────
function LegalPanel() {
  return (
    <PanelWrapper title="Legal Pages" subtitle="Manage privacy policy and terms of service content.">
      <div className="p-5 rounded-xl border border-red-500/20 bg-red-500/5 mb-5">
        <p className="text-red-400 text-sm font-semibold mb-1">Legal review required</p>
        <p className="text-white/40 text-xs leading-relaxed">
          Legal page content must be reviewed and approved by a qualified legal adviser before publishing. Replace all [placeholder] fields. Do not use template language as the final published document.
        </p>
      </div>
      <div className="space-y-3">
        {[
          { title: 'Privacy Policy', path: '/legal/privacy-policy', status: 'Template — needs review' },
          { title: 'Terms of Service', path: '/legal/terms-of-service', status: 'Template — needs review' },
        ].map((page) => (
          <div key={page.path} className="flex items-center justify-between p-5 rounded-xl bg-[#0d0d14] border border-white/[0.06]">
            <div>
              <p className="text-white text-sm font-medium mb-0.5">{page.title}</p>
              <p className="text-white/30 text-xs">{page.status}</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={page.path}
                target="_blank"
                className="p-1.5 rounded-lg border border-white/[0.06] text-white/40 hover:text-[#3b82d4] hover:border-[#3b82d4]/30 transition-colors"
              >
                <Eye size={12} />
              </a>
              <EditDeleteButtons />
            </div>
          </div>
        ))}
      </div>
    </PanelWrapper>
  );
}
