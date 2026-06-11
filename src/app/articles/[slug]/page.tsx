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
            <Link href="/articles">Articles</Link>
            {article.articleType &&
              article.articleType.toLowerCase() !== 'article' && (
                <>
                  <span aria-hidden="true"> / </span>
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
          <p className={styles.byline}>
            {article.author &&
              (() => {
                const authorUrl = getAuthorUrl(article.author);
                const name = <strong>{article.author}</strong>;
                return (
                  <>
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
                  </>
                );
              })()}
            {article.author && article.publishedAt && (
              <span aria-hidden="true"> · </span>
            )}
            {article.publishedAt && (
              <time dateTime={article.publishedAt}>
                {formatPublishedDate(article.publishedAt)}
              </time>
            )}
            {article.readingTime ? (
              <>
                <span aria-hidden="true"> · </span>
                <span>{article.readingTime} min read</span>
              </>
            ) : null}
          </p>
        </div>

        <article className={styles.article}>
        <header className={styles.header}>
          {article.articleType?.toLowerCase() === 'book review' && (
            <p className={styles.preTitleLabel}>Book Review</p>
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
