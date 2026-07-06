import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CompactArticleList from '../../../../components/CompactArticleList';
import CategoriesSidebar from '../../../../components/CategoriesSidebar';
import {
  articleTypeSlug,
  getAllArticles,
  pluralize,
  topicDisplay
} from '../../../../lib/articles';
import styles from '../../page.module.scss';

type Props = { params: Promise<{ type: string }> };

// Pre-render one page per distinct category — combining articleType
// slugs (`book-reviews`, `podcast`, etc.) and topic slugs (`careers`,
// `public-health`, etc.) into a single URL space. Also emits the
// special `all` route that lists every published article.
export function generateStaticParams() {
  const slugs = new Set<string>();
  slugs.add('all');
  for (const article of getAllArticles()) {
    if (article.articleType) {
      slugs.add(articleTypeSlug(article.articleType));
    }
    for (const t of article.topics) slugs.add(t);
  }
  return Array.from(slugs).map((type) => ({ type }));
}

// Resolve a URL slug against every published article. Prefers article
// type over topic if the same slug matches both (arbitrary but stable).
type Match = {
  label: string;
  articles: ReturnType<typeof getAllArticles>;
};
function resolveMatch(slug: string): Match | null {
  const all = getAllArticles();
  const byType = all.filter(
    (a) => articleTypeSlug(a.articleType) === slug
  );
  if (byType.length > 0) {
    return { label: byType[0].articleType, articles: byType };
  }
  const byTopic = all.filter((a) => a.topics.includes(slug));
  if (byTopic.length > 0) {
    return { label: topicDisplay(slug), articles: byTopic };
  }
  return null;
}

export async function generateMetadata({
  params
}: Props): Promise<Metadata> {
  const { type } = await params;
  if (type === 'all') {
    return {
      title: 'All content — Hard Problems',
      description: 'Every article from Hard Problems.'
    };
  }
  const match = resolveMatch(type);
  if (!match) return { title: 'Articles — Hard Problems' };
  const label = pluralize(match.label);
  return {
    title: `${label} — Hard Problems`,
    description: `${label} from Hard Problems.`
  };
}

export default async function TypePage({ params }: Props) {
  const { type } = await params;
  const allArticles = getAllArticles();
  const isAll = type === 'all';

  let articles = allArticles;
  let label = 'All content';
  if (!isAll) {
    const match = resolveMatch(type);
    if (!match) notFound();
    articles = match.articles;
    label = match.label;
  }

  return (
    <section>
      <div className={styles.typeLayout}>
        <aside className={styles.typeFilters}>
          <CategoriesSidebar
            allArticles={allArticles}
            activeKey={`type:${type}`}
          />
        </aside>
        <div className={styles.typeResults}>
          <h2 className={styles.typeHeading}>{label}</h2>
          <CompactArticleList articles={articles} />
        </div>
      </div>
    </section>
  );
}
