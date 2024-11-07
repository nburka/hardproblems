'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Newsletter = {
  id: number;
  title: string;
  thumbnail_url: string;
  web_url: string;
};

type NewsletterResponse = {
  data: Newsletter[];
};

export default function Page() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);

  const headers = {
    Authorization: ''
  };

  const publicationId = 'pub_b8e3a238-0b92-430d-8539-2e2e32ec213d';

  useEffect(() => {
    fetch(`https://api.beehiiv.com/v2/publications/${publicationId}/posts`, {
      headers
    })
      .then((response) => response.json())
      .then((data: NewsletterResponse) => {
        setNewsletters(data.data);
      });
  });

  return (
    <>
      <section className="left">
        <h3>Newsletters</h3>
        {newsletters &&
          newsletters.map((newsletter) => {
            return (
              <div key={newsletter.id}>
                <h3>
                  <Link href={newsletter.web_url}>{newsletter.title}</Link>
                </h3>
                <Image
                  src={newsletter.thumbnail_url}
                  width="256"
                  height="118"
                  alt={newsletter.title}
                />
              </div>
            );
          })}
      </section>
    </>
  );
}
