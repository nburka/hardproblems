import Image from 'next/image';
import Link from 'next/link';
import { type Article, formatPublishedDate } from '../lib/articles';
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
        {article.image && (
          <div className={styles.articleCardImageWrap}>
            <Image
              src={article.image}
              alt={article.imageAlt ?? ''}
              width={1200}
              height={800}
              className={styles.articleCardImage}
            />
            <span className={styles.articleType}>{article.articleType}</span>
          </div>
        )}
        <div className={styles.articleCardBody}>
          {!article.image && (
            <span className={styles.articleType}>{article.articleType}</span>
          )}
          <h3 className={styles.articleCardTitle}>{article.title}</h3>
          {article.excerpt && (
            <p className={styles.articleCardExcerpt}>{article.excerpt}</p>
          )}
          <div className={styles.articleCardMeta}>
            {article.author && <span>{article.author}</span>}
            {article.author && article.publishedAt && (
              <span aria-hidden="true">·</span>
            )}
            {article.publishedAt && (
              <time dateTime={article.publishedAt}>
                {formatPublishedDate(article.publishedAt)}
              </time>
            )}
            {article.readingTime && (
              <>
                <span aria-hidden="true">·</span>
                <span>{article.readingTime} min read</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}
