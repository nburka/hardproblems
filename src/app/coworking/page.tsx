import Image from 'next/image';
import { Footer } from '../../components/Footer';

export default function Page() {
  return (
    <>
      <section className="left">
        <h2>Co-working space in London</h2>
        <p className="intro">
          We have a small co-working space in the Shoreditch neighborhood of London. This space is intended to
          foster community for people working on hard problems.
        </p>

        <h3>Can I work here?</h3>
        <p>
          If you work on a large-scale tech project related to climate change, public health, healthcare, education,
          poverty, or other issues related to sustainable development goals, the answer could be "Yes!" We have a handful
          of desks that we are offering for short-term (3-6 month) free use or, if you&#8216;re able to pay, we can likely arrange
          longer-term co-working with a fixed desk for ~£450/month.
        </p>

        <h3>Is it free?</h3>
        <p>
          We offer free desks for a limited time (3-6 months) for not-for-profit tech people who are working on hard problenms.
          If you have budget to pay for co-working space, we would prefer if you paid, but if you are running on a shoestring (who
          isn&#8216;t) please apply for a feee desk.
        </p>

        <h3>How to apply for a desk</h3>
        <p>More...</p>

        <Image src="/images/illustration-cowork.svg" width="80" height="80" alt="Illustration of two people co-working" className="image-full" />
      </section>
      <section className="right">
        Content...
      </section>
      <section className="left"></section>
      <section className="right">
        <Footer />
      </section>
    </>
  );
}
