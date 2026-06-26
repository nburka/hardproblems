import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleListSection from '../../../../components/ArticleListSection';
import {
  articleTypeSlug,
  getAllArticles,
  pluralize
} from '../../../../lib/articles';

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
  const typeName = articles[0].articleType;

  return (
    <ArticleListSection
      heading={label}
      intro={<>All articles under the category: {typeName}</>}
      articles={articles}
    />
  );
}
