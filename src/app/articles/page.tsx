import type { Metadata } from 'next';
import ArticleListSection from '../../components/ArticleListSection';
import { getAllArticles } from '../../lib/articles';

export const metadata: Metadata = {
  title: 'Articles — Hard Problems',
  description:
    'Reflections, book reviews, and other writing on impact-driven careers and the hard problems we work on.'
};

export default function ArticlesPage() {
  return (
    <ArticleListSection
      heading="Articles"
      intro={
        <>
          Reflections, book reviews, and other writing about impact-driven
          careers and the work happening on the world&rsquo;s hard problems.
        </>
      }
      articles={getAllArticles()}
    />
  );
}
