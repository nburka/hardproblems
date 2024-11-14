import { Footer } from '../../components/Footer';
import { Map } from '../../components/Map';

export default function Page() {
  return (
    <>
      <section className="left">
        <h2>Contact</h2>
        <p>
          Email:{' '}
          <a href="mailto:contact@hardproblems.com">contact@hardproblems.com</a>
        </p>
        <Map />
      </section>
      <section className="right"></section>
      <section className="left"></section>
      <section className="right">
        <Footer />
      </section>
    </>
  );
}
