'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Parser from 'rss-parser';
import NewsletterSkeleton from './newsletterSkeleton';
import NewsletterForm from '../../components/NewsletterForm';
import { Footer } from '../../components/Footer';
import styles from './page.module.scss';

type Newsletter = {
  id: string;
  title: string;
  content: string;
  image: string;
  url: string;
};

export default function Page() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [newslettersLoaded, setNewslettersLoaded] = useState<boolean>(false);
  const parser = new Parser();
  useEffect(() => {
    parser
      .parseURL('https://rss.beehiiv.com/feeds/wQIRuYfjAg.xml')
      .then((feed) => {
        setNewsletters(
          feed.items.map((item) => {
            return {
              id: item.guid || '',
              title: item.title || '',
              content: item.content || '',
              image: item.enclosure?.url || '',
              url: item.link || ''
            };
          })
        );
        setNewslettersLoaded(true);
      });
  });

  return (
    <>
      <section className="left">
        <h2>Newsletters</h2>
        <div className={styles.newsletters}>
          {!newslettersLoaded && (
            <>
              <NewsletterSkeleton />
              <NewsletterSkeleton />
              <NewsletterSkeleton />
            </>
          )}

          {newslettersLoaded &&
            newsletters &&
            newsletters.map((newsletter) => {
              return (
                <div key={newsletter.id} className={styles.newsletter}>
                  <h3>
                    <Link href={newsletter.url} target="_blank">
                      {newsletter.title}
                    </Link>
                  </h3>
                  <p>{newsletter.content}</p>
                  <div>
                    <Link href={newsletter.url} target="_blank">
                      <img
                        src={newsletter.image}
                        width="512"
                        height="236"
                        alt={newsletter.title}
                      />
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
      </section>
      <section className="right">
        <h3>Subscribe to our new monthly newsletter</h3>
        <NewsletterForm />
      </section>
      <section className="left"></section>
      <section className="right">
        <Footer />
      </section>
    </>
  );
}
