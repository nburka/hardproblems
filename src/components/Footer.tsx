import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <>
      <section className="left footer">
        <div className="columns-2">
          <div className="column">
            <h3>Contact</h3>
            <p><Link href="https://maps.app.goo.gl/8SYY1vdDDcwwqGJy7">1 Rivington Pl, London EC2A 3BA</Link></p>
            <p><Link href="mailto:contact@hardproblems.com">contact@hardproblems.com</Link></p>
          </div>
          <div className="column">
            <Image src="/images/uk-government.svg" width="110" height="110" alt="UK Government Logo" className="float-right" />
            <h3>Registration</h3>
            <p>
              Hard Problems is a non-profit Company Limited by Guarantee registered
              with{' '}
              <Link href="https://find-and-update.company-information.service.gov.uk/company/16028166">
                Companies House
              </Link>{' '}
              in the UK in 2024.
            </p>
          </div>
        </div>
      </section>
      <section className="right footer">
        <h3>Legal &amp; Code of conduct</h3>
        <p><Link href="/conduct">Code of conduct</Link></p>
        <p><Link href="/privacy">Privacy notice</Link></p>
        <p>&copy; Copyright {new Date().getFullYear()} Hard Problems</p>
      </section>
    </>
  );
}
