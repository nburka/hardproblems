'use client';

import { Fragment, ReactNode, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import type { SerializedJob } from './fetchJobs';
import {
  ORG_TYPE_OPTIONS,
  OrgCategory,
  orgTypeDisplay
} from './orgType';
import {
  FILTER_PARAM_KEYS,
  SECTOR_OPTIONS,
  SectorCategory,
  WORK_STYLE_OPTIONS,
  WorkStyle,
  filterJobs,
  parseOrgParam,
  parseRoleParam,
  parseSectorParam,
  parseWorkStyleParam,
  splitCountries
} from './filters';
import styles from './page.module.scss';

export type { SerializedJob } from './fetchJobs';

type ClickSource = 'title' | 'company' | 'favicon';

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

function formatLocation(job: SerializedJob): string {
  const bits = [job.city, job.country].filter((s) => s.length > 0);
  const place = bits.join(', ');
  if (job.remote && place) return `${place} · ${job.remote}`;
  return place || job.remote;
}

// Country-name → ISO 3166-1 alpha-2 code, used to derive a flag emoji from
// regional indicator letters. Covers every value currently in the sheet plus
// common aliases and likely future additions so the dropdown degrades
// gracefully as new countries appear. Unknown values render with no emoji.
const COUNTRY_ISO_CODES: Record<string, string> = {
  Australia: 'AU',
  Austria: 'AT',
  Bangladesh: 'BD',
  Belgium: 'BE',
  Brazil: 'BR',
  Bulgaria: 'BG',
  Canada: 'CA',
  Chile: 'CL',
  China: 'CN',
  Colombia: 'CO',
  Croatia: 'HR',
  Cyprus: 'CY',
  Czechia: 'CZ',
  'Czech Republic': 'CZ',
  Denmark: 'DK',
  Egypt: 'EG',
  England: 'GB',
  Estonia: 'EE',
  Finland: 'FI',
  France: 'FR',
  Germany: 'DE',
  Greece: 'GR',
  Hungary: 'HU',
  Iceland: 'IS',
  India: 'IN',
  Indonesia: 'ID',
  Ireland: 'IE',
  Israel: 'IL',
  Italy: 'IT',
  Japan: 'JP',
  Kenya: 'KE',
  Latvia: 'LV',
  Lithuania: 'LT',
  Luxembourg: 'LU',
  Malaysia: 'MY',
  Malta: 'MT',
  Mexico: 'MX',
  Moldova: 'MD',
  Netherlands: 'NL',
  'New Zealand': 'NZ',
  Nigeria: 'NG',
  'Northern Ireland': 'GB',
  Norway: 'NO',
  Pakistan: 'PK',
  Philippines: 'PH',
  Poland: 'PL',
  Portugal: 'PT',
  Romania: 'RO',
  Russia: 'RU',
  'Saudi Arabia': 'SA',
  Scotland: 'GB',
  Serbia: 'RS',
  Singapore: 'SG',
  Slovakia: 'SK',
  Slovenia: 'SI',
  'South Africa': 'ZA',
  'South Korea': 'KR',
  Spain: 'ES',
  'Sri Lanka': 'LK',
  Sweden: 'SE',
  Switzerland: 'CH',
  Thailand: 'TH',
  UAE: 'AE',
  UK: 'GB',
  Ukraine: 'UA',
  'United Arab Emirates': 'AE',
  'United Kingdom': 'GB',
  'United States': 'US',
  USA: 'US',
  US: 'US',
  Vietnam: 'VN',
  Wales: 'GB'
};

// Special-case overrides for dropdown options that don't map to a single
// country. "all" is the literal value of the "All countries" option;
// "Europe" is a synthetic value the user can select to broaden the search.
const SPECIAL_COUNTRY_FLAGS: Record<string, string> = {
  all: '🌍', // globe centered on Europe-Africa
  Europe: '🇪🇺'
};

function isoToFlagEmoji(iso: string): string {
  if (iso.length !== 2) return '';
  const REGIONAL_A = 0x1f1e6;
  const c1 = iso.toUpperCase().charCodeAt(0) - 0x41;
  const c2 = iso.toUpperCase().charCodeAt(1) - 0x41;
  if (c1 < 0 || c1 > 25 || c2 < 0 || c2 > 25) return '';
  return String.fromCodePoint(REGIONAL_A + c1, REGIONAL_A + c2);
}

function countryFlag(name: string): string {
  if (SPECIAL_COUNTRY_FLAGS[name]) return SPECIAL_COUNTRY_FLAGS[name];
  const iso = COUNTRY_ISO_CODES[name];
  return iso ? isoToFlagEmoji(iso) : '';
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
  const sectorFilters = useMemo(
    () => parseSectorParam(searchParams.get('sector')),
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
        // "Global" isn't a country — it's a flag on the job meaning
        // location-agnostic. matchesCountry() makes those jobs appear in
        // every filter, so we hide the value from the dropdown itself.
        if (c.toLowerCase() === 'global') continue;
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

  const filtered = useMemo(
    () =>
      filterJobs(jobs, {
        country,
        workStyles: workStyleFilters,
        orgs: orgFilters,
        sectors: sectorFilters,
        roles: roleFilters
      }),
    [jobs, country, workStyleFilters, orgFilters, sectorFilters, roleFilters]
  );

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

  const toggleSectorFilter = (value: SectorCategory) => {
    const next = sectorFilters.includes(value)
      ? sectorFilters.filter((v) => v !== value)
      : [...sectorFilters, value];
    updateParams((params) => {
      if (next.length === 0) params.delete('sector');
      else params.set('sector', next.join(','));
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
      params.delete('sector');
      params.delete('role');
    });
  };

  const hasActiveFilters =
    country !== 'all' ||
    workStyleFilters.length > 0 ||
    orgFilters.length > 0 ||
    sectorFilters.length > 0 ||
    roleFilters.length > 0;

  // RSS feed URL mirrors the current filter state so subscribing while
  // looking at e.g. "Climate + Remote" lands you on the equivalent feed.
  // Only forward known filter keys (FILTER_PARAM_KEYS) — arbitrary params
  // would otherwise leak into the feed URL.
  const feedHref = useMemo(() => {
    const out = new URLSearchParams();
    for (const key of FILTER_PARAM_KEYS) {
      const value = searchParams.get(key);
      if (value) out.set(key, value);
    }
    const qs = out.toString();
    return qs ? `/jobs/feed.xml?${qs}` : '/jobs/feed.xml';
  }, [searchParams]);

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
            <option value="all">{countryFlag('all')}{'  '}All countries</option>
            {countries.map((c) => {
              const flag = countryFlag(c);
              return (
                <option key={c} value={c}>
                  {flag ? `${flag}  ${c}` : c}
                </option>
              );
            })}
          </select>
        </label>

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

          <div className={styles.filterField}>
            <span className={styles.filterLabel}>Sector</span>
            <div className={styles.checkboxes}>
              {SECTOR_OPTIONS.map((opt) => (
                <label key={opt.value} className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={sectorFilters.includes(opt.value)}
                    onChange={() => toggleSectorFilter(opt.value)}
                  />
                  <span className={styles.checkboxBox} aria-hidden="true" />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

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

        <a
          href={feedHref}
          className={styles.rssLink}
          aria-label={
            hasActiveFilters
              ? 'Subscribe to RSS feed for these filters'
              : 'Subscribe to RSS feed'
          }
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className={styles.rssIcon}
          >
            <path d="M6.18 17.82a2.18 2.18 0 1 1-4.36 0 2.18 2.18 0 0 1 4.36 0zM4 4.44v3.04A12.52 12.52 0 0 1 16.52 20h3.04A15.56 15.56 0 0 0 4 4.44zM4 10.36v3.05A6.6 6.6 0 0 1 10.59 20h3.05A9.64 9.64 0 0 0 4 10.36z" />
          </svg>
          RSS feed{hasActiveFilters ? ' for these filters' : ''}
        </a>

      </div>

      <div className={styles.results}>
      <div className={styles.filterCount}>
        {filtered.length} {filtered.length === 1 ? 'job' : 'jobs'}
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
                        <span
                          className={styles.jobStaffPickStar}
                          aria-hidden="true"
                        >
                          ⭐
                        </span>
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
                {date &&
                  (() => {
                    const relativeLabel = formatRelativeDate(date);
                    const isNewToday = relativeLabel === 'Today';
                    return (
                      <small
                        className={`${styles.jobDate} ${
                          isNewToday ? styles.jobDateToday : ''
                        }`}
                      >
                        {isNewToday && (
                          <span
                            className={styles.jobDateIcon}
                            aria-hidden="true"
                          >
                            ✨
                          </span>
                        )}
                        {relativeLabel}
                      </small>
                    );
                  })()}
              </div>
            </li>
          );
        })}
      </ul>
      </div>
    </div>
  );
}
