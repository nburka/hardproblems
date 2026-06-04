import Link from 'next/link';
import NewsletterForm from '../components/NewsletterForm';
import Image from 'next/image';
import { Footer } from '../components/Footer';
import { Team } from '../components/Team';
import { fetchJobs } from './jobs/fetchJobs';
import JobsTeaser from './jobs/JobsTeaser';

export default async function Home() {
  const jobs = await fetchJobs();
  const recentJobs = jobs.slice(0, 5);
  return (
    <>
      <section className="left">
        <div className="illustration-home">
          <Image
            src="/images/illustration-directions.svg"
            width="80"
            height="80"
            alt="Illustration of a person considering which way their career might take."
          />
        </div>
        <h3>The challenge</h3>
        <blockquote>
          “The best minds of my generation are thinking about how to make people
          click ads. That sucks.” &#8212; Jeff Hammerbacher, 2011
        </blockquote>
        <h3>Our mission</h3>
        <p>
          We are a non-profit that helps tech people to work on the hard
          problems that matter in the world: problems like{' '}
          <em>public health</em>, <em>climate change</em>, and{' '}
          <em>good government</em>.
        </p>
        <p>
          While the loudest part of the tech world is focused on AI, VR, crypto,
          fin-tech, and advertising, other people are trying to tackle the
          hardest, thorniest problems.
        </p>
        <p>
          Programmers, designers, and product managers know that these hard
          problems matter but they often wring their hands and stand by, unsure
          how to have any positive impact.
        </p>
        <p>
          It’s time to refocus the tech world on what matters most. It’s time to
          build new relationships between doctors, environmentalists,
          scientists, not-for-profit leaders, public servants, and others
          tackling the world’s hardest problems with technologists who can help
          make practical tools to help them succeed.
        </p>
        <p>
          We are a multi-skilled team of very experienced tech veterans and
          other subject-matter experts. We aim to push this effort &#8212;
          whether it’s by building teams to work on issues, creating bridges
          between ambitious experts and technologists, finding ways to fund tech
          initiatives, or inspiring a generation of tech people to work on these
          fundamentally important problems.
        </p>
        <p>
          We are in the earliest stages of forming the Hard Problems non-profit.
          We don’t have all of the answers, but we’ll start anyhow and learn
          along the way.
        </p>

        <h3 className="space-top-large">What we offer</h3>
        <div className="grid-layout">
          <Link href="/jobs" className="grid-cell">
            <Image
              src="/images/icon-piggy-bank.svg"
              width="120"
              height="120"
              alt="Illustration of a piggy bank."
            />
            <b className="grid-link">Job board</b>
            <p className="grid-detail">Find your next full-time role</p>
            <p>
              Job listings from orgs working on climate change and health.
            </p>
          </Link>

          <Link href="/newsletter" className="grid-cell">
            <Image
              src="/images/icon-mailbox.svg"
              width="120"
              height="120"
              alt="Mailbox"
            />
            <b className="grid-link">Email newsletter</b>
            <p className="grid-detail">Sign up today</p>
            <p>News, job opportunities, and events from around the world.</p>
          </Link>

          <Link href="/podcast" className="grid-cell">
            <Image
              src="/images/icon-mic.svg"
              width="120"
              height="120"
              alt="Mic"
            />
            <b className="grid-link">Podcast</b>
            <p className="grid-detail">Coming soon...</p>
            <p>Interview tech people who work on hard problems.</p>
          </Link>

          <Link href="/coworking" className="grid-cell">
            <Image
              src="/images/icon-lamp.svg"
              width="120"
              height="120"
              alt="Work lamp."
            />
            <b className="grid-link">Co-working space</b>
            <p className="grid-detail">Apply for a desk in London</p>
            <p>A space for people who work on hard problems.</p>
          </Link>
        </div>
      </section>
      <section className="right">
        <h3>Subscribe to our newsletter</h3>
        <p className="no-margin">
          We share job opportunities, great books, relevant news, and
          events.
        </p>
        <NewsletterForm />

        <h3 className="divider">Job board</h3>
        <p>
          Recent listings from our <Link href="/jobs">job board</Link>.
        </p>
        <JobsTeaser jobs={recentJobs} />

        <h3 className="divider">Team</h3>
        <p>
          We are an all-volunteer team from around the world. Hard Problems is a
          global non-profit with a home base in London.
        </p>
        <Team />
      </section>
      <Footer />
    </>
  );
}
