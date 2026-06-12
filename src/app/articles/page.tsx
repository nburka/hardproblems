import type { Metadata } from 'next';
import ArticleCard from '../../components/ArticleCard';
import { Footer } from '../../components/Footer';
import { getAllArticles } from '../../lib/articles';
import { fetchJobs } from '../jobs/fetchJobs';
import JobsTeaser from '../jobs/JobsTeaser';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Articles — Hard Problems',
  description:
    'Reflections, book reviews, and other writing on impact-driven careers and the hard problems we work on.'
};

// Headline page for the Articles section. At desktop, the newest article
// renders as a large hero on the left with a compact job-board teaser to
// its right; below, the remaining articles fall into a regular 3-up grid.
// This is the only article-listing surface that diverges from the shared
// `<ArticleListSection>` (topic and type pages still use it).
export default async function ArticlesPage() {
  const articles = getAllArticles();
  const heroArticle = articles[0];
  const remainingArticles = articles.slice(1);

  const jobs = await fetchJobs();
  const recentJobs = jobs.slice(0, 6);

  return (
    <>
      <section className={styles.articles}>
        {heroArticle && (
          <div className={styles.heroRow}>
            <ul className={styles.heroList}>
              <ArticleCard article={heroArticle} />
            </ul>
            <aside className={styles.heroJobs}>
              <h3>Newest jobs</h3>
              <JobsTeaser jobs={recentJobs} totalCount={jobs.length} />
            </aside>
          </div>
        )}

        {remainingArticles.length > 0 && (
          <ul className={styles.articleList}>
            {remainingArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </ul>
        )}
      </section>
      <Footer />
    </>
  );
}
