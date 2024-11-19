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

        <h3 className="margin-top">We need your help</h3>
        <p>Know someone who we should interview? Please fill out this Google Form and let us know. Thanks!</p>

        <h3 className="margin-top">Be informed</h3>
        <p>Join our email newsletter so you don't miss when we start the podcast.</p>

        <Image src="/images/illustration-podcast.svg" width="80" height="80" alt="Illustration of a person recording a podcast." className="image-full" />

      </section>
      <section className="right">

      </section>
      <section className="left"></section>
      <section className="right">
        <Footer />
      </section>
    </>
  );
}
