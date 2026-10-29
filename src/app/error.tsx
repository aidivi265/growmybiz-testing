'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception for telemetry / monitoring
    console.error('[Application Error Boundary Caught]:', error);
  }, [error]);

  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 py-24 relative overflow-hidden bg-[#0A101D]">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          Unexpected Glitch Encountered
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold font-syne text-white tracking-tight mb-4">
          Something went temporarily wrong
        </h1>

        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
          We encountered a minor hiccup while loading this resource. Don&apos;t worry, your data is safe and our systems have logged this event.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-semibold shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all text-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all text-sm"
          >
            <Home className="w-4 h-4" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
