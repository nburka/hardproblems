import type { Metadata } from 'next';
import Link from 'next/link';
import TopBar from '../components/TopBar';
import PostHogProvider from '../components/PostHogProvider';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://hardproblems.com'),
  title: 'Hard Problems',
  description:
    'Helping tech people to work on the hard problems that matter in the world: problems like public health, climate change, poverty, and good government.',
  openGraph: {
    title: 'Hard Problems',
    description:
      'A not-for-profit helping tech people to work on the hard problems that matter in the world.',
    url: 'https://hardproblems.com',
    siteName: 'Hard Problems',
    type: 'website'
    // og:image is supplied per-route via each opengraph-image.tsx;
    // routes without one fall back automatically.
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hard Problems',
    description:
      'A not-for-profit helping tech people to work on the hard problems that matter in the world.'
    // twitter:image is auto-populated by Next.js from each route's
    // opengraph-image.tsx, so no need to specify it here.
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PostHogProvider>
          <div className="main">
            <TopBar />
            <h1>
              <Link href="/">
                Hard Problems<span className="hp-period">.</span>
              </Link>
            </h1>
            <div className="container">{children}</div>
          </div>
        </PostHogProvider>
      </body>
    </html>
  );
}
