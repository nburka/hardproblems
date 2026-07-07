'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, House } from 'lucide-react';

// "← 🏠" link in the top-left of the site header. Hidden on the
// homepage itself (where it would just point at the current page),
// but we still render an empty placeholder span so the header's
// `1fr auto 1fr` grid keeps the logo centered.
export default function SiteHeaderHome() {
  const pathname = usePathname();
  if (pathname === '/') {
    return <span className="site-header-home" aria-hidden="true" />;
  }

  return (
    <Link
      href="/"
      className="site-header-home"
      title="Go to the Hard Problems homepage"
    >
      <ArrowLeft className="site-header-home-icon" aria-hidden="true" />
      <House className="site-header-home-icon" aria-hidden="true" />
      <span className="sr-only">Go to the Hard Problems homepage</span>
    </Link>
  );
}
