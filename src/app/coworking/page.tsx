import Image from 'next/image';
import Link from 'next/link';
import { Footer } from '../../components/Footer';

export default function Page() {
  return (
    <>
      <section className="left">
        <h2>Co-working space in London</h2>
        <p className="intro">
          We have a small co-working space in the Shoreditch neighborhood of
          London. This space is intended to foster community for people working
          on hard problems.
        </p>
        <p>
          Whether you live in London or are just visiting for a few days, this
          could be for you. Please get in touch with us (fill the form below) if
          you are unsure.
        </p>
        <Image
          src="/images/illustration-cowork.svg"
          width="80"
          height="80"
          alt="Illustration of two people co-working"
          className="image-full space-top-small"
        />

        <h3 className="space-top-small">Can I work here?</h3>
        <p>
          If you work on a large-scale tech project related to climate change,
          public health, healthcare, education, poverty, or other issues related
          to sustainable development goals, the answer could be
          &#8216;Yes!&#8217;
        </p>
        <dl>
          <dt>Drop-in</dt>
          <dd>
            Need a desk for just a few days? If you work on a hard problem,
            apply and we could offer you a free place to work.
          </dd>
          <dt>Desks</dt>
          <dd>
            We have a handful of desks that we are offering for short-term (3-12
            month) use. If you can pay, a fixed desk is £450/month. If you
            cannot pay, get in touch and we might be able to work something out.
          </dd>
        </dl>

        <h3 className="space-top-small">Is it free?</h3>
        <p>
          We offer free desks for a limited time (3-6 months) for not-for-profit
          tech people who are working on hard problems. If you have budget to
          pay for co-working space, we would prefer if you paid, but if you are
          running on a shoestring (who isn&#8216;t) please apply for a free
          desk.
        </p>

        <h3 className="space-top-small">How to apply for a desk?</h3>
        <p>Please complete this Google Form:</p>
        <p>
          <Link href="https://forms.gle/BFESE6iHh6pppUGXA" className="button">
            Apply for a desk
          </Link>
        </p>
      </section>
      <section className="right">
        <h3>Location</h3>
        <p>
          <Link href="https://maps.app.goo.gl/8SYY1vdDDcwwqGJy7">
            1 Rivington Pl, London EC2A 3BA
          </Link>
        </p>
        <p>
          We are located in the Autograph Gallery building at 1 Rivington Place
          in the Shoreditch neighborhood. We are very central and are closest to
          Liverpool Street Station with access to Underground and train
          services.
        </p>
        <h3 className="divider">Photos</h3>
        <p>
          <Link href="/images/office-photo-1.jpg">
            <Image
              src="/images/office-photo-1.jpg"
              width="1500"
              height="1500"
              alt="Photo of the office"
              className="image-full"
            />
          </Link>
        </p>
        <p>
          <Link href="/images/office-photo-2.jpg">
            <Image
              src="/images/office-photo-2.jpg"
              width="1500"
              height="1500"
              alt="Photo of the office"
              className="image-full"
            />
          </Link>
        </p>
        <p>
          <Link href="/images/office-photo-3.jpg">
            <Image
              src="/images/office-photo-3.jpg"
              width="1500"
              height="1500"
              alt="Photo of the office"
              className="image-full"
            />
          </Link>
        </p>
        <p>
          <Link href="/images/office-photo-4.jpg">
            <Image
              src="/images/office-photo-4.jpg"
              width="1500"
              height="1500"
              alt="Photo of the office"
              className="image-full"
            />
          </Link>
        </p>
        <p>
          <Link href="/images/office-photo-5.jpg">
            <Image
              src="/images/office-photo-5.jpg"
              width="1500"
              height="1500"
              alt="Photo of the office"
              className="image-full"
            />
          </Link>
        </p>
      </section>
      <Footer />
    </>
  );
}
