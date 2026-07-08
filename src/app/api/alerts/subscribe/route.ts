import { NextResponse } from 'next/server';
import { alertsDb } from '../../../../lib/alerts/supabase';
import { alertsFromAddress, getResend } from '../../../../lib/alerts/resend';
import { newToken } from '../../../../lib/alerts/tokens';
import { serializeFilters } from '../../../../lib/alerts/filters';
import {
  confirmHtml,
  confirmSubject,
  confirmText
} from '../../../../lib/alerts/emails';
import {
  EMAIL_RE,
  MAX_EMAIL_LENGTH,
  clientIp,
  isAllowedOrigin,
  looksLikeBot,
  rateLimit,
  siteUrl
} from '../../../../lib/alerts/http';

// POST /api/alerts/subscribe
// Body: { email: string, filters: Record<string, string>, hp?: string }
//
// Creates a `pending` subscriber row and emails a confirmation link.
// Double opt-in: nothing is "active" until the user clicks the link.
// Re-subscribe path: if the email already exists as `unsubscribed`, we
// reuse the row and flip it back to `pending` with fresh tokens.

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json(
      { ok: false, error: 'Invalid request.' },
      { status: 403 }
    );
  }

  if (looksLikeBot(request)) {
    // Silent 200 — no signal that the bot filter caught them.
    return NextResponse.json({ ok: true });
  }

  const ip = clientIp(request);
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: 'Too many attempts. Please try again shortly.' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid request.' },
      { status: 400 }
    );
  }

  const rec = (body ?? {}) as Record<string, unknown>;

  // Honeypot: real users leave `hp` blank; bots fill everything.
  if (typeof rec.hp === 'string' && rec.hp.trim()) {
    return NextResponse.json({ ok: true });
  }

  const email = String(rec.email ?? '').trim();
  if (
    !email ||
    email.length > MAX_EMAIL_LENGTH ||
    !EMAIL_RE.test(email)
  ) {
    return NextResponse.json(
      { ok: false, error: 'Please enter a valid email address.' },
      { status: 400 }
    );
  }

  const filters =
    rec.filters && typeof rec.filters === 'object'
      ? serializeFilters(rec.filters as Record<string, string>)
      : {};

  const confirm_token = newToken();
  const unsubscribe_token = newToken();

  let subscriberId: string;
  let db;
  try {
    db = alertsDb();
  } catch (err) {
    console.error('[alerts/subscribe] misconfigured', err);
    return NextResponse.json(
      { ok: false, error: 'Job alerts are not configured yet.' },
      { status: 500 }
    );
  }

  // Look for an existing row for this email (case-insensitive via the
  // generated `email_lower` column).
  const { data: existing, error: findErr } = await db
    .from('alert_subscribers')
    .select('id, status')
    .eq('email_lower', email.toLowerCase())
    .limit(1)
    .maybeSingle();

  if (findErr) {
    console.error('[alerts/subscribe] lookup failed', findErr);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }

  if (existing?.status === 'active') {
    // Already active — succeed silently so we don't leak subscription
    // state to enumeration probes. This IS a real successful return
    // as far as the user is concerned; log it so it's visible in
    // Vercel logs and doesn't look like "nothing happened".
    console.log('[alerts/subscribe] already active, skipping send', {
      subscriberId: existing.id
    });
    return NextResponse.json({ ok: true, already: true });
  }

  if (existing) {
    // Existing pending or unsubscribed row — refresh tokens and reset
    // to pending. Filters are updated to whatever they just submitted.
    const { error: updateErr } = await db
      .from('alert_subscribers')
      .update({
        status: 'pending',
        filters,
        confirm_token,
        unsubscribe_token,
        confirmed_at: null,
        unsubscribed_at: null,
        signup_ip: ip === 'unknown' ? null : ip
      })
      .eq('id', existing.id);
    if (updateErr) {
      console.error('[alerts/subscribe] update failed', updateErr);
      return NextResponse.json(
        { ok: false, error: 'Something went wrong. Please try again.' },
        { status: 500 }
      );
    }
    subscriberId = existing.id;
  } else {
    const { data: inserted, error: insertErr } = await db
      .from('alert_subscribers')
      .insert({
        email,
        status: 'pending',
        filters,
        confirm_token,
        unsubscribe_token,
        signup_ip: ip === 'unknown' ? null : ip
      })
      .select('id')
      .single();
    if (insertErr || !inserted) {
      console.error('[alerts/subscribe] insert failed', insertErr);
      return NextResponse.json(
        { ok: false, error: 'Something went wrong. Please try again.' },
        { status: 500 }
      );
    }
    subscriberId = inserted.id;
  }

  // Send the confirmation email.
  const base = siteUrl();
  const confirmUrl = `${base}/api/alerts/confirm?token=${confirm_token}`;
  const unsubscribeUrl = `${base}/api/alerts/unsubscribe?token=${unsubscribe_token}`;

  try {
    const resend = getResend();
    // Resend SDK v6+ returns { data, error } — it does NOT throw on
    // API errors. So we have to inspect the returned object as well
    // as catch actual network throws.
    const result = await resend.emails.send({
      from: alertsFromAddress(),
      to: email,
      replyTo: 'contact@hardproblems.com',
      subject: confirmSubject(),
      html: confirmHtml({ confirmUrl, unsubscribeUrl, filters }),
      text: confirmText({ confirmUrl, unsubscribeUrl, filters }),
      headers: {
        // RFC 2369 + RFC 8058 — Gmail / Apple Mail render a native
        // one-click unsubscribe button when both headers are present.
        'List-Unsubscribe': `<${unsubscribeUrl}>, <mailto:contact@hardproblems.com?subject=unsubscribe>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
      }
    });
    if (result.error) {
      console.error('[alerts/subscribe] resend returned error', result.error, {
        subscriberId
      });
      return NextResponse.json(
        {
          ok: false,
          error: "We couldn't send the confirmation email. Please try again."
        },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error('[alerts/subscribe] resend threw', err, { subscriberId });
    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't send the confirmation email. Please try again."
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
