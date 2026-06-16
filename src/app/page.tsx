import ArticleCard from '../components/ArticleCard';
import { getAllArticles } from '../lib/articles';
import { fetchJobs } from './jobs/fetchJobs';
import JobsTeaser from './jobs/JobsTeaser';
import styles from './articles/page.module.scss';

// Homepage doubles as the articles index. At desktop, the newest article
// renders as a large hero on the left with a compact job-board teaser to
// its right; below, the remaining articles fall into a regular 3-up grid.
export default async function Home() {
  const articles = getAllArticles();
  const heroArticle = articles[0];
  const remainingArticles = articles.slice(1);

  const jobs = await fetchJobs();
  const recentJobs = jobs.slice(0, 5);

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
    </>
  );
}
