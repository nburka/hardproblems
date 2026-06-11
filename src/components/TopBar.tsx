'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import styles from './TopBar.module.scss';

export default function TopBar() {
  const pathname = usePathname();
  return (
    <nav>
      <Link
        href="/about"
        className={`link ${pathname === '/about' ? 'active' : ''}`}
      >
        About
      </Link>
      <Link
        href="/jobs"
        className={`link ${pathname === '/jobs' ? 'active' : ''}`}
      >
        Job board
      </Link>
      {/* Temporarily hidden from the main nav while the Articles section
          is in active development. Restore when ready to launch. */}
      {/* <Link
        href="/articles"
        className={`link ${
          pathname.startsWith('/articles') ? 'active' : ''
        }`}
      >
        Articles
      </Link> */}
      <Link
        href="/podcast"
        className={`link ${pathname === '/podcast' ? 'active' : ''}`}
      >
        Podcast
      </Link>
      <Link
        href="/newsletter"
        className={`link ${pathname === '/newsletter' ? 'active' : ''}`}
      >
        Newsletter
      </Link>
    </nav>
  );
}
