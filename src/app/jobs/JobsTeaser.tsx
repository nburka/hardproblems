'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { usePostHog } from 'posthog-js/react';
import type { SerializedJob } from './fetchJobs';
import { orgTypeDisplay } from './orgType';
import styles from './jobsTeaser.module.scss';

type ClickSource = 'title' | 'company' | 'favicon';

function buildFaviconUrl(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;
  const withProto = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
  try {
    const { hostname } = new URL(withProto);
    if (!hostname) return null;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
  } catch {
    return null;
  }
}

// Pretty-print the sector for display. Mirrors the helper in JobsList.tsx
// so the homepage and /articles previews simplify the same way the full
// board does (e.g. "Health (Public Health)" → "Public health").
function displaySector(sector: string): string {
  const trimmed = sector.trim();
  const healthMatch = trimmed.match(/^Health\s*\(([^)]+)\)\s*$/i);
  if (healthMatch) {
    const inner = healthMatch[1].trim();
    return inner.charAt(0).toUpperCase() + inner.slice(1).toLowerCase();
  }
  if (trimmed.toLowerCase() === 'good government') return 'Good gov';
  return trimmed;
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


export default function JobsTeaser({
  jobs,
  totalCount
}: {
  jobs: SerializedJob[];
  // Total number of visible jobs across the whole board. When provided,
  // the "See all jobs" button reads "See all N jobs" instead. Optional so
  // existing callers that don't pass it keep their current button text.
  totalCount?: number;
}) {
  const posthog = usePostHog();

  const trackJobClick = (job: SerializedJob, source: ClickSource) => {
    if (!posthog) return;
    posthog.capture('job_click', {
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
  };

  return (
    <div className={styles.teaser}>
      {jobs.map((job, i) => {
        const location = job.country.trim();
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
            {job.sector && (
              <div className={styles.sectorKicker}>
                {displaySector(job.sector)}
              </div>
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
            {job.description && (
              <div className={styles.description} role="tooltip">
                {job.company && (
                  <strong className={styles.descriptionCompany}>
                    {job.company} —
                  </strong>
                )}
                {job.company && ' '}
                {job.description}
              </div>
            )}
          </div>
        );
      })}
      <div className={styles.seeAll}>
        <p className={styles.seeAllText}>
          We follow job boards that feature roles for senior designers
          working on hard problems.
        </p>
        <Link href="/jobs">
          {typeof totalCount === 'number'
            ? `See all ${totalCount} ${totalCount === 1 ? 'job' : 'jobs'}`
            : 'See all jobs'}{' '}
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
