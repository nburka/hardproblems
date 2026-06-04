'use client';

import { Fragment, ReactNode, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import type { SerializedJob } from './fetchJobs';
import {
  ORG_TYPE_OPTIONS,
  OrgCategory,
  orgCategory,
  orgTypeDisplay
} from './orgType';
import styles from './page.module.scss';

export type { SerializedJob } from './fetchJobs';

type ClickSource = 'title' | 'company' | 'favicon';

function parseWorkStyleParam(value: string | null): WorkStyle[] {
  if (!value) return [];
  return value
    .split(',')
    .filter(
      (v): v is WorkStyle =>
        v === 'remote' || v === 'hybrid' || v === 'onsite'
    );
}

function parseOrgParam(value: string | null): OrgCategory[] {
  if (!value) return [];
  return value
    .split(',')
    .filter(
      (v): v is OrgCategory =>
        v === 'for-profit' ||
        v === 'not-for-profit' ||
        v === 'public-sector'
    );
}

function parseRoleParam(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

// Pretty-print a role name for the UI. The internal value (used for filter
// matching and URL params) stays as the raw sheet value so data lookups
// still work.
function displayRole(role: string): string {
  if (role.toLowerCase() === 'copywriter') return 'Copywriting';
  return role;
}

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

type WorkStyle = 'remote' | 'hybrid' | 'onsite';

const WORK_STYLE_OPTIONS: { value: WorkStyle; label: string }[] = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' }
];

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.5l2.95 6.13 6.55.61-4.95 4.66 1.46 6.6L12 17.27 5.99 20.5l1.46-6.6L2.5 9.24l6.55-.61L12 2.5z" />
    </svg>
  );
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
  const r = remote.toLowerCase();
  if (filter === 'remote') return r.includes('remote');
  if (filter === 'hybrid') return r.includes('hybrid');
  if (filter === 'onsite') return r.length === 0;
  return false;
}

function formatLocation(job: SerializedJob): string {
  const bits = [job.city, job.country].filter((s) => s.length > 0);
  const place = bits.join(', ');
  if (job.remote && place) return `${place} · ${job.remote}`;
  return place || job.remote;
}

export default function JobsList({ jobs }: { jobs: SerializedJob[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const posthog = usePostHog();

  // Fires a GA-style `job_click` event in PostHog with rich job attributes
  // for slicing. No-ops cleanly when PostHog isn't initialised (e.g. env
  // vars missing).
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

  // Mobile-only UI state for the "More filters" toggle. The Work style and
  // Role filters are hidden until this is true. Ignored at desktop — CSS
  // unconditionally shows everything in the column layout.
  const [showMore, setShowMore] = useState(false);

  // Filter state is derived from the URL so it's shareable and bookmarkable.
  // Visiting /jobs?country=Germany&work=remote,hybrid&org=non-profit will
  // restore those filters on load. All filter changes go through
  // updateParams() below, which uses router.replace so each checkbox toggle
  // doesn't push a separate history entry.
  const country = searchParams.get('country') ?? 'all';
  const workStyleFilters = useMemo(
    () => parseWorkStyleParam(searchParams.get('work')),
    [searchParams]
  );
  const orgFilters = useMemo(
    () => parseOrgParam(searchParams.get('org')),
    [searchParams]
  );
  const roleFilters = useMemo(
    () => parseRoleParam(searchParams.get('role')),
    [searchParams]
  );

  const updateParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const setCountry = (value: string) => {
    updateParams((params) => {
      if (value === 'all') params.delete('country');
      else params.set('country', value);
    });
  };

  const countries = useMemo(() => {
    const set = new Set<string>();
    for (const j of jobs) {
      for (const c of splitCountries(j.country)) {
        set.add(c);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [jobs]);

  // Distinct role-type values from the data, excluding "Other" and blanks.
  const roles = useMemo(() => {
    const set = new Set<string>();
    for (const j of jobs) {
      const r = j.role.trim();
      if (r && r.toLowerCase() !== 'other') set.add(r);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [jobs]);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (!matchesCountry(j.country, country)) return false;
      if (
        workStyleFilters.length > 0 &&
        !workStyleFilters.some((w) => matchesWorkStyle(j.remote, w))
      )
        return false;
      if (orgFilters.length > 0) {
        const cat = orgCategory(j.typeOfOrg);
        if (!cat || !orgFilters.includes(cat)) return false;
      }
      if (roleFilters.length > 0 && !roleFilters.includes(j.role)) {
        return false;
      }
      return true;
    });
  }, [jobs, country, workStyleFilters, orgFilters, roleFilters]);

  const toggleWorkStyle = (value: WorkStyle) => {
    const next = workStyleFilters.includes(value)
      ? workStyleFilters.filter((v) => v !== value)
      : [...workStyleFilters, value];
    updateParams((params) => {
      if (next.length === 0) params.delete('work');
      else params.set('work', next.join(','));
    });
  };

  const toggleOrgFilter = (value: OrgCategory) => {
    const next = orgFilters.includes(value)
      ? orgFilters.filter((v) => v !== value)
      : [...orgFilters, value];
    updateParams((params) => {
      if (next.length === 0) params.delete('org');
      else params.set('org', next.join(','));
    });
  };

  const toggleRoleFilter = (value: string) => {
    const next = roleFilters.includes(value)
      ? roleFilters.filter((v) => v !== value)
      : [...roleFilters, value];
    updateParams((params) => {
      if (next.length === 0) params.delete('role');
      else params.set('role', next.join(','));
    });
  };

  const clearFilters = () => {
    updateParams((params) => {
      params.delete('country');
      params.delete('work');
      params.delete('org');
      params.delete('role');
    });
  };

  const hasActiveFilters =
    country !== 'all' ||
    workStyleFilters.length > 0 ||
    orgFilters.length > 0 ||
    roleFilters.length > 0;

  return (
    <div className={styles.layout}>
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
          <span className={styles.filterLabel}>Org type</span>
          <div className={styles.checkboxes}>
            {ORG_TYPE_OPTIONS.map((opt) => (
              <label key={opt.value} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={orgFilters.includes(opt.value)}
                  onChange={() => toggleOrgFilter(opt.value)}
                />
                <span className={styles.checkboxBox} aria-hidden="true" />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={styles.moreFiltersToggle}
          aria-expanded={showMore}
          onClick={() => setShowMore((v) => !v)}
        >
          {showMore ? 'Fewer filters' : 'More filters…'}
        </button>

        <div
          className={`${styles.moreFilters} ${
            showMore ? styles.moreFiltersOpen : ''
          }`}
        >
          <div className={styles.filterField}>
            <span className={styles.filterLabel}>Work style</span>
            <div className={styles.checkboxes}>
              {WORK_STYLE_OPTIONS.map((opt) => (
                <label key={opt.value} className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={workStyleFilters.includes(opt.value)}
                    onChange={() => toggleWorkStyle(opt.value)}
                  />
                  <span className={styles.checkboxBox} aria-hidden="true" />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {roles.length > 0 && (
            <div className={styles.filterField}>
              <span className={styles.filterLabel}>Role</span>
              <div className={styles.checkboxes}>
                {roles.map((role) => (
                  <label key={role} className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={roleFilters.includes(role)}
                      onChange={() => toggleRoleFilter(role)}
                    />
                    <span className={styles.checkboxBox} aria-hidden="true" />
                    {displayRole(role)}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      <div className={styles.results}>
      <div className={styles.resultsHeader}>
        <div className={styles.filterCount}>
          {filtered.length} {filtered.length === 1 ? 'job' : 'jobs'}
        </div>
        <p className={styles.betaNotice}>
          <strong>Beta:</strong> Contact us if you see issues with the job
          board.{' '}
          <a href="mailto:contact@hardproblems.com">
            contact@hardproblems.com
          </a>
        </p>
      </div>
      {filtered.length === 0 && (
        <div className={styles.noResults}>
          <svg
            className={styles.noResultsIcon}
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.5" y2="16.5" />
          </svg>
          <h3 className={styles.noResultsTitle}>No jobs found</h3>
          <p className={styles.noResultsText}>
            No jobs match your current filters. Try removing a filter or
            widening your search.
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              className={styles.noResultsButton}
              onClick={clearFilters}
            >
              Clear all filters
            </button>
          )}
        </div>
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
          const typeLabel = orgTypeDisplay(job.typeOfOrg);
          const goodForWorldScore = parseFloat(job.goodForWorld);
          const isStaffPick =
            !Number.isNaN(goodForWorldScore) && goodForWorldScore > 8;
          const metaItems: ReactNode[] = [];
          if (job.company) {
            metaItems.push(
              companyHref ? (
                <Link
                  href={companyHref}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.jobCompany}
                  onClick={() => trackJobClick(job, 'company')}
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

          const iconContents = faviconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={faviconUrl}
              alt={
                companyHref
                  ? job.company
                    ? `Icon of ${job.company}`
                    : 'Company icon'
                  : ''
              }
              width={16}
              height={16}
              className={styles.companyFavicon}
              loading="lazy"
            />
          ) : (
            <GlobeIcon className={styles.companyFavicon} />
          );

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
                  onClick={() => trackJobClick(job, 'favicon')}
                >
                  {iconContents}
                </Link>
              ) : (
                <div className={styles.jobIcon}>{iconContents}</div>
              )}
              <div className={styles.jobMain}>
                <h4 className={styles.jobTitle}>
                  {job.url ? (
                    <Link
                      href={job.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackJobClick(job, 'title')}
                    >
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
                {(job.sector || typeLabel || isStaffPick) && (
                  <div className={styles.jobSectorRow}>
                    {isStaffPick && (
                      <span className={`tag ${styles.jobStaffPick}`}>
                        <StarIcon className={styles.jobStaffPickStar} />
                        Hard Problems Pick
                      </span>
                    )}
                    {job.sector && (
                      <span className={`tag ${styles.jobSector}`}>
                        {job.sector}
                      </span>
                    )}
                    {typeLabel && (
                      <span className={`tag ${styles.jobType}`}>
                        {typeLabel}
                      </span>
                    )}
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
      </div>
    </div>
  );
}
