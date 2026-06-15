import Link from 'next/link';
import type { Metadata } from 'next';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'Page not found — Hard Problems',
  description:
    'The page you were looking for doesn’t exist. Head back to the homepage or browse the rest of Hard Problems.'
};

export default function NotFound() {
  return (
    <>
      <section className="left">
        <h2>Page not found</h2>
        <p className="intro">
          Sorry — the page you were looking for doesn’t exist, or it
          moved.
        </p>
        <p>
          <Link href="/" className="button">
            Back to the homepage
          </Link>
        </p>
      </section>
      <section className="right">
        <h3>Did we break a link?</h3>
        <p>
          If you got here from a link on our own site, please tell us so
          we can fix it. Email{' '}
          <em>contact@hardproblems.com</em>
        </p>

        <h3 className="divider">Hard Problems</h3>
        <p>
          A nonprofit helping designers to work on the hard problems
          that matter in the world: problems like{' '}
          <em className="highlight">public health</em>,{' '}
          <em className="highlight">climate change</em>, and{' '}
          <em className="highlight">good government</em>.
        </p>
      </section>
      <Footer />
    </>
  );
}
