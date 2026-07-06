'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Inline nav clusters that sit to the left and right of the "Hard
// Problems." logo in the desktop header. Hidden on mobile via CSS —
// the standalone TopBar below the header covers navigation there.
type NavItem = { href: string; label: string };

const LEFT_ITEMS: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/jobs', label: 'Job board' },
  { href: '/podcast', label: 'Podcast' }
];

const RIGHT_ITEMS: NavItem[] = [
  { href: '/about', label: 'About us' },
  { href: '/newsletter', label: 'Newsletter' }
];

export default function SiteHeaderNav({
  side
}: {
  side: 'left' | 'right';
}) {
  const pathname = usePathname();
  const items = side === 'left' ? LEFT_ITEMS : RIGHT_ITEMS;
  return (
    <nav className={`site-header-nav site-header-nav--${side}`}>
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={isActive ? 'active' : ''}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
