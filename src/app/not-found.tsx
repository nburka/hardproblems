import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found — Hard Problems',
  description:
    'The page you were looking for doesn’t exist. Head back to the homepage or browse the rest of Hard Problems.'
};

export default function NotFound() {
  return (
    <>
      <section
        style={{
          width: '100%',
          maxWidth: '720px',
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center'
        }}
      >
        <h2>Page not found</h2>
        <p className="intro">
          Sorry, the page you were looking for doesn’t exist, or it
          moved.
        </p>
        <p>
          <Link href="/" className="black-button">
            Back to the homepage <span aria-hidden="true">→</span>
          </Link>
        </p>

        <h3 className="space-top-large">Did we break a link?</h3>
        <p>
          Please tell us so we can fix it.
          <br />
          <em>contact@hardproblems.com</em>
        </p>
      </section>
    </>
  );
}
