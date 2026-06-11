// Central lookup for author URLs. Articles store just the author's name in
// their frontmatter; this module is the single source of truth for where
// that name links out to. Update here when a contributor changes their
// profile URL and every article they've written picks it up automatically.
const AUTHOR_URLS: Record<string, string> = {
  // Founders — use the same LinkedIn profiles as the homepage <Team /> block.
  'Daniel Burka': 'https://www.linkedin.com/in/dburka/',
  'Elyce Cole': 'https://www.linkedin.com/in/elyce-cole-1380903a/',
  'Mahima Chandak': 'https://www.linkedin.com/in/mahima-chandak/',

  // Other contributors.
  'Kane Lincoln': 'https://kanelincoln.com/'
};

// Returns the canonical URL for a contributor, or `null` if we don't have
// one on file. The page component should render the name as plain text
// when this returns null.
export function getAuthorUrl(name: string | undefined | null): string | null {
  if (!name) return null;
  return AUTHOR_URLS[name.trim()] ?? null;
}
