import Image from 'next/image';
import Link from 'next/link';
import { Footer } from '../../components/Footer';

export default function Page() {
  return (
    <>
      <section className="left">
        <h2>Give</h2>
        <p className="intro">
          Hard Problems is a non-profit that is primarily funded by the founding team.
          We aim to keep our expenses low, which will allow us to run sustainably for a long time. That said, we could
          benefit from your help.
        </p>

        <p>Get in touch by email: <em>contact@hardproblems.com</em></p>

        <h3 className="space-top-large">Co-working space in London</h3>
        <p>
          We have a <Link href="/coworking">co-working space</Link> in London where we donate desks to people that work on hard problems. Renting office space in London is expensive. You could donate a desk to a great
          technologist by gifting £450 for a month.
        </p>
        <p>
          Or you could donate a smaller amount to help us outfit the office &#8212;
          buy a chair (£100) or even gift a bag of good coffee (£10) would be appreciated.
        </p>

        <h3 className="space-top-large">Sponsor an event</h3>
        <p>
          We will run events in 2025 with an audience of people who work on hard problems all over the world. If you or your
          company is interested in sponsoring an event, please get in touch.
        </p>
        <Image src="/images/illustration-savings.svg" width="80" height="80" alt="Illustration of a person putting money in a piggy bank." className="image-full space-top-large" />
      </section>
      <section className="right">
        <h3>Thank you</h3>
        <p>If you donate, we will add you to a &#8216;Thank you wall&#8217; here on the website.</p>
        <Image src="/images/illustration-thanks.svg" width="120" height="120" alt="Illustration of hands in a heart shape." />
      </section>
      <section className="left"></section>
      <section className="right">
        <Footer />
      </section>
    </>
  );
}
