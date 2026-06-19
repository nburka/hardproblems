import Image from 'next/image';
import Link from 'next/link';
import { type Article } from '../lib/articles';
import styles from '../app/articles/page.module.scss';

// Shared card used by both /articles (full listing) and
// /articles/topic/[topic] (per-topic listings). Keeping a single component
// keeps the two surfaces visually identical.
export default function ArticleCard({ article }: { article: Article }) {
  return (
    <li className={styles.articleCard}>
      <Link
        href={`/articles/${article.slug}`}
        className={styles.articleCardLink}
      >
        <span className={styles.articleType}>{article.articleType}</span>
        {(article.image || article.thumbnailVideo) && (
          <div className={styles.articleCardImageWrap}>
            {article.thumbnailVideo ? (
              <video
                className={styles.articleCardVideo}
                poster={article.image}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label={article.imageAlt ?? article.title}
              >
                {article.thumbnailVideoWebm && (
                  <source src={article.thumbnailVideoWebm} type="video/webm" />
                )}
                <source src={article.thumbnailVideo} type="video/mp4" />
              </video>
            ) : (
              article.image && (
                <Image
                  src={article.image}
                  alt={article.imageAlt ?? ''}
                  width={1200}
                  height={800}
                  className={styles.articleCardImage}
                />
              )
            )}
          </div>
        )}
        <div className={styles.articleCardBody}>
          <h3 className={styles.articleCardTitle}>{article.title}</h3>
          {article.excerpt && (
            <p className={styles.articleCardExcerpt}>{article.excerpt}</p>
          )}
          {article.readingTime &&
          article.articleType?.toLowerCase() !== 'video' ? (
            <p className={styles.articleCardReadingTime}>
              {article.readingTime} min read
            </p>
          ) : null}
        </div>
      </Link>
    </li>
  );
}
