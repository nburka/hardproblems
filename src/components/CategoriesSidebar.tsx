import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import {
  type Article,
  articleTypeSlug,
  topicDisplay
} from '../lib/articles';
import styles from '../app/articles/page.module.scss';

// Right-rail "All categories" list shown on /articles/type/[type] and
// /articles/topic/[topic]. Combines every article-type and topic across
// all published articles into one alphabetised list with counts.
export default function CategoriesSidebar({
  allArticles,
  activeKey
}: {
  allArticles: Article[];
  activeKey?: string;
}) {
  const typeCounts = new Map<string, number>();
  const topicCounts = new Map<string, number>();
  for (const a of allArticles) {
    if (a.articleType) {
      typeCounts.set(
        a.articleType,
        (typeCounts.get(a.articleType) || 0) + 1
      );
    }
    for (const t of a.topics) {
      topicCounts.set(t, (topicCounts.get(t) || 0) + 1);
    }
  }

  type Entry = {
    key: string;
    label: string;
    href: string;
    count: number;
  };
  const entries: Entry[] = [];
  for (const [type, count] of typeCounts) {
    entries.push({
      key: `type:${articleTypeSlug(type)}`,
      label: type,
      href: `/articles/type/${articleTypeSlug(type)}`,
      count
    });
  }
  for (const [topic, count] of topicCounts) {
    entries.push({
      key: `type:${topic}`,
      label: topicDisplay(topic),
      href: `/articles/type/${topic}`,
      count
    });
  }
  entries.sort((a, b) =>
    a.label.toLowerCase().localeCompare(b.label.toLowerCase())
  );

  const allEntry: Entry = {
    key: 'type:all',
    label: 'All',
    href: '/articles/type/all',
    count: allArticles.length
  };

  return (
    <>
      <h2 className={styles.categoriesHeading}>Categories</h2>
      <ul className={styles.categoriesList}>
        {[allEntry, ...entries].map((entry) => {
          const isActive = entry.key === activeKey;
          return (
            <li key={entry.key}>
              <Link
                href={entry.href}
                className={`${styles.categoriesLink} ${
                  isActive ? styles.categoriesLinkActive : ''
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span>{entry.label}</span>
                <span className={styles.categoriesMeta}>
                  <span className={styles.categoriesCount}>
                    {entry.count}
                  </span>
                  <BookOpen
                    className={styles.categoriesIcon}
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
