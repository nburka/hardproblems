import { PostHog } from 'posthog-node';

// Server-side PostHog client for exception + event capture from API
// routes and cron jobs. Reuses the public project token — same as the
// browser client — because PostHog's ingest endpoint accepts anonymous
// events with only the project write key. No secret involved.
//
// Uses the direct ingest host (the `/ingest` reverse-proxy is a
// Next.js rewrite that only exists at request time — server code has
// to talk to PostHog directly).

let cached: PostHog | null = null;

function client(): PostHog | null {
  if (cached) return cached;
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (!token) return null;
  cached = new PostHog(token, {
    host: 'https://eu.i.posthog.com',
    // Flush aggressively so events actually leave before a serverless
    // function terminates. `flushAt: 1` sends after the first event;
    // `flushInterval: 0` disables the batching timer that would
    // otherwise hold events until the interval elapses (which never
    // happens in a short-lived function).
    flushAt: 1,
    flushInterval: 0
  });
  return cached;
}

// Report a server-side error to PostHog Error Tracking. Never throws
// — instrumentation failures shouldn't turn a handled error into an
// unhandled one. Extra properties are attached to the event for
// context (which route, subscriber id, etc.).
export async function captureServerException(
  error: unknown,
  extra?: Record<string, unknown>
): Promise<void> {
  const c = client();
  if (!c) return;
  try {
    const err = error instanceof Error ? error : new Error(String(error));
    c.captureException(err, undefined, extra);
    // Force a flush before the serverless function returns so the
    // event actually reaches PostHog. Non-blocking network round-trip
    // — a few dozen ms — worth it for reliable ingestion.
    await c.flush();
  } catch (e) {
    console.warn('[posthog-server] captureException failed', e);
  }
}

// Convenience wrapper: log to the Vercel runtime log AND ship to
// PostHog Error Tracking in one call. Drop-in replacement for the
// existing `console.error(tag, err, extra?)` calls scattered across
// the API routes so we don't have to add a second call at every site.
// The `tag` becomes a `tag` property on the PostHog event, keeping
// grouping/routing tidy.
export function logError(
  tag: string,
  error: unknown,
  extra?: Record<string, unknown>
): void {
  console.error(tag, error, extra ?? '');
  // Fire-and-forget from the caller's POV; captureServerException
  // handles its own errors internally.
  void captureServerException(error, { tag, ...extra });
}
