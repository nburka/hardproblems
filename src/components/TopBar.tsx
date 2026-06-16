'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import styles from './TopBar.module.scss';

export default function TopBar() {
  const pathname = usePathname();
  return (
    <nav>
      <Link
        href="/jobs"
        className={`link ${pathname === '/jobs' ? 'active' : ''}`}
      >
        Job board
      </Link>
      <Link
        href="/podcast"
        className={`link ${pathname === '/podcast' ? 'active' : ''}`}
      >
        Podcast
      </Link>
      <Link
        href="/about"
        className={`link ${pathname === '/about' ? 'active' : ''}`}
      >
        About us
      </Link>
      <Link
        href="/newsletter"
        className={`link nav-newsletter ${
          pathname === '/newsletter' ? 'active' : ''
        }`}
      >
        Newsletter
      </Link>
    </nav>
  );
}
