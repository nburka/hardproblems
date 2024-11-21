import Link from 'next/link';

export function Footer() {
  return (
    <>
      <section className="left">

        <h3>Office</h3>
        <p>We have an office in the Shoreditch neighborhood of London which has a <Link href="/coworking">co-working space</Link> for people who work on hard problems: <Link href="https://maps.app.goo.gl/8SYY1vdDDcwwqGJy7">1 Rivington Pl, London EC2A 3BA</Link></p>

        <h3 className="space-top-small">Code of conduct &amp; privacy</h3>
        <p>Our online and in-person events and co-working space follow <Link href="/conduct">our code of conduct</Link>. Also see our <Link href="/privacy">privacy notice</Link> for how we handle personal information.</p>

        <h3 className="space-top-small">Contact</h3>
        <p>Email: contact@hardproblems.com</p>
      </section>
      <section className="right">
        <h3>Legal</h3>
        <p>&copy; Copyright {new Date().getFullYear()} Hard Problems</p>
        <p>
          Hard Problems is a non-profit Company Limited by Guarantee registered
          with{' '}
          <Link href="https://find-and-update.company-information.service.gov.uk/company/16028166">
            Companies House
          </Link>{' '}
          in the UK in 2024.
        </p>
      </section>
    </>
  );
}
