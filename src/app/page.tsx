import Link from 'next/link';
import NewsletterForm from '../components/NewsletterForm';
import Image from 'next/image';
import { Footer } from '../components/Footer';
import { Team } from '../components/Team';

export default function Home() {
  return (
    <>
      <section className="left">
        <div className="illustration-home">
          <Image src="/images/illustration-directions.svg" width="80" height="80" alt="Illustration of a person considering which way their career might take." />
        </div>
        <h3>The challenge</h3>
        <blockquote>
          “The best minds of my generation are thinking about how to make people
          click ads. That sucks.” &#8212; Jeff Hammerbacher, 2011
        </blockquote>
        <h3>Our mission</h3>
        <p>
          We are a non-profit that helps tech people to work on the hard problems that matter in the
          world: problems like <em>public health</em>, <em>climate change</em>, and <em>good government</em>.
        </p>
        <p>While Silicon Valley is focused on AI, VR, crypto, SAAS, fin-tech, and ad-tech, many people in the real world are trying to tackle the hardest, thorniest problems.</p>
        <p>Programmers and designers know these issues matter but they wring their hands and stand by, unsure how to have any positive impact… choosing to focus on making big money and working on trendy new technologies.</p>
        <p>It’s time to refocus the tech world on what matters most. It’s time to build new relations between doctors, environmentalists, scientists, not-for-profit leaders, public servants, and others tackling the world’s hardest problems with technologists who can help make practical tools to help solve them.</p>
        <p>We are a multi-skilled team of very experienced tech veterans and other subject-matter experts. We aim to push this effort &#8212; whether it’s by building teams to work on issues, creating bridges between ambitious experts and technologists, finding ways to fund tech initiatives, or inspiring a generation of tech people to work on these fundamentally important problems.</p>
        <p>We are in the earliest stages of forming the Hard Problems non-profit. We don’t have all of the answers, but we’ll start anyhow and learn along the way.</p>
      </section>
      <section className="right">
        <h3>Get involved</h3>
        <ol>
          <li>
            <p className="no-margin"><b>Subscribe to our newsletter.</b><br />We share job opportunities, great books, relevant news, and events.</p>
            <NewsletterForm />
          </li>
          <li>
            <b>
              Suggest podcast guests.
            </b>{' '}
            We are going to interview people who already work on hard problems.{' '}
            <Link href="/podcast">Suggest a future guest?</Link>
          </li>
          <li>
            <b>Give financially.</b> Want to
            discuss how you can contribute to Hard Problems? <Link href="/give">Get in touch.</Link>
          </li>
        </ol>

        <h3 className="divider">Team</h3>
        <p>
          We are an all-volunteer team. We are a global non-profit with a home
          base in London.
        </p>
        <Team />
      </section>
      <Footer />
    </>
  );
}
