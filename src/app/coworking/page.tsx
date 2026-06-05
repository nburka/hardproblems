import Image from 'next/image';
import Link from 'next/link';
import { Footer } from '../../components/Footer';
import styles from './page.module.scss';

type Team = {
  name: string;
  href: string;
  description: string;
  image?: string; // path under /public, e.g. "/images/coworking/wellvrse.png"
};

const teams: Team[] = [
  {
    name: 'Abuela',
    href: 'https://tryabuela.com/',
    description: 'Turning senior living facilities into clinical trial sites.',
    image: '/images/coworking/abuela.jpg'
  },
  {
    name: 'Blute',
    href: 'https://www.blute.co.uk/',
    description: 'Giving healthcare students a voice on clinical placements.',
    image: '/images/coworking/blute.jpg'
  },
  {
    name: 'Branch',
    href: 'https://joinbranch.co/',
    description: 'Keep your career on track while you have a baby.',
    image: '/images/coworking/branch.jpg'
  },
  {
    name: 'Coolit Labs',
    href: 'https://www.coolitlabs.com/',
    description:
      'Transforming medical devices into beautiful lifestyle objects.',
    image: '/images/coworking/coolit.jpg'
  },
  {
    name: 'Elyfia',
    href: 'https://www.elyfia.com/how-it-works',
    description:
      'Personalised coaching to Fibromyalgia patients through an app.',
    image: '/images/coworking/elyfia.jpg'
  },
  {
    name: 'Grene',
    href: 'https://grene.co.uk/',
    description:
      'A new operating layer for domiciliary and supported living services.',
    image: '/images/coworking/grene.jpg'
  },
  {
    name: 'Health Data Avatar',
    href: 'https://www.healthdataavatar.com/',
    description: 'All your health data in one platform.',
    image: '/images/coworking/health-data-avatar.jpg'
  },
  {
    name: 'Joey',
    href: 'https://www.askjoeynow.com/',
    description: "Your child's GP on Whatsapp.",
    image: '/images/coworking/joey.jpg'
  },
  {
    name: 'Minimum Viable Narrative',
    href: 'https://find-and-update.company-information.service.gov.uk/company/17106346',
    description: 'Storytelling for a better future.',
    image: '/images/coworking/minimum-viable-narrative.jpg'
  },
  {
    name: 'Prime Radiant Studio',
    href: 'https://primeradiantstudio.webflow.io/',
    description:
      'Using quantitative data to understand the trajectory of society.',
    image: '/images/coworking/cortex.jpg'
  },
  {
    name: 'Relay',
    href: 'https://www.linkedin.com/company/readytorelay/about/',
    description:
      'Safety through community-powered infrastructure for women runners.',
    image: '/images/coworking/relay.jpg'
  },
  {
    name: 'Resolve to Save Lives',
    href: 'https://rtsl.org/',
    description:
      "A global public health non-profit working on the world's largest threats.",
    image: '/images/coworking/resolve-to-save-lives.jpg'
  },
  {
    name: 'Scrub the Stigma',
    href: 'https://www.scrubthestigma.com/',
    description:
      'Dismantling barriers and challenging the stigma impacting women’s health.',
    image: '/images/coworking/scrub-the-stigma.jpg'
  },
  {
    name: 'Vayla Health',
    href: 'https://vaylahealth.ai/',
    description:
      'Augments discharge teams with follow-up for patients at risk of readmission.',
    image: '/images/coworking/vayla.jpg'
  },
  {
    name: 'Wellvrse',
    href: 'https://www.wellvrse.com/',
    description:
      'A new paradigm for health, centring creativity, community and technology.',
    image: '/images/coworking/wellvrse.jpg'
  }
];

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
        <dl>
          <dt>Drop-in</dt>
          <dd>
            Need a desk for just a few days? If you work on a hard problem,
            apply and we could offer you a free place to work.
          </dd>
          <dt>Desks</dt>
          <dd>
            If you can pay, a fixed desk is £450/month and a drop-in desk is
            £200/month. If that is too much, get in touch and we might be able
            to work something out.
          </dd>
        </dl>

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
          <Link href="https://forms.gle/BFESE6iHh6pppUGXA" className="button">
            Apply for a desk
          </Link>
        </p>

        <h3 className="space-top-large">Teams</h3>
        <p>People from these organizations use the co-working space:</p>
        <ul className={styles.teamsGrid}>
          {teams.map((team) => (
            <li key={team.name} className={styles.teamTile}>
              {team.image ? (
                <Link href={team.href} aria-label={`Visit ${team.name}`}>
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
              <div className={styles.teamTileName}>
                <Link href={team.href}>{team.name}</Link>
              </div>
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
          request.
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
