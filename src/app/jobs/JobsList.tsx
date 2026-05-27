'use client';

import { Fragment, ReactNode, useMemo, useState } from 'react';
import Link from 'next/link';
import type { SerializedJob } from './fetchJobs';
import styles from './page.module.scss';

export type { SerializedJob } from './fetchJobs';

const BULLET_SEPARATOR = '  •  ';


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

type WorkStyle = 'all' | 'remote' | 'hybrid' | 'onsite';

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

function splitCountries(s: string): string[] {
  return s
    .split(/\s+(?:or|and)\s+|\s*[,&/]\s*/i)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const EUROPEAN_COUNTRIES = [
  'Europe',
  'EU',
  'UK',
  'United Kingdom',
  'England',
  'Scotland',
  'Wales',
  'Northern Ireland',
  'Ireland',
  'France',
  'Germany',
  'Spain',
  'Italy',
  'Portugal',
  'Netherlands',
  'Belgium',
  'Luxembourg',
  'Denmark',
  'Sweden',
  'Norway',
  'Finland',
  'Iceland',
  'Austria',
  'Switzerland',
  'Poland',
  'Czech Republic',
  'Czechia',
  'Slovakia',
  'Hungary',
  'Romania',
  'Bulgaria',
  'Greece',
  'Slovenia',
  'Croatia',
  'Serbia',
  'Bosnia',
  'Herzegovina',
  'Montenegro',
  'North Macedonia',
  'Albania',
  'Estonia',
  'Latvia',
  'Lithuania',
  'Ukraine',
  'Moldova',
  'Malta',
  'Cyprus'
];

function matchesCountry(jobCountry: string, selected: string): boolean {
  if (selected === 'all') return true;
  if (selected === 'Europe') {
    return EUROPEAN_COUNTRIES.some((name) =>
      new RegExp(`\\b${escapeRegex(name)}\\b`, 'i').test(jobCountry)
    );
  }
  const re = new RegExp(`\\b${escapeRegex(selected)}\\b`, 'i');
  return re.test(jobCountry);
}

function matchesWorkStyle(remote: string, filter: WorkStyle): boolean {
  if (filter === 'all') return true;
  const r = remote.toLowerCase();
  if (filter === 'remote') return r.includes('remote');
  if (filter === 'hybrid') return r.includes('hybrid');
  if (filter === 'onsite') return r.length === 0;
  return true;
}

function formatLocation(job: SerializedJob): string {
  const bits = [job.city, job.country].filter((s) => s.length > 0);
  const place = bits.join(', ');
  if (job.remote && place) return `${place} · ${job.remote}`;
  return place || job.remote;
}

export default function JobsList({ jobs }: { jobs: SerializedJob[] }) {
  const [country, setCountry] = useState<string>('all');
  const [workStyle, setWorkStyle] = useState<WorkStyle>('all');

  const countries = useMemo(() => {
    const set = new Set<string>();
    for (const j of jobs) {
      for (const c of splitCountries(j.country)) {
        set.add(c);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [jobs]);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (!matchesCountry(j.country, country)) return false;
      if (!matchesWorkStyle(j.remote, workStyle)) return false;
      return true;
    });
  }, [jobs, country, workStyle]);

  const workStyles: { value: WorkStyle; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'onsite', label: 'On-site' }
  ];

  return (
    <>
      <p className={styles.betaNotice}>
        <strong>Beta:</strong> Please contact us if you see any issues with the
        job board.{' '}
        <a href="mailto:contact@hardproblems.com">
          contact@hardproblems.com
        </a>
      </p>
      <div className={styles.filters}>
        <label className={styles.filterField}>
          <span className={styles.filterLabel}>Country</span>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.filterField}>
          <span className={styles.filterLabel}>Work style</span>
          <div className={styles.filterButtons}>
            {workStyles.map((w) => (
              <button
                key={w.value}
                type="button"
                onClick={() => setWorkStyle(w.value)}
                className={`${styles.filterButton} ${
                  workStyle === w.value ? styles.filterButtonActive : ''
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterCount}>
          {filtered.length} {filtered.length === 1 ? 'job' : 'jobs'}
        </div>
      </div>

      {filtered.length === 0 && (
        <p>No jobs match these filters. Try widening your search.</p>
      )}

      <ul className={styles.jobs}>
        {filtered.map((job, i) => {
          const date = job.date ? new Date(job.date) : null;
          const location = formatLocation(job);
          const hasSalary =
            job.salary && job.salary.toLowerCase() !== 'n/a';

          const faviconUrl = buildFaviconUrl(job.companyUrl);
          const companyHref = job.companyUrl
            ? job.companyUrl.startsWith('http')
              ? job.companyUrl
              : `https://${job.companyUrl}`
            : null;
          const metaItems: ReactNode[] = [];
          if (job.company) {
            metaItems.push(
              companyHref ? (
                <Link
                  href={companyHref}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.jobCompany}
                >
                  {job.company}
                </Link>
              ) : (
                <span className={styles.jobCompany}>{job.company}</span>
              )
            );
          }
          if (location) {
            metaItems.push(
              <span className={styles.jobLocation}>{location}</span>
            );
          }
          if (hasSalary) {
            metaItems.push(
              <span className={styles.jobSalary}>{job.salary}</span>
            );
          }

          return (
            <li key={`${job.url}-${i}`} className={styles.job}>
              {companyHref ? (
                <Link
                  href={companyHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={
                    job.company ? `Visit ${job.company}` : 'Visit company'
                  }
                  className={styles.jobIcon}
                >
                  {faviconUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={faviconUrl}
                      alt={job.company ? `Icon of ${job.company}` : 'Company icon'}
                      width={16}
                      height={16}
                      className={styles.companyFavicon}
                      loading="lazy"
                    />
                  )}
                </Link>
              ) : (
                <div className={styles.jobIcon}>
                  {faviconUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={faviconUrl}
                      alt=""
                      width={16}
                      height={16}
                      className={styles.companyFavicon}
                      loading="lazy"
                    />
                  )}
                </div>
              )}
              <div className={styles.jobMain}>
                <h4 className={styles.jobTitle}>
                  {job.url ? (
                    <Link href={job.url} target="_blank" rel="noreferrer">
                      {job.title}
                    </Link>
                  ) : (
                    job.title
                  )}
                </h4>
                <div className={styles.jobMeta}>
                  {metaItems.map((item, idx) => (
                    <Fragment key={idx}>
                      {idx > 0 && (
                        <span className={styles.jobBullet}>
                          {BULLET_SEPARATOR}
                        </span>
                      )}
                      {item}
                    </Fragment>
                  ))}
                </div>
                {job.sector && (
                  <div className={styles.jobSectorRow}>
                    <span className={`tag ${styles.jobSector}`}>
                      {job.sector}
                    </span>
                  </div>
                )}
              </div>
              {job.description && (
                <div className={styles.jobDescription} role="tooltip">
                  {job.company && (
                    <strong className={styles.jobDescriptionCompany}>
                      {job.company} —
                    </strong>
                  )}
                  {job.company && ' '}
                  {job.description}
                </div>
              )}
              <div className={styles.jobAside}>
                {date && (
                  <small className={styles.jobDate}>
                    {formatRelativeDate(date)}
                  </small>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
