import Link from 'next/link';
import Image from 'next/image';
import { Team } from '../../components/Team';
import ArticleCard from '../../components/ArticleCard';
import { getArticleBySlug } from '../../lib/articles';
import articlesStyles from '../articles/page.module.scss';

export default function Page() {
  const featuredArticle = getArticleBySlug('explain-hard-problems');
  return (
    <>
      <section className="page-narrow">
        <p className="page-lede">
          Hard Problems is a nonprofit that helps designers to make the shift to
          working full-time on the world’s urgent problems &#8212; problems like
          climate change and public health.
        </p>

        <div className="column-split">
          <div>
            <h3>Our mission</h3>
            <p>
              While the loudest part of the tech world is focused on AI, crypto,
              fin-tech, and advertising, other people are trying to tackle the
              hardest, thorniest problems. Problems like climate change, public
              health, healthcare, and good government.
            </p>
            <p>
              Designers, product managers, user researchers, copywriters, and
              others know that these hard problems matter but they often wring
              their hands and stand by, unsure how to have any positive impact.
            </p>
            <p>
              It’s time to refocus the tech world on what matters most. It’s
              time to build new relationships between doctors,
              environmentalists, scientists, nonprofit leaders, public servants,
              and others tackling the world’s hardest problems with designers
              who can help make practical tools to help them succeed.
            </p>
            <p>
              We are a multi-skilled team of very experienced tech veterans and
              other subject-matter experts. We aim to push this effort &#8212;
              whether it’s by building teams to work on issues, creating bridges
              between ambitious experts and designers, finding ways to fund tech
              initiatives, or inspiring a generation of designers to work on
              these fundamentally important problems.
            </p>
          </div>
          <aside>
            <h3>Our team</h3>
            <p>We are an all-volunteer team from around the world.</p>
            <Team />
          </aside>
        </div>

        <blockquote className="space-top-large">
          <p>
            “The best minds of my generation are thinking about how to make
            people click ads. That sucks.”
          </p>
          <p>
            <Link href="/jobs">Jeff Hammerbacher, 2011</Link>
          </p>
        </blockquote>

        <h3 className="space-top-large">What success looks like</h3>
        <p>
          Thinking of this in terms of KPIs, we’d first think of measuring: the
          number of people we help make the leap from the traditional tech world
          to organizations that work on the world’s hard problems. In the
          broader sense, our goals are to change the culture of tech to value
          people who work on hard problems.
        </p>
        <h3 className="space-top-large">What we offer</h3>
        <div className="offer-stack offer-bento">
          <Link href="/jobs" className="grid-cell">
            <Image
              src="/images/icon-piggy-bank.svg"
              width="120"
              height="120"
              alt="Illustration of a piggy bank."
            />
            <b className="grid-link">Job board</b>
            <p className="grid-detail">For designers</p>
            <span className="bento-cta">Browse jobs</span>
          </Link>

          <Link href="/" className="grid-cell">
            <Image
              src="/images/icon-conversation.svg"
              width="120"
              height="120"
              alt="Speech bubbles."
            />
            <b className="grid-link">Articles &amp; advice</b>
            <p className="grid-detail">For designers and orgs</p>
            <span className="bento-cta">Read articles</span>
          </Link>

          <Link href="/podcast" className="grid-cell">
            <Image
              src="/images/icon-mic.svg"
              width="120"
              height="120"
              alt="Mic"
            />
            <b className="grid-link">Podcast</b>
            <p className="grid-detail">(coming soon)</p>
            <span className="bento-cta bento-cta--soon">Coming soon</span>
          </Link>

          <Link href="/coworking" className="grid-cell">
            <Image
              src="/images/icon-lamp.svg"
              width="120"
              height="120"
              alt="Work lamp."
            />
            <b className="grid-link">Co-working space</b>
            <p className="grid-detail">In London, UK</p>
            <span className="bento-cta">Book a tour</span>
          </Link>
        </div>
        <h3 className="space-top-large">Funding</h3>
        <p>
          We are a lean organization that is primarily self-funded by our
          founding team. But, we could use help.{' '}
          <Link href="/give">Learn how...</Link>
        </p>

        <h3 className="space-top-large">Hard Problems explained...</h3>
        {featuredArticle && (
          <div className={articlesStyles.aboutFeaturedArticle}>
            <ul className={articlesStyles.articleList}>
              <ArticleCard article={featuredArticle} />
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
