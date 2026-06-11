import type { Metadata } from 'next';
import ArticleCard from '../../components/ArticleCard';
import { Footer } from '../../components/Footer';
import { getAllArticles } from '../../lib/articles';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Articles — Hard Problems',
  description:
    'Reflections, book reviews, and other writing on impact-driven careers and the hard problems we work on.'
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <>
      <section className={styles.articles}>
        <h2>Articles</h2>
        <p className="intro">
          Reflections, book reviews, and other writing about impact-driven
          careers and the work happening on the world&rsquo;s hard problems.
        </p>

        {articles.length === 0 ? (
          <p>No articles yet — check back soon.</p>
        ) : (
          <ul className={styles.articleList}>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </ul>
        )}
      </section>
      <Footer />
    </>
  );
}
