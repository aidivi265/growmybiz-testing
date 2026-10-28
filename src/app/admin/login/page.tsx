'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials. Please try again.');
        setLoading(false);
        return;
      }

      // Hard redirect ensures the newly issued HTTP-only session cookie is sent on the fresh GET request
      // and completely bypasses any stale Next.js client router cache
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = '/admin/dashboard';
    } catch {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      suppressHydrationWarning
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#07070d]"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[150px] opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #3b82d4, transparent)' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BrandLogo size="lg" theme="dark" asLink={false} />
          </div>
          <h1 className="text-xl font-bold text-white">Admin Access</h1>
          <p className="text-white/40 text-sm mt-1">Growmybizz CMS</p>
        </div>

        {/* Login form card */}
        <div
          suppressHydrationWarning
          className="bg-[#0d0d14] rounded-2xl border border-white/[0.08] p-7 shadow-2xl shadow-black/80"
        >
          <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Username or Email</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                  <User size={15} />
                </div>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#3b82d4]/60 focus:ring-1 focus:ring-[#3b82d4]/20 transition-colors"
                  placeholder="admin or admin@growmybizz.com"
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
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#3b82d4] to-[#7c5cd8] text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 mt-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                'Sign in'
              )}
            </button>

            {/* Quick credentials hint */}
            <div className="pt-1 text-center">
              <p className="text-[11px] text-white/30">
                Authorized for <span className="text-white/50 font-mono">admin</span> or founder email
              </p>
            </div>
          </form>
        </div>

        {/* Back to site */}
        <p className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            ← Return to public website
          </Link>
        </p>
      </div>
    </div>
  );
}
