export type OrgCategory = 'for-profit' | 'nonprofit' | 'public-sector';

export const ORG_TYPE_OPTIONS: { value: OrgCategory; label: string }[] = [
  { value: 'for-profit', label: 'Company' },
  { value: 'nonprofit', label: 'Nonprofit' },
  { value: 'public-sector', label: 'Public sector' }
];

// Maps a raw "Type of org" value from the sheet to a canonical category.
// Charities and nonprofits are grouped under "nonprofit".
export function orgCategory(typeOfOrg: string): OrgCategory | null {
  const t = typeOfOrg.trim().toLowerCase();
  if (!t) return null;
  if (t === 'for-profit') return 'for-profit';
  if (
    t === 'charity' ||
    t === 'not-for-profit' ||
    t === 'nonprofit' ||
    t === 'non-profit' ||
    t === 'non profit'
  )
    return 'nonprofit';
  if (t === 'public sector') return 'public-sector';
  return null;
}

// Returns the label to show as a tag, or null if it should be hidden
// (For-profit is intentionally not displayed). Charities display as
// "Nonprofit". Unknown non-empty types fall back to their raw value.
export function orgTypeDisplay(typeOfOrg: string): string | null {
  const cat = orgCategory(typeOfOrg);
  if (cat === 'for-profit') return null;
  if (cat === 'nonprofit') return 'Nonprofit';
  if (cat === 'public-sector') return 'Public sector';
  const t = typeOfOrg.trim();
  return t || null;
}
