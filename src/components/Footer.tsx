import Link from 'next/link';
import Image from 'next/image';

// Inline SVGs so the icons inherit the footer link colour (currentColor)
// on both the default and hover states.
function BuildingIcon() {
  return (
    <svg
      className="footer-contact-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16" />
      <path d="M15 9h4a1 1 0 0 1 1 1v11" />
      <path d="M2 21h20" />
      <path d="M7 8h2" />
      <path d="M7 12h2" />
      <path d="M7 16h2" />
      <path d="M11 8h0" />
      <path d="M11 12h0" />
      <path d="M11 16h0" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      className="footer-contact-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 6 9 6 9-6" />
    </svg>
  );
}

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

function DocumentIcon() {
  return (
    <svg
      className="footer-contact-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      className="footer-contact-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20.5 4.3 12.8a4.6 4.6 0 0 1 6.5-6.5l1.2 1.2 1.2-1.2a4.6 4.6 0 0 1 6.5 6.5z" />
    </svg>
  );
}

function CopyrightIcon() {
  return (
    <svg
      className="footer-contact-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M14.8 9.6a3.5 3.5 0 1 0 0 4.8" />
    </svg>
  );
}

export function Footer() {
  return (
    <div className="footer-grid">
      <div className="footer-col">
        <h3>Contact</h3>
        <p>
          <Link href="https://maps.app.goo.gl/8SYY1vdDDcwwqGJy7" className="footer-contact-link">
            <BuildingIcon />
            1 Rivington Place, London EC2A 3BA
          </Link>
        </p>
        <p>
          <Link href="mailto:contact@hardproblems.com" className="footer-contact-link">
            <MailIcon />
            contact@hardproblems.com
          </Link>
        </p>
        <p>
          <Link href="https://www.linkedin.com/company/hardproblems/" className="footer-contact-link">
            <LinkedInIcon />
            LinkedIn
          </Link>
        </p>
        <p>
          <Link href="https://bsky.app/profile/hardproblems.com" className="footer-contact-link">
            <BlueskyIcon />
            Bluesky
          </Link>
        </p>
      </div>
      <div className="footer-col">
        <h3>Registration</h3>
        <p>
          Hard Problems is a nonprofit Company Limited by Guarantee registered
          with{' '}
          <Link href="https://find-and-update.company-information.service.gov.uk/company/16028166">
            Companies House
          </Link>{' '}
          in the UK in 2024.
        </p>
        <Image
          src="/images/uk-government.svg"
          width="77"
          height="77"
          alt="UK Government Logo"
          style={{ opacity: 0.5 }}
        />
      </div>
      <div className="footer-col">
        <h3>Legal &amp; code of conduct</h3>
        <p>
          <Link href="/conduct" className="footer-contact-link">
            <HeartIcon />
            Code of conduct
          </Link>
        </p>
        <p>
          <Link href="/privacy" className="footer-contact-link">
            <DocumentIcon />
            Privacy notice
          </Link>
        </p>
        <p className="footer-contact-link">
          <CopyrightIcon />
          Copyright {new Date().getFullYear()} Hard Problems
        </p>
      </div>
    </div>
  );
}
