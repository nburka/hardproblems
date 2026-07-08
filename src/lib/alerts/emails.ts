// Email templates for the job-alert flow. Kept as plain string
// builders instead of a React Email dependency — every job-alert
// message is a small, mostly-textual card, and Resend accepts both
// html + text alongside List-Unsubscribe headers directly.

import type { SerializedJob } from '../../app/jobs/fetchJobs';
import { filtersSummary } from './filters';
import { siteUrl, withUtm } from './http';

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type ConfirmMailParams = {
  confirmUrl: string;
  unsubscribeUrl: string;
  filters: Record<string, unknown>;
};

export function confirmSubject(): string {
  return 'Confirm your Hard Problems job alerts';
}

export function confirmHtml({
  confirmUrl,
  unsubscribeUrl,
  filters
}: ConfirmMailParams): string {
  const summary = escape(filtersSummary(filters));
  const site = siteUrl();
  const siteJobsTagged = escape(withUtm(`${site}/jobs`, 'confirm'));
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Confirm your Hard Problems job alerts</title>
<style>
  @media only screen and (max-width: 620px) {
    .hp-outer { padding: 16px 8px !important; }
    .hp-body { padding-left: 20px !important; padding-right: 20px !important; }
    .hp-logo { padding-bottom: 24px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#f6f8f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#231f20;">
  <div style="display:none;visibility:hidden;height:0;overflow:hidden;">Click the link inside to activate your daily digest of matching jobs.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="hp-outer" style="background:#f6f8f7;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;background:#ffffff;border-top:5px solid #4ABF83;box-shadow:0 1px 2px rgba(0,0,0,0.04);">
        <tr><td class="hp-body hp-logo" style="padding:32px 32px 8px;">
          <div style="font-size:20px;font-weight:700;letter-spacing:-0.02em;color:#231f20;">
            Hard Problems<span style="color:#2f8b53;">.</span>
          </div>
        </td></tr>
        <tr><td class="hp-body" style="padding:8px 32px 0;">
          <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;font-weight:700;color:#231f20;">Confirm your job alerts</h1>
          <p style="margin:0 0 20px;font-size:16px;line-height:1.5;color:#333;">You'll get a daily email with any new jobs matching your saved filters.</p>
          <p style="margin:0 0 24px;font-size:14px;line-height:1.5;color:#555;"><strong style="color:#231f20;">Your filters:</strong> ${summary}</p>
          <p style="margin:0 0 28px;">
            <a href="${confirmUrl}" style="display:inline-block;padding:12px 20px;background:#235337;color:#ffffff;text-decoration:none;border-radius:100px;font-weight:500;font-size:15px;">Confirm subscription</a>
          </p>
          <p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#666;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="margin:0 0 24px;font-size:12px;line-height:1.5;color:#2f8b53;word-break:break-all;"><a href="${confirmUrl}" style="color:#2f8b53;">${confirmUrl}</a></p>
        </td></tr>
        <tr><td class="hp-body" style="padding:0 32px 28px;border-top:1px solid #eaeaea;">
          <p style="margin:20px 0 6px;font-size:12px;line-height:1.5;color:#777;">You're receiving this because someone (hopefully you) signed up for job alerts at <a href="${siteJobsTagged}" style="color:#2f8b53;">${site}/jobs</a>. If it wasn't you, ignore this email — no subscription is created until you click the link above.</p>
          <p style="margin:6px 0 0;font-size:12px;line-height:1.5;color:#777;"><a href="${unsubscribeUrl}" style="color:#777;">Unsubscribe</a> · <a href="${site}/privacy" style="color:#777;">Privacy notice</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function confirmText({
  confirmUrl,
  unsubscribeUrl,
  filters
}: ConfirmMailParams): string {
  const summary = filtersSummary(filters);
  const site = siteUrl();
  const siteJobsTagged = withUtm(`${site}/jobs`, 'confirm');
  return [
    'Confirm your Hard Problems job alerts',
    '',
    "You'll get a daily email with any new jobs matching your saved filters.",
    '',
    `Your filters: ${summary}`,
    '',
    'Confirm your subscription by opening this link:',
    confirmUrl,
    '',
    `You're receiving this because someone (hopefully you) signed up for job alerts at ${siteJobsTagged}. If it wasn't you, ignore this email — no subscription is created until you click the link.`,
    '',
    `Unsubscribe: ${unsubscribeUrl}`,
    `Privacy notice: ${site}/privacy`
  ].join('\n');
}

// -----------------------------------------------------------------------
// Daily digest — sent each morning to active subscribers with any new
// jobs matching their saved filters.
// -----------------------------------------------------------------------

type DigestMailParams = {
  jobs: SerializedJob[];
  filters: Record<string, unknown>;
  unsubscribeUrl: string;
  // Full URL back into the job board with the same filters preselected,
  // so a subscriber can "see all matching jobs" in-browser.
  boardUrl: string;
};

export function digestSubject(jobs: SerializedJob[]): string {
  const n = jobs.length;
  if (n === 1) return '1 new job on Hard Problems';
  return `${n} new jobs on Hard Problems`;
}

function jobLocation(job: SerializedJob): string {
  const bits = [job.city, job.country].filter((s) => s && s.trim().length > 0);
  const place = bits.join(', ');
  if (job.remote && place) return `${place} · ${job.remote}`;
  return place || job.remote || '';
}

function isStaffPick(job: SerializedJob): boolean {
  const score = parseFloat(job.goodForWorld);
  return !Number.isNaN(score) && score > 8;
}

function normalizedCompanyUrl(raw: string): string | null {
  const trimmed = (raw || '').trim();
  if (!trimmed) return null;
  return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
}

// Compact relative date label for the digest — "Today", "Yesterday",
// "N days ago", or an absolute short date for anything older than a
// week. Same shape as the site's job list uses so the email reads
// consistently with the board.
function relativeDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const now = new Date();
  const todayUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  const jobUTC = Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate()
  );
  const diffDays = Math.round((todayUTC - jobUTC) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  });
}

function renderJobCardHtml(job: SerializedJob): string {
  const title = escape(job.title);
  const company = escape(job.company);
  const companyHref = normalizedCompanyUrl(job.companyUrl);
  const companyLinked = companyHref
    ? `<a href="${escape(companyHref)}" style="color:#235337;text-decoration:none;">${company}</a>`
    : company;
  const location = escape(jobLocation(job));
  const sector = escape((job.sector || '').trim());
  const description = escape((job.description || '').trim());
  const hasSalary = job.salary && job.salary.trim().toLowerCase() !== 'n/a';
  const salary = hasSalary ? escape(job.salary.trim()) : '';
  const pick = isStaffPick(job);
  const link = escape(job.url || '');

  // Meta line: company · location · salary (only include non-empty bits).
  const metaBits: string[] = [];
  if (company) metaBits.push(companyLinked);
  if (location) metaBits.push(location);
  if (salary) metaBits.push(salary);
  const meta = metaBits.join(' &middot; ');

  const tagBits: string[] = [];
  if (sector) {
    tagBits.push(
      `<span style="display:inline-block;padding:2px 8px;margin-right:6px;background:#ebf7f0;color:#235337;border-radius:100px;font-size:11px;font-weight:500;">${sector}</span>`
    );
  }
  if (pick) {
    tagBits.push(
      `<span style="display:inline-block;padding:2px 8px;background:#fff3c4;color:#8a5a00;border-radius:100px;font-size:11px;font-weight:500;">◆ Our Pick</span>`
    );
  }
  const date = escape(relativeDate(job.date));
  const dateCell = date
    ? `<td align="right" valign="middle" style="font-size:12px;color:#777;white-space:nowrap;padding-left:8px;">${date}</td>`
    : '';
  const tags =
    tagBits.length || date
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;"><tr><td valign="middle" style="line-height:1.6;">${tagBits.join('')}</td>${dateCell}</tr></table>`
      : '';

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #eaeaea;">
  <tr><td style="padding:18px 0;">
    <div style="font-size:16px;font-weight:600;line-height:1.3;color:#231f20;">
      ${link ? `<a href="${link}" style="color:#231f20;text-decoration:underline;text-decoration-color:#cbead8;text-decoration-thickness:1px;text-underline-offset:2px;">${title}</a>` : title}
    </div>
    ${meta ? `<div style="margin-top:4px;font-size:13px;color:#555;">${meta}</div>` : ''}
    ${description ? `<p style="margin:8px 0 0;font-size:13px;line-height:1.5;color:#444;">${description}</p>` : ''}
    ${tags}
  </td></tr>
</table>`;
}

export function digestHtml({
  jobs,
  filters,
  unsubscribeUrl,
  boardUrl
}: DigestMailParams): string {
  const summary = escape(filtersSummary(filters));
  const site = siteUrl();
  const boardUrlTagged = escape(withUtm(boardUrl, 'daily_digest'));
  const siteJobsTagged = escape(withUtm(`${site}/jobs`, 'daily_digest'));
  const n = jobs.length;
  const heading = escape(
    n === 1 ? '1 new job for you' : `${n} new jobs for you`
  );
  const cards = jobs.map(renderJobCardHtml).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${heading}</title>
<style>
  @media only screen and (max-width: 620px) {
    .hp-outer { padding: 16px 8px !important; }
    .hp-body { padding-left: 20px !important; padding-right: 20px !important; }
    .hp-logo { padding-bottom: 32px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#f6f8f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#231f20;">
  <div style="display:none;visibility:hidden;height:0;overflow:hidden;">${heading} matching your saved filters on Hard Problems.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="hp-outer" style="background:#f6f8f7;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-top:5px solid #4ABF83;box-shadow:0 1px 2px rgba(0,0,0,0.04);">
        <tr><td class="hp-body hp-logo" style="padding:28px 32px 48px;">
          <div style="font-size:20px;font-weight:700;letter-spacing:-0.02em;color:#231f20;">
            Hard Problems<span style="color:#2f8b53;">.</span>
          </div>
        </td></tr>
        <tr><td class="hp-body" style="padding:0 32px 4px;">
          <h1 style="margin:0 0 8px;font-size:22px;line-height:1.25;font-weight:700;color:#231f20;">${heading}</h1>
          <p style="margin:0 0 20px;font-size:13px;line-height:1.4;color:#666;">Alerts for: <strong style="color:#235337;font-weight:500;">${summary}</strong></p>
        </td></tr>
        <tr><td class="hp-body" style="padding:0 32px 12px;">
          ${cards}
        </td></tr>
        <tr><td class="hp-body" style="padding:16px 32px 24px;">
          <p style="margin:0;">
            <a href="${boardUrlTagged}" style="display:inline-block;padding:10px 18px;background:#235337;color:#ffffff;text-decoration:none;border-radius:100px;font-weight:500;font-size:14px;">See all matching jobs on the board →</a>
          </p>
        </td></tr>
        <tr><td class="hp-body" style="padding:0 32px 28px;border-top:1px solid #eaeaea;">
          <p style="margin:20px 0 6px;font-size:12px;line-height:1.5;color:#777;">You're getting this because you signed up for a daily digest of jobs matching your filters at <a href="${siteJobsTagged}" style="color:#2f8b53;">${site}/jobs</a>.</p>
          <p style="margin:6px 0 0;font-size:12px;line-height:1.5;color:#777;"><a href="${unsubscribeUrl}" style="color:#777;">Unsubscribe</a> · <a href="${site}/privacy" style="color:#777;">Privacy notice</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function digestText({
  jobs,
  filters,
  unsubscribeUrl,
  boardUrl
}: DigestMailParams): string {
  const summary = filtersSummary(filters);
  const site = siteUrl();
  const boardUrlTagged = withUtm(boardUrl, 'daily_digest');
  const siteJobsTagged = withUtm(`${site}/jobs`, 'daily_digest');
  const n = jobs.length;
  const heading =
    n === 1 ? '1 new job for you' : `${n} new jobs for you`;
  const lines: string[] = [heading, '', `Alerts for: ${summary}`, ''];
  for (const j of jobs) {
    lines.push(j.title);
    const metaBits = [j.company, jobLocation(j)].filter(Boolean);
    if (metaBits.length) lines.push(metaBits.join(' · '));
    if (j.salary && j.salary.trim().toLowerCase() !== 'n/a') {
      lines.push(j.salary);
    }
    if (j.sector) lines.push(j.sector);
    if (j.description) lines.push(j.description);
    if (j.url) lines.push(j.url);
    lines.push('');
  }
  lines.push(`See all matching jobs: ${boardUrlTagged}`);
  lines.push('');
  lines.push(
    `You're getting this because you signed up for a daily digest at ${siteJobsTagged}.`
  );
  lines.push(`Unsubscribe: ${unsubscribeUrl}`);
  lines.push(`Privacy notice: ${site}/privacy`);
  return lines.join('\n');
}
