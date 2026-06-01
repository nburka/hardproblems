import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Required for the PostHog reverse-proxy rewrites below, so /ingest/decide
  // (and any other unslashed PostHog endpoints) aren't redirected.
  skipTrailingSlashRedirect: true,

  // PostHog reverse proxy — routes analytics traffic through the same domain
  // as the site so ad blockers don't see it. Configured for PostHog EU cloud.
  // For US cloud swap the destination hosts to us.i.posthog.com and
  // us-assets.i.posthog.com.
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
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://api.beehiiv.com'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,DELETE,PATCH,POST,PUT'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
          }
        ]
      }
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
