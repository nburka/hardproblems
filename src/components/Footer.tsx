import Link from 'next/link';

export function Footer() {
  return (
    <>
      <h3>Legal</h3>
      <p>
        Hard Problems is a non-profit Company Limited by Guarantee registered
        with{' '}
        <Link href="https://find-and-update.company-information.service.gov.uk/company/16028166">
          Companies House
        </Link>{' '}
        in the UK in 2024.
      </p>
      <p>&copy; Copyright {new Date().getFullYear()} Hard Problems</p>
    </>
  );
}
