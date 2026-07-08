import { NextResponse } from 'next/server';
import { fetchJobs } from '../../../jobs/fetchJobs';
import { filterJobs, parseFiltersFromParams } from '../../../jobs/filters';
import type { SerializedJob } from '../../../jobs/fetchJobs';
import { alertsDb } from '../../../../lib/alerts/supabase';
import { alertsFromAddress, getResend } from '../../../../lib/alerts/resend';
import {
  digestHtml,
  digestSubject,
  digestText
} from '../../../../lib/alerts/emails';
import { filtersToSearchParams } from '../../../../lib/alerts/filters';
import { siteUrl } from '../../../../lib/alerts/http';

// GET /api/cron/send-alerts
//
// Daily digest sender. Called by Vercel Cron at 06:00 UTC (see
// vercel.json) and returns a summary JSON so we can inspect what it
// did in the Vercel logs.
//
// Auth: requires `Authorization: Bearer $CRON_SECRET` — Vercel Cron
// sends this header automatically when the env var is set on the
// project.
//
// Flow per active subscriber:
//   1. Skip if we already sent to them in the last 20h (accidental
//      double-firing guard).
//   2. Apply their saved filters to today's Sheets snapshot.
//   3. Subtract job URLs already logged in alert_sent for them.
//   4. If ≥1 new match, send the digest, insert one alert_sent row per
//      job URL, bump last_digest_at.
//   5. If 0 new matches, silently skip — no empty-inbox email.

// Cap the total per-run to a safe upper bound. With ~500 subscribers
// we won't come close; this is a runaway-fleet backstop.
const MAX_SUBSCRIBERS_PER_RUN = 5000;

// Fresh-digest window: if we sent to a subscriber less than this many
// hours ago, skip. Guards against Vercel Cron ever double-firing and
// against ad-hoc manual `curl` re-triggers.
const RECENT_DIGEST_HOURS = 20;

// Absolute cap on jobs per digest email, in case a subscriber has
// filters so broad that "new since last digest" balloons.
const MAX_JOBS_PER_DIGEST = 30;

type ActiveSubscriber = {
  id: string;
  email: string;
  filters: Record<string, unknown>;
  unsubscribe_token: string;
  last_digest_at: string | null;
};

function isAuthorized(request: Request): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const header = request.headers.get('authorization') ?? '';
  return header === `Bearer ${expected}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, {
      status: 401
    });
  }

  let db;
  try {
    db = alertsDb();
  } catch (err) {
    console.error('[alerts/cron] misconfigured', err);
    return NextResponse.json({ ok: false, error: 'misconfigured' }, {
      status: 500
    });
  }

  const jobs = await fetchJobs();
  if (jobs.length === 0) {
    console.log('[alerts/cron] no jobs in sheet, aborting');
    return NextResponse.json({
      ok: true,
      totals: { subscribers: 0, sent: 0, skipped: 0, failed: 0 }
    });
  }

  const { data: subscribers, error: fetchErr } = await db
    .from('alert_subscribers')
    .select('id, email, filters, unsubscribe_token, last_digest_at')
    .eq('status', 'active')
    .limit(MAX_SUBSCRIBERS_PER_RUN);

  if (fetchErr) {
    console.error('[alerts/cron] subscribers fetch failed', fetchErr);
    return NextResponse.json({ ok: false, error: 'db_fetch_failed' }, {
      status: 500
    });
  }

  const rows = (subscribers ?? []) as ActiveSubscriber[];
  const now = Date.now();
  const site = siteUrl();
  const resend = getResend();
  const from = alertsFromAddress();

  const totals = {
    subscribers: rows.length,
    sent: 0,
    skipped: 0,
    failed: 0,
    skippedRecent: 0,
    skippedEmpty: 0
  };

  for (const sub of rows) {
    try {
      // 1. Recency guard.
      if (sub.last_digest_at) {
        const ageMs = now - new Date(sub.last_digest_at).getTime();
        if (ageMs < RECENT_DIGEST_HOURS * 3600 * 1000) {
          totals.skipped++;
          totals.skippedRecent++;
          continue;
        }
      }

      // 2. Apply the subscriber's saved filters. filtersToSearchParams
      // handles the JSONB → URL-shape round-trip; then we parse those
      // params through the same helper the /jobs page uses so the
      // matching logic stays perfectly aligned with the UI.
      const params = filtersToSearchParams(sub.filters);
      const parsed = parseFiltersFromParams(params);
      const matching = filterJobs(jobs, parsed);

      if (matching.length === 0) {
        totals.skipped++;
        totals.skippedEmpty++;
        continue;
      }

      // 3. Subtract already-sent job URLs. Chunked SELECT so we don't
      // exceed URL-length limits when a subscriber has been active for
      // a long time.
      const { data: sentRows, error: sentErr } = await db
        .from('alert_sent')
        .select('job_url')
        .eq('subscriber_id', sub.id);
      if (sentErr) {
        console.error('[alerts/cron] alert_sent lookup failed', sentErr, {
          subscriberId: sub.id
        });
        totals.failed++;
        continue;
      }
      const alreadySent = new Set(
        (sentRows ?? []).map((r: { job_url: string }) => r.job_url)
      );
      const fresh = matching
        .filter((j): j is SerializedJob => Boolean(j.url))
        .filter((j) => !alreadySent.has(j.url));

      if (fresh.length === 0) {
        totals.skipped++;
        totals.skippedEmpty++;
        continue;
      }

      const digestJobs = fresh.slice(0, MAX_JOBS_PER_DIGEST);

      // 4. Send the digest.
      const boardParams = filtersToSearchParams(sub.filters).toString();
      const boardUrl = boardParams
        ? `${site}/jobs?${boardParams}`
        : `${site}/jobs`;
      const unsubscribeUrl = `${site}/api/alerts/unsubscribe?token=${sub.unsubscribe_token}`;

      try {
        await resend.emails.send({
          from,
          to: sub.email,
          replyTo: 'contact@hardproblems.com',
          subject: digestSubject(digestJobs),
          html: digestHtml({
            jobs: digestJobs,
            filters: sub.filters,
            unsubscribeUrl,
            boardUrl
          }),
          text: digestText({
            jobs: digestJobs,
            filters: sub.filters,
            unsubscribeUrl,
            boardUrl
          }),
          headers: {
            'List-Unsubscribe': `<${unsubscribeUrl}>, <mailto:contact@hardproblems.com?subject=unsubscribe>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
          }
        });
      } catch (err) {
        console.error('[alerts/cron] resend send failed', err, {
          subscriberId: sub.id
        });
        totals.failed++;
        continue;
      }

      // 5. Log every job URL to alert_sent so we don't send it again.
      const sentAt = new Date().toISOString();
      const insertRows = digestJobs.map((j) => ({
        subscriber_id: sub.id,
        job_url: j.url,
        sent_at: sentAt
      }));
      const { error: insertErr } = await db
        .from('alert_sent')
        .insert(insertRows);
      if (insertErr) {
        // Send already succeeded — log but don't fail the run. The
        // unique index on (subscriber_id, job_url) still protects
        // against future re-sends of the same URL even if the write
        // partially failed here.
        console.error('[alerts/cron] alert_sent insert failed', insertErr, {
          subscriberId: sub.id,
          count: insertRows.length
        });
      }

      // 6. Bump last_digest_at.
      const { error: touchErr } = await db
        .from('alert_subscribers')
        .update({ last_digest_at: sentAt })
        .eq('id', sub.id);
      if (touchErr) {
        console.error('[alerts/cron] last_digest_at update failed', touchErr, {
          subscriberId: sub.id
        });
      }

      totals.sent++;
    } catch (err) {
      console.error('[alerts/cron] subscriber failed', err, {
        subscriberId: sub.id
      });
      totals.failed++;
    }
  }

  console.log('[alerts/cron] finished', totals);
  return NextResponse.json({ ok: true, totals });
}

// Vercel Cron POSTs are legal too. Same handler for both.
export const POST = GET;

// Cap the function's runtime at 300s (the Vercel Pro maximum for
// serverless functions). Well above what we need today (~30s at ~50
// subscribers) but headroom for growth without hitting the default
// 60s wall.
export const maxDuration = 300;

