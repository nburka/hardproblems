import { Resend } from 'resend';

// Lazy singleton so we don't crash imports when the env var is missing
// at build time. The route handlers that actually send email surface a
// clearer error at request time via getResend().
let cached: Resend | null = null;

export function getResend(): Resend {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error('RESEND_API_KEY is required to send job alerts.');
  }
  cached = new Resend(key);
  return cached;
}

// From-address for every job-alert email. Configurable via env in case
// the sending subdomain changes later.
export function alertsFromAddress(): string {
  return (
    process.env.ALERTS_FROM_EMAIL ||
    'Hard Problems Jobs <jobs@alerts.hardproblems.com>'
  );
}
