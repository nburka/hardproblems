import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';

// All articles live as Markdown files under content/articles/. Adding a new
// file there is the entire workflow for publishing an article — the file
// system is the CMS.
const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');

// markdown-it-attrs gives us the Pandoc-style `{#id .class key=val}` syntax
// that the source articles use for heading anchors, paragraph classes, and
// image classes (e.g. `{.float-right}` on inline cover images).
const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
}).use(markdownItAttrs);

export type ArticleStatus = 'draft' | 'review' | 'published';

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  authorSlug?: string;
  publishedAt: string; // ISO date string (YYYY-MM-DD)
  updatedAt: string;
  status: ArticleStatus;
  articleType: string; // e.g. "Article", "Book Review", "Podcast"
  topics: string[];
  organizations: string[];
  people: string[];
  readingTime: number; // minutes
  featured: boolean;
  image?: string; // path under /public, used as thumbnail + OG image
  imageAlt?: string;
  // Optional looping video shown in the listing thumbnail box. `image`
  // is still used as the poster/fallback and as the OG/social image.
  thumbnailVideo?: string; // path under /public (mp4); webm sibling auto-used
  thumbnailVideoWebm?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  // Raw markdown body — useful for excerpt extraction or RSS feeds later.
  content: string;
  // Rendered HTML body, ready to be dangerouslySetInnerHTML'd.
  contentHtml: string;
};

function listArticleFiles(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.markdown'));
}

function readArticleFile(filename: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, filename);
  if (!fs.existsSync(filePath)) return null;
  const slug = filename.replace(/\.(md|markdown)$/, '');
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const data = parsed.data as Partial<Article>;
  const content = parsed.content;
  const contentHtml = md.render(content);

  return {
    slug: typeof data.slug === 'string' && data.slug ? data.slug : slug,
    title: data.title ?? slug,
    excerpt: data.excerpt ?? '',
    author: data.author ?? '',
    authorSlug: data.authorSlug,
    publishedAt: data.publishedAt ?? '',
    updatedAt: data.updatedAt ?? data.publishedAt ?? '',
    status: (data.status as ArticleStatus) ?? 'draft',
    articleType: data.articleType ?? 'Article',
    topics: Array.isArray(data.topics) ? data.topics : [],
    organizations: Array.isArray(data.organizations)
      ? data.organizations
      : [],
    people: Array.isArray(data.people) ? data.people : [],
    readingTime:
      typeof data.readingTime === 'number'
        ? data.readingTime
        : estimateReadingTime(content),
    featured: data.featured === true,
    image: data.image,
    imageAlt: data.imageAlt,
    thumbnailVideo: data.thumbnailVideo,
    thumbnailVideoWebm: data.thumbnailVideoWebm,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    canonicalUrl: data.canonicalUrl,
    content,
    contentHtml
  };
}

// ~250 words/minute average reading speed, rounded up to whole minutes.
function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 250));
}

// Returns all published articles, newest-first. Drafts and review-status
// items are excluded from the public listing but `getArticleBySlug` still
// returns them (gated on `status` in the page component) so authors can
// preview by visiting the URL directly during local dev.
export function getAllArticles(): Article[] {
  const articles = listArticleFiles()
    .map(readArticleFile)
    .filter((a): a is Article => a !== null)
    .filter((a) => a.status === 'published');

  return articles.sort((a, b) =>
    (b.publishedAt || '').localeCompare(a.publishedAt || '')
  );
}

export function getArticleBySlug(slug: string): Article | null {
  // Look up by frontmatter `slug` first (canonical), falling back to the
  // filename. Allows the file on disk to be renamed without breaking URLs.
  for (const file of listArticleFiles()) {
    const article = readArticleFile(file);
    if (!article) continue;
    if (article.slug === slug) return article;
  }
  return null;
}

// Turn a topic slug (kebab-case, lower) into the display form: dashes →
// spaces, first letter capitalized, rest lower-case. So "social-impact"
// becomes "Social impact" and "ai" becomes "Ai".
export function topicDisplay(topic: string): string {
  const spaced = topic.replace(/-/g, ' ').trim();
  if (!spaced) return '';
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

// Convert an article-type label (e.g. "Book Review") to a URL slug
// ("book-review"). Used by the breadcrumb link and the /articles/type/
// route handler.
export function articleTypeSlug(type: string): string {
  return type.trim().toLowerCase().replace(/\s+/g, '-');
}

// Naive pluralisation good enough for the article-type labels we use
// (Article, Book Review, Podcast, Interview, etc.). Doesn't handle
// irregulars — extend if we add a type like "Analysis" later.
export function pluralize(label: string): string {
  if (!label) return '';
  if (label.endsWith('s')) return label;
  if (/[^aeiou]y$/i.test(label)) return label.slice(0, -1) + 'ies';
  return label + 's';
}

// Friendly subtitles for the topic / type OG cards. Kept in this single
// place so we can re-use them anywhere we want a one-line description of
// a topic or article type. Unmapped slugs fall back to no subtitle.
const TOPIC_SUBTITLES: Record<string, string> = {
  careers: 'Building a career around the problems that matter.',
  'social-impact':
    'Writing on impact-driven work and the people doing it.',
  'job-search':
    'Practical advice for finding meaningful roles at orgs doing meaningful work.',
  design: 'How designers can apply themselves to hard problems.',
  'decision-making':
    'Approaches for making big career decisions with more clarity.',
  frameworks:
    'Tools and rubrics for approaching hard problems.',
  'tech-for-good': 'Using technology to make a positive difference.'
};

export function topicSubtitle(topic: string): string | undefined {
  return TOPIC_SUBTITLES[topic];
}

const ARTICLE_TYPE_SUBTITLES: Record<string, string> = {
  article:
    'Reflections and writing about hard problems and impact-driven careers.',
  advice:
    'Practical guidance for navigating impact-driven careers and the work that matters.',
  'book-review':
    'Books we’ve read on impact-driven careers and the work that matters.',
  tools:
    'Practical tools and rubrics for thinking through impact-driven work.',
  opinion:
    'Personal takes on careers, design, and the work that matters.',
  podcast:
    'Conversations with designers working on hard problems.',
  video:
    'Talks, conference sessions, and videos on design and the hard problems that matter.',
  'about-us':
    'Updates and stories about Hard Problems — what we’re building and why.'
};

export function articleTypeSubtitle(
  typeSlug: string
): string | undefined {
  return ARTICLE_TYPE_SUBTITLES[typeSlug];
}

// Helper used by the article page header.
export function formatPublishedDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
