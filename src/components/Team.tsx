import Image from 'next/image';
import Link from 'next/link';
import styles from './team.module.scss';

export function Team() {
  return (
    <div className={styles.team}>

      <div>
        <Link href="https://www.linkedin.com/in/elyce-cole-1380903a/">
        <Image src="/images/team/elyce.svg" width="80" height="80" alt="" /> Elyce
        Cole
        </Link>
      </div>

      <div>
        <Link href="https://www.linkedin.com/in/dburka/">
        <Image src="/images/team/daniel.svg" width="80" height="80" alt="" /> Daniel Burka
        </Link>
      </div>

      <div>
        <Image src="/images/team/blank.svg" width="80" height="80" alt="" /> Coming soon...
      </div>
      <div>
        <Image src="/images/team/blank.svg" width="80" height="80" alt="" /> Coming soon...
      </div>
      <div>
        <Image src="/images/team/blank.svg" width="80" height="80" alt="" /> Coming soon...
      </div>
      <div>
        <Image src="/images/team/blank.svg" width="80" height="80" alt="" /> Coming soon...
      </div>
      <div>
        <Image src="/images/team/blank.svg" width="80" height="80" alt="" /> Coming soon...
      </div>
    </div>
  );
}
