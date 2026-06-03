'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import {
  PostHogProvider as PHJSProvider,
  usePostHog
} from 'posthog-js/react';

// Initialise PostHog once on the client. The module-level flag guards
// against double-init across HMR reloads in dev.
let posthogInitialised = false;

if (typeof window !== 'undefined') {
  const key = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  // Default to the reverse-proxy path so events go through hardproblems.com
  // (configured via `rewrites` in next.config.ts). Override only if you need
  // to bypass the proxy.
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || '/ingest';
  if (key && !posthogInitialised) {
    posthog.init(key, {
      api_host: host,
      // Where the PostHog toolbar links back to. Has to be the real PostHog
      // dashboard, not the proxy path. Change to https://us.posthog.com if on
      // US cloud.
      ui_host: 'https://eu.posthog.com',
      // Cookieless mode: PostHog will not set cookies or write to local
      // storage. Sessions are reconstructed in-memory per page load using
      // request characteristics, then discarded.
      cookieless_mode: 'always',
      // Pageviews are captured manually below — Next.js App Router's client
      // navigation doesn't trigger PostHog's default pageview detection.
      capture_pageview: false,
      capture_pageleave: true,
      person_profiles: 'identified_only'
    });
    posthogInitialised = true;
  }
}

export default function PostHogProvider({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <PHJSProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHJSProvider>
  );
}

// Fires a $pageview event whenever the App Router pathname or search params
// change. Wrapped in Suspense above because useSearchParams() triggers a CSR
// bailout otherwise.
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const client = usePostHog();

  useEffect(() => {
    if (!client || !pathname) return;
    let url = window.origin + pathname;
    const qs = searchParams?.toString();
    if (qs) url += `?${qs}`;
    client.capture('$pageview', { $current_url: url });
  }, [client, pathname, searchParams]);

  return null;
}
