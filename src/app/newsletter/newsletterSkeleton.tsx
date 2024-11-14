import Skeleton from 'react-loading-skeleton';
import styles from './page.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Podcast() {
  return (
    <div className={styles.newsletter}>
      <h3>
        <Skeleton />
      </h3>
      <p>
        <Skeleton className={styles.newsletterContent} />
      </p>
      <Skeleton className={styles.newsletterImage} />
    </div>
  );
}
