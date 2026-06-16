import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <div className="footer-grid">
      <div className="footer-col">
        <h3>Contact</h3>
        <p>
          <Link href="https://maps.app.goo.gl/8SYY1vdDDcwwqGJy7">
            1 Rivington Pl, London EC2A 3BA
          </Link>
        </p>
        <p>
          <Link href="mailto:contact@hardproblems.com">
            contact@hardproblems.com
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
        />
      </div>
      <div className="footer-col">
        <h3>Legal &amp; code of conduct</h3>
        <p>
          <Link href="/conduct">Code of conduct</Link>
        </p>
        <p>
          <Link href="/privacy">Privacy notice</Link>
        </p>
        <p>&copy; Copyright {new Date().getFullYear()} Hard Problems</p>
      </div>
    </div>
  );
}
