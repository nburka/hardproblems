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
  // When true, the link is hidden at the desktop breakpoint. Used for
  // items whose destination is already accessible another way on
  // desktop (e.g. the newsletter, reachable via the header subscribe
  // form).
  hideOnDesktop?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: '/jobs', short: 'Jobs', long: 'Job board' },
  { href: '/podcast', short: 'Podcast', long: 'Podcast' },
  { href: '/newsletter', short: 'News', long: 'Newsletter', hideOnDesktop: true },
  { href: '/about', short: 'About', long: 'About us' }
];

export default function TopBar() {
  const pathname = usePathname();
  return (
    <nav className="site-nav-bar">
      {NAV_ITEMS.map((item) => {
        const isActive = item.matches
          ? item.matches(pathname)
          : pathname === item.href;
        const classes = ['link'];
        if (isActive) classes.push('active');
        if (item.hideOnDesktop) classes.push('nav-hide-desktop');
        return (
          <Link
            key={item.href}
            href={item.href}
            className={classes.join(' ')}
          >
            <span className="nav-label-short">{item.short}</span>
            <span className="nav-label-long">{item.long}</span>
          </Link>
        );
      })}
    </nav>
  );
}
