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

  return (
    <div className="footer-intro">
      <div className="footer-intro-inner">
        <h3>What is Hard Problems?</h3>
        <p>
          Hard Problems is a nonprofit that helps designers to make the
          shift to working full-time on the world&rsquo;s hard problems
          &mdash; problems like climate change and public health.
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
