import Link from 'next/link';
import { Footer } from '../../components/Footer';

export default function Page() {
  return (
    <>
      <section className="left">
        <h2>Privacy notice</h2>
        <p>This is the Hard Problems customer privacy notice. This privacy notice tells you what to expect us to do with your personal information.</p>
        <ul>
          <li><Link href="#contact">Contact details</Link></li>
          <li><Link href="#info">What information we collect, use, and why</Link></li>
          <li><Link href="#lawful">Lawful bases and data protection rights</Link></li>
          <li><Link href="#where">Where we get personal information from</Link></li>
          <li><Link href="#keep">How long we keep information</Link></li>
          <li><Link href="#complain">How to complain</Link></li>
        </ul>

        <h3 className="space-top-large" id="contact">Contact details</h3>
        <dl>
          <dt>Post</dt>
          <dd>Hard Problems, 1 Rivington Place, LONDON, EC2A 3BA, GB</dd>
          <dt>Email</dt>
          <dd>contact@hardproblems.com</dd>
        </dl>

        <h3 className="space-top-large" id="info">What information we collect, use, and why</h3>
        <p>
          We collect or use the following information to receive donations or funding and organise fundraising activities:
          <br /><span className="tag">Names and contact details</span>
        </p>
        <p>
          We collect or use the following personal information for service updates or marketing purposes:
          <br /><span className="tag">Names and contact details</span>
        </p>
        <p>We collect or use the following personal information for dealing with queries, complaints or claims:
          <br /><span className="tag">Names and contact details</span>
        </p>
        <p>We also collect or use the following information for dealing with queries, complaints or claims:
          <br /><span className="tag">Names and contact details</span>
        </p>

        <h3 className="space-top-large" id="lawful">Lawful bases and data protection rights</h3>
        <p>Under UK data protection law, we must have a “lawful basis” for collecting and using your personal information. There is a list of possible lawful bases in the UK GDPR. You can find out more about lawful bases on the ICO’s website.</p>
        <p>Which lawful basis we rely on may affect your data protection rights which are in brief set out below. You can find out more about your data protection rights and the exemptions which may apply on the ICO’s website:</p>
        <ul>
          <li><b>Your right of access</b> - You have the right to ask us for copies of your personal information. You can request other information such as details about where we get personal information from and who we share personal information with. There are some exemptions which means you may not receive all the information you ask for. You can read more about this right here.</li>
          <li><b>Your right to rectification</b> - You have the right to ask us to correct or delete personal information you think is inaccurate or incomplete. You can read more about this right here.</li>
          <li><b>Your right to erasure</b> - You have the right to ask us to delete your personal information. You can read more about this right here.</li>
          <li><b>Your right to restriction of processing</b> - You have the right to ask us to limit how we can use your personal information. You can read more about this right here.</li>
          <li><b>Your right to object to processing</b> - You have the right to object to the processing of your personal data. You can read more about this right here.</li>
          <li><b>Your right to data portability</b> - You have the right to ask that we transfer the personal information you gave us to another organisation, or to you. You can read more about this right here.</li>
          <li><b>Your right to withdraw consent</b> – When we use consent as our lawful basis you have the right to withdraw your consent at any time. You can read more about this right here.</li>
        </ul>
        <p>If you make a request, we must respond to you without undue delay and in any event within one month.</p>
        <p>To make a data protection rights request, please contact us using the contact details at the top of this privacy notice.</p>

        <div className="feature">
          <h3>Our lawful bases for the collection and use of your data</h3>

          <p>Our lawful bases for collecting or using personal information to <b>receive funding and organise fundraising activities</b> are:</p>
          <p className="indent">Consent - we have permission from you after we gave you all the relevant information. All of your data protection rights may apply, except the right to object. To be clear, you do have the right to withdraw your consent at any time.</p>
          <p>Our lawful bases for collecting or using personal information for <b>service updates or marketing purposes</b> are:</p>
          <p className="indent">Consent - we have permission from you after we gave you all the relevant information. All of your data protection rights may apply, except the right to object. To be clear, you do have the right to withdraw your consent at any time.</p>
          <p>Our lawful bases for collecting or using personal information for <b>dealing with queries, complaints or claims</b> are:</p>
          <p className="indent">Consent - we have permission from you after we gave you all the relevant information. All of your data protection rights may apply, except the right to object. To be clear, you do have the right to withdraw your consent at any time.</p>
        </div>

        <h3 className="space-top-large" id="where">Where we get personal information from</h3>
        <p>Directly from you</p>

        <h3 className="space-top-large" id="keep">How long we keep information</h3>
        <p>Newsletter email addresses are kept until you unsubscribe from the newsletter.</p>
        <p>Contact information provided for the purpose of attending an event or applying for a service are removed after 3 months.</p>

        <h3 className="space-top-large">Last updated</h3>
        <p>21 November 2024</p>
      </section>
      <section className="right">
        <h3 id="complain">How to complain</h3>
        <p>If you have any concerns about our use of your personal data, you can make a complaint to us using the contact details at the top of this privacy notice.</p>
        <p>If you remain unhappy with how we’ve used your data after raising a complaint with us, you can also complain to the ICO (Information Commissioner’s Office).</p>
        <p>The ICO’s address:</p>
        <p className="indent">
          Information Commissioner’s Office.<br />
          Wycliffe House<br />
          Water Lane<br />
          Wilmslow<br />
          Cheshire<br />
          SK9 5AF
        </p>
        <p>Helpline number: 0303 123 1113</p>
        <p>Website: <Link href="https://www.ico.org.uk/make-a-complaint">ico.org.uk/make-a-complaint</Link></p>
      </section>
      <Footer />
    </>
  );
}
