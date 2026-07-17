import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import NotFoundTracker from '../components/NotFoundTracker';

export const metadata: Metadata = {
  title: 'Page not found — Hard Problems',
  description:
    'The page you were looking for doesn’t exist. Head back to the homepage or browse the rest of Hard Problems.'
};

export default function NotFound() {
  return (
    <>
      <NotFoundTracker />
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
        <Image
          src="/images/illustration-connection.svg"
          width="360"
          height="360"
          alt=""
          style={{
            display: 'block',
            margin: '2rem auto 0',
            width: '360px',
            maxWidth: '100%',
            height: 'auto'
          }}
        />

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
