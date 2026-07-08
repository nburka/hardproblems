import { NextResponse } from 'next/server';
import { alertsDb } from '../../../../lib/alerts/supabase';
import { siteUrl } from '../../../../lib/alerts/http';

// GET /api/alerts/confirm?token=…
// Idempotent — clicking twice succeeds twice. Redirects to a small
// static status page so the user sees a real "confirmed" screen.

function statusRedirect(state: 'ok' | 'invalid'): NextResponse {
  const base = siteUrl();
  return NextResponse.redirect(`${base}/jobs/alerts/${state}`, {
    status: 302
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = (url.searchParams.get('token') ?? '').trim();

  if (!token) return statusRedirect('invalid');

  let db;
  try {
    db = alertsDb();
  } catch (err) {
    console.error('[alerts/confirm] misconfigured', err);
    return statusRedirect('invalid');
  }

  const { data: sub, error: findErr } = await db
    .from('alert_subscribers')
    .select('id, status')
    .eq('confirm_token', token)
    .limit(1)
    .maybeSingle();

  if (findErr || !sub) return statusRedirect('invalid');

  if (sub.status === 'active') return statusRedirect('ok');

  const { error: updateErr } = await db
    .from('alert_subscribers')
    .update({
      status: 'active',
      confirmed_at: new Date().toISOString(),
      confirm_token: null
    })
    .eq('id', sub.id);

  if (updateErr) {
    console.error('[alerts/confirm] update failed', updateErr);
    return statusRedirect('invalid');
  }

  return statusRedirect('ok');
}
