'use client';

import { useState } from 'react';
import styles from './page.module.scss';

// Deterministic hue in 0..359 derived from the name so a given company
// always renders the same avatar colour.
function hueFromName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) % 360;
  }
  return h;
}

// Renders a company icon inside the outer `.jobIcon` circle. Tries the
// favicon URL first; on load error (or when no URL is available at all)
// falls back to a coloured letter avatar built from the company name.
export default function CompanyIcon({
  faviconUrl,
  companyName,
  hasCompanyLink
}: {
  faviconUrl: string | null;
  companyName: string;
  // Purely for the alt text — the wrapping <Link> already labels the
  // element for screen readers, so a non-linked icon uses `alt=""`.
  hasCompanyLink: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const showLetter = !faviconUrl || failed;

  if (showLetter) {
    const trimmed = companyName.trim();
    const letter = (trimmed.charAt(0) || '?').toUpperCase();
    const hue = hueFromName(trimmed || '?');
    return (
      <span
        className={styles.companyLetter}
        style={{ background: `hsl(${hue}, 42%, 55%)` }}
        aria-hidden="true"
      >
        {letter}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={faviconUrl}
      alt={
        hasCompanyLink
          ? companyName
            ? `Icon of ${companyName}`
            : 'Company icon'
          : ''
      }
      width={16}
      height={16}
      className={styles.companyFavicon}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
