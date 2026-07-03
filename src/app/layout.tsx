import type { Metadata } from 'next';
import Link from 'next/link';
import { Instrument_Serif } from 'next/font/google';
import TopBar from '../components/TopBar';
import CodeBlockCopyButtons from '../components/CodeBlockCopyButtons';
import PostHogProvider from '../components/PostHogProvider';
import { Footer } from '../components/Footer';
import FooterIntro from '../components/FooterIntro';
import RotatingTagline from '../components/RotatingTagline';
import SiteHeaderHome from '../components/SiteHeaderHome';
import './globals.css';

// Used for article titles (listing cards and the article H1). Exposed as a
// CSS variable so SCSS modules can reference it via var(...).
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hardproblems.com'),
  title: 'Hard Problems',
  description:
    'Helping designers to work on the hard problems that matter in the world: problems like public health, climate change, poverty, and good government.',
  openGraph: {
    title: 'Hard Problems',
    description:
      'A nonprofit helping designers to work on the hard problems that matter in the world.',
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
      'A nonprofit helping designers to work on the hard problems that matter in the world.'
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
    <html lang="en" className={instrumentSerif.variable}>
      <body>
        <PostHogProvider>
          <div className="main">
            <RotatingTagline />
            <header className="site-header">
              <SiteHeaderHome />
              <h1>
                <Link href="/">
                  Hard Problems<span className="hp-period">.</span>
                </Link>
              </h1>
            </header>
            <TopBar />
            <div className="container">{children}</div>
          </div>
          <FooterIntro />
          <footer className="site-footer">
            <div className="main">
              <Footer />
            </div>
          </footer>
          <CodeBlockCopyButtons />
        </PostHogProvider>
      </body>
    </html>
  );
}
