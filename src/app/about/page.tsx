import Link from 'next/link';
import Image from 'next/image';
import { Footer } from '../../components/Footer';
import { Map } from '../../components/Map';
import { Team } from '../../components/Team';

export default function Page() {
  return (
    <>
      <section className="left">
        <h2>About</h2>
        <p className="intro">
          Hard Problems is a non-profit that helps tech people to make the shift to
          working full-time on the world’s hard problems &#8212; problems like climate
          change and public health.
        </p>
        <p>
          Many of the world’s smartest and most dedicated teams tackling hard
          problems struggle to get help from (or hire) experienced technologists
          who are integral to designing and implementing important solutions.
          The technical part of problem solving, which we refer to simply as
          tech, is seen as an “add-on” to be hired out at the end of research
          and planning when it’s much more effective to integrate tech into
          problem-solving from the start.
        </p>
        <p>
          At the same time, most tech people don’t think it’s a viable career
          move to work full-time on hard problems and decide to focus on
          “prestigious” Silicon Valley career paths instead. Even if they do
          want to transition to working on something meaningful, they can’t see
          where they might have an impact.
        </p>
        <p>
          We aim to solve this divide by bridging the gap and championing the
          importance of practical tech for good.
        </p>

        <Image src="/images/illustration-bridge.svg" width="80" height="80" alt="Illustration of two hands shaking. One is a technologist and the other is a environmentalist, doctor, epidemiologist
        climatologist who is working on hard problems " className="image-full space-top-small" />

        <h3 className="space-top-large">We plan to</h3>
        <ul>
          <li>
            <b>Help teams to set themselves up for success.</b> Once teams are formed,
            there are many challenges to successfully getting off the ground. We
            will show, from our experience, how to form functional teams, move
            quickly to validate ideas, and how to deploy software in
            new/challenging environments.
          </li>
          <li>
            <b>Encourage long-term solutions.</b> The tech world is notorious for
            focusing on short-term thinking around shiny new technologies. Hard
            problems are, pretty much by definition, multi-decade problems
            without ‘silver bullet’ tech solutions. This is a cultural value in
            tech that needs to be shifted.
          </li>
          <li>
            <b>Develop sustainable funding models.</b> This itself is a hard problem.
            Capitalism is obviously the crux of many of these challenges – tech
            people can make big money working on other challenges, and most
            teams working on hard problems are chronically underfunded.
            Ultimately, we will need to address this. We believe the solution is
            unlikely to be impact investing, which intends to generate a
            measurable, beneficial social or environmental impact alongside a
            financial return.
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
      </section>
      <section className="right">
        <h3>What do we do</h3>
        <ul>
          <li>
            <Link href="/coworking"><b>Co-working space in London</b></Link>
          </li>
          <li>
            <Link href="/events"><b>Events in London and online</b></Link>
          </li>
          <li>
            <Link href="/newsletter"><b>Email newsletter</b></Link>
          </li>
          <li>
            <Link href="/podcast"><b>Podcast</b></Link> (soon...)
          </li>
          <li><span className="disabled"><b>Job board</b> (soon...)</span></li>
          <li><span className="disabled"><b>Online community</b> (soon...)</span></li>
          <li><span className="disabled"><b>3-month workshops</b> (future...)</span></li>
        </ul>
        <h3 className="divider">Funding</h3>
        <p>
          We are a lean organization that is primarily self-funded. But, we could use help. Learn how you could <Link href="/give">support our work</Link>.
        </p>

        <h3 className="divider">Team</h3>
        <p>
          We are an all-volunteer team.
        </p>
        <Team />
      </section>
      <section className="left">
        <Map />
      </section>
      <section className="right">
        <Footer />
      </section>
    </>
  );
}
