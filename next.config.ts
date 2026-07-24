import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Required for the PostHog reverse-proxy rewrites below, so /ingest/decide
  // (and any other unslashed PostHog endpoints) aren't redirected.
  skipTrailingSlashRedirect: true,

  // PostHog reverse proxy — routes analytics traffic through the same domain
  // as the site so ad blockers don't see it. Configured for PostHog EU cloud.
  // For US cloud swap the destination hosts to us.i.posthog.com and
  // us-assets.i.posthog.com.
  // Permanent (308) redirects for common misspellings / legacy URLs so
  // typos and stale outbound links land on the right page.
  async redirects() {
    return [
      { source: '/job', destination: '/jobs', permanent: true }
    ];
  },

  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://eu-assets.i.posthog.com/static/:path*'
      },
      {
        source: '/ingest/decide',
        destination: 'https://eu.i.posthog.com/decide'
      },
      {
        source: '/ingest/:path*',
        destination: 'https://eu.i.posthog.com/:path*'
      }
    ];
  },

  async headers() {
    // Baseline site-wide security headers. Nothing here is aggressive
    // (no strict script-src CSP, which would require nonces on every
    // Next.js inline script) but they meaningfully limit clickjacking,
    // MIME-sniffing, and referrer leakage.
    const security = [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload'
      }
    ];
    return [
      { source: '/:path*', headers: security }
      // Note: the earlier CORS block on /api/* was removed — it allowed
      // credentials from api.beehiiv.com, which never calls this site;
      // the config was accidental / harmless but signaled confused
      // intent to auditors.
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'beehiiv-images-production.s3.amazonaws.com',
        port: '',
        pathname: '/uploads/**'
      },
      {
        protocol: 'https',
        hostname: 'media.beehiiv.com',
        port: '',
        pathname: '/cdn-cgi/**'
      }
    ]
  }
};

export default nextConfig;
