'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

// Mission-statement section rendered at the bottom of every page (above
// the main footer columns) — except on /about, where it would be
// redundant with that page's own content.
export default function FooterIntro() {
  const pathname = usePathname();
  if (pathname === '/about') return null;
  // Job-alert status pages (/jobs/alerts/ok, unsubscribed, invalid) are
  // small confirmation screens — the mission blurb would drown them out.
  if (pathname?.startsWith('/jobs/alerts/')) return null;

  return (
    <div className="footer-intro">
      <div className="footer-intro-inner">
        <h3>What is Hard Problems?</h3>
        <p>
          We are a nonprofit that helps designers find meaningful
          full-time work on the world&rsquo;s hardest problems &mdash; like
          climate change and public health.
        </p>
        <p>
          <Link href="/about" className="black-button">
            About us
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </p>
      </div>
    </div>
  );
}
