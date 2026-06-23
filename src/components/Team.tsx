import Image from 'next/image';
import Link from 'next/link';
import styles from './team.module.scss';

export function Team() {
  return (
    <div className={styles.team}>
      <div>
        <Link className="hover-saturate" href="https://www.linkedin.com/in/elyce-cole-1380903a/">
          <Image src="/images/team/elyce.svg" width="80" height="80" alt="" />
          Elyce Cole
        </Link>
      </div>

      <div>
        <Link className="hover-saturate" href="https://www.linkedin.com/in/dburka/">
          <Image src="/images/team/daniel.svg" width="80" height="80" alt="" />
          Daniel Burka
        </Link>
      </div>

      <div>
        <Link className="hover-saturate" href="https://www.linkedin.com/in/mahima-chandak/">
          <Image src="/images/team/mahima.svg" width="80" height="80" alt="" />
          Mahima Chandak
        </Link>
      </div>
    </div>
  );
}
