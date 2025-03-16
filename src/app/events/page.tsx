import { Footer } from '../../components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
  return (
    <>
      <section className="left">
        <h2>Events</h2>
        <p className="intro">
          We host global events online and in-person events in London, featuring great speakers to build community.
        </p>

        <p>If you’re unable to join live, watch this space as we will publish videos online too.</p>

        <p>
          The best way to stay informed about upcoming events is to join our <Link href="/newsletter">email newsletter</Link>. All in-person events follow our <Link href="/conduct">code of conduct</Link>. We hope to see you at an event soon.
        </p>

        <h3 className="space-top-large">Upcoming events</h3>

        <div className="event">
          <div className="event-image">
            <Image src="/images/events/asquared-event.svg" width="80" height="80" alt="Illustration of ASquared." />
            <div className="event-image-date">Apr 10, 2025</div>
          </div>
          <h4><Link href="https://lu.ma/kme2kbaa">Fireside chat with ASquared: Can a design agency do good in the world and run a viable business?</Link></h4>
          <p>We will discuss with three of the leaders of ASquared about their agency&rsquo;s transition to a B-Corp that does half their work with organizations working on &ldquo;Sustainable Development Goals.&rdquo; Is it possible to run a successful digital agency with an explicit aim to make the world better?</p>
          <dl className="event-details">
            <dt>When?</dt>
            <dd>6-9 pm on Thur, April 10, 2025</dd>
            <dt>Where?</dt>
            <dd>1 Rivington Place, London, EC2A 3BA</dd>
            <dt>RSVP</dt>
            <dd><Link href="https://lu.ma/kme2kbaa">Please RSVP</Link></dd>
          </dl>
        </div>


        <h3 className="space-top-large">Past events</h3>

        <div className="event">
          <div className="event-image">
            <Image src="/images/events/brian-event.svg" width="80" height="80" alt="Illustration of Brian O'Donnell." />
            <div className="event-image-date">Mar 13, 2025</div>
          </div>
          <h4><Link href="https://lu.ma/bengeegp">Fireside chat with Brian O&#39;Donnell from DHIS2.org</Link></h4>
          <p>We are hosting tech architect, Brian O D&rsquo;onnell (Linkedin), for a fireside chat where we will discuss what he does, how he ended up working on DHIS2.org, and the highs and lows of working at the intersection of academia, government, global public health, and tech. This will be an open discussion where you can ask Brian questions.</p>
          <dl className="event-details">
            <dt>When?</dt>
            <dd>6-9 pm on Thur, March 13, 2025</dd>
            <dt>Where?</dt>
            <dd>1 Rivington Place, London, EC2A 3BA</dd>
            <dt>RSVP</dt>
            <dd><Link href="https://lu.ma/bengeegp">Please RSVP</Link></dd>
          </dl>
        </div>

        <div className="event">
          <div className="event-image">
            <Image src="/images/events/wine-event.svg" width="80" height="80" alt="Illustration of a person sipping wine." />
            <div className="event-image-date">Dec 11, 2024</div>
          </div>
          <h4><Link href="https://lu.ma/3n56utd7">Wine &amp; chat at our new office</Link></h4>
          <p>Come to our new office in London for casual wine, beverages, and snacks or just to say hello!</p>
          <dl className="event-details">
            <dt>When?</dt>
            <dd>5-7 pm on Wed, December 11, 2024</dd>
            <dt>Where?</dt>
            <dd>1 Rivington Place, London, EC2A 3BA</dd>
            <dt>RSVP</dt>
            <dd><Link href="https://lu.ma/3n56utd7">Please RSVP</Link></dd>
          </dl>
        </div>

      </section>
      <section className="right">
        <h3>Other people&#8216;s events</h3>
        <p>These are other people&#8216;s events that we&#8216;re tracking around the world. Email
          contact@hardproblems.com if you have an event we should add.</p>

        <div className="other-event">
          <div className="other-event-title"><Link href="https://dhis2.org/academy/annual-conference/">DHIS2 Annual Conference</Link></div>
          <p className="no-margin">Oslo, Norway</p>
          <div className="other-event-date">Jun 10-13, 2025</div>
        </div>

        <div className="other-event">
          <div className="other-event-title"><Link href="https://skoll.org/skoll-world-forum/">Skoll World Forum</Link></div>
          <p className="no-margin">Oxford, UK, and online</p>
          <div className="other-event-date">Apr 1-4, 2025</div>
        </div>

        <div className="other-event">
          <div className="other-event-title"><Link href="https://www.whatdesigncando.com/events/wdcd-live-delhi-2025/">What Design Can Do</Link></div>
          <p className="no-margin">Delhi, India</p>
          <div className="other-event-date">Mar 8, 2025</div>
        </div>

        <h3 className="divider">Older events</h3>

        <div className="other-event">
          <div className="other-event-title"><Link href="https://www.gdhf.digital/abstracts">Global Digital Health Forum 2024</Link></div>
          <p className="no-margin">Nairobi, Kenya, and online</p>
          <div className="other-event-date">Dec 4-6, 2024</div>
        </div>

        <div className="other-event">
          <div className="other-event-title"><Link href="https://www.onehealthtech.com/events-1/oht-london-shift">Open Health Tech London: SHIFT</Link></div>
          <p className="no-margin">London, UK</p>
          <div className="other-event-date">Nov 20, 2024</div>
        </div>

      </section>
      <Footer />
    </>
  );
}
