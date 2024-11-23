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
        <p>While Silicon Valley is focused on AI, VR, SAAS, crypto, fin-tech, and ad-tech, many people in the real world are trying to tackle the hardest, thorniest problems.</p>
        <p>Programmers and designers know these issues matter but they wring their hands and stand by, unsure how to have any positive impact… choosing to focus on making big money and working on trendy new technologies.</p>
        <p>It’s time to refocus the tech world on what matters most. It’s time to build new relations between doctors, environmentalists, scientists, not-for-profit leaders, public servants, and others tackling the world’s hardest problems with technologists who can help make practical tools to help solve them.</p>
        <p>We are a multi-skilled team of very experienced tech veterans and other subject-matter experts. We aim to push this effort &#8212; whether it’s by building teams to work on issues, creating bridges between ambitious experts and technologists, finding ways to fund tech initiatives, or inspiring a generation of tech people to work on these fundamentally important problems.</p>
        <p>We are in the earliest stages of forming the Hard Problems non-profit. We don’t have all of the answers, but we’ll start anyhow and learn along the way.</p>

        <h3 className="space-top-large">What we offer</h3>
        <div className="grid-layout">

          <Link href="/events" className="grid-cell">
              <Image src="/images/icon-clap.svg" width="120" height="120" alt="Illustration of hands in a heart shape." />
              <b className="grid-link">Events</b>
              <p className="grid-detail">Online and in London</p>
              <p>Speakers who work on hard problems share their knowledge.</p>
          </Link>

          <Link href="/newsletter" className="grid-cell">
              <Image src="/images/icon-mailbox.svg" width="120" height="120" alt="Mailbox" />
              <b className="grid-link">Email newsletter</b>
              <p className="grid-detail">Sign up today</p>
              <p>News, job opportunities, and events from around the world.</p>
          </Link>

          <Link href="/podcast" className="grid-cell">
              <Image src="/images/icon-mic.svg" width="120" height="120" alt="Mic" />
              <b className="grid-link">Podcast</b>
              <p className="grid-detail">Coming soon...</p>
              <p>Interview tech people who work on hard problems.</p>
          </Link>

          <Link href="/coworking" className="grid-cell">
              <Image src="/images/icon-lamp.svg" width="120" height="120" alt="Work lamp." />
              <b className="grid-link">Co-working space</b>
              <p className="grid-detail">Apply for a desk in London</p>
              <p>A space for people who work on hard problems to work and collaborate.</p>
          </Link>

          <div className="grid-cell">
              <Image src="/images/icon-peace.svg" width="120" height="120" alt="Hand peace." />
              <span className="disabled grid-link"><b>Job board</b></span>
              <p className="grid-detail">Coming soon...</p>
              <p>For engineers, designers, PMs, UX researchers, and others.</p>
          </div>

          <div className="grid-cell">
              <Image src="/images/icon-conversation.svg" width="120" height="120" alt="Conversation" />
              <span className="disabled grid-link"><b>Online community</b></span>
              <p className="grid-detail">Coming soon...</p>
              <p>A place to connect with others in your technical field.</p>
          </div>

          <div className="grid-cell">
              <Image src="/images/icon-idea.svg" width="120" height="120" alt="Idea bulb" />
              <span className="disabled grid-link"><b>3-month workshops</b></span>
              <p className="grid-detail">In the future...</p>
              <p>Cohorts of tech people with experts to prototype and start on the path to success.</p>
          </div>

          <div className="grid-cell">
              <Image src="/images/icon-lego.svg" width="120" height="120" alt="Lego bricks" />
              <span className="disabled grid-link"><b>TBD</b></span>
              <p className="grid-detail">In the future...</p>
              <p>We are just getting started and will adapt as we learn what people need.</p>
          </div>
        </div>
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
          We are an all-volunteer team from around the world. Hard Problems is a global non-profit with a home
          base in London.
        </p>
        <Team />
      </section>
      <Footer />
    </>
  );
}
