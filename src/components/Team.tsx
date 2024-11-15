import Image from 'next/image';
import styles from './team.module.scss';

export function Team() {
  return (
    <div className={styles.team}>
      <div>
        <Image src="/images/user.png" width="80" height="80" alt="" /> Elyce
        Cole
      </div>
      <div>
        <Image src="/images/user.png" width="80" height="80" alt="" /> Daniel
        Burka
      </div>
      <div>
        <Image src="/images/user.png" width="80" height="80" alt="" /> Person 3
      </div>
      <div>
        <Image src="/images/user.png" width="80" height="80" alt="" /> Person 4
      </div>
      <div>
        <Image src="/images/user.png" width="80" height="80" alt="" /> Person 5
      </div>
      <div>
        <Image src="/images/user.png" width="80" height="80" alt="" /> Person 6
      </div>
      <div>
        <Image src="/images/user.png" width="80" height="80" alt="" /> Person 7
      </div>
    </div>
  );
}
