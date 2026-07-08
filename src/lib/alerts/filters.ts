import { FILTER_PARAM_KEYS } from '../../app/jobs/filters';

// Serialize the current /jobs URL search params into a stable object we
// can store as JSONB. Only the keys we know about are kept, and each
// value is trimmed; empty strings drop out entirely. That gives a
// canonical shape so two subscribers with the same filters store the
// same JSON (useful later for analytics / debugging).
export function serializeFilters(
  params: URLSearchParams | Record<string, string>
): Record<string, string> {
  const out: Record<string, string> = {};
  const get = (k: string): string | null =>
    params instanceof URLSearchParams
      ? params.get(k)
      : params[k] != null
        ? String(params[k])
        : null;
  for (const key of FILTER_PARAM_KEYS) {
    const raw = get(key);
    if (raw == null) continue;
    const trimmed = raw.trim();
    if (!trimmed) continue;
    out[key] = trimmed;
  }
  return out;
}

// Rebuild a URLSearchParams from the stored JSON — used by the daily
// digest to reproduce the same filter view the subscriber signed up
// with, and to render "your filters" links in the email footer.
export function filtersToSearchParams(
  filters: Record<string, unknown>
): URLSearchParams {
  const sp = new URLSearchParams();
  for (const key of FILTER_PARAM_KEYS) {
    const v = filters[key];
    if (typeof v === 'string' && v.length > 0) sp.set(key, v);
  }
  return sp;
}

// Human-readable one-liner describing the saved filters, for the
// confirmation email and the daily digest header.
// e.g. "Design, Product · Europe · Remote · Senior"
//
// Multi-select filter values arrive as comma-separated strings in the
// URL (e.g. "junior,general"); split, title-case the first letter of
// each token, and rejoin with ", " for a natural read.
function prettifyMulti(raw: string): string {
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
    .join(', ');
}

export function filtersSummary(filters: Record<string, unknown>): string {
  const bits: string[] = [];
  const label = (k: string) => {
    const v = filters[k];
    return typeof v === 'string' && v.length > 0 ? prettifyMulti(v) : null;
  };
  const push = (v: string | null) => {
    if (v) bits.push(v);
  };
  push(label('sector'));
  push(label('sectorPick'));
  push(label('country'));
  push(label('work'));
  push(label('role'));
  push(label('seniority'));
  push(label('org'));
  if (filters.pick === '1') push('Our Picks only');
  return bits.length > 0 ? bits.join(' · ') : 'All jobs';
}
