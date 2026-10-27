'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';

// NOTE: In production, replace with server-side session auth (NextAuth, JWT, etc.)
// These credentials are for development demo only — must be environment variables in production.
const DEMO_CREDENTIALS = {
  username: 'admin',
  password: 'growmybizz2025',
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate auth latency
    await new Promise((r) => setTimeout(r, 800));

    if (
      form.username === DEMO_CREDENTIALS.username &&
      form.password === DEMO_CREDENTIALS.password
    ) {
      // Set a simple session marker (demo only — use proper auth in production)
      sessionStorage.setItem('gmb_admin_auth', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[150px] opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #3b82d4, transparent)' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3b82d4] to-[#7c5cd8] flex items-center justify-center mx-auto mb-3 shadow-xl shadow-blue-500/20">
            <Lock size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Admin Access</h1>
          <p className="text-white/40 text-sm mt-1">Growmybizz CMS</p>
        </div>

        {/* Card */}
        <div className="bg-[#0d0d14] rounded-2xl border border-white/[0.06] p-7 shadow-2xl shadow-black/60">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Username</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                  <User size={15} />
                </div>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#3b82d4]/60 focus:ring-1 focus:ring-[#3b82d4]/20 transition-colors"
                  placeholder="Enter username"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                  <Lock size={15} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#3b82d4]/60 focus:ring-1 focus:ring-[#3b82d4]/20 transition-colors"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle size={14} className="text-red-400 shrink-0" />
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#3b82d4] hover:bg-[#2563eb] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Verifying...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-white/20 text-xs mt-5">
          This panel is not publicly linked. Access is logged.
        </p>
        <p className="text-center mt-3">
          <a href="/" className="text-white/25 text-xs hover:text-white/40 transition-colors">
            ← Back to site
          </a>
        </p>
      </div>
    </div>
  );
}
