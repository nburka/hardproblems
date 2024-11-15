import Image from 'next/image';

export default function Podcast() {
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
        <div className="team">
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
      </section>
      <section className="right">
        <h3>Legal</h3>
        <p>
          Hard Problems is a non-profit Company Limited by Guarantee registered
          with{' '}
          <a href="https://find-and-update.company-information.service.gov.uk/company/16028166">
            Companies House
          </a>{' '}
          in the UK in 2024.
        </p>
        <p>All content is &copy; Copyright 2024</p>
      </section>
    </>
  );
}
