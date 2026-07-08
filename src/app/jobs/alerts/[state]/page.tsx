import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Small confirmation pages the confirm / unsubscribe API routes
// redirect to. Three states, each a single card:
//   /jobs/alerts/ok            → subscription confirmed
//   /jobs/alerts/unsubscribed  → unsubscribed successfully
//   /jobs/alerts/invalid       → token missing or expired

type Params = { params: Promise<{ state: string }> };

const COPY: Record<
  string,
  { title: string; body: string; icon: string }
> = {
  ok: {
    title: 'You are now subscribed',
    body: 'You’ll get a daily digest with any new jobs matching your saved filters. If there are no new jobs, you will not receive an email. You can unsubscribe at any time via the link at the bottom of every email.',
    icon: '/images/icon-peace.svg'
  },
  unsubscribed: {
    title: 'You’ve been unsubscribed',
    body: 'You won’t receive any more job-alert emails from Hard Problems. You can always sign up again from the job board.',
    icon: '/images/icon-email.svg'
  },
  invalid: {
    title: 'That link didn’t work',
    body: 'This confirmation or unsubscribe link is missing or has already been used. If you meant to subscribe, please try again from the job board.',
    icon: '/images/illustration-connection.svg'
  }
};

export const dynamic = 'force-static';

export function generateStaticParams() {
  return Object.keys(COPY).map((state) => ({ state }));
}

export async function generateMetadata({
  params
}: Params): Promise<Metadata> {
  const { state } = await params;
  const copy = COPY[state];
  return {
    title: copy?.title ?? 'Job alerts',
    // Prevent Google indexing these tokens-adjacent status pages.
    robots: { index: false, follow: false }
  };
}

export default async function Page({ params }: Params) {
  const { state } = await params;
  const copy = COPY[state];
  if (!copy) notFound();

  return (
    <section className="page-narrow" style={{ textAlign: 'center' }}>
      <Image
        src={copy.icon}
        alt=""
        width={160}
        height={160}
        style={{ display: 'inline-block', marginBottom: '1rem' }}
      />
      <p className="page-lede" style={{ marginBottom: '1rem' }}>
        {copy.title}
      </p>
      <p>{copy.body}</p>
      <p>
        <Link href="/jobs" className="black-button">
          Back to the job board <span aria-hidden="true">→</span>
        </Link>
      </p>
    </section>
  );
}
