import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleCard from '../../../../components/ArticleCard';
import { Footer } from '../../../../components/Footer';
import { getAllArticles, topicDisplay } from '../../../../lib/articles';
import styles from '../../page.module.scss';

type Props = { params: Promise<{ topic: string }> };

// Pre-render one page per topic that appears in any published article.
export function generateStaticParams() {
  const topics = new Set<string>();
  for (const article of getAllArticles()) {
    for (const t of article.topics) topics.add(t);
  }
  return Array.from(topics).map((topic) => ({ topic }));
}

export async function generateMetadata({
  params
}: Props): Promise<Metadata> {
  const { topic } = await params;
  const label = topicDisplay(topic);
  return {
    title: `${label} — Articles — Hard Problems`,
    description: `Articles tagged ${label} from Hard Problems.`
  };
}

export default async function TopicPage({ params }: Props) {
  const { topic } = await params;
  const articles = getAllArticles().filter((a) =>
    a.topics.includes(topic)
  );
  if (articles.length === 0) notFound();

  const label = topicDisplay(topic);

  return (
    <>
      <section className={styles.articles}>
        <h2>{label}</h2>
        <p className="intro">
          Articles tagged <strong>{label}</strong>.
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
