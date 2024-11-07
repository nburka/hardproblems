'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import styles from './TopBar.module.scss';

export function TopBar() {
  const pathname = usePathname();
  return (
    <nav>
      <Link href="/" className={`link ${pathname === '/' ? 'active' : ''}`}>
        About
      </Link>
      <Link
        href="/events"
        className={`link ${pathname === '/events' ? 'active' : ''}`}
      >
        Events
      </Link>
      <Link
        href="/podcast"
        className={`link ${pathname === '/podcast' ? 'active' : ''}`}
      >
        Podcast
      </Link>
      <Link
        href="/newsletter"
        className={`link ${pathname === '/' ? 'newsletter' : ''}`}
      >
        Newsletter
      </Link>
      <Link href="/give" className={`link ${pathname === '/' ? 'give' : ''}`}>
        Give
      </Link>
    </nav>
  );
}
