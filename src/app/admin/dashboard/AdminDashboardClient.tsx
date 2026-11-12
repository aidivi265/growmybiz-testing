'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  Briefcase,
  Settings,
  Users,
  Globe,
  LogOut,
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
  Phone,
  Mail,
  RefreshCw,
  Check,
  Share2,
  FileText,
  Sparkles,
  Download,
  Search,
  Calendar,
  Calculator,
  SplitSquareVertical,
  ArrowUpRight,
} from 'lucide-react';
import type { InquiryRecord } from '@/lib/supabase';
import BrandLogo from '@/components/BrandLogo';
import ProjectsPanel from '@/components/admin/ProjectsPanel';
import ServicesPanel from '@/components/admin/ServicesPanel';
import PortfolioPanel from '@/components/admin/PortfolioPanel';
import BlogPanel from '@/components/admin/BlogPanel';
import TestimonialsPanel from '@/components/admin/TestimonialsPanel';
import HeroPanel from '@/components/admin/HeroPanel';
import SeoPanel from '@/components/admin/SeoPanel';
import ProcessPanel from '@/components/admin/ProcessPanel';
import TeamPanel from '@/components/admin/TeamPanel';
import PageCopyPanel from '@/components/admin/PageCopyPanel';
import LegalPanel from '@/components/admin/LegalPanel';
import EstimatorPanel from '@/components/admin/EstimatorPanel';
import BeforeAfterPanel from '@/components/admin/BeforeAfterPanel';
import BookingPanel from '@/components/admin/BookingPanel';
import PageVisibilityPanel from '@/components/admin/PageVisibilityPanel';
import { invalidateClientSettings } from '@/lib/settingsClient';
import {
  siteConfig,
  services,
  portfolioItems,
  blogPosts,
} from '@/data';

// ─── Grouped Admin Sidebar Navigation ─────────────────────────────────────────
interface AdminNavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

interface AdminNavGroup {
  group: string;
  items: AdminNavItem[];
}

const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    group: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    group: 'Leads & Clients',
    items: [
      { id: 'leads', label: 'Leads & Inquiries', icon: Inbox },
      { id: 'projects', label: 'Client Projects', icon: Sparkles },
      { id: 'booking', label: 'Call Booking', icon: Calendar },
    ],
  },
  {
    group: 'Pages & Layout',
    items: [
      { id: 'pages', label: 'Show / Hide Pages', icon: EyeOff, badge: 'All' },
      { id: 'hero', label: 'Hero Banner', icon: Globe },
      { id: 'page-copy', label: 'Homepage Copy', icon: FileText },
    ],
  },
  {
    group: 'Content',
    items: [
      { id: 'services', label: 'Services', icon: Briefcase },
      { id: 'portfolio', label: 'Portfolio', icon: Image },
      { id: 'blog', label: 'Blog / Insights', icon: BookOpen },
      { id: 'before-after', label: 'Before & After', icon: SplitSquareVertical },
      { id: 'process', label: 'Process Steps', icon: ChevronRight },
      { id: 'team', label: 'Team Members', icon: Users },
      { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
      { id: 'legal', label: 'Legal Policies', icon: Shield },
    ],
  },
  {
    group: 'Pricing & Settings',
    items: [
      { id: 'estimator', label: 'Estimator (INR ₹)', icon: Calculator },
      { id: 'site-config', label: 'Business & Socials', icon: Settings },
      { id: 'seo', label: 'SEO & Analytics', icon: Share2 },
    ],
  },
];

const FLAT_NAV_ITEMS = ADMIN_NAV_GROUPS.flatMap((g) => g.items);

export default function AdminDashboardClient() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // Ignore network error on logout
    }
    router.push('/admin/login');
    router.refresh();
  };

  const currentNav = FLAT_NAV_ITEMS.find((n) => n.id === activeSection);

  return (
    <div className="flex min-h-screen bg-[#07070d]">
      {/* Sidebar backdrop — mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden animate-fadeIn cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#0a0a11] border-r border-white/[0.06] z-40 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <BrandLogo size="sm" theme="dark" showTagline={false} asLink={false} />
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">
              CMS
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/40 hover:text-white p-1"
          >
            <X size={16} />
          </button>
        </div>

        {/* Grouped Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4">
          {ADMIN_NAV_GROUPS.map((group) => (
            <div key={group.group}>
              <div className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-white/30">
                {group.group}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#3b82d4]/20 text-white border border-[#3b82d4]/40'
                          : 'text-white/55 hover:text-white hover:bg-white/[0.04] border border-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <item.icon
                          size={15}
                          className={isActive ? 'text-[#60a5fa] shrink-0' : 'text-white/40 shrink-0'}
                        />
                        <span className="truncate">{item.label}</span>
                      </span>
                      {item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3.5 border-t border-white/[0.06] space-y-2">
          <div className="px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-between text-[11px] text-white/60">
            <span>🇮🇳 Region</span>
            <span className="font-mono font-bold text-emerald-400">India (INR ₹)</span>
          </div>
          <div className="flex items-center justify-between px-1 pt-1">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs text-white/45 hover:text-white transition-colors"
            >
              <Eye size={12} /> View Site
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-red-400/70 hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut size={12} /> Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="h-14 border-b border-white/[0.06] flex items-center justify-between px-5 bg-[#0a0a11] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05]"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2">
              {currentNav && <currentNav.icon size={16} className="text-[#60a5fa]" />}
              <h1 className="text-sm font-semibold text-white">
                {currentNav?.label ?? 'Dashboard'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveSection('pages')}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-white/75 hover:text-white transition-colors cursor-pointer"
            >
              <EyeOff size={12} className="text-amber-400" />
              <span>Page Visibility</span>
            </button>

            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>CMS Live</span>
            </div>

            <div className="w-7 h-7 rounded-full bg-[#3b82d4]/30 flex items-center justify-center">
              <span className="text-[#60a5fa] text-xs font-bold">A</span>
            </div>
          </div>
        </div>

        {/* Active Panel */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          {activeSection === 'dashboard' && <DashboardHome setSection={setActiveSection} />}
          {activeSection === 'projects' && <ProjectsPanel />}
          {activeSection === 'leads' && <LeadsPanel />}
          {activeSection === 'pages' && <PageVisibilityPanel />}
          {activeSection === 'site-config' && <SiteConfigPanel setSection={setActiveSection} />}
          {activeSection === 'before-after' && <BeforeAfterPanel />}
          {activeSection === 'booking' && <BookingPanel />}
          {activeSection === 'estimator' && <EstimatorPanel />}
          {activeSection === 'seo' && <SeoPanel />}
          {activeSection === 'hero' && <HeroPanel />}
          {activeSection === 'services' && <ServicesPanel />}
          {activeSection === 'portfolio' && <PortfolioPanel />}
          {activeSection === 'blog' && <BlogPanel />}
          {activeSection === 'process' && <ProcessPanel />}
          {activeSection === 'team' && <TeamPanel />}
          {activeSection === 'testimonials' && <TestimonialsPanel />}
          {activeSection === 'page-copy' && <PageCopyPanel />}
          {activeSection === 'legal' && <LegalPanel />}
        </main>
      </div>
    </div>
  );
}

// ─── Dashboard Home ───────────────────────────────────────────────────────────
function DashboardHome({ setSection }: { setSection: (s: string) => void }) {
  const [leads, setLeads] = useState<InquiryRecord[]>([]);
  const [servicesCount, setServicesCount] = useState<number>(services.length);
  const [portfolioCount, setPortfolioCount] = useState<number>(portfolioItems.length);
  const [blogCount, setBlogCount] = useState<number>(blogPosts.length);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLiveCounts = async () => {
    setRefreshing(true);
    try {
      const [leadsRes, servicesRes, portfolioRes, blogRes] = await Promise.allSettled([
        fetch('/api/admin/inquiries').then((res) => (res.ok ? res.json() : { leads: [] })),
        fetch('/api/admin/services').then((res) => (res.ok ? res.json() : { services: [] })),
        fetch('/api/admin/portfolio').then((res) => (res.ok ? res.json() : { projects: [] })),
        fetch('/api/admin/insights').then((res) => (res.ok ? res.json() : { articles: [] })),
      ]);

      if (leadsRes.status === 'fulfilled' && Array.isArray(leadsRes.value?.leads)) {
        setLeads(leadsRes.value.leads);
      }
      if (servicesRes.status === 'fulfilled' && Array.isArray(servicesRes.value?.services)) {
        setServicesCount(servicesRes.value.services.length);
      }
      if (portfolioRes.status === 'fulfilled' && Array.isArray(portfolioRes.value?.projects)) {
        setPortfolioCount(portfolioRes.value.projects.length);
      }
      if (blogRes.status === 'fulfilled' && Array.isArray(blogRes.value?.articles)) {
        setBlogCount(blogRes.value.articles.length > 0 ? blogRes.value.articles.length : blogPosts.length);
      }
    } catch (err) {
      console.warn('Failed to fetch live admin stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveCounts();
  }, []);

  const stats = [
    { label: 'Inbound Inquiries', count: leads.length, section: 'leads', highlight: true },
    { label: 'Services', count: servicesCount, section: 'services' },
    { label: 'Portfolio Items', count: portfolioCount, section: 'portfolio' },
    { label: 'Blog Posts', count: blogCount, section: 'blog' },
  ];

  const quickActions = [
    {
      title: 'Show / Hide Any Page',
      desc: 'Turn pages, tools (/audit, /estimator, /portal), legal docs or homepage sections Live or Hidden.',
      section: 'pages',
      icon: EyeOff,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Client Projects & Quotations',
      desc: 'Create quotations, update milestone payments (₹ INR) and share Client Portal links.',
      section: 'projects',
      icon: Sparkles,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Edit Services & Pricing',
      desc: 'Manage service offerings, deliverables, or adjust Cost Estimator INR (₹) rates.',
      section: 'estimator',
      icon: Calculator,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Business Details & Socials',
      desc: 'Update phone number, WhatsApp alert number, contact email and social media links.',
      section: 'site-config',
      icon: Settings,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
  ];

  return (
    <div className="max-w-6xl space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Welcome to Growmybiz24 CMS</h2>
          <p className="text-white/55 text-xs sm:text-sm">
            Manage website pages, leads, services, portfolio, and India (INR ₹) pricing from one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchLiveCounts}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 bg-white/[0.05] hover:bg-white/[0.10] border border-white/10 transition-all shrink-0 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin text-[#3b82d4]' : ''} />
            <span>{refreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>
          <button
            onClick={() => setSection('pages')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#3b82d4] hover:bg-[#2563eb] transition-all shrink-0 cursor-pointer"
          >
            <EyeOff size={14} />
            <span>Manage Page Visibility</span>
          </button>
        </div>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => setSection(s.section)}
            className={`p-5 rounded-xl border text-left transition-all group cursor-pointer ${
              s.highlight
                ? 'bg-gradient-to-br from-[#3b82d4]/15 to-transparent border-[#3b82d4]/40 hover:border-[#3b82d4]'
                : 'bg-[#0d0d14] border-white/[0.06] hover:border-white/[0.12]'
            }`}
          >
            <p
              className={`text-3xl font-bold mb-1 transition-colors ${
                s.highlight ? 'text-[#60a5fa]' : 'text-white group-hover:text-[#3b82d4]'
              }`}
            >
              {s.count}
            </p>
            <p className="text-white/45 text-xs">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">
          Quick Tasks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {quickActions.map((qa) => (
            <button
              key={qa.section}
              type="button"
              onClick={() => setSection(qa.section)}
              className="p-4 rounded-xl bg-[#0d0d14] border border-white/[0.06] hover:border-white/[0.16] text-left transition-all flex items-start gap-3.5 group cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${qa.color}`}>
                <qa.icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-white group-hover:text-[#60a5fa] transition-colors">
                    {qa.title}
                  </span>
                  <ArrowUpRight size={14} className="text-white/30 group-hover:text-white transition-colors shrink-0" />
                </div>
                <p className="text-xs text-white/45 mt-1 leading-relaxed">{qa.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Latest Inquiries Table Preview */}
      <div className="bg-[#0d0d14] rounded-xl border border-white/[0.06] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Inquiries</h3>
            <p className="text-xs text-white/40">Latest leads received from the website</p>
          </div>
          <button
            onClick={() => setSection('leads')}
            className="text-xs text-[#60a5fa] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({leads.length})</span>
            <ChevronRight size={12} />
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-white/30 text-xs">Loading inquiries...</div>
        ) : leads.length === 0 ? (
          <div className="py-8 text-center text-white/30 text-xs">
            No inquiries recorded yet. Contact form submissions will appear here automatically.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-white/40">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3">Service</th>
                  <th className="py-2.5 px-3">Budget</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {leads.slice(0, 5).map((l) => (
                  <tr key={l.id} className="hover:bg-white/[0.02] text-white/80">
                    <td className="py-3 px-3 text-white/40 whitespace-nowrap">
                      {new Date(l.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      <div>{l.name}</div>
                      <div className="text-[11px] text-white/40 font-normal">{l.email}</div>
                    </td>
                    <td className="py-3 px-3 text-white/70">{l.service}</td>
                    <td className="py-3 px-3 text-emerald-400 font-mono">{l.budget}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          l.status === 'new'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : l.status === 'contacted'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : l.status === 'qualified'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {l.phone && (
                          <a
                            href={`https://wa.me/${l.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              'Hi ' + l.name + ', thank you for contacting Growmybiz24!'
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <Phone size={12} />
                          </a>
                        )}
                        <a
                          href={`mailto:${l.email}`}
                          className="p-1.5 rounded-lg bg-[#3b82d4]/10 text-[#3b82d4] hover:bg-[#3b82d4]/20 transition-colors"
                          title="Reply by Email"
                        >
                          <Mail size={12} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Leads Panel (Full Inbound CRM) ──────────────────────────────────────────
function LeadsPanel() {
  const [leads, setLeads] = useState<InquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'qualified' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLeads = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const res = await fetch('/api/admin/inquiries');
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetch('/api/admin/inquiries')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data?.leads) {
          setLeads(data.leads);
        }
      })
      .catch((err) => console.error('Error fetching inquiries:', err))
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleStatusChange = async (id: string, newStatus: InquiryRecord['status']) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    try {
      await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry record?')) return;
    setLeads((prev) => prev.filter((l) => l.id !== id));
    try {
      await fetch(`/api/admin/inquiries?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
    }
  };

  const filteredLeads = leads.filter((l) => {
    const matchesFilter = filter === 'all' || l.status === filter;
    if (!matchesFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (l.name && l.name.toLowerCase().includes(q)) ||
      (l.email && l.email.toLowerCase().includes(q)) ||
      (l.phone && l.phone.toLowerCase().includes(q)) ||
      (l.company && l.company.toLowerCase().includes(q)) ||
      (l.service && l.service.toLowerCase().includes(q)) ||
      (l.message && l.message.toLowerCase().includes(q))
    );
  });

  const handleExportCsv = () => {
    if (filteredLeads.length === 0) {
      alert('No inquiries found to export.');
      return;
    }
    const headers = ['ID', 'Date (UTC)', 'Name', 'Email', 'Phone', 'Company', 'Service', 'Budget', 'Status', 'Message'];
    const rows = filteredLeads.map((l) => [
      `"${l.id}"`,
      `"${new Date(l.created_at).toISOString()}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${(l.service || '').replace(/"/g, '""')}"`,
      `"${(l.budget || '').replace(/"/g, '""')}"`,
      `"${(l.status || '').replace(/"/g, '""')}"`,
      `"${(l.message || '').replace(/"/g, '""').replace(/[\r\n]+/g, ' ')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `growmybiz24_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <PanelWrapper
      title="Leads & Inquiries"
      subtitle="Manage prospects from the contact form and quote requests."
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            disabled={filteredLeads.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600/90 hover:bg-emerald-600 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Download size={13} />
            <span>Export CSV ({filteredLeads.length})</span>
          </button>
          <button
            onClick={() => fetchLeads(true)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/70 bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      }
    >
      {/* Controls: Filter Tabs + Search Input */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'new', 'contacted', 'qualified', 'closed'] as const).map((tab) => {
            const count = tab === 'all' ? leads.length : leads.filter((l) => l.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors flex items-center gap-1.5 cursor-pointer ${
                  filter === tab
                    ? 'bg-[#3b82d4] text-white shadow-sm'
                    : 'bg-[#0d0d14] text-white/50 hover:text-white border border-white/[0.06]'
                }`}
              >
                <span>{tab}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] ${filter === tab ? 'bg-white/20 text-white' : 'bg-white/[0.06] text-white/40'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[220px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, service..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0d0d14] border border-white/[0.08] text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b82d4] transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-white/40 text-sm">Loading leads...</div>
      ) : filteredLeads.length === 0 ? (
        <div className="py-12 rounded-xl bg-[#0d0d14] border border-white/[0.06] text-center text-white/30 text-sm">
          No inquiries found matching this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLeads.map((lead) => {
            const cleanPhone = lead.phone ? lead.phone.replace(/[^0-9]/g, '') : '';
            const whatsappLink =
              cleanPhone.length >= 10
                ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    'Hi ' + lead.name + ', thank you for reaching out to Growmybiz24 regarding ' + lead.service + '! We received your project brief and would love to discuss this with you.'
                  )}`
                : null;

            return (
              <div
                key={lead.id}
                className="p-5 rounded-xl bg-[#0d0d14] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h4 className="text-base font-bold text-white">{lead.name}</h4>
                      {lead.company && (
                        <span className="text-xs px-2 py-0.5 rounded bg-white/[0.05] text-white/60">
                          {lead.company}
                        </span>
                      )}
                      <span className="text-xs text-white/30">
                        {new Date(lead.created_at).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-white/50 flex-wrap">
                      <a href={`mailto:${lead.email}`} className="text-[#60a5fa] hover:underline flex items-center gap-1">
                        <Mail size={12} /> {lead.email}
                      </a>
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`} className="hover:text-white flex items-center gap-1">
                          <Phone size={12} /> {lead.phone}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as InquiryRecord['status'])}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#12121c] border border-white/[0.1] text-white focus:outline-none focus:border-[#3b82d4]"
                    >
                      <option value="new">Status: New</option>
                      <option value="contacted">Status: Contacted</option>
                      <option value="qualified">Status: Qualified</option>
                      <option value="closed">Status: Closed</option>
                    </select>

                    {whatsappLink && (
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] transition-all shadow-sm"
                      >
                        <Phone size={12} />
                        <span>WhatsApp</span>
                      </a>
                    )}

                    <a
                      href={`mailto:${lead.email}?subject=Re:%20Growmybiz24%20Inquiry%20-%20${encodeURIComponent(lead.service)}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#3b82d4] hover:bg-[#2563eb] transition-all shadow-sm"
                    >
                      <Mail size={12} />
                      <span>Email</span>
                    </a>

                    <button
                      onClick={() => handleDelete(lead.id)}
                      className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-white/[0.04] transition-colors cursor-pointer"
                      title="Delete lead"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-lg bg-black/20 border border-white/[0.03] text-xs mb-3">
                  <div>
                    <span className="text-white/40 block text-[11px]">Service</span>
                    <span className="text-white font-medium">{lead.service}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[11px]">Budget</span>
                    <span className="text-emerald-400 font-mono font-medium">{lead.budget}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[11px]">Timeline</span>
                    <span className="text-white font-medium">{lead.timeline}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] text-xs text-white/80 leading-relaxed whitespace-pre-wrap">
                  {lead.message}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PanelWrapper>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function PanelWrapper({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-0.5">{title}</h2>
          <p className="text-white/45 text-xs">{subtitle}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

// ─── Site Config Panel (Business Details & Social Channels Only) ──────────────
function SiteConfigPanel({ setSection }: { setSection: (s: string) => void }) {
  const [data, setData] = useState({
    siteName: siteConfig.siteName,
    tagline: siteConfig.tagline,
    description: siteConfig.description,
    email: siteConfig.email,
    phone: siteConfig.phone,
    address: siteConfig.address,
    whatsappNumber: siteConfig.whatsappNumber,
    social: {
      linkedin: siteConfig.social.linkedin || '',
      instagram: siteConfig.social.instagram || '',
      twitter: siteConfig.social.twitter || '',
      youtube: siteConfig.social.youtube || '',
    },
    socialVisibility: {
      linkedin: true,
      instagram: true,
      twitter: true,
      youtube: true,
    },
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let ignore = false;
    fetch('/api/admin/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!ignore && json?.settings) {
          setData((prev) => ({
            ...prev,
            ...json.settings,
          }));
        }
      })
      .catch((err) => console.error('Failed to load settings:', err));

    return () => {
      ignore = true;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSaved(true);
        invalidateClientSettings();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('growmybiz:settings-updated', { detail: data }));
        }
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PanelWrapper
      title="Business Details & Socials"
      subtitle="Update your agency name, contact email, WhatsApp number, address, and social links."
      action={
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#3b82d4] hover:bg-[#2563eb] transition-colors disabled:opacity-50 cursor-pointer"
        >
          {saved ? <Check size={13} /> : <Save size={13} />}
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
        </button>
      }
    >
      <div className="max-w-2xl space-y-5">
        {/* Shortcut banner for Page Visibility */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3">
          <div className="text-xs text-amber-200">
            Want to show or hide website pages? Manage all 22 pages &amp; sections from the dedicated panel.
          </div>
          <button
            type="button"
            onClick={() => setSection('pages')}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-[11px] font-bold shrink-0 cursor-pointer"
          >
            Go to Show / Hide Pages →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Agency Name', key: 'siteName' as const },
            { label: 'Tagline', key: 'tagline' as const },
            { label: 'Contact Email', key: 'email' as const },
            { label: 'Phone Number', key: 'phone' as const },
            { label: 'WhatsApp Number', key: 'whatsappNumber' as const },
            { label: 'Address / City', key: 'address' as const },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-white/60 mb-1.5">{f.label}</label>
              <input
                type="text"
                value={(data as any)[f.key] || ''}
                onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0d0d14] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[#3b82d4]"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-medium text-white/60 mb-1.5">Company Description</label>
          <textarea
            rows={2}
            value={data.description || ''}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-[#0d0d14] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[#3b82d4]"
          />
        </div>

        <div className="pt-4 border-t border-white/5 space-y-3">
          <div>
            <div className="text-xs font-semibold text-white">Social Media Links &amp; Visibility</div>
            <p className="text-[11px] text-white/45">
              Hide any social channel from the website footer without deleting its link.
            </p>
          </div>
          <div className="space-y-3">
            {[
              { label: 'LinkedIn', key: 'linkedin' as const, placeholder: 'https://linkedin.com/company/growmybiz24' },
              { label: 'Instagram', key: 'instagram' as const, placeholder: 'https://instagram.com/growmybiz24' },
              { label: 'Twitter / X', key: 'twitter' as const, placeholder: 'https://x.com/growmybiz24' },
              { label: 'YouTube', key: 'youtube' as const, placeholder: 'https://youtube.com/@growmybiz24' },
            ].map((s) => {
              const isVisible = (data.socialVisibility as any)?.[s.key] !== false;
              return (
                <div key={s.key} className="p-3 rounded-xl bg-[#0d0d14] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white/80">{s.label}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setData((prev) => {
                          const currentVis = (prev.socialVisibility as any)?.[s.key] !== false;
                          return {
                            ...prev,
                            socialVisibility: {
                              ...(prev.socialVisibility || {}),
                              [s.key]: !currentVis,
                            },
                          };
                        })
                      }
                      className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isVisible
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-white/5 text-white/40 border border-white/10 hover:text-white'
                      }`}
                    >
                      <span>{isVisible ? '✓ Visible' : '✕ Hidden'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={(data.social as any)?.[s.key] || ''}
                    placeholder={s.placeholder}
                    onChange={(e) =>
                      setData({
                        ...data,
                        social: { ...(data.social || {}), [s.key]: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/[0.08] text-white text-xs outline-none focus:border-[#3b82d4]"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PanelWrapper>
  );
}
