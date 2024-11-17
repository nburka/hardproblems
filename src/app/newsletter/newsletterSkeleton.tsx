import Skeleton from 'react-loading-skeleton';
import styles from './page.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Podcast() {
  return (
    <div className={styles.newsletterSkeleton}>
      <div className={styles.newsletter}>
        <Skeleton className={styles.newsletterImage} />
        <h3>
          <Skeleton />
        </h3>
        <div>
          <small>
            <Skeleton />
          </small>
        </div>
        <p>
          <Skeleton className={styles.newsletterContent} />
        </p>
      </div>
    </div>
  );
}
