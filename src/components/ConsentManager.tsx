'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import styles from './consent.module.scss';

const STORAGE_KEY = 'hp-analytics-consent';
const GA_ID = 'G-RLX8RJL11E';
const EXPIRY_MS = 180 * 24 * 60 * 60 * 1000; // re-prompt after 180 days

type ChoiceValue = 'accepted' | 'rejected';
type Choice = ChoiceValue | null;
type StoredConsent = { choice: ChoiceValue; ts: number };

function readStoredConsent(): Choice {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (
      (parsed.choice === 'accepted' || parsed.choice === 'rejected') &&
      typeof parsed.ts === 'number' &&
      Date.now() - parsed.ts < EXPIRY_MS
    ) {
      return parsed.choice;
    }
    return null;
  } catch {
    // Either localStorage unavailable, or a legacy/plain-string value that
    // pre-dates the timestamped format. Treat as no choice so we re-ask.
    return null;
  }
}

export default function ConsentManager() {
  const [choice, setChoice] = useState<Choice>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setChoice(readStoredConsent());
  }, []);

  const persist = (value: ChoiceValue) => {
    try {
      const stored: StoredConsent = { choice: value, ts: Date.now() };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // ignore storage errors
    }
    setChoice(value);
  };

  // Avoid SSR/hydration mismatch by rendering nothing until mounted.
  if (!mounted) return null;

  return (
    <>
      {choice === 'accepted' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}

      {choice === null && (
        <div
          className={styles.banner}
          role="dialog"
          aria-live="polite"
          aria-label="Cookie and analytics consent"
        >
          <div className={styles.bannerContent}>
            <p className={styles.bannerText}>
              We use cookies to understand how visitors use this site. See our{' '}
              <Link href="/privacy">privacy policy</Link> for details.
            </p>
            <div className={styles.bannerActions}>
              <button
                type="button"
                onClick={() => persist('rejected')}
                className={`${styles.button} ${styles.buttonSecondary}`}
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => persist('accepted')}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
