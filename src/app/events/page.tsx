import { Footer } from '../../components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
  return (
    <>
      <section className="left">
        <h2>Events</h2>
        <p>We do global events online and in-person events in London.</p>

        <h3 className="margin-top">Upcoming events</h3>

        <div className="event">
          <Image src="/images/events/wine-event.svg" width="80" height="80" alt="Illustration of a person sipping wine." />
          <h4><Link href="https://lu.ma/3n56utd7">Wine &amp; chat at our new office</Link></h4>
          <p>Come to our new office in London for a casual wine, beverages, and snacks. Just come to say hello!</p>
          <dl className="event-details">
            <dt>When?</dt>
            <dd>Wed, Dec 11, 2024</dd>
            <dt>Where?</dt>
            <dd>1 Rivington Place, London, EC2A 3BA</dd>
            <dt>RSVP</dt>
            <dd><Link href="https://lu.ma/3n56utd7">Please RSVP</Link></dd>
          </dl>
        </div>


        <h3 className="margin-top">Past events</h3>
        <div className="none">
          No past events
        </div>
      </section>
      <section className="right">
        <h3>Other people's events</h3>
        <p>These are other people's events that we're tracking.</p>

        <div className="other-event">
          <div className="other-event-title"><Link href="https://dhis2.org/academy/annual-conference/">DHIS2 Annual Conference</Link></div>
          <div className="other-event-location">Oslo, Norway</div>
          <div className="other-event-date">Jun 10-13, 2025</div>
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
