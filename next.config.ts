import type { NextConfig } from "next";

// Content Security Policy (CSP) - Hardened production policy
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://*.wp.com https://s0.wp.com https://*.vercel.app https://growmybiz24.com https://*.growmybiz24.com https://growmybizz.vercel.app https://*.growmybizz.vercel.app https://growmybizz.com https://*.growmybizz.com https://www.googletagmanager.com https://www.google-analytics.com;
  font-src 'self' https://fonts.gstatic.com data:;
  connect-src 'self' https://*.supabase.co https://va.vercel-scripts.com https://vitals.vercel-insights.com https://*.vercel.app https://growmybiz24.com https://*.growmybiz24.com https://growmybizz.vercel.app https://growmybizz.com https://*.growmybizz.com https://www.google-analytics.com https://analytics.google.com https://*.google-analytics.com https://region1.google-analytics.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`
  .replace(/\s{2,}/g, ' ')
  .trim();

const nextConfig: NextConfig = {
  // Speed & Compression
  compress: true,
  poweredByHeader: false,

  // Compiler Optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "s0.wp.com",
      },
      {
        protocol: "https",
        hostname: "**.wp.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.vercel.app",
      },
      {
        protocol: "https",
        hostname: "growmybiz24.com",
      },
      {
        protocol: "https",
        hostname: "**.growmybiz24.com",
      },
      {
        protocol: "https",
        hostname: "growmybizz.vercel.app",
      },
      {
        protocol: "https",
        hostname: "growmybizz.com",
      },
      {
        protocol: "https",
        hostname: "**.growmybizz.com",
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Canonical Domain Redirects (Consolidate www traffic to apex domain)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.growmybiz24.com' }],
        destination: 'https://growmybiz24.com/:path*',
        permanent: true,
      },
    ];
  },

  // Comprehensive Cybersecurity & Anti-Scraping Headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Content Security Policy
          { key: "Content-Security-Policy", value: cspHeader },
          // Prevent MIME-sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Clickjacking protection
          { key: "X-Frame-Options", value: "DENY" },
          // Legacy XSS filter protection
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Referrer Policy
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Strict Transport Security (HSTS) - 2 years + subdomains + preload
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Restrict browser features & sensors
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()",
          },
          // Browser isolation & compatibility (supports in-app mobile browsers & webviews)
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
        ],
      },
      // Dedicated anti-scraping and privacy protection for API routes (except public settings)
      {
        source: "/api/((?!settings).*)",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, proxy-revalidate" },
        ],
      },
      // Edge-cached public settings endpoint
      {
        source: "/api/settings",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=60, stale-while-revalidate=300" },
        ],
      },
      // Dedicated anti-indexing protection for Admin routes
      {
        source: "/admin/(.*)",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
        ],
      },
    ];
  },

  // Turbopack rules
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
