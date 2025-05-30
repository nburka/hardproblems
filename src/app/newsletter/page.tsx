'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  pubDate: Date;
};

export default function Page() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [newslettersLoaded, setNewslettersLoaded] = useState<boolean>(false);
  const parser = new Parser();
  useEffect(() => {
    if (!newslettersLoaded) {
      parser.parseURL('/api/newsletters').then((feed) => {
        setNewsletters(
          feed.items.map((item) => {
            return {
              id: item.guid || '',
              title: item.title || '',
              content: item.content || '',
              image: item.enclosure?.url || '',
              url: item.link || '',
              pubDate: new Date(item.pubDate || '')
            };
          })
        );
        setNewslettersLoaded(true);
      });
    }
  });

  const dateFormat: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  return (
    <>
      <section className="left">
        <h2>Newsletter</h2>
        <p className="intro">
          This is the email newsletter for technologists, engineers, designers, product managers, and
          others  who want to work on hard problems.
        </p>
        <p>We share job opportunities, great books, relevant news, and events from around the world.</p>

        <h3 className="space-top-large">Recent newsletters</h3>
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
                  <div>
                    <Link href={newsletter.url} target="_blank">
                      <Image
                        src={newsletter.image}
                        width="512"
                        height="236"
                        alt={newsletter.title}
                        className={styles.newsletterImage}
                      />
                    </Link>
                  </div>
                  <h4>
                    <Link href={newsletter.url} target="_blank">
                      {newsletter.title}
                    </Link>
                  </h4>
                  <div>
                    <p>{newsletter.content}</p>
                    <small>
                      {newsletter.pubDate.toLocaleDateString('en', dateFormat)}
                    </small>
                  </div>
                </div>
              );
            })}
        </div>
      </section>
      <section className="right">
        <h3>Subscribe</h3>
        <NewsletterForm />
        <h3 className="divider">About the newsletter</h3>
        <ul>
          <li>3-4 emails per month</li>
          <li>No spam</li>
          <li>We will never share our email list</li>
          <li>Easy unsubscribe</li>
        </ul>
        <p>
          Browse our previous newsletters on this page to get a flavor for what we post. We try to
          focus on relevant news, upcoming events, and new job opportunities from around the world.
        </p>
      </section>
      <Footer />
    </>
  );
}
