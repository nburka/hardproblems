// Shared filter logic used by both the client UI (JobsList.tsx) and the
// server-side RSS feed handler (feed.xml/route.ts). Centralising it here
// guarantees the RSS output stays in lockstep with what the page shows for
// the same query string.

import type { SerializedJob } from './fetchJobs';
import { OrgCategory, orgCategory } from './orgType';

export type WorkStyle = 'remote' | 'hybrid' | 'onsite';

export const WORK_STYLE_OPTIONS: { value: WorkStyle; label: string }[] = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' }
];

export type SectorCategory =
  | 'climate'
  | 'health'
  | 'public-services'
  | 'education';

export const SECTOR_OPTIONS: {
  value: SectorCategory;
  label: string;
  keywords: string[];
}[] = [
  {
    value: 'climate',
    label: 'Climate change',
    keywords: ['climate', 'clean energy']
  },
  { value: 'health', label: 'Health', keywords: ['health'] },
  {
    value: 'public-services',
    label: 'Public services',
    keywords: ['public service', 'government']
  },
  { value: 'education', label: 'Education', keywords: ['education'] }
];

export const EUROPEAN_COUNTRIES = [
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

export function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function splitCountries(s: string): string[] {
  return s
    .split(/\s+(?:or|and)\s+|\s*[,&/]\s*/i)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

export function matchesCountry(jobCountry: string, selected: string): boolean {
  if (selected === 'all') return true;
  // "Global" roles are location-agnostic — they should appear in every
  // country filter so a user looking at e.g. Germany still sees them.
  if (/\bGlobal\b/i.test(jobCountry)) return true;
  if (selected === 'Europe') {
    return EUROPEAN_COUNTRIES.some((name) =>
      new RegExp(`\\b${escapeRegex(name)}\\b`, 'i').test(jobCountry)
    );
  }
  const re = new RegExp(`\\b${escapeRegex(selected)}\\b`, 'i');
  return re.test(jobCountry);
}

export function matchesWorkStyle(remote: string, filter: WorkStyle): boolean {
  const r = remote.toLowerCase();
  if (filter === 'remote') return r.includes('remote');
  if (filter === 'hybrid') return r.includes('hybrid');
  if (filter === 'onsite') return r.length === 0;
  return false;
}

export function matchesSector(
  jobSector: string,
  category: SectorCategory
): boolean {
  const opt = SECTOR_OPTIONS.find((o) => o.value === category);
  if (!opt) return false;
  const lower = jobSector.toLowerCase();
  return opt.keywords.some((k) => lower.includes(k));
}

export function parseWorkStyleParam(value: string | null): WorkStyle[] {
  if (!value) return [];
  return value
    .split(',')
    .filter(
      (v): v is WorkStyle =>
        v === 'remote' || v === 'hybrid' || v === 'onsite'
    );
}

export function parseOrgParam(value: string | null): OrgCategory[] {
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

export function parseSectorParam(value: string | null): SectorCategory[] {
  if (!value) return [];
  return value
    .split(',')
    .filter(
      (v): v is SectorCategory =>
        v === 'climate' ||
        v === 'health' ||
        v === 'public-services' ||
        v === 'education'
    );
}

export function parseRoleParam(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

// The known set of filter query-string keys. Used by the RSS link in the UI
// to forward exactly the same filters into the feed URL.
export const FILTER_PARAM_KEYS = [
  'country',
  'work',
  'org',
  'sector',
  'role'
] as const;

export type JobFilters = {
  country: string;
  workStyles: WorkStyle[];
  orgs: OrgCategory[];
  sectors: SectorCategory[];
  roles: string[];
};

export function parseFiltersFromParams(
  params: URLSearchParams
): JobFilters {
  return {
    country: params.get('country') ?? 'all',
    workStyles: parseWorkStyleParam(params.get('work')),
    orgs: parseOrgParam(params.get('org')),
    sectors: parseSectorParam(params.get('sector')),
    roles: parseRoleParam(params.get('role'))
  };
}

// Filters jobs identically to the JobsList UI. Keep this in sync with the
// `filtered` useMemo block over there — or better, only call from this
// module so there's one implementation.
export function filterJobs(
  jobs: SerializedJob[],
  filters: JobFilters
): SerializedJob[] {
  return jobs.filter((j) => {
    if (!matchesCountry(j.country, filters.country)) return false;
    if (
      filters.workStyles.length > 0 &&
      !filters.workStyles.some((w) => matchesWorkStyle(j.remote, w))
    ) {
      return false;
    }
    if (filters.orgs.length > 0) {
      const cat = orgCategory(j.typeOfOrg);
      if (!cat || !filters.orgs.includes(cat)) return false;
    }
    if (
      filters.sectors.length > 0 &&
      !filters.sectors.some((s) => matchesSector(j.sector, s))
    ) {
      return false;
    }
    if (filters.roles.length > 0 && !filters.roles.includes(j.role)) {
      return false;
    }
    return true;
  });
}
