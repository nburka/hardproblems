'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Each link carries two labels — a short one shown on mobile and a
// longer one shown on desktop. The full-width label switches over at
// the same breakpoint the rest of the site uses (1000px).
type NavItem = {
  href: string;
  short: string;
  long: string;
  matches?: (pathname: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: '/', short: 'Home', long: 'Home' },
  { href: '/jobs', short: 'Jobs', long: 'Job board' },
  { href: '/podcast', short: 'Podcast', long: 'Podcast' },
  { href: '/newsletter', short: 'News', long: 'Newsletter' },
  { href: '/about', short: 'About', long: 'About us' }
];

function HomeIcon() {
  return (
    <svg
      className="nav-home-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12L12 3l9 9" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

export default function TopBar() {
  const pathname = usePathname();
  return (
    <nav className="site-nav-bar">
      {NAV_ITEMS.map((item) => {
        const isActive = item.matches
          ? item.matches(pathname)
          : pathname === item.href;
        const isHome = item.href === '/';
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={isHome ? 'Home' : undefined}
            className={`link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-label-short">
              {isHome ? <HomeIcon /> : item.short}
            </span>
            <span className="nav-label-long">{item.long}</span>
          </Link>
        );
      })}
    </nav>
  );
}
