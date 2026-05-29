export type OrgCategory = 'for-profit' | 'not-for-profit' | 'public-sector';

export const ORG_TYPE_OPTIONS: { value: OrgCategory; label: string }[] = [
  { value: 'for-profit', label: 'Company' },
  { value: 'not-for-profit', label: 'Non-profit' },
  { value: 'public-sector', label: 'Public sector' }
];

// Maps a raw "Type of org" value from the sheet to a canonical category.
// Charities and not-for-profits are grouped under "not-for-profit".
export function orgCategory(typeOfOrg: string): OrgCategory | null {
  const t = typeOfOrg.trim().toLowerCase();
  if (!t) return null;
  if (t === 'for-profit') return 'for-profit';
  if (t === 'charity' || t === 'not-for-profit') return 'not-for-profit';
  if (t === 'public sector') return 'public-sector';
  return null;
}

// Returns the label to show as a tag, or null if it should be hidden
// (For-profit is intentionally not displayed). Charities display as
// "Non-profit". Unknown non-empty types fall back to their raw value.
export function orgTypeDisplay(typeOfOrg: string): string | null {
  const cat = orgCategory(typeOfOrg);
  if (cat === 'for-profit') return null;
  if (cat === 'not-for-profit') return 'Non-profit';
  if (cat === 'public-sector') return 'Public sector';
  const t = typeOfOrg.trim();
  return t || null;
}
