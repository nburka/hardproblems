'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import type { SerializedJob } from './fetchJobs';
import { orgTypeDisplay } from './orgType';
import styles from './jobsTeaser.module.scss';

type ClickSource = 'title' | 'company' | 'favicon';

// Fires a GA4 `job_click` event with rich job attributes for slicing.
// Safely no-ops when gtag isn't loaded (e.g. user has not given consent).
function trackJobClick(job: SerializedJob, source: ClickSource) {
  if (typeof window === 'undefined') return;
  const gtag = (
    window as unknown as { gtag?: (...args: unknown[]) => void }
  ).gtag;
  if (typeof gtag !== 'function') return;
  gtag('event', 'job_click', {
    job_title: job.title,
    company: job.company,
    sector: job.sector,
    type_of_org: job.typeOfOrg,
    country: job.country,
    city: job.city,
    salary: job.salary,
    remote: job.remote,
    listing_url: job.url,
    click_source: source
  });
}

function buildFaviconUrl(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;
  const withProto = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
  try {
    const { hostname } = new URL(withProto);
    if (!hostname) return null;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  } catch {
    return null;
  }
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#8a9b94"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <ellipse cx="12" cy="12" rx="4" ry="10" />
    </svg>
  );
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const todayUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  const jobUTC = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );
  const diffDays = Math.round((todayUTC - jobUTC) / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays > 1) return `${diffDays} days ago`;
  if (diffDays === -1) return 'Tomorrow';
  return `in ${-diffDays} days`;
}

export default function JobsTeaser({ jobs }: { jobs: SerializedJob[] }) {
  return (
    <div className={styles.teaser}>
      {jobs.map((job, i) => {
        const date = job.date ? new Date(job.date) : null;
        const location = [job.city, job.country]
          .filter((s) => s.trim().length > 0)
          .join(', ');
        const typeLabel = orgTypeDisplay(job.typeOfOrg);
        const metaParts: { key: string; node: React.ReactNode }[] = [];
        if (job.company) {
          metaParts.push({
            key: 'company',
            node: <span className={styles.company}>{job.company}</span>
          });
        }
        if (typeLabel) {
          metaParts.push({
            key: 'type',
            node: <span className={styles.type}>{typeLabel}</span>
          });
        }
        if (location) {
          metaParts.push({
            key: 'location',
            node: <span className={styles.location}>{location}</span>
          });
        }
        if (job.sector) {
          metaParts.push({
            key: 'sector',
            node: <span className={styles.sector}>{job.sector}</span>
          });
        }
        const faviconUrl = buildFaviconUrl(job.companyUrl);
        const companyHref = job.companyUrl
          ? job.companyUrl.startsWith('http')
            ? job.companyUrl
            : `https://${job.companyUrl}`
          : null;
        const iconContents = faviconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={faviconUrl}
            alt=""
            width={16}
            height={16}
            className={styles.favicon}
            loading="lazy"
          />
        ) : (
          <GlobeIcon className={styles.favicon} />
        );
        return (
          <div key={`${job.url}-${i}`} className={styles.row}>
            {companyHref ? (
              <Link
                href={companyHref}
                target="_blank"
                rel="noreferrer"
                aria-label={
                  job.company ? `Visit ${job.company}` : 'Visit company'
                }
                className={styles.icon}
                onClick={() => trackJobClick(job, 'favicon')}
              >
                {iconContents}
              </Link>
            ) : (
              <div className={styles.icon}>{iconContents}</div>
            )}
            <div className={styles.content}>
            {date && (
              <small className={styles.date}>{formatRelativeDate(date)}</small>
            )}
            <div className={styles.titleLine}>
              {job.url ? (
                <Link
                  href={job.url}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.title}
                  onClick={() => trackJobClick(job, 'title')}
                >
                  {job.title}
                </Link>
              ) : (
                <span className={styles.title}>{job.title}</span>
              )}
            </div>
            <div className={styles.meta}>
              {metaParts.map((part, idx) => (
                <Fragment key={part.key}>
                  {idx > 0 && (
                    <span className={styles.bullet}>{' · '}</span>
                  )}
                  {part.node}
                </Fragment>
              ))}
            </div>
            </div>
          </div>
        );
      })}
      <p className={styles.seeAll}>
        <Link href="/jobs">See all jobs &rarr;</Link>
      </p>
    </div>
  );
}
