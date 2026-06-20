import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ArticleCard from '../../../components/ArticleCard';
import {
  formatPublishedDate,
  getAllArticles,
  getArticleBySlug,
  topicDisplay
} from '../../../lib/articles';
import { getAuthorUrl } from '../../../lib/authors';
import styles from './article.module.scss';

// Hand-picked slugs shown in the "Top articles" rail at the bottom of
// every article page. Order here is the order they render. Extra slugs
// past the first three serve as backfill when the current article is
// itself one of the picks (so the rail always shows three cards).
const TOP_ARTICLE_SLUGS = [
  'hard-problems-explained',
  'use-a-spreadsheet-to-choose-your-next-role',
  'join-nonprofit-board-or-advisory-group',
  'hard-problems-job-board',
  'missing-piece-design-career',
  'tricks-find-meaningful-job-linkedin'
];

type Props = { params: Promise<{ slug: string }> };

// Split the article HTML at the boundary where the byline should be
// inserted. Preferred boundary is the end of the `.intro` paragraph (the
// lede); if there's no intro, fall back to the end of the H1 (title) so
// the byline still sits between the title and the body copy.
function splitForByline(html: string): { before: string; after: string } {
  const introIdx = html.search(/class=["']intro["']/i);
  if (introIdx !== -1) {
    const close = html.indexOf('</p>', introIdx);
    if (close !== -1) {
      const end = close + '</p>'.length;
      return { before: html.slice(0, end), after: html.slice(end) };
    }
  }
  const h1 = /<\/h1>/i.exec(html);
  if (h1) {
    const end = h1.index + h1[0].length;
    return { before: html.slice(0, end), after: html.slice(end) };
  }
  return { before: '', after: html };
}

// Pre-render every published article at build time. New articles ship by
// adding a .md file under content/articles/.
export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || article.status !== 'published') {
    return { title: 'Article — Hard Problems' };
  }
  const title =
    article.seoTitle ?? `${article.title} — Hard Problems`;
  const description = article.seoDescription || article.excerpt;
  return {
    title,
    description,
    alternates: article.canonicalUrl
      ? { canonical: article.canonicalUrl }
      : undefined,
    openGraph: {
      type: 'article',
      title: article.title,
      description,
      publishedTime: article.publishedAt || undefined,
      modifiedTime: article.updatedAt || undefined,
      authors: article.author ? [article.author] : undefined,
      images: article.image ? [article.image] : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: article.image ? [article.image] : undefined
    }
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  // 404 if the article doesn't exist at all. Drafts and in-review articles
  // 404 in production but are viewable in `next dev` so authors can preview
  // them at /articles/<slug> before flipping `status: published`.
  if (
    !article ||
    (article.status !== 'published' &&
      process.env.NODE_ENV !== 'development')
  )
    notFound();

  const { before, after } = splitForByline(article.contentHtml);

  // Build the "Top articles" rail. Filter out the current article so a
  // post never recommends itself, and skip any slug that doesn't resolve
  // to a published article (so a typo in the list above degrades
  // gracefully). Cap at 3 — extra slugs in TOP_ARTICLE_SLUGS act as
  // backfill when one of the top picks is the current article.
  const topArticles = TOP_ARTICLE_SLUGS.map((s) => getArticleBySlug(s))
    .filter(
      (a): a is NonNullable<typeof a> =>
        a != null && a.status === 'published' && a.slug !== article.slug
    )
    .slice(0, 3);

  return (
    <>
      <section className={styles.articleWrap}>
        <article className={styles.article}>
        <header className={styles.header}>
          {article.articleType &&
            (article.articleType.toLowerCase() === 'book review' ||
              article.articleType.toLowerCase() === 'opinion' ||
              article.articleType.toLowerCase() === 'advice' ||
              article.articleType.toLowerCase() === 'video') && (
              <p className={styles.preTitleLabel}>{article.articleType}</p>
            )}
        </header>

        <div className={styles.body}>
          <div dangerouslySetInnerHTML={{ __html: before }} />
          <ArticleByline article={article} />
          <div dangerouslySetInnerHTML={{ __html: after }} />
        </div>

        {article.topics.length > 0 && (
          <>
            <h3 className={styles.tagsLabel}>Tags</h3>
            <div className={styles.topics}>
              {article.topics.map((t) => (
                <Link
                  key={t}
                  href={`/articles/topic/${t}`}
                  className={`tag ${styles.topicTag}`}
                >
                  {topicDisplay(t)}
                </Link>
              ))}
            </div>
          </>
        )}
        </article>

        {topArticles.length > 0 && (
          <aside className={styles.topArticles}>
            <h2 className={styles.topArticlesHeading}>Top articles</h2>
            <ul className={styles.topArticlesList}>
              {topArticles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </ul>
          </aside>
        )}
      </section>
    </>
  );
}

// Byline row shown above the article body: "By <Author> · <Date> · N min read".
// Each piece is conditional, so the dot separators only appear between pieces
// that are actually rendered. Author becomes a link when we have a URL for them.
function ArticleByline({
  article
}: {
  article: ReturnType<typeof getArticleBySlug>;
}) {
  if (!article) return null;
  const authorUrl = article.author ? getAuthorUrl(article.author) : null;
  const parts: React.ReactNode[] = [];

  if (article.author) {
    const name = <strong>{article.author}</strong>;
    parts.push(
      <span key="author">
        By{' '}
        {authorUrl ? (
          <Link
            href={authorUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.authorLink}
          >
            {name}
          </Link>
        ) : (
          name
        )}
      </span>
    );
  }
  if (article.publishedAt) {
    parts.push(
      <time key="date" dateTime={article.publishedAt}>
        {formatPublishedDate(article.publishedAt)}
      </time>
    );
  }
  if (article.readingTime) {
    parts.push(<span key="read">{article.readingTime} min read</span>);
  }

  return (
    <p className={styles.byline}>
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 && <span aria-hidden="true"> · </span>}
          {part}
        </span>
      ))}
    </p>
  );
}
