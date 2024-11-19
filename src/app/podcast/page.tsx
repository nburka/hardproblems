import Image from 'next/image';
import { Footer } from '../../components/Footer';

export default function Page() {
  return (
    <>
      <section className="left">
        <h2>Podcast</h2>
        <p><em>Podcast coming soon!</em></p>

        <h3 className="margin-top">What will the podcast be about?</h3>
        <p>We plan to interview the tech people in the trenches doing the work on 'hard problems.' We want to find out what works and what doesn't work for tech people who are working on the world's challenges. And, we want to inspire people (you?) to make the jump to working on hard problems.</p>

        <h3 className="margin-top">Be informed</h3>
        <p>Join our email newsletter so you don't miss when we start the podcast.</p>

        <Image src="/images/illustration-podcast.svg" width="80" height="80" alt="Illustration of a person recording a podcast." className="image-full" />

      </section>
      <section className="right">
        <h3>We need your help</h3>
        <p>Know someone who we should interview? Please fill out this Google Form and let us know. Thanks!</p>

        <h3 className="divider">What makes a good guest?</h3>
        <ul>
          <li>Not the usual suspects who do the podcast circuit.</li>
          <li>Not just a 'thought leader.' Someone who actually creates new technologies.</li>
          <li>Has been working on 'hard problems' for more than a year &#8212; ideally 5+ years. Hard problems are long-term problems.</li>
          <li>Takes a thoughtful and ethical approach to their work.</li>
          <li>Likely works on tech related to:
            <ul>
              <li>Climate change</li>
              <li>Public health</li>
              <li>Healthcare</li>
              <li>Government or civics</li>
              <li>Education</li>
              <li>Solving a 'Sustainable Development Goal'</li>
              <li>Etc.</li>
            </ul>
          </li>
        </ul>
      </section>
      <section className="left"></section>
      <section className="right">
        <Footer />
      </section>
    </>
  );
}
