import Image from 'next/image';
import Link from 'next/link';
import { type Article } from '../lib/articles';
import styles from '../app/articles/page.module.scss';

// Filled play triangle — used in the "Watch" badge on Video cards.
function PlayIcon() {
  return (
    <svg
      className={styles.articleCardBadgeIcon}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

// Spotify-style headphones — used in the "Listen" badge on Podcast
// cards. Drawn with a thin stroke so it reads at small sizes.
function HeadphonesIcon() {
  return (
    <svg
      className={styles.articleCardBadgeIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 17v-5a9 9 0 0 1 18 0v5" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

// Shared card used by both /articles (full listing) and
// /articles/topic/[topic] (per-topic listings). Keeping a single component
// keeps the two surfaces visually identical.
//
// `compact` enables a mobile-only horizontal layout used on the
// homepage for the 4th-and-later cards (image left, text right, top
// rule). Desktop falls back to the normal stacked card.
// `hero` enables a desktop-only wider layout — full-grid-width with
// image on the left and text on the right. Used for the 7th article
// on the homepage as a "secondary hero" break in the article list.
// On mobile the hero flag has no effect (compact still applies).
export default function ArticleCard({
  article,
  compact = false,
  hero = false
}: {
  article: Article;
  compact?: boolean;
  hero?: boolean;
}) {
  const articleTypeLower = article.articleType?.toLowerCase();
  const isVideo = articleTypeLower === 'video';
  const isPodcast = articleTypeLower === 'podcast';

  return (
    <li
      className={`${styles.articleCard} ${
        compact ? styles.articleCardCompact : ''
      } ${hero ? styles.articleCardHero : ''}`}
    >
      <Link
        href={`/articles/${article.slug}`}
        className={`${styles.articleCardLink} hover-saturate`}
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
            {isVideo && (
              <span className={styles.articleCardBadge}>
                <PlayIcon />
                Watch
              </span>
            )}
            {isPodcast && (
              <span className={styles.articleCardBadge}>
                <HeadphonesIcon />
                Listen
              </span>
            )}
          </div>
        )}
        <div className={styles.articleCardBody}>
          <h3 className={styles.articleCardTitle}>{article.title}</h3>
          {article.excerpt && (
            <p className={styles.articleCardExcerpt}>{article.excerpt}</p>
          )}
          {article.readingTime && !isVideo && !isPodcast ? (
            <p className={styles.articleCardReadingTime}>
              {article.readingTime} min read
            </p>
          ) : null}
        </div>
      </Link>
    </li>
  );
}
