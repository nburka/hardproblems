import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleCard from '../../../../components/ArticleCard';
import { Footer } from '../../../../components/Footer';
import {
  articleTypeSlug,
  getAllArticles,
  pluralize
} from '../../../../lib/articles';
import styles from '../../page.module.scss';

type Props = { params: Promise<{ type: string }> };

// Pre-render one page per distinct articleType across all published
// articles (so e.g. `book-review`, `podcast`, etc. get their own route).
export function generateStaticParams() {
  const types = new Set<string>();
  for (const article of getAllArticles()) {
    if (article.articleType) {
      types.add(articleTypeSlug(article.articleType));
    }
  }
  return Array.from(types).map((type) => ({ type }));
}

export async function generateMetadata({
  params
}: Props): Promise<Metadata> {
  const { type } = await params;
  const articles = getAllArticles().filter(
    (a) => articleTypeSlug(a.articleType) === type
  );
  if (articles.length === 0) {
    return { title: 'Articles — Hard Problems' };
  }
  const label = pluralize(articles[0].articleType);
  return {
    title: `${label} — Hard Problems`,
    description: `${label} from Hard Problems.`
  };
}

export default async function TypePage({ params }: Props) {
  const { type } = await params;
  const articles = getAllArticles().filter(
    (a) => articleTypeSlug(a.articleType) === type
  );
  if (articles.length === 0) notFound();

  const label = pluralize(articles[0].articleType);

  return (
    <>
      <section className={styles.articles}>
        <h2>{label}</h2>
        <p className="intro">
          All <strong>{label.toLowerCase()}</strong> from Hard Problems.
        </p>

        <ul className={styles.articleList}>
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </ul>
      </section>
      <Footer />
    </>
  );
}
