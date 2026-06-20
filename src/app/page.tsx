import { Fragment } from 'react';
import ArticleCard from '../components/ArticleCard';
import { getAllArticles } from '../lib/articles';
import { fetchJobs } from './jobs/fetchJobs';
import JobsTeaser from './jobs/JobsTeaser';
import styles from './articles/page.module.scss';

// Homepage doubles as the articles index. At desktop, the newest article
// renders as a large hero on the left with a compact job-board teaser to
// its right; below, the remaining articles fall into a regular 3-up grid.
// On mobile the right-of-hero teaser is hidden — a second teaser is
// inserted into the article list after the 3rd article instead.
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
            {remainingArticles.map((article, i) => (
              <Fragment key={article.slug}>
                <ArticleCard article={article} />
                {/* Inserted after the 2nd remaining card = the 3rd
                    article overall on the page (hero + 2 cards above).
                    Mobile only — hidden on desktop where the
                    .heroJobs teaser to the right of the hero serves
                    the same purpose. */}
                {i === 1 && (
                  <li className={styles.mobileJobsTeaser}>
                    <h3>Newest jobs</h3>
                    <JobsTeaser
                      jobs={recentJobs}
                      totalCount={jobs.length}
                    />
                  </li>
                )}
              </Fragment>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
