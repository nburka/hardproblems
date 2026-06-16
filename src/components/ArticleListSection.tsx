import type { ReactNode } from 'react';
import ArticleCard from './ArticleCard';
import { type Article } from '../lib/articles';
import styles from '../app/articles/page.module.scss';

// Wrapper used by every article-listing surface (/articles, /articles/
// topic/[topic], /articles/type/[type]). Keeps the heading + intro +
// hero-grid markup in one place so the three pages stay in lockstep.
export default function ArticleListSection({
  heading,
  intro,
  articles,
  emptyMessage = 'No articles yet — check back soon.'
}: {
  heading: string;
  intro: ReactNode;
  articles: Article[];
  emptyMessage?: string;
}) {
  return (
    <>
      <section className={styles.articles}>
        <h2>{heading}</h2>
        <p className="intro">{intro}</p>

        {articles.length === 0 ? (
          <p>{emptyMessage}</p>
        ) : (
          <ul className={styles.articleList}>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
