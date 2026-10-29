import Link from 'next/link';
import { ArrowLeft, Compass, Home, MessageSquare } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-24 relative overflow-hidden bg-[#0A101D]">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Compass className="w-4 h-4 animate-spin text-emerald-400" style={{ animationDuration: '8s' }} />
          Page Not Found • 404
        </div>

        <h1 className="text-6xl sm:text-7xl font-bold font-syne text-white tracking-tight mb-4">
          Lost in Space?
        </h1>

        <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8">
          The page or route you are looking for doesn&apos;t exist or has been relocated to another galaxy. Let&apos;s get your business growth journey back on course.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-semibold shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all text-sm"
          >
            <Home className="w-4 h-4" />
            Back to Homepage
          </Link>

          <Link
            href="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Explore Services
          </Link>

          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all text-sm"
          >
            <MessageSquare className="w-4 h-4" />
            Contact Team
          </Link>
        </div>
      </div>
    </main>
  );
}
