import Image from 'next/image';
import Link from 'next/link';
import { coworkingTeams as teams } from '../../lib/coworkingTeams';
import styles from './page.module.scss';

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

        <h3 className="space-top-small">Can I work here?</h3>
        <p>
          If you work on a large-scale tech project related to climate change,
          public health, healthcare, education, poverty, or other issues related
          to sustainable development goals, the answer could be
          &#8216;Yes!&#8217;
        </p>
        <h4 style={{ color: 'var(--color-mid-green)' }}>Drop-in for a few days</h4>
        <p>
          Need a desk for just a few days? If you work on a hard problem,
          apply and we could offer you a free place to work.
        </p>
        <h4 style={{ color: 'var(--color-mid-green)' }}>Long-term desks</h4>
        <p>
          If you can pay, a fixed desk is £450/month and a drop-in desk is
          £200/month. If that is too much, get in touch and we might be able
          to work something out.
        </p>

        <h3 className="space-top-small">Is it free?</h3>
        <p>
          We offer free desks for a limited time (3-6 months) for not-for-profit
          tech people who are working on hard problems. If you have budget to
          pay for co-working space, we would prefer if you paid, but if you are
          running on a shoestring, please apply for a free desk.
        </p>

        <h3 className="space-top-small">How to apply for a desk?</h3>
        <p>Please complete this Google Form:</p>
        <p>
          <Link
            href="https://forms.gle/BFESE6iHh6pppUGXA"
            className="black-button"
          >
            Apply for a desk <span aria-hidden="true">→</span>
          </Link>
        </p>

        <h3 className="space-top-large">Teams</h3>
        <p>People from these organizations use the co-working space:</p>
        <ul className={styles.teamsGrid}>
          {teams.map((team) => (
            <li key={team.name} className={styles.teamTile}>
              {team.image ? (
                <Link href={team.href} aria-label={`Visit ${team.name}`} className="hover-saturate">
                  <Image
                    src={team.image}
                    width={512}
                    height={410}
                    alt={`${team.name} logo`}
                    className={styles.teamTileImage}
                  />
                </Link>
              ) : (
                <div
                  className={styles.teamTilePlaceholder}
                  aria-hidden="true"
                />
              )}
              {team.description && (
                <p className={styles.teamTileDescription}>{team.description}</p>
              )}
            </li>
          ))}
        </ul>
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
          in the Shoreditch neighborhood.
        </p>
        <h3 className="space-top-small">Getting here</h3>
        <p>
          Liverpool Street Station and Old Street Station are closest
          Underground stops. There is secure bicycle parking at the office by
          request. Visiting? Come into Autograph Gallery and ask for Hard
          Problems at the front desk.
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
    </>
  );
}
