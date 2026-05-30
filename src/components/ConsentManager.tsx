'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import styles from './consent.module.scss';

const STORAGE_KEY = 'hp-analytics-consent';
const FORCE_PROMPT_KEY = 'hp-force-prompt';
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

function writeStoredConsent(value: ChoiceValue) {
  try {
    const stored: StoredConsent = { choice: value, ts: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // ignore storage errors
  }
}

// Reads the hp-consent-required cookie set by middleware based on visitor's
// geo. Returns true if the visitor is in a consent-required jurisdiction,
// false if not, or null if the cookie isn't present (default to safe).
function readConsentRequiredCookie(): boolean | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)hp-consent-required=([^;]+)/);
  if (!match) return null;
  if (match[1] === 'true') return true;
  if (match[1] === 'false') return false;
  return null;
}

// Reads & clears the session-storage flag that "Manage cookie tracking" sets
// so that clicking it always re-shows the modal regardless of geo.
function consumeForcePromptFlag(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (window.sessionStorage.getItem(FORCE_PROMPT_KEY) === 'true') {
      window.sessionStorage.removeItem(FORCE_PROMPT_KEY);
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}

export default function ConsentManager() {
  const [choice, setChoice] = useState<Choice>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const existing = readStoredConsent();
    if (existing) {
      setChoice(existing);
      return;
    }
    // No stored choice yet. Decide between modal and silent auto-accept.
    const forcePrompt = consumeForcePromptFlag();
    if (forcePrompt) {
      // Visitor clicked "Manage cookie tracking" — always show the modal
      // so they can make an explicit fresh choice, regardless of geo.
      return; // leave choice null → modal renders
    }
    const required = readConsentRequiredCookie();
    if (required === false) {
      // Visitor is outside our consent-required jurisdictions; silently
      // accept and persist (so the choice is consistent across visits and
      // they can still withdraw via "Manage cookie tracking").
      writeStoredConsent('accepted');
      setChoice('accepted');
    }
    // required === true (in a consent-required jurisdiction)
    // OR required === null (geo unknown → default to safe behavior)
    // → leave choice null so the modal renders.
  }, []);

  const persist = (value: ChoiceValue) => {
    writeStoredConsent(value);
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
          className={styles.backdrop}
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-title"
          aria-describedby="consent-desc"
        >
          <div className={styles.modal}>
            <h2 id="consent-title" className={styles.modalTitle}>
              Cookies
            </h2>
            <p id="consent-desc" className={styles.modalText}>
              We use cookies to understand how visitors use this site. See our{' '}
              <Link href="/privacy">privacy policy</Link> for details.
            </p>
            <div className={styles.actions}>
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
