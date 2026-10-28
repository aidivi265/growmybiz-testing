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
  Database,
  Check,
} from 'lucide-react';
import type { InquiryRecord } from '@/lib/supabase';
import BrandLogo from '@/components/BrandLogo';

// ─── Admin Nav Items ──────────────────────────────────────────────────────────
const adminNav = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Inbound Inquiries', icon: Inbox },
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

// ─── Data from submodules ────────────────────────────────────────────────────
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

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // Ignore network error on logout
    }
    router.push('/admin/login');
    router.refresh();
  };

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
          <BrandLogo size="sm" theme="dark" asLink={false} />
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
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Supabase (cswpwcmtjzutuownuvez)</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#3b82d4]/30 flex items-center justify-center">
              <span className="text-[#3b82d4] text-xs font-bold">A</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          {activeSection === 'dashboard' && <DashboardHome setSection={setActiveSection} />}
          {activeSection === 'leads' && <LeadsPanel />}
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
  const [leads, setLeads] = useState<InquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/inquiries')
      .then((res) => (res.ok ? res.json() : { leads: [] }))
      .then((data) => {
        setLeads(data.leads || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Inbound Inquiries', count: leads.length, section: 'leads', highlight: true },
    { label: 'Services', count: services.length, section: 'services' },
    { label: 'Portfolio Items', count: portfolioItems.length, section: 'portfolio' },
    { label: 'Blog Posts', count: blogPosts.length, section: 'blog' },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Growmybizz Mission Control</h2>
          <p className="text-white/40 text-sm">Real-time database records and content management powered by Supabase.</p>
        </div>
        <button
          onClick={() => setSection('leads')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#3b82d4] hover:bg-[#2563eb] transition-all shrink-0"
        >
          <Inbox size={14} />
          <span>View Inquiries ({leads.length})</span>
        </button>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => setSection(s.section)}
            className={`p-5 rounded-xl border text-left transition-all group ${
              s.highlight
                ? 'bg-gradient-to-br from-[#3b82d4]/15 to-transparent border-[#3b82d4]/40 hover:border-[#3b82d4]'
                : 'bg-[#0d0d14] border-white/[0.06] hover:border-white/[0.12]'
            }`}
          >
            <p className={`text-3xl font-bold mb-1 transition-colors ${s.highlight ? 'text-[#60a5fa]' : 'text-white group-hover:text-[#3b82d4]'}`}>
              {s.count}
            </p>
            <p className="text-white/40 text-xs">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Live System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-[#0d0d14] border border-white/[0.06] flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Database size={20} />
          </div>
          <div>
            <p className="text-xs text-white/40">Database Engine</p>
            <p className="text-sm font-semibold text-white">Supabase PostgreSQL</p>
            <p className="text-[11px] text-emerald-400 font-mono mt-0.5">Project: cswpwcmtjzutuownuvez</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0d0d14] border border-white/[0.06] flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
            <Mail size={20} />
          </div>
          <div>
            <p className="text-xs text-white/40">Email Pipeline</p>
            <p className="text-sm font-semibold text-white">Resend API (Live)</p>
            <p className="text-[11px] text-blue-400 mt-0.5">divyanshgupta103@gmail.com</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0d0d14] border border-white/[0.06] flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Phone size={20} />
          </div>
          <div>
            <p className="text-xs text-white/40">Instant Alert Engine</p>
            <p className="text-sm font-semibold text-white">WhatsApp Direct Handoff</p>
            <p className="text-[11px] text-emerald-400 font-mono mt-0.5">+91 98765 43210</p>
          </div>
        </div>
      </div>

      {/* Latest Inquiries Table Preview */}
      <div className="bg-[#0d0d14] rounded-xl border border-white/[0.06] p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Inbound Inquiries</h3>
            <p className="text-xs text-white/40">Prospects captured through the website contact funnel</p>
          </div>
          <button
            onClick={() => setSection('leads')}
            className="text-xs text-[#3b82d4] hover:underline flex items-center gap-1"
          >
            <span>Manage All ({leads.length})</span>
            <ChevronRight size={12} />
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-white/30 text-xs">Loading inquiries...</div>
        ) : leads.length === 0 ? (
          <div className="py-8 text-center text-white/30 text-xs">
            No inquiries recorded yet. Submissions to the contact form will appear here in real time.
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
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        l.status === 'new'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : l.status === 'contacted'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : l.status === 'qualified'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {l.phone && (
                          <a
                            href={`https://wa.me/${l.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi ' + l.name + ', thank you for contacting Growmybizz!')}`}
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

  const filteredLeads = filter === 'all' ? leads : leads.filter((l) => l.status === filter);

  return (
    <PanelWrapper
      title="Inbound Inquiries & Leads"
      subtitle="Prospects captured via the website contact form, stored in Supabase with Resend notification history."
      action={
        <button
          onClick={() => fetchLeads(true)}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/70 bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      }
    >
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {(['all', 'new', 'contacted', 'qualified', 'closed'] as const).map((tab) => {
          const count = tab === 'all' ? leads.length : leads.filter((l) => l.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors flex items-center gap-1.5 ${
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

      {loading ? (
        <div className="py-12 text-center text-white/40 text-sm">Fetching leads from Supabase...</div>
      ) : filteredLeads.length === 0 ? (
        <div className="py-12 rounded-xl bg-[#0d0d14] border border-white/[0.06] text-center text-white/30 text-sm">
          No inquiries found matching this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLeads.map((lead) => {
            const cleanPhone = lead.phone ? lead.phone.replace(/[^0-9]/g, '') : '';
            const whatsappLink = cleanPhone.length >= 10
              ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hi ' + lead.name + ', thank you for reaching out to Growmybizz regarding ' + lead.service + '! We received your project brief and would love to discuss this with you.')}`
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

                  {/* Actions & Status Dropdown */}
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
                      href={`mailto:${lead.email}?subject=Re:%20Growmybizz%20Inquiry%20-%20${encodeURIComponent(lead.service)}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#3b82d4] hover:bg-[#2563eb] transition-all shadow-sm"
                    >
                      <Mail size={12} />
                      <span>Email</span>
                    </a>

                    <button
                      onClick={() => handleDelete(lead.id)}
                      className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-white/[0.04] transition-colors"
                      title="Delete lead"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Scope & Metadata Chips */}
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

                {/* Client Message */}
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-0.5">{title}</h2>
          <p className="text-white/40 text-xs">{subtitle}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function CMSTable({ headers, rows }: { headers: string[]; rows: (React.ReactNode | string)[][] }) {
  return (
    <div className="rounded-xl border border-white/[0.06] overflow-hidden">
      <table className="w-full text-xs text-left">
        <thead className="bg-white/[0.02] border-b border-white/[0.06]">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-white/40 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-white/80">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Site Config Panel (Connected to Supabase site_settings) ─────────────────
function SiteConfigPanel() {
  const [data, setData] = useState({
    siteName: siteConfig.siteName,
    tagline: siteConfig.tagline,
    email: siteConfig.email,
    phone: siteConfig.phone,
    address: siteConfig.address,
    whatsappNumber: siteConfig.whatsappNumber,
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [source, setSource] = useState<'siteConfig' | 'supabase'>('siteConfig');

  useEffect(() => {
    let ignore = false;
    fetch('/api/admin/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!ignore && json?.settings) {
          setData((prev) => ({ ...prev, ...json.settings }));
          if (json.source) setSource(json.source);
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
        setSource('supabase');
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      console.error('Failed to save settings to Supabase:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PanelWrapper
      title="Site Settings"
      subtitle={`Global agency metadata stored in siteConfig & synced with Supabase site_settings (${source === 'supabase' ? 'Synced with Supabase DB' : 'Default config fallback'}).`}
      action={
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#3b82d4] hover:bg-[#2563eb] transition-colors disabled:opacity-50 cursor-pointer"
        >
          {saved ? <Check size={13} /> : <Save size={13} />}
          {saved ? 'Saved to Supabase!' : saving ? 'Saving...' : 'Save changes'}
        </button>
      }
    >
      <div className="max-w-2xl space-y-4">
        {[
          { label: 'Agency Name', key: 'siteName' as const },
          { label: 'Tagline', key: 'tagline' as const },
          { label: 'Contact Email', key: 'email' as const },
          { label: 'Phone Number', key: 'phone' as const },
          { label: 'WhatsApp Number', key: 'whatsappNumber' as const },
          { label: 'Address / Delivery Base', key: 'address' as const },
        ].map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-medium text-white/60 mb-1">{f.label}</label>
            <input
              type="text"
              value={data[f.key]}
              onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#0d0d14] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[#3b82d4]"
            />
          </div>
        ))}
      </div>
    </PanelWrapper>
  );
}

// ─── Hero Panel ───────────────────────────────────────────────────────────────
function HeroPanel() {
  return (
    <PanelWrapper
      title="Hero Slides"
      subtitle="Rotating headline banners managed in src/data/hero.ts for zero-latency edge delivery."
      action={
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/50">
          File-Driven Module
        </span>
      }
    >
      <CMSTable
        headers={['Badge', 'Heading', 'Subheading', 'Status']}
        rows={heroSlides.map((s) => [
          s.badge || '–',
          s.heading,
          s.subheading.slice(0, 45) + '...',
          <span key="status" className="px-2 py-0.5 rounded text-[11px] font-mono text-emerald-400 bg-emerald-400/10">Active</span>,
        ])}
      />
    </PanelWrapper>
  );
}

// ─── Services Panel ───────────────────────────────────────────────────────────
function ServicesPanel() {
  return (
    <PanelWrapper
      title="Services"
      subtitle="Core disciplines, deliverables, and service scopes managed in src/data/services.ts."
      action={
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/50">
          File-Driven Module
        </span>
      }
    >
      <CMSTable
        headers={['Title', 'Slug', 'Offerings', 'Featured', 'Preview']}
        rows={services.map((s) => [
          s.title,
          s.slug,
          `${s.offerings.length} items`,
          s.featured ? 'Yes' : 'No',
          <a
            key={s.slug}
            href={`/services/${s.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#3b82d4] hover:underline"
          >
            <Eye size={12} /> View Page ↗
          </a>,
        ])}
      />
    </PanelWrapper>
  );
}

// ─── Portfolio Panel ──────────────────────────────────────────────────────────
function PortfolioPanel() {
  return (
    <PanelWrapper
      title="Portfolio & Case Studies"
      subtitle="Case studies, prototypes, and impact metrics managed in src/data/portfolio.ts."
      action={
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/50">
          File-Driven Module
        </span>
      }
    >
      <CMSTable
        headers={['Client', 'Project Title', 'Category', 'Type', 'Preview']}
        rows={portfolioItems.map((p) => [
          p.client,
          p.title,
          p.category,
          p.isConcept ? (
            <span key="type" className="px-2 py-0.5 rounded text-[10px] font-bold text-amber-300 bg-amber-400/15 border border-amber-400/30">
              Concept Demo
            </span>
          ) : (
            <span key="type" className="px-2 py-0.5 rounded text-[10px] font-bold text-emerald-300 bg-emerald-400/15">
              Client Work
            </span>
          ),
          <a
            key={p.slug}
            href={`/portfolio/${p.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#3b82d4] hover:underline"
          >
            <Eye size={12} /> View Case Study ↗
          </a>,
        ])}
      />
    </PanelWrapper>
  );
}

// ─── Blog Panel ───────────────────────────────────────────────────────────────
function BlogPanel() {
  return (
    <PanelWrapper
      title="Blog & Insights"
      subtitle="Strategic growth articles and guides managed in src/data/insights.ts."
      action={
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/50">
          File-Driven Module
        </span>
      }
    >
      <CMSTable
        headers={['Title', 'Category', 'Read Time', 'Published', 'Preview']}
        rows={blogPosts.map((b) => [
          b.title,
          b.category,
          `${b.readTime} min`,
          b.publishedAt,
          <a
            key={b.slug}
            href={`/insights/${b.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#3b82d4] hover:underline"
          >
            <Eye size={12} /> View Article ↗
          </a>,
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
      subtitle="6-stage delivery framework managed in src/data/process.ts."
    >
      <CMSTable
        headers={['Stage', 'Title', 'Description', 'Checkpoints', 'Status']}
        rows={processSteps.map((p) => [
          p.number,
          p.title,
          p.description.slice(0, 50) + '...',
          `${p.details.length} points`,
          <span key="st" className="px-2 py-0.5 rounded text-[11px] font-mono text-emerald-400 bg-emerald-400/10">Stage {p.number}</span>,
        ])}
      />
    </PanelWrapper>
  );
}

// ─── Team Panel ───────────────────────────────────────────────────────────────
function TeamPanel() {
  return (
    <PanelWrapper
      title="Team Members"
      subtitle="Agency leadership profiles managed in src/data/company.ts."
      action={
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/50">
          File-Driven Module
        </span>
      }
    >
      <CMSTable
        headers={['Name', 'Role', 'Profile']}
        rows={teamMembers.map((t) => [
          t.name,
          t.role,
          t.linkedin ? (
            <a
              key={t.id}
              href={t.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#3b82d4] hover:underline inline-flex items-center gap-1"
            >
              LinkedIn ↗
            </a>
          ) : (
            <span key={t.id} className="text-white/40">–</span>
          ),
        ])}
      />
    </PanelWrapper>
  );
}

// ─── Testimonials Panel ───────────────────────────────────────────────────────
function TestimonialsPanel() {
  return (
    <PanelWrapper
      title="Testimonials & Social Proof"
      subtitle="Client testimonials managed in src/data/company.ts & seeded in Supabase testimonials."
      action={
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/50">
          File-Driven Module
        </span>
      }
    >
      <CMSTable
        headers={['Author', 'Company', 'Rating', 'Verified']}
        rows={testimonials.map((t) => [
          t.author,
          t.company,
          `${t.rating}/5`,
          t.verified ? <span key="v" className="text-emerald-400 font-bold">✓ Verified</span> : '–',
        ])}
      />
    </PanelWrapper>
  );
}

// ─── Legal Panel ─────────────────────────────────────────────────────────────
function LegalPanel() {
  return (
    <PanelWrapper
      title="Legal Pages"
      subtitle="Statutory policies compliant with digital consumer protection laws."
      action={
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/50">
          6 Live Pages
        </span>
      }
    >
      <div className="space-y-3">
        {[
          { title: 'Privacy Policy', path: '/legal/privacy-policy', status: 'Live & Production Ready' },
          { title: 'Terms of Service', path: '/legal/terms-of-service', status: 'Live & Production Ready' },
          { title: 'Cookie Policy', path: '/legal/cookie-policy', status: 'Live & Production Ready' },
          { title: 'Refund Policy', path: '/legal/refund-policy', status: 'Live & Production Ready' },
          { title: 'Disclaimer', path: '/legal/disclaimer', status: 'Live & Production Ready' },
          { title: 'Accessibility Statement', path: '/legal/accessibility', status: 'Live & Production Ready' },
        ].map((page) => (
          <div key={page.path} className="flex items-center justify-between p-5 rounded-xl bg-[#0d0d14] border border-white/[0.06]">
            <div>
              <p className="text-white text-sm font-medium mb-0.5">{page.title}</p>
              <p className="text-emerald-400 text-xs">{page.status}</p>
            </div>
            <a
              href={page.path}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] text-white/60 hover:text-[#3b82d4] hover:border-[#3b82d4]/30 hover:bg-white/[0.04] transition-colors text-xs"
            >
              <Eye size={12} />
              <span>Preview ↗</span>
            </a>
          </div>
        ))}
      </div>
    </PanelWrapper>
  );
}
