import Link from 'next/link';
import { Footer } from '../../components/Footer';
import JobsList from './JobsList';
import { fetchJobs } from './fetchJobs';
import styles from './page.module.scss';

export default async function Page() {
  const jobs = await fetchJobs();

  return (
    <>
      <section className={styles.board}>
        <p className={styles.betaNotice}>
          <strong>Beta:</strong> Please contact us if you see any issues with
          the job board.{' '}
          <a href="mailto:contact@hardproblems.com">
            contact@hardproblems.com
          </a>
        </p>
        <h2>Jobs</h2>
        <p className="intro">
          Jobs for designers who want to work on hard problems like healthcare,
          public health, and climate change. Our favorite job sources are{' '}
          <Link href="https://linkedin.come">LinkedIn</Link>,{' '}
          <Link href="https://designgigsforgood.org">Design Gigs for Good</Link>
          , <Link href="https://techjobsforgood.com">Tech Jobs for Good</Link>,{' '}
          <Link href="https://climatebase.org">Climate Base</Link>, and{' '}
          <Link href="https://digitalrights.community/job-board">
            Digital Rights
          </Link>
          .
        </p>

        {jobs.length === 0 ? (
          <p>
            We&rsquo;re having trouble loading the job board right now. Please
            check back soon.
          </p>
        ) : (
          <JobsList jobs={jobs} />
        )}
      </section>
      <Footer />
    </>
  );
}
