import Image from 'next/image';
import Link from 'next/link';
import { Footer } from '../../components/Footer';

export default function Page() {
  return (
    <>
      <section className="left">

        <div className="illustration-home">
          <Image src="/images/illustration-podcast.svg" width="80" height="80" alt="Illustration of a person recording a podcast." />
        </div>

        <h2>Podcast</h2>

        <p><em>Podcast coming soon!</em></p>

        <h3 className="space-top-large">What will the podcast be about?</h3>
        <p>We plan to interview the tech people in the trenches doing the work on &#8216;hard problems.&#8217;
          We want to find out what works and what doesn&#8216;t work for tech people who are working on the world&#8216;s
          challenges.
        </p>
        <p>
          And, we want to inspire people (you?) to make the jump to work on hard problems.
        </p>

        <h3 className="space-top-large">Episodes</h3>
        <p>Episodes will be displayed here when we start. Join our <Link href="/newsletter/">email newsletter</Link> so you don&#8216;t miss when we start the podcast.</p>

        <div className="episode">
          <h3>Episode 1</h3>
          <div>Coming soon...</div>
        </div>

        <div className="episode">
          <h3>Episode 2</h3>
          <div>Coming soon...</div>
        </div>

        <div className="episode">
          <h3>Episode 3</h3>
          <div>Coming soon...</div>
        </div>

        <div className="episode">
          <h3>Episode 4</h3>
          <div>Coming soon...</div>
        </div>

        <div className="episode">
          <h3>Episode 5</h3>
          <div>Coming soon...</div>
        </div>

      </section>
      <section className="right">
        <h3>We need your help</h3>
        <p>Know someone who we should interview? Please fill out this Google Form and let us know. Thanks!</p>
        <p><Link href="https://forms.gle/fK7LrCLNzckobynh7" className="button">Suggest a guest</Link></p>

        <h3 className="divider">What makes a good guest?</h3>
        <ul>
          <li>Not the usual suspects who do the podcast circuit.</li>
          <li>Not just a &#8216;thought leader.&#8217; Someone who actually works on real-world technologies.</li>
          <li>Has been working on &#8216;hard problems&#8217; for more than a year &#8212; ideally 5+ years. Hard problems are long-term problems.</li>
          <li>Takes a thoughtful and ethical approach to their work.</li>
          <li>Likely works on tech related to:
              <div><span className="tag">Climate change</span></div>
              <div><span className="tag">Public health</span></div>
              <div><span className="tag">Healthcare</span></div>
              <div><span className="tag">Government or civics</span></div>
              <div><span className="tag">Education</span></div>
              <div><span className="tag">Achieving a &#8216;Sustainable Development Goal&#8217;</span></div>
              <div><span className="tag">Etc...</span></div>
          </li>
        </ul>
      </section>
      <Footer />
    </>
  );
}
