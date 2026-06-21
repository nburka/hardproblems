'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// "← Home" link in the top-left of the site header. Hidden on the
// homepage itself (where it would just point at the current page),
// but we still render an empty placeholder span so the header's
// `1fr auto 1fr` grid keeps the logo centered.
export default function SiteHeaderHome() {
  const pathname = usePathname();
  if (pathname === '/') {
    return <span className="site-header-home" aria-hidden="true" />;
  }

  return (
    <Link href="/" className="site-header-home">
      <svg
        className="site-header-home-caret"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
      Home
    </Link>
  );
}
