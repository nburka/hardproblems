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
      person_profiles: 'identified_only',
      // Auto-capture uncaught JS errors + unhandled promise rejections
      // as `$exception` events. Shows up in PostHog under Error Tracking.
      // Anonymous — no user identification, matches the cookieless posture.
      capture_exceptions: true,
      // Drop noise before it ships. Several classes of exception
      // clog Error Tracking without ever representing a real bug:
      //   1. "Script error." — a cross-origin exception whose details
      //      the browser strips for security. Almost always from an
      //      extension.
      //   2. "ResizeObserver loop completed with undelivered
      //      notifications." / "ResizeObserver loop limit exceeded" —
      //      Chrome / Safari's warning that an observer callback
      //      triggered layout work; the browser recovers automatically,
      //      Chrome's own DevRel calls it safe to ignore.
      //   3. Any exception whose top stack frame comes from a
      //      `chrome-extension://` / `moz-extension://` /
      //      `safari-web-extension://` URL — that's an extension's
      //      content script throwing, and we can neither reproduce nor
      //      fix it. Catches Zotero Connector, 1Password, Grammarly,
      //      LastPass, and every future extension without needing a
      //      per-name pattern.
      // None are actionable, so we drop them here rather than letting
      // them drown the real signal.
      before_send: (event) => {
        if (!event || event.event !== '$exception') return event;
        const excList = (event.properties as Record<string, unknown> | undefined)
          ?.$exception_list;
        const first = Array.isArray(excList) ? excList[0] : null;
        if (!first || typeof first !== 'object') return event;
        const value = String(
          (first as { value?: unknown }).value ?? ''
        ).trim();
        const frames = (
          first as { stacktrace?: { frames?: unknown[] } }
        ).stacktrace?.frames as
          | { filename?: string }[]
          | undefined;
        const hasRealStack = Array.isArray(frames) && frames.length > 0;
        if (!hasRealStack && /^script error\.?$/i.test(value)) {
          return null;
        }
        if (/^ResizeObserver loop /i.test(value)) {
          return null;
        }
        // Windows security-suite extensions (McAfee WebAdvisor,
        // Norton Safe Web, etc.) throw a distinctively-shaped
        // promise rejection when their in-page bridge can't find
        // the expected page-side object. Same "not our code, nothing
        // to fix" category as the extension checks above.
        if (
          /^Object Not Found Matching Id:\d+, MethodName:\S+, ParamCount:\d+/i.test(
            value
          )
        ) {
          return null;
        }
        // Extension check — two passes, because extensions throw in
        // varied shapes:
        //   a) message contains a well-known extension name (works even
        //      when the stack is missing / opaque).
        //   b) ANY stack frame lives at an extension:// URL (catches
        //      errors that bubble through browser bridge code before
        //      the extension frame appears).
        if (
          /^(Zotero Connector|LastPass|1Password|Grammarly|Honey|MetaMask):/i.test(
            value
          )
        ) {
          return null;
        }
        if (hasRealStack) {
          const anyFromExtension = frames.some((f) =>
            /^(chrome-extension|moz-extension|safari-web-extension|webkit-masked-url):\/\//i.test(
              f?.filename ?? ''
            )
          );
          if (anyFromExtension) return null;
        }
        return event;
      }
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
