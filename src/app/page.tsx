import Image from 'next/image';
import { Footer } from '../components/Footer';
import styles from './page.module.scss';

export default function Home() {
  return (
    <>
      <section className="left">
        <h3>The challenge</h3>
        <blockquote>
          “The best minds of my generation are thinking about how to make people
          click ads. That sucks.” &#8212; Jeff Hammerbacher, 2011
        </blockquote>
        <h3>Our mission</h3>
        <p>
          Helping tech people to work on the hard problems that matter in the
          world: problems like <em>public health</em>, <em>climate change</em>,{' '}
          <em>poverty</em>, and <em>good government</em>.
        </p>
        <p>
          While Silicon Valley is focused on AI, VR, new subscription models,
          and, yes, ads, many people in the real world are trying to tackle the
          hard problems of climate change, public health, poverty, and other
          issues that affect us all.
        </p>
        <p>
          Programmers and designers know these issues matter but wring their
          hands and standby, unsure how to have any positive impact... choosing
          to focus on making big money and working on trendy new technologies.
        </p>
        <p>
          It’s time to refocus the tech world on what matters most. It’s time to
          build new relations between doctors, environmentalists, scientists,
          not-for-profit leaders, public servants, and others tackling the
          world’s hardest problems with technologists who can help make
          practical tools to help solve them.
        </p>
        <p>
          Made up of a multi-skilled team of very experienced tech veterans and
          other subject-matter experts. Hard Problems is taking the lead in this
          effort - whether it’s building teams to work on issues, solving
          problems with robust long-term solutions, finding ways to fund tech
          initiatives, and inspiring a new generation of tech workers to
          champion the work on these fundamentally important problems.
        </p>
        <p>
          We are in the earliest stages of forming Hard Problems. We don’t have
          all of the answers, but we’ll start anyhow and learn along the way.
        </p>
      </section>
      <section className="right">
        <h3>Get involved</h3>
        <ol>
          <li>
            <b>Subscribe</b> to our new monthly newsletter
            <iframe
              src="https://embeds.beehiiv.com/2352d28d-4a8e-4c9e-b88a-a457586e04ad?slim=true"
              data-test-id="beehiiv-embed"
              height="52"
              frameBorder="0"
              scrolling="no"
            ></iframe>
          </li>
          <li>
            <b>Suggest podcast guests.</b> We are going to interview people who
            already work on hard problems.{' '}
            <a href="#">Suggest a future guest?</a>
          </li>
          <li>
            <b>Give financially.</b> <a href="#">Get in touch</a> to discuss how
            you can contribute to Hard Problems.
          </li>
        </ol>

        <h3 className="divider">Team</h3>
        <p>
          We are an all-volunteer team. We are a global non-profit with a home
          base in London.
        </p>
        <div className={styles.team}>
          <div>
            <Image src="/images/user.png" width="80" height="80" alt="" /> Elyce
            Cole
          </div>
          <div>
            <Image src="/images/user.png" width="80" height="80" alt="" />{' '}
            Daniel Burka
          </div>
          <div>
            <Image src="/images/user.png" width="80" height="80" alt="" />{' '}
            Person 3
          </div>
          <div>
            <Image src="/images/user.png" width="80" height="80" alt="" />{' '}
            Person 4
          </div>
          <div>
            <Image src="/images/user.png" width="80" height="80" alt="" />{' '}
            Person 5
          </div>
          <div>
            <Image src="/images/user.png" width="80" height="80" alt="" />{' '}
            Person 6
          </div>
          <div>
            <Image src="/images/user.png" width="80" height="80" alt="" />{' '}
            Person 7
          </div>
        </div>
      </section>
      <section className="left">
        <h3>Office</h3>
        <p>4th Floor, 1 Rivington Place, London EC2A 3BA</p>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.2855128099854!2d-0.08192342218557233!3d51.52632290931932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761cba884c342b%3A0xe4666be3fe5263b2!2sRivington%20Place%2C%201%20Rivington%20Pl%2C%20London%20EC2A%203BA!5e0!3m2!1sen!2suk!4v1729851120894!5m2!1sen!2suk"
          width="100%"
          height="350"
          loading="lazy"
          className={styles.mapEmbed}
        ></iframe>
      </section>
      <section className="right">
        <Footer />
      </section>
    </>
  );
}
