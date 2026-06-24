// Shared filter logic used by both the client UI (JobsList.tsx) and the
// server-side RSS feed handler (feed.xml/route.ts). Centralising it here
// guarantees the RSS output stays in lockstep with what the page shows for
// the same query string.

import type { SerializedJob } from './fetchJobs';
import { OrgCategory, orgCategory } from './orgType';

export type WorkStyle = 'remote' | 'hybrid' | 'onsite';

export const WORK_STYLE_OPTIONS: { value: WorkStyle; label: string }[] = [
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
  { value: 'remote', label: 'Remote' }
];

export type SeniorityCategory =
  | 'junior'
  | 'general'
  | 'senior'
  | 'director';

// Order matters — the dropdown / checkbox rendering follows this
// array, not an alphabetical sort.
export const SENIORITY_OPTIONS: {
  value: SeniorityCategory;
  label: string;
  keywords: string[];
}[] = [
  { value: 'junior', label: 'Junior', keywords: ['junior', 'entry'] },
  {
    value: 'general',
    label: 'General',
    keywords: ['general', 'mid', 'intermediate']
  },
  {
    value: 'senior',
    label: 'Senior, staff, or lead',
    keywords: ['senior', 'staff', 'principal', 'lead']
  },
  {
    value: 'director',
    label: 'Director and above',
    keywords: [
      'director',
      'vp',
      'vice president',
      'chief',
      'head of',
      'c-level',
      'cto',
      'cpo',
      'ceo',
      'executive'
    ]
  }
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
  { value: 'education', label: 'Education', keywords: ['education'] },
  { value: 'health', label: 'Health', keywords: ['health'] },
  {
    value: 'public-services',
    label: 'Public services',
    keywords: ['public service', 'government']
  }
];

// Meta-regions shown at the top of the country dropdown. Selecting a
// region matches every job whose country string mentions any country
// in the region's list — plus any job tagged with the region name
// itself ("Europe", "Africa", etc.) or a common alias (e.g. "EU",
// "MENA"). The region name itself is included in each list so those
// cross-region tags resolve correctly.
export type MetaRegion = {
  name: string;
  // List of country names + aliases that should resolve when this
  // region is selected. Matched as word-boundary case-insensitive
  // substrings against the job's country field.
  countries: string[];
};

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

const SOUTH_AMERICAN_COUNTRIES = [
  'South America',
  'LatAm',
  'Latin America',
  'Argentina',
  'Bolivia',
  'Brazil',
  'Chile',
  'Colombia',
  'Ecuador',
  'Guyana',
  'Paraguay',
  'Peru',
  'Suriname',
  'Uruguay',
  'Venezuela'
];

const AFRICAN_COUNTRIES = [
  'Africa',
  'Algeria',
  'Angola',
  'Benin',
  'Botswana',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cameroon',
  'Central African Republic',
  'Chad',
  'Comoros',
  'Congo',
  'DR Congo',
  "Côte d'Ivoire",
  'Ivory Coast',
  'Djibouti',
  'Egypt',
  'Equatorial Guinea',
  'Eritrea',
  'Eswatini',
  'Ethiopia',
  'Gabon',
  'Gambia',
  'Ghana',
  'Guinea',
  'Guinea-Bissau',
  'Kenya',
  'Lesotho',
  'Liberia',
  'Libya',
  'Madagascar',
  'Malawi',
  'Mali',
  'Mauritania',
  'Mauritius',
  'Morocco',
  'Mozambique',
  'Namibia',
  'Niger',
  'Nigeria',
  'Rwanda',
  'Sao Tome and Principe',
  'Senegal',
  'Seychelles',
  'Sierra Leone',
  'Somalia',
  'South Africa',
  'South Sudan',
  'Sudan',
  'Tanzania',
  'Togo',
  'Tunisia',
  'Uganda',
  'Zambia',
  'Zimbabwe'
];

const MIDDLE_EAST_COUNTRIES = [
  'Middle East',
  'MENA',
  'Bahrain',
  'Egypt',
  'Iran',
  'Iraq',
  'Israel',
  'Jordan',
  'Kuwait',
  'Lebanon',
  'Oman',
  'Palestine',
  'Qatar',
  'Saudi Arabia',
  'Syria',
  'Turkey',
  'UAE',
  'United Arab Emirates',
  'Yemen'
];

const ASIAN_COUNTRIES = [
  'Asia',
  'APAC',
  'Afghanistan',
  'Bangladesh',
  'Bhutan',
  'Brunei',
  'Cambodia',
  'China',
  'Hong Kong',
  'India',
  'Indonesia',
  'Japan',
  'Kazakhstan',
  'Kyrgyzstan',
  'Laos',
  'Macau',
  'Malaysia',
  'Maldives',
  'Mongolia',
  'Myanmar',
  'Nepal',
  'North Korea',
  'Pakistan',
  'Philippines',
  'Singapore',
  'South Korea',
  'Sri Lanka',
  'Taiwan',
  'Tajikistan',
  'Thailand',
  'Timor-Leste',
  'Turkmenistan',
  'Uzbekistan',
  'Vietnam'
];

const NORTH_AMERICAN_COUNTRIES = [
  'North America',
  'USA',
  'US',
  'United States',
  'United States of America',
  'America',
  'Canada',
  'Mexico',
  'Bahamas',
  'Barbados',
  'Belize',
  'Costa Rica',
  'Cuba',
  'Dominican Republic',
  'El Salvador',
  'Greenland',
  'Guatemala',
  'Haiti',
  'Honduras',
  'Jamaica',
  'Nicaragua',
  'Panama',
  'Trinidad and Tobago'
];

export const META_REGIONS: MetaRegion[] = [
  { name: 'Africa', countries: AFRICAN_COUNTRIES },
  { name: 'Asia', countries: ASIAN_COUNTRIES },
  { name: 'Europe', countries: EUROPEAN_COUNTRIES },
  { name: 'Middle East', countries: MIDDLE_EAST_COUNTRIES },
  { name: 'North America', countries: NORTH_AMERICAN_COUNTRIES },
  { name: 'South America', countries: SOUTH_AMERICAN_COUNTRIES }
];

export const META_REGION_NAMES = new Set(META_REGIONS.map((r) => r.name));

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
  // Meta region (Europe, South America, Africa, Middle East, Asia) —
  // matches if the job's country field mentions any country or alias
  // in the region's list.
  const region = META_REGIONS.find((r) => r.name === selected);
  if (region) {
    return region.countries.some((name) =>
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

export function matchesSeniority(
  jobSeniority: string,
  category: SeniorityCategory
): boolean {
  const opt = SENIORITY_OPTIONS.find((o) => o.value === category);
  if (!opt) return false;
  const lower = jobSeniority.toLowerCase();
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

export function parseSeniorityParam(value: string | null): SeniorityCategory[] {
  if (!value) return [];
  return value
    .split(',')
    .filter(
      (v): v is SeniorityCategory =>
        v === 'junior' ||
        v === 'general' ||
        v === 'senior' ||
        v === 'director'
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
  'role',
  'seniority'
] as const;

export type JobFilters = {
  country: string;
  workStyles: WorkStyle[];
  orgs: OrgCategory[];
  sectors: SectorCategory[];
  roles: string[];
  seniorities: SeniorityCategory[];
};

export function parseFiltersFromParams(
  params: URLSearchParams
): JobFilters {
  return {
    country: params.get('country') ?? 'all',
    workStyles: parseWorkStyleParam(params.get('work')),
    orgs: parseOrgParam(params.get('org')),
    sectors: parseSectorParam(params.get('sector')),
    roles: parseRoleParam(params.get('role')),
    seniorities: parseSeniorityParam(params.get('seniority'))
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
    if (
      filters.seniorities.length > 0 &&
      !filters.seniorities.some((s) => matchesSeniority(j.seniority, s))
    ) {
      return false;
    }
    return true;
  });
}
