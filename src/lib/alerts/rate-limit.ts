import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Durable rate limiter backed by Upstash Redis. Solves the fatal flaw
// of the in-memory limiter (which resets per serverless instance and
// therefore doesn't actually limit anything at Vercel's fan-out).
//
// Requires two env vars:
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN
//
// If either is unset (local dev without Upstash) the helper returns
// true unconditionally — same behavior as "no limit". The in-memory
// fallback is still available via the legacy `rateLimit()` in http.ts
// for callers that want any protection during development.

let cached: Ratelimit | null = null;
let bootstrapped = false;

function getLimiter(): Ratelimit | null {
  if (bootstrapped) return cached;
  bootstrapped = true;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return null;
  }
  cached = new Ratelimit({
    redis: new Redis({ url, token }),
    // Sliding window feels smoother than a fixed-bucket for bursty
    // human traffic. 5 requests per minute per key is generous for
    // real signups and tight for bots.
    limiter: Ratelimit.slidingWindow(5, '60 s'),
    prefix: 'hp:signup',
    analytics: false
  });
  return cached;
}

// Returns true if the request should be allowed. Never throws — on
// any Upstash failure we fail open (allow) so a Redis outage doesn't
// take down signups.
export async function isAllowedByRateLimit(key: string): Promise<boolean> {
  if (!key) return true;
  const rl = getLimiter();
  if (!rl) return true;
  try {
    const { success } = await rl.limit(key);
    return success;
  } catch (err) {
    console.warn('[rate-limit] upstash call failed, failing open', err);
    return true;
  }
}
