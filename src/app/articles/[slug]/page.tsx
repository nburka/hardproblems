import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Footer } from '../../../components/Footer';
import {
  articleTypeSlug,
  formatPublishedDate,
  getAllArticles,
  getArticleBySlug,
  topicDisplay
} from '../../../lib/articles';
import { getAuthorUrl } from '../../../lib/authors';
import styles from './article.module.scss';

type Props = { params: Promise<{ slug: string }> };

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

  return (
    <>
      <section className={styles.articleWrap}>
        <div className={styles.topBar}>
          <p className={styles.breadcrumb}>
            <Link href="/articles">
              <span aria-hidden="true">←</span> Articles
            </Link>
            {article.articleType &&
              article.articleType.toLowerCase() !== 'article' && (
                <>
                  <span
                    aria-hidden="true"
                    className={styles.breadcrumbSep}
                  >
                    {' / '}
                  </span>
                  <Link
                    href={`/articles/type/${articleTypeSlug(
                      article.articleType
                    )}`}
                  >
                    {article.articleType}
                  </Link>
                </>
              )}
          </p>
          <ArticleByline article={article} />
        </div>

        <article className={styles.article}>
        <header className={styles.header}>
          {article.articleType &&
            (article.articleType.toLowerCase() === 'book review' ||
              article.articleType.toLowerCase() === 'opinion') && (
              <p className={styles.preTitleLabel}>{article.articleType}</p>
            )}
        </header>

        <div
          className={styles.body}
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

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
      </section>
      <Footer />
    </>
  );
}

// Byline row shown in the article's top bar: "By <Author> · <Date> · N min read".
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
