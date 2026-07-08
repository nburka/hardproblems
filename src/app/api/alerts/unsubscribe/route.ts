import { NextResponse } from 'next/server';
import { alertsDb } from '../../../../lib/alerts/supabase';
import { siteUrl } from '../../../../lib/alerts/http';

// GET  /api/alerts/unsubscribe?token=… — user-facing link.
// POST /api/alerts/unsubscribe?token=… — RFC 8058 one-click.
// Idempotent; already-unsubscribed tokens still succeed.

async function unsubscribeByToken(token: string): Promise<boolean> {
  let db;
  try {
    db = alertsDb();
  } catch (err) {
    console.error('[alerts/unsubscribe] misconfigured', err);
    return false;
  }
  const { data: sub, error: findErr } = await db
    .from('alert_subscribers')
    .select('id, status')
    .eq('unsubscribe_token', token)
    .limit(1)
    .maybeSingle();
  if (findErr || !sub) return false;
  if (sub.status === 'unsubscribed') return true;
  const { error: updateErr } = await db
    .from('alert_subscribers')
    .update({
      status: 'unsubscribed',
      unsubscribed_at: new Date().toISOString()
    })
    .eq('id', sub.id);
  if (updateErr) {
    console.error('[alerts/unsubscribe] update failed', updateErr);
    return false;
  }
  return true;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = (url.searchParams.get('token') ?? '').trim();
  const ok = token ? await unsubscribeByToken(token) : false;
  const base = siteUrl();
  return NextResponse.redirect(
    `${base}/jobs/alerts/${ok ? 'unsubscribed' : 'invalid'}`,
    { status: 302 }
  );
}

// RFC 8058 one-click flow. Gmail/Apple Mail POST here with an empty
// body; we respond 200 with no redirect. No CSRF token because RFC
// 8058 says the token in the URL IS the credential.
export async function POST(request: Request) {
  const url = new URL(request.url);
  const token = (url.searchParams.get('token') ?? '').trim();
  const ok = token ? await unsubscribeByToken(token) : false;
  return new NextResponse(null, { status: ok ? 200 : 400 });
}
