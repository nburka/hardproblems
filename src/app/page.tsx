import Link from 'next/link';
import { Footer } from '../components/Footer';
import NewsletterForm from '../components/NewsletterForm';
import { Map } from '../components/Map';
import { Team } from '../components/Team';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <section className="left">
        <div className="illustration-home">
          <Image src="/images/illustration-directions.svg" width="80" height="80" alt="" />
        </div>
        <h3>The challenge</h3>
        <blockquote>
          “The best minds of my generation are thinking about how to make people
          click ads. That sucks.” &#8212; Jeff Hammerbacher, 2011
        </blockquote>
        <h3>Our mission</h3>
        <p>
          Helping tech people to work on the hard problems that matter in the
          world: problems like <em>public health</em>, <em>climate change</em>,{' '}
          <em>poverty</em>, and <em>good government</em>.
        </p>
        <p>
          While Silicon Valley is focused on AI, VR, new subscription models,
          and, yes, ads, many people in the real world are trying to tackle the
          hard problems of climate change, public health, poverty, and other
          issues that affect us all.
        </p>
        <p>
          Programmers and designers know these issues matter but wring their
          hands and standby, unsure how to have any positive impact... choosing
          to focus on making big money and working on trendy new technologies.
        </p>
        <p>
          It’s time to refocus the tech world on what matters most. It’s time to
          build new relations between doctors, environmentalists, scientists,
          not-for-profit leaders, public servants, and others tackling the
          world’s hardest problems with technologists who can help make
          practical tools to help solve them.
        </p>
        <p>
          Made up of a multi-skilled team of very experienced tech veterans and
          other subject-matter experts. Hard Problems is taking the lead in this
          effort - whether it’s building teams to work on issues, solving
          problems with robust long-term solutions, finding ways to fund tech
          initiatives, and inspiring a new generation of tech workers to
          champion the work on these fundamentally important problems.
        </p>
        <p>
          We are in the earliest stages of forming Hard Problems. We don’t have
          all of the answers, but we’ll start anyhow and learn along the way.
        </p>
      </section>
      <section className="right">
        <h3>Get involved</h3>
        <ol>
          <li>
            <b>Subscribe</b> to our new monthly newsletter
            <NewsletterForm />
          </li>
          <li>
            <b>
              Suggest <Link href="/podcast">podcast guests</Link>.
            </b>{' '}
            We are going to interview people who already work on hard problems.{' '}
            <a href="#">Suggest a future guest?</a>
          </li>
          <li>
            <b>Give financially.</b> <Link href="/give">Get in touch</Link> to
            discuss how you can contribute to Hard Problems.
          </li>
        </ol>

        <h3 className="divider">Team</h3>
        <p>
          We are an all-volunteer team. We are a global non-profit with a home
          base in London.
        </p>
        <Team />
      </section>
      <section className="left">
        <h3>Office</h3>
        <Map />
      </section>
      <section className="right">
        <Footer />
      </section>
    </>
  );
}
