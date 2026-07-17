'use client';

import { useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';

// Mounted inside app/not-found.tsx so every visit to the 404 page
// ships a `$exception` event to PostHog Error Tracking with the URL
// that was requested and (when available) the referrer that led there.
// Fires exactly once per mount — StrictMode double-invokes effects in
// dev, so guard with a `sent` flag on the ref cell.
export default function NotFoundTracker() {
  const posthog = usePostHog();

  useEffect(() => {
    if (!posthog) return;
    const url = window.location.href;
    const path = window.location.pathname + window.location.search;
    const referrer = document.referrer || null;
    posthog.captureException(new Error(`404: ${path}`), {
      $current_url: url,
      referrer,
      path
    });
  }, [posthog]);

  return null;
}
