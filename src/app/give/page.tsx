import Image from 'next/image';
import Link from 'next/link';
import { CreditCard } from 'lucide-react';

export default function Page() {
  return (
    <>
      <section className="left">
        <h2>Support our work</h2>
        <p className="intro">
          Hard Problems is a nonprofit that is primarily funded by the founding
          team. We aim to keep our expenses low, which will allow us to run
          sustainably for a long time. That said, we could benefit from your
          help.
        </p>
        <p>
          <a
            href="https://www.paypal.com/ncp/payment/EKT76R9DGCEH4"
            className="black-button"
          >
            <CreditCard size={16} aria-hidden="true" />
            Paypal gift (credit card) <span aria-hidden="true">→</span>
          </a>
        </p>
        <p>
          Get in touch by email: <em>contact@hardproblems.com</em>
        </p>
        <h3 className="space-top-xlarge">Ideas for gifts</h3>
        <p>
          Here are a few ideas for gifts. We&rsquo;re open to all kinds of
          new ideas too, so please get in touch if you have ideas that
          might be helpful to Hard Problems. Thank you.
        </p>
        <ul className="hand-drawn-checklist">
          <li>
            <b>Co-working space in London.</b> We have a{' '}
            <Link href="/coworking">co-working space</Link> in London where we
            gift desks to people that work on hard problems. Renting office
            space in London is expensive. You could gift a desk to a great
            designer by giving £450 one-time or per month.
          </li>
          <li>
            <b>Outfit the office.</b> Gift a smaller amount to help us
            outfit the office &#8212; buy a chair (£100) or even gift a bag
            of good coffee (£10). Any gift would be appreciated.
          </li>
          <li>
            <b>Sponsor an event.</b> We will run events in 2026 with an
            audience of people who work on hard problems all over the world.
            If you or your company is interested in sponsoring an event,
            please get in touch. You will get a nice shout-out at the event.
          </li>
          <li>
            <b>Sponsor the job board.</b> For £3,000/month, your organization
            could sponsor the Job Board. We would put a (fairly subtle)
            sponsorship line at the top of the jobs and we would thank you
            in our Newsletter.
          </li>
        </ul>
        <Image
          src="/images/illustration-savings.svg"
          width="80"
          height="80"
          alt="Illustration of a person putting money in a piggy bank."
          className="image-full space-top-large"
        />
      </section>
      <section className="right">
        <h3>Thank you</h3>
        <p>
          If you give us a gift, we will add you to a &#8216;Thank you wall&#8217; here
          on the website.
        </p>
        <div className="offer-stack">
          <div className="grid-cell">
            <Image
              src="/images/illustration-thanks.svg"
              width="120"
              height="120"
              alt="Illustration of hands in a heart shape."
            />
            <b className="grid-link">
              <a href="https://www.funsize.co/">Funsize</a>
            </b>
            <p className="grid-detail">
              For kindly redesigning our website and giving us strategic
              guidance.
            </p>
          </div>

          <div className="grid-cell">
            <Image
              src="/images/illustration-thanks.svg"
              width="120"
              height="120"
              alt="Illustration of hands in a heart shape."
            />
            <b className="grid-link">
              <a href="https://d.mba/">d.MBA</a>
            </b>
            <p className="grid-detail">For their generous gift.</p>
          </div>

          <div className="grid-cell">
            <Image
              src="/images/illustration-thanks.svg"
              width="120"
              height="120"
              alt="Illustration of hands in a heart shape."
            />
            <b className="grid-link">
              <a href="https://champaca.in/pages/meet-the-booksellers">
                Radhika Timbadia
              </a>{' '}
              &amp;{' '}
              <a href="https://www.rahulgonsalves.com/">Rahul Gonsalves</a>
            </b>
            <p className="grid-detail">For their generous cash gift.</p>
          </div>

          <div className="grid-cell">
            <Image
              src="/images/illustration-thanks.svg"
              width="120"
              height="120"
              alt="Illustration of hands in a heart shape."
            />
            <b className="grid-link">
              <a href="https://primeradiantstudio.webflow.io/">
                Prime Radiant
              </a>
            </b>
            <p className="grid-detail">
              For gifting a beautiful coffee machine.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
