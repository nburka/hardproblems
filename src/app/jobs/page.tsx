import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '../../components/Footer';
import JobsList from './JobsList';
import { fetchJobs } from './fetchJobs';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Jobs board for designers who want to work on hard problems'
};

export default async function Page() {
  const jobs = await fetchJobs();

  return (
    <>
      <section className={styles.board}>
        <h2>Jobs board</h2>
        <p className="intro">
          Jobs for designers who want to work on hard problems like healthcare,
          public health, and climate change. Our favorite job sources are{' '}
          <Link href="https://linkedin.come">LinkedIn</Link>,{' '}
          <Link href="https://designgigsforgood.org">Design Gigs for Good</Link>
          , <Link href="https://techjobsforgood.com">Tech Jobs for Good</Link>,{' '}
          <Link href="https://climatebase.org">Climate Base</Link>,{' '}
          <Link href="https://digitalrights.community/job-board">
            Digital Rights
          </Link>
          , and{' '}
          <Link href="https://jobs.womenintech.co.uk/jobs/">
            Women in Tech
          </Link>
          .
        </p>

        {jobs.length === 0 ? (
          <p>
            We&rsquo;re having trouble loading the job board right now. Please
            check back soon.
          </p>
        ) : (
          // Suspense is required because JobsList reads useSearchParams.
          // Without it Next.js would deopt the route from static rendering.
          <Suspense fallback={null}>
            <JobsList jobs={jobs} />
          </Suspense>
        )}
      </section>
      <Footer />
    </>
  );
}
