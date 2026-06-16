import Link from 'next/link';
import Image from 'next/image';
import { Team } from '../../components/Team';

export default function Page() {
  return (
    <>
      <section className="left">
        <h2>About</h2>
        <p className="intro">
          Hard Problems is a nonprofit that helps tech people to make the shift to
          working full-time on the world’s hard problems &#8212; problems like climate
          change and public health.
        </p>

        <div className="illustration-home">
          <Image
            src="/images/illustration-directions.svg"
            width="80"
            height="80"
            alt="Illustration of a person considering which way their career might take."
          />
        </div>
        <h3>The challenge</h3>
        <p>
          “The best minds of my generation are thinking about how to make people
          click ads. That sucks.” &#8212; Jeff Hammerbacher, 2011
        </p>
        <h3>Our mission</h3>
        <p>
          While the loudest part of the tech world is focused on AI, crypto,
          fin-tech, and advertising, other people are trying to tackle the
          hardest, thorniest problems.
        </p>
        <p>
          Designers, product managers, user researchers, copywriters, and others
          know that these hard problems matter but they often wring their hands
          and stand by, unsure how to have any positive impact.
        </p>
        <p>
          It’s time to refocus the tech world on what matters most. It’s time to
          build new relationships between doctors, environmentalists,
          scientists, not-for-profit leaders, public servants, and others
          tackling the world’s hardest problems with designers who can help make
          practical tools to help them succeed.
        </p>
        <p>
          We are a multi-skilled team of very experienced tech veterans and
          other subject-matter experts. We aim to push this effort &#8212;
          whether it’s by building teams to work on issues, creating bridges
          between ambitious experts and designers, finding ways to fund tech
          initiatives, or inspiring a generation of designers to work on these
          fundamentally important problems.
        </p>
        <p>
          We are in the earliest stages of forming the Hard Problems nonprofit.
          We don’t have all of the answers, but we’ll start anyhow and learn
          along the way.
        </p>

        <Image src="/images/illustration-bridge.svg" width="80" height="80" alt="Illustration of two hands shaking. One is a designer and the other is a environmentalist, doctor, epidemiologist
        climatologist who is working on hard problems " className="image-full space-top-large" />

        <div className="captions desktop">
          <p className="caption-right">
            <b>Environmentalists</b>, <b>doctors</b>, <b>epidemiologists</b>, & others working on hard problems
          </p>
          <p className="caption-left">
            <b>Designers</b> who want to work on hard problems
          </p>
        </div>

        <p className="space-top-large">
          Many of the world’s smartest and most dedicated teams tackling hard
          problems struggle to get help from (or hire) experienced designers
          who are integral to designing and implementing important solutions.
          The technical part of problem solving, which we refer to simply as
          tech, is seen as an “add-on” to be hired out at the end of research
          and planning when it’s much more effective to integrate tech into
          problem-solving from the start.
        </p>
        <p>
          At the same time, most designers don’t think it’s a viable career
          move to work full-time on hard problems and decide to focus on
          “prestigious” Silicon Valley career paths instead. Even if they do
          want to transition to working on something meaningful, they can’t see
          where they might have an impact.
        </p>
        <p>
          We aim to solve this divide by bridging the gap and championing the
          importance of practical tech for good.
        </p>

        <h3 className="space-top-large">We plan to</h3>
        <ul>
          <li>
            <b>Foster a community and build bridges.</b> Tie into existing communities and create a bridge
            between the experts who are working on the world’s hard problems and tech
            people who can help them.
            <div className="tags">
              <span className="tag">Email newsletter</span>
              <span className="tag">Job board</span>
              <span className="tag">Podcast</span>
              <span className="tag">Slack community</span>
            </div>
          </li>
          <li>
            <b>Help teams to set themselves up for success.</b> Once teams are formed,
            there are many challenges to successfully getting off the ground. We
            will show, from our experience, how to form functional teams, move
            quickly to validate ideas, and how to deploy software in
            new and challenging environments.
            <div className="tags">
              <span className="tag">Job board</span>
              <span className="tag">Cohort-based workshops</span>
              <span className="tag">Org development consulting</span>
              <span className="tag">Mentorship program</span>
            </div>
          </li>
          <li>
            <b>Encourage long-term solutions.</b> The tech world is notorious for
            focusing on short-term thinking around shiny new technologies. Hard
            problems are, pretty much by definition, multi-decade problems
            without ‘silver bullet’ tech solutions. Also, none of the truly hard
            challenges are going to be <i>solved</i> by technology &#8212; tech will
            be one part of a broader effort. These are cultural values in
            tech that needs to be shifted.
            <div className="tags">
              <span className="tag">Podcast</span>
              <span className="tag">Cohort-based workshops</span>
              <span className="tag">TBD...</span>
            </div>
          </li>
        </ul>
        <h3 className="space-top-large">What success looks like</h3>
        <p>
          Thinking of this in terms of KPIs, we’d first think of measuring: the
          number of people we help make the leap from the traditional tech world
          to organizations that work on the world’s hard problems. In the
          broader sense, our goals are to change the culture of tech to value
          people who work on hard problems.
        </p>
        <Image src="/images/illustration-yes-hands.svg" width="80" height="80" alt="Hands saying YES!" className="image-full" />
      </section>
      <section className="right">
        <h3>What we offer</h3>
        <div className="offer-stack">
          <Link href="/jobs" className="grid-cell">
            <Image
              src="/images/icon-piggy-bank.svg"
              width="120"
              height="120"
              alt="Illustration of a piggy bank."
            />
            <b className="grid-link">Job board</b>
            <p className="grid-detail">Find your next full-time role</p>
            <p>Job listings from orgs working on climate change and health.</p>
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
            <p>Interview designers who work on hard problems.</p>
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
        <h3 className="divider">Funding</h3>
        <p>
          We are a lean organization that is primarily self-funded by our founding team. But, we could use help. Learn how you could <Link href="/give">support our work</Link>.
        </p>

        <h3 className="divider">Team</h3>
        <p>
          We are an all-volunteer team from around the world.
        </p>
        <Team />
      </section>
    </>
  );
}
