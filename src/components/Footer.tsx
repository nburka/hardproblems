import Link from 'next/link';
import {
  MapPinned,
  Mail,
  File as FileIcon,
  HandHelping,
  FileHeart,
  Copyright
} from 'lucide-react';
import NewsletterForm from './NewsletterForm';

// Shared props for the small icons that sit before each footer link
// (or in the Notices column). They use currentColor so they inherit
// the dark-green link colour and brighten/darken on hover with the
// text.
const footerIconProps = {
  className: 'footer-contact-icon',
  size: 18,
  strokeWidth: 1.8,
  'aria-hidden': true
} as const;

function LinkedInIcon() {
  return (
    <svg
      className="footer-contact-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4.98 3.5A2.5 2.5 0 1 1 2.5 6 2.5 2.5 0 0 1 4.98 3.5zM3 8.98h4v12.02H3zM9.5 8.98h3.83v1.64h.05a4.2 4.2 0 0 1 3.78-2.08c4.04 0 4.79 2.66 4.79 6.12V21h-4v-5.34c0-1.27-.02-2.91-1.77-2.91-1.78 0-2.05 1.39-2.05 2.82V21h-4z" />
    </svg>
  );
}

function BlueskyIcon() {
  return (
    <svg
      className="footer-contact-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M5.77 3.93C8.32 5.85 11.06 9.74 12 11.83c.94-2.09 3.68-5.98 6.23-7.9C20.07 2.55 23 1.48 23 4.83c0 .67-.38 5.62-.61 6.42-.78 2.8-3.63 3.51-6.17 3.08 4.43.76 5.56 3.26 3.12 5.76-4.62 4.74-6.64-1.19-7.16-2.71-.1-.28-.14-.41-.18-.3-.04-.11-.08.02-.18.3-.52 1.52-2.54 7.45-7.16 2.71-2.44-2.5-1.31-5 3.12-5.76-2.54.43-5.39-.28-6.17-3.08C1.38 10.45 1 5.5 1 4.83c0-3.35 2.93-2.28 4.77-.9z" />
    </svg>
  );
}

export function Footer() {
  return (
    <div className="footer-grid">
      <div className="footer-col">
        <h3>Contact</h3>
        <p>
          <Link
            href="https://maps.app.goo.gl/8SYY1vdDDcwwqGJy7"
            className="footer-contact-link"
          >
            <MapPinned {...footerIconProps} />1 Rivington Place, London EC2A 3BA
          </Link>
        </p>
        <p>
          <Link
            href="mailto:contact@hardproblems.com"
            className="footer-contact-link"
          >
            <Mail {...footerIconProps} />
            contact@hardproblems.com
          </Link>
        </p>
        <p>
          <Link
            href="https://www.linkedin.com/company/hardproblems/"
            className="footer-contact-link"
          >
            <LinkedInIcon />
            LinkedIn
          </Link>
        </p>
        <p>
          <Link
            href="https://bsky.app/profile/hardproblems.com"
            className="footer-contact-link"
          >
            <BlueskyIcon />
            Bluesky
          </Link>
        </p>
      </div>
      <div className="footer-col">
        <h3>We are a nonprofit</h3>
        <p>
          <Link href="/give" className="footer-contact-link">
            <HandHelping {...footerIconProps} />
            Support our work
          </Link>
        </p>
        <p>
          Hard Problems is a nonprofit Company Limited by Guarantee registered
          with{' '}
          <Link href="https://find-and-update.company-information.service.gov.uk/company/16028166">
            Companies House
          </Link>{' '}
          in the UK in 2024.
        </p>
      </div>
      <div className="footer-col">
        <h3>Newsletter</h3>
        <NewsletterForm labelSuffix=" for weekly news and meaningful jobs." />
      </div>
      <div className="footer-col">
        <h3>Notices</h3>
        <p>
          <Link href="/conduct" className="footer-contact-link">
            <FileHeart {...footerIconProps} />
            Code of conduct
          </Link>
        </p>
        <p>
          <Link href="/privacy" className="footer-contact-link">
            <FileIcon {...footerIconProps} />
            Privacy notice
          </Link>
        </p>
        <p>
          <span className="footer-contact-link">
            <Copyright {...footerIconProps} />
            Copyright {new Date().getFullYear()} Hard Problems
          </span>
        </p>
      </div>
    </div>
  );
}
