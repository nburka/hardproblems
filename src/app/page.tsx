import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ArticleCard from '../components/ArticleCard';
import CoworkingRotator from '../components/CoworkingRotator';
import NewsletterModule from '../components/NewsletterModule';
import { getAllArticles } from '../lib/articles';
import { fetchJobs } from './jobs/fetchJobs';
import JobsTeaser from './jobs/JobsTeaser';
import styles from './articles/page.module.scss';

// Homepage doubles as the articles index. At desktop, the newest article
// renders as a large hero on the left with a compact job-board teaser to
// its right; below, the remaining articles fall into a regular 3-up grid.
// On mobile the right-of-hero teaser is hidden — a second teaser is
// inserted into the article list after the 3rd article instead.
// Slug pinned to the secondary-hero slot (i === 3 in the remaining list)
// so it always sits on the same row as the Co-working London aside.
const COWORKING_HERO_SLUG = 'hard-problems-coworking-space';

// Curated reading lists rendered at the bottom of the homepage. Each
// column is a title + a list of article slugs. The book-reviews column
// picks up any article whose articleType is "Book reviews", so future
// reviews land there automatically.
const ORGS_SLUGS = [
  'design-in-public-health-in-india',
  'hidden-costs-of-bad-design',
  'geek-heresy-kentaro-toyama'
];

const DESIGNERS_SLUGS = [
  'using-a-spreadsheet-to-choose-your-next-role',
  'use-a-spreadsheet-to-choose-your-next-role',
  'join-nonprofit-board-or-advisory-group',
  'books-designers-hard-problems',
  'tricks-find-meaningful-job-linkedin',
  'missing-piece-design-career',
  'can-a-designer-improve-social-care',
  'explain-hard-problems'
];

// Explicit picks for the About us column that aren't tagged as
// "Announcements" but belong there anyway.
const ABOUT_EXTRA_SLUGS: string[] = [];

// Newest-first order matches the rest of the site.
const byDateDesc = (a: { publishedAt: string }, b: { publishedAt: string }) =>
  (b.publishedAt || '').localeCompare(a.publishedAt || '');

export default async function Home() {
  const articles = getAllArticles();
  // Cap the main homepage listing at 11 total (1 hero + up to 10
  // more). Anything past that only surfaces in the curated reading
  // rows at the bottom of the page.
  const HOMEPAGE_MAX_ARTICLES = 11;
  const heroArticle = articles[0];
  let remainingArticles = articles.slice(1, HOMEPAGE_MAX_ARTICLES);

  // Pin the co-working article into the secondary-hero slot.
  const coworkingIdx = remainingArticles.findIndex(
    (a) => a.slug === COWORKING_HERO_SLUG
  );
  if (coworkingIdx !== -1 && coworkingIdx !== 3) {
    const [coworkingArticle] = remainingArticles.splice(coworkingIdx, 1);
    const insertAt = Math.min(3, remainingArticles.length);
    remainingArticles = [
      ...remainingArticles.slice(0, insertAt),
      coworkingArticle,
      ...remainingArticles.slice(insertAt)
    ];
  }

  const jobs = await fetchJobs();
  const recentJobs = jobs.slice(0, 5);

  // Build the three curated columns for the reading-list block at the
  // bottom of the page. Look up by slug (dropping any that don't
  // resolve — e.g. unpublished drafts) and sort each column
  // newest-first. The designers column also picks up every "Book
  // reviews" article automatically, and the about-us column picks up
  // every "Announcements" article.
  const bySlug = (slug: string) =>
    articles.find((a) => a.slug === slug);
  const orgsArticles = ORGS_SLUGS.map(bySlug)
    .filter((a): a is NonNullable<typeof a> => a !== undefined)
    .sort(byDateDesc);
  const orgsSlugSet = new Set(orgsArticles.map((a) => a.slug));
  const designersFromSlugs = DESIGNERS_SLUGS.map(bySlug).filter(
    (a): a is NonNullable<typeof a> => a !== undefined
  );
  const designersSlugSet = new Set(designersFromSlugs.map((a) => a.slug));
  const bookReviewArticles = articles.filter(
    (a) => a.articleType?.toLowerCase() === 'book reviews'
  );
  const designersArticles = [
    ...designersFromSlugs,
    ...bookReviewArticles.filter(
      (a) => !designersSlugSet.has(a.slug) && !orgsSlugSet.has(a.slug)
    )
  ].sort(byDateDesc);
  const announcementArticles = articles.filter(
    (a) => a.articleType?.toLowerCase() === 'announcements'
  );
  const announcementSlugSet = new Set(announcementArticles.map((a) => a.slug));
  const aboutExtras = ABOUT_EXTRA_SLUGS.map(bySlug).filter(
    (a): a is NonNullable<typeof a> =>
      a !== undefined && !announcementSlugSet.has(a.slug)
  );
  const aboutArticles = [...announcementArticles, ...aboutExtras].sort(
    byDateDesc
  );

  return (
    <>
      <section className={styles.articles}>
        {heroArticle && (
          <div className={styles.heroRow}>
            <ul className={styles.heroList}>
              <ArticleCard article={heroArticle} />
            </ul>
            <aside className={styles.heroJobs}>
              <h3>New on the job board</h3>
              <JobsTeaser jobs={recentJobs} totalCount={jobs.length} />
            </aside>
          </div>
        )}

        {remainingArticles.length > 0 && (
          <ul className={styles.articleList}>
            {remainingArticles.map((article, i) => (
              <Fragment key={article.slug}>
                {/* Mobile-only newsletter module inserted just above the
                    "More content" heading. Hidden on desktop — a
                    desktop-only copy is slotted before the co-working
                    aside further down. */}
                {i === 2 && (
                  <li className={styles.newsletterModuleRowMobile}>
                    <NewsletterModule />
                  </li>
                )}
                {/* Mobile-only "More content" heading right before the
                    first compact card. Hidden on desktop. */}
                {i === 2 && (
                  <li className={styles.moreContentHeading}>
                    <h3>More content</h3>
                  </li>
                )}
                {/* hero = 1st article, list = 2nd onward. Indices 0,1
                    are the 2nd and 3rd articles → standard card.
                    Indices 2+ are the 4th onward → compact card on
                    mobile (image left + text right with top rule).
                    Desktop falls back to the normal card layout via
                    the @media rules in page.module.scss. */}
                {/* Desktop only — slot the Co-working aside into the
                    left grid column right before the secondary hero
                    so the row reads as: [aside | hero spanning 2/3].
                    Hidden on mobile via CSS. */}
                {i === 3 && (
                  <li className={styles.newsletterModuleRow}>
                    <NewsletterModule />
                  </li>
                )}
                {i === 3 && (
                  <li className={styles.coworkingAside}>
                    <h3>Co-working in London</h3>
                    <p className={styles.coworkingAsideIntro}>
                      These health and climate organizations use our{' '}
                      <Link href="/coworking">co-working space</Link> in London,
                      UK. You can use our space if you are visiting the city.
                    </p>
                    <CoworkingRotator />
                    <p className={styles.coworkingAsideCta}>
                      <Link
                        href="/coworking"
                        className="black-button black-button--small"
                      >
                        Learn more…
                      </Link>
                    </p>
                  </li>
                )}
                <ArticleCard
                  article={article}
                  compact={i >= 0}
                  hero={i === 3}
                  hideDate={article.slug === COWORKING_HERO_SLUG}
                />
                {/* Mobile-only jobs teaser slotted between the 3rd
                    and 4th articles. Hidden on desktop where the
                    .heroJobs teaser to the right of the hero already
                    serves the same purpose. */}
                {i === 1 && (
                  <li className={styles.mobileJobsTeaser}>
                    <h3>New on the job board</h3>
                    <JobsTeaser jobs={recentJobs} totalCount={jobs.length} />
                  </li>
                )}
              </Fragment>
            ))}
          </ul>
        )}

        <div className={styles.guides} aria-label="Reading lists">
          <ul className={styles.guidesRows}>
            <ReadingRow title="For orgs" articles={orgsArticles} />
            <ReadingRow title="For designers" articles={designersArticles} />
            <ReadingRow title="About us" articles={aboutArticles} />
          </ul>
        </div>
      </section>
    </>
  );
}

// Reading-list row at the bottom of the homepage. On desktop the row
// is a 5-across grid: the section title sits in column 1 and up to
// four articles fill columns 2-5. Overflow articles wrap to the next
// row indented one cell (still starting at column 2). Each article
// shows a thumbnail above its title.
function ReadingRow({
  title,
  articles
}: {
  title: string;
  articles: {
    slug: string;
    title: string;
    readingTime: number;
    articleType: string;
    image?: string;
    imageAlt?: string;
  }[];
}) {
  if (articles.length === 0) return null;
  return (
    <li className={styles.readingRow}>
      <h3 className={styles.readingRowTitle}>{title}</h3>
      <ul className={styles.readingRowArticles}>
        {articles.map((article) => {
          const type = article.articleType?.toLowerCase();
          const unit =
            type === 'video'
              ? 'video'
              : type === 'podcast'
                ? 'podcast'
                : 'read';
          return (
            <li key={article.slug} className={styles.readingRowArticle}>
              <Link
                href={`/articles/${article.slug}`}
                className={`${styles.readingRowLink} hover-saturate`}
              >
                {article.image && (
                  <div className={styles.readingRowThumb}>
                    <Image
                      src={article.image}
                      alt={article.imageAlt ?? ''}
                      width={400}
                      height={300}
                      className={styles.readingRowImg}
                    />
                  </div>
                )}
                <h4 className={styles.readingRowArticleTitle}>
                  {article.title}
                </h4>
                {article.readingTime > 0 && (
                  <span className={styles.readingRowMeta}>
                    {article.readingTime} min {unit}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </li>
  );
}
