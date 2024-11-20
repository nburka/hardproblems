import { Footer } from '../../components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
  return (
    <>
      <section className="left">
        <h2>Events</h2>
        <p className="intro">
          We do global events online and in-person events in London. We will build community, host great speakers, and publish videos online.
        </p>

        <p>
          The best way to stay informed about upcoming events is to join our <Link href="/newsletter">email newsletter</Link>. We hope to see you at an event soon. Please contact us at
          contact@hardproblems.com if you have an event we should add to the ’other events’ list.
        </p>

        <h3 className="space-top-large">Upcoming events</h3>

        <div className="event">
          <div className="event-image">
            <Image src="/images/events/wine-event.svg" width="80" height="80" alt="Illustration of a person sipping wine." />
            <div className="event-image-date">Dec 11, 2024</div>
          </div>
          <h4><Link href="https://lu.ma/3n56utd7">Wine &amp; chat at our new office</Link></h4>
          <p>Come to our new office in London for a casual wine, beverages, and snacks. Just come to say hello!</p>
          <dl className="event-details">
            <dt>When?</dt>
            <dd>5-7pm on Wed, Dec 11, 2024</dd>
            <dt>Where?</dt>
            <dd>1 Rivington Place, London, EC2A 3BA</dd>
            <dt>RSVP</dt>
            <dd><Link href="https://lu.ma/3n56utd7">Please RSVP</Link></dd>
          </dl>
        </div>


        <h3 className="space-top-large">Past events</h3>
        <div className="none">
          No past events
        </div>
      </section>
      <section className="right">
        <h3>Other people&#8216;s events</h3>
        <p>These are other people&#8216;s events that we&#8216;re tracking around the world.</p>

        <div className="other-event">
          <div className="other-event-title"><Link href="https://dhis2.org/academy/annual-conference/">DHIS2 Annual Conference</Link></div>
          <div className="other-event-location">Oslo, Norway</div>
          <div className="other-event-date">Jun 10-13, 2025</div>
        </div>

        <div className="other-event">
          <div className="other-event-title"><Link href="https://skoll.org/skoll-world-forum/">Skoll World Forum</Link></div>
          <div className="other-event-location">Oxford, UK, and online</div>
          <div className="other-event-date">Apr 1-4, 2025</div>
        </div>

        <div className="other-event">
          <div className="other-event-title"><Link href="https://www.whatdesigncando.com/events/wdcd-live-delhi-2025/">What Design Can Do</Link></div>
          <div className="other-event-location">Delhi, India</div>
          <div className="other-event-date">Mar 8, 2025</div>
        </div>

        <div className="other-event">
          <div className="other-event-title"><Link href="https://www.gdhf.digital/abstracts">Global Digital Health Forum 2024</Link></div>
          <div className="other-event-location">Nairobi, Kenya, and online</div>
          <div className="other-event-date">Dec 4-6, 2024</div>
        </div>

        <div className="other-event">
          <div className="other-event-title"><Link href="https://www.onehealthtech.com/events-1/oht-london-shift">Open Health Tech London: SHIFT</Link></div>
          <div className="other-event-location">London, UK</div>
          <div className="other-event-date">Nov 20, 2024</div>
        </div>

      </section>
      <section className="left">
      </section>
      <section className="right">
        <Footer />
      </section>
    </>
  );
}
