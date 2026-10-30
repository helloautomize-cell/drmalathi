import type { NextConfig } from "next";

// Report-only CSP for the first deploy; tighten to enforce once the report
// endpoint shows a clean baseline. Third parties: GA4 (script + beacons) and
// Vercel Speed Insights (beacon POSTs).
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://vitals.vercel-insights.com",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  // Reports go to a route handler that logs them, so the baseline exists
  // before this policy is flipped to enforce.
  "report-uri /api/csp-report",
  "report-to csp-endpoint",
  // upgrade-insecure-requests is ignored in a report-only policy; add it
  // back when this CSP moves to enforce.
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy },
  {
    key: "Reporting-Endpoints",
    value: 'csp-endpoint="/api/csp-report"',
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      // Legacy LiteSpeed site (see docs/REDIRECTS.md)
      { source: "/index.html", destination: "/", permanent: true },
      {
        source: "/cme-activities.html",
        destination: "/cme-activities",
        permanent: true,
      },
      { source: "/contact.html", destination: "/contact", permanent: true },
      {
        source: "/doctors-details.html",
        destination: "/doctors",
        permanent: true,
      },
      { source: "/gallery.html", destination: "/gallery", permanent: true },
      {
        source: "/img/gallery/ISUOGTrichy-Materno-Fetal-Conclave.pdf",
        destination: "/docs/ISUOG-Trichy-Materno-Fetal-Conclave.pdf",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
