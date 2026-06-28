'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { usePostHog } from 'posthog-js/react';
import {
  Activity,
  GraduationCap,
  Heart,
  Sprout,
  Landmark,
  HandHelping,
  Earth,
  Gem
} from 'lucide-react';
import type { SerializedJob } from './fetchJobs';
import { isHardProblemsPick } from './filters';
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

// Lucide icon to show next to each sector kicker. Keyed off the
// _displayed_ sector string (lower-cased) so the mapping survives the
// pretty-printing in displaySector(). Returns null if the sector
// doesn't have a dedicated icon yet.
function getSectorIcon(displayed: string) {
  const key = displayed.toLowerCase().trim();
  switch (key) {
    case 'healthcare':
    case 'public health':
      return Activity;
    case 'education':
      return GraduationCap;
    case 'personal health':
      return Heart;
    case 'climate tech':
    case 'climate change':
      return Sprout;
    case 'public services':
    case 'good gov':
      return Landmark;
    case 'nonprofit support':
    case 'non-profit support':
      return HandHelping;
    case 'other':
      return Earth;
    default:
      return null;
  }
}

// Pretty-print the sector for display. Mirrors the helper in JobsList.tsx
// so the homepage and /articles previews simplify the same way the full
// board does (e.g. "Health (Public Health)" → "Public health").
function displaySector(sector: string): string {
  const trimmed = sector.trim().replace(/\bnon-profit\b/gi, 'Nonprofit');
  const healthMatch = trimmed.match(/^Health\s*\(([^)]+)\)\s*$/i);
  if (healthMatch) {
    const inner = healthMatch[1].trim();
    return inner.charAt(0).toUpperCase() + inner.slice(1).toLowerCase();
  }
  if (trimmed.toLowerCase() === 'good government') return 'Good gov';
  if (trimmed.toLowerCase() === 'clean energy') return 'Climate Tech';
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
        const isStaffPick = isHardProblemsPick(job.goodForWorld);
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
              {job.sector &&
                (() => {
                  const displayed = displaySector(job.sector);
                  const SectorIcon = getSectorIcon(displayed);
                  const filterHref = `/jobs?sectorPick=${encodeURIComponent(
                    displayed.toLowerCase()
                  )}`;
                  return (
                    <Link
                      href={filterHref}
                      className={styles.sectorKicker}
                      aria-label={`See all ${displayed} jobs on the job board`}
                    >
                      {SectorIcon && (
                        <SectorIcon
                          className={styles.sectorKickerIcon}
                          aria-hidden="true"
                        />
                      )}
                      {displayed}
                    </Link>
                  );
                })()}
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
                    {idx > 0 && <span className={styles.bullet}>{' · '}</span>}
                    {part.node}
                  </Fragment>
                ))}
              </div>
            </div>
            {(job.description || isStaffPick) && (
              <div className={styles.description} role="tooltip">
                {job.description && (
                  <>
                    {job.company && (
                      <>
                        <strong className={styles.descriptionCompany}>
                          {job.company}
                        </strong>
                        <br />
                      </>
                    )}
                    {job.description}
                  </>
                )}
                {isStaffPick && (
                  <div className={styles.descriptionPick}>
                    <strong className={styles.descriptionPickHeading}>
                      <Gem
                        className={styles.descriptionPickIcon}
                        aria-hidden="true"
                      />
                      Hard Problems Pick
                    </strong>
                    <p>
                      We hand-select great jobs at orgs whose primary mission is
                      to make the world better.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      <div className={styles.seeAll}>
        <p className={styles.seeAllText}>
          We search the web to find roles for designers to work on hard
          problems.
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
